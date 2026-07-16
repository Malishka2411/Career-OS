"""
Core business logic for TechnicalAssessment.

Executes submitted Python code against test cases in a subprocess with
a hard timeout, then scores correctness, efficiency (via static
complexity analysis), and code quality (via style heuristics). If any
test cases fail, an LLM call explains the likely mistake in plain
language.

SECURITY NOTE — read before deploying to production:
This reference implementation runs untrusted code via `subprocess`
with a timeout, which is enough for local development and demos, but
is NOT a real security boundary. Before this touches real, unauthenticated
student submissions in production, the Technical Assessment sub-team
must run this inside a properly isolated sandbox (e.g. a locked-down
Docker/gVisor/Firecracker container with no network access, dropped
capabilities, and a memory/CPU cgroup limit) rather than a bare
subprocess on the host.
"""

import ast
import subprocess
import sys
import tempfile
from datetime import datetime, timezone
from pathlib import Path

from digital_twin.schema import CodingSubmission
from digital_twin.service import get_twin, upsert_twin
from shared.exceptions import LLMGenerationError, SandboxExecutionError
from shared.llm_client import generate_text
from shared.logging_config import get_logger
from technical_assessment.models import TechnicalAssessmentRequest, TechnicalAssessmentResponse

logger = get_logger(__name__)

_EXECUTION_TIMEOUT_SECONDS = 5

_FEEDBACK_SYSTEM_PROMPT = (
    "You are a patient coding mentor reviewing a student's failed test cases. "
    "Explain the likely bug in plain language in 2-4 sentences, then suggest "
    "one concrete fix. Do not rewrite their whole solution."
)


def _run_single_test_case(code: str, stdin: str, timeout: int = _EXECUTION_TIMEOUT_SECONDS) -> str:
    """Runs the submitted code as a subprocess and returns its stdout."""
    with tempfile.TemporaryDirectory() as tmp_dir:
        script_path = Path(tmp_dir) / "submission.py"
        script_path.write_text(code)

        try:
            result = subprocess.run(
                [sys.executable, str(script_path)],
                input=stdin,
                capture_output=True,
                text=True,
                timeout=timeout,
            )
        except subprocess.TimeoutExpired as exc:
            raise SandboxExecutionError(f"Execution timed out after {timeout}s (possible infinite loop).") from exc

        if result.returncode != 0:
            raise SandboxExecutionError(f"Code exited with an error:\n{result.stderr.strip()[:500]}")

        return result.stdout


def _score_correctness(code: str, test_cases) -> tuple[int, int, list[str]]:
    passed = 0
    failures: list[str] = []

    for i, case in enumerate(test_cases, start=1):
        try:
            actual_output = _run_single_test_case(code, case.stdin).strip()
        except SandboxExecutionError as exc:
            failures.append(f"Test case {i}: {exc.message}")
            continue

        if actual_output == case.expected_output.strip():
            passed += 1
        else:
            failures.append(
                f"Test case {i}: expected '{case.expected_output.strip()}', got '{actual_output}'"
            )

    return passed, len(test_cases), failures


def _score_efficiency(code: str) -> float:
    """
    Static complexity heuristic: penalizes deep loop nesting, which is
    the most common source of avoidable inefficiency in early-career
    submissions. Not a substitute for real Big-O analysis.
    """
    try:
        tree = ast.parse(code)
    except SyntaxError:
        return 0.0

    max_loop_depth = 0

    def _walk(node, depth=0):
        nonlocal max_loop_depth
        if isinstance(node, (ast.For, ast.While)):
            depth += 1
            max_loop_depth = max(max_loop_depth, depth)
        for child in ast.iter_child_nodes(node):
            _walk(child, depth)

    _walk(tree)

    penalty = {0: 0, 1: 5, 2: 20, 3: 45}.get(max_loop_depth, 65)
    return round(max(0.0, 100 - penalty), 1)


def _score_code_quality(code: str) -> float:
    """
    Style heuristic: rewards descriptive names and reasonable line
    lengths, penalizes single-letter variable names (loop counters
    like i/j/k are allowed) and very long lines.
    """
    try:
        tree = ast.parse(code)
    except SyntaxError:
        return 0.0

    names = [n.id for n in ast.walk(tree) if isinstance(n, ast.Name) and isinstance(n.ctx, ast.Store)]
    allowed_short = {"i", "j", "k", "x", "y", "_"}
    short_names = [n for n in names if len(n) <= 1 and n not in allowed_short]
    naming_penalty = min(30, len(short_names) * 5)

    lines = code.splitlines()
    long_lines = [line for line in lines if len(line) > 100]
    length_penalty = min(20, len(long_lines) * 4)

    return round(max(0.0, 100 - naming_penalty - length_penalty), 1)


def _generate_feedback(failures: list[str]) -> str:
    if not failures:
        return "All test cases passed. Nice work!"

    try:
        return generate_text(
            system_prompt=_FEEDBACK_SYSTEM_PROMPT,
            user_prompt="Failed test cases:\n" + "\n".join(failures),
            max_tokens=300,
        )
    except LLMGenerationError as exc:
        logger.warning("Feedback generation unavailable, falling back to raw failure list: %s", exc)
        return "Some test cases failed:\n" + "\n".join(failures)


def process(request: TechnicalAssessmentRequest) -> TechnicalAssessmentResponse:
    logger.info(
        "Running technical assessment for learner %s, problem %s",
        request.learner_id,
        request.problem_id,
    )

    passed, total, failures = _score_correctness(request.code, request.test_cases)
    correctness_score = round((passed / total) * 100, 1) if total else 0.0
    efficiency_score = _score_efficiency(request.code)
    code_quality_score = _score_code_quality(request.code)
    feedback = _generate_feedback(failures)

    twin = get_twin(request.learner_id)
    twin.coding_history.append(
        CodingSubmission(
            problem_id=request.problem_id,
            language=request.language,
            correctness_score=correctness_score,
            efficiency_score=efficiency_score,
            code_quality_score=code_quality_score,
            submitted_at=datetime.now(timezone.utc),
        )
    )
    upsert_twin(twin)

    return TechnicalAssessmentResponse(
        learner_id=request.learner_id,
        problem_id=request.problem_id,
        correctness_score=correctness_score,
        efficiency_score=efficiency_score,
        code_quality_score=code_quality_score,
        passed_test_cases=passed,
        total_test_cases=total,
        feedback=feedback,
    )
