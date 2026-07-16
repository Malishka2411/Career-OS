"""
Core business logic for HRSimulator.

Runs a fixed-length, multi-turn simulated HR interview per learner.
Session state (conversation history, turn count) is kept in-memory,
keyed by session_id — swap for real persistence (Redis, DB) if the
service needs to survive restarts or scale beyond one process.

Flow:
  1. First call (no session_id) -> opens a session, asks question 1.
  2. Subsequent calls (with session_id + candidate_message) -> asks
     the next question, up to _MAX_TURNS.
  3. Final call -> generates a structured evaluation, saves it to the
     learner's Digital Twin, and closes the session.
"""

import json
import uuid
from datetime import datetime, timezone

from digital_twin.schema import InterviewResult, InterviewStage
from digital_twin.service import get_twin, upsert_twin
from hr_simulator.models import HREvaluation, HRSimulatorRequest, HRSimulatorResponse
from shared.exceptions import LLMGenerationError
from shared.llm_client import generate_text
from shared.logging_config import get_logger

logger = get_logger(__name__)

_MAX_TURNS = 4  # number of interviewer questions before final evaluation

# In-memory session store: session_id -> {learner_id, history, turns}
_SESSIONS: dict[str, dict] = {}

_INTERVIEWER_SYSTEM_PROMPT = (
    "You are a friendly but professional HR interviewer conducting a mock "
    "behavioral interview for an early-career tech candidate. Ask one "
    "clear behavioral or situational question at a time (e.g. teamwork, "
    "handling conflict, time management, motivation). Do not repeat a "
    "question type already asked in this session. Respond with ONLY the "
    "question text, no preamble, no numbering."
)

_EVALUATION_SYSTEM_PROMPT = (
    "You are an HR evaluator reviewing a completed mock interview transcript. "
    "Score the candidate 0-100 on communication clarity, confidence, and "
    "professionalism, and write a 2-3 sentence feedback summary. Respond with "
    "valid JSON only, no markdown, matching this exact shape: "
    '{"communication_score": 0-100, "confidence_score": 0-100, '
    '"professionalism_score": 0-100, "feedback_summary": "..."}'
)


def _transcript(history: list[dict]) -> str:
    lines = []
    for turn in history:
        speaker = "Interviewer" if turn["role"] == "assistant" else "Candidate"
        lines.append(f"{speaker}: {turn['content']}")
    return "\n".join(lines)


def _start_session(request: HRSimulatorRequest) -> HRSimulatorResponse:
    session_id = str(uuid.uuid4())

    opening_question = generate_text(
        system_prompt=_INTERVIEWER_SYSTEM_PROMPT,
        user_prompt="Begin the interview with your first question.",
        max_tokens=150,
    )

    _SESSIONS[session_id] = {
        "learner_id": request.learner_id,
        "history": [{"role": "assistant", "content": opening_question}],
        "turns": 1,
    }

    return HRSimulatorResponse(
        learner_id=request.learner_id,
        session_id=session_id,
        agent_message=opening_question,
        is_complete=False,
    )


def _finalize_session(session_id: str, session: dict) -> HRSimulatorResponse:
    transcript = _transcript(session["history"])

    try:
        raw_response = generate_text(
            system_prompt=_EVALUATION_SYSTEM_PROMPT,
            user_prompt=f"Interview transcript:\n{transcript}",
            max_tokens=400,
        )
        parsed = json.loads(raw_response)
        evaluation = HREvaluation(**parsed)
    except (LLMGenerationError, json.JSONDecodeError, TypeError) as exc:
        logger.warning("HR evaluation generation failed, using neutral fallback: %s", exc)
        evaluation = HREvaluation(
            communication_score=50.0,
            confidence_score=50.0,
            professionalism_score=50.0,
            feedback_summary="Automated evaluation unavailable for this session; manual review recommended.",
        )

    learner_id = session["learner_id"]
    twin = get_twin(learner_id)
    twin.interview_history.append(
        InterviewResult(
            interview_type="hr",
            communication_score=evaluation.communication_score,
            confidence_score=evaluation.confidence_score,
            professionalism_score=evaluation.professionalism_score,
            feedback_summary=evaluation.feedback_summary,
            completed_at=datetime.now(timezone.utc),
        )
    )
    twin.interview_stage = (
        InterviewStage.COMPLETED
        if twin.interview_stage == InterviewStage.TECHNICAL_DONE
        else InterviewStage.HR_DONE
    )
    upsert_twin(twin)

    del _SESSIONS[session_id]

    return HRSimulatorResponse(
        learner_id=learner_id,
        session_id=session_id,
        agent_message=None,
        is_complete=True,
        evaluation=evaluation,
    )


def _continue_session(request: HRSimulatorRequest, session: dict) -> HRSimulatorResponse:
    if request.candidate_message:
        session["history"].append({"role": "user", "content": request.candidate_message})

    if session["turns"] >= _MAX_TURNS:
        return _finalize_session(request.session_id, session)

    next_question = generate_text(
        system_prompt=_INTERVIEWER_SYSTEM_PROMPT,
        user_prompt=f"Conversation so far:\n{_transcript(session['history'])}\n\nAsk the next question.",
        max_tokens=150,
    )
    session["history"].append({"role": "assistant", "content": next_question})
    session["turns"] += 1

    return HRSimulatorResponse(
        learner_id=request.learner_id,
        session_id=request.session_id,
        agent_message=next_question,
        is_complete=False,
    )


def process(request: HRSimulatorRequest) -> HRSimulatorResponse:
    if not request.session_id or request.session_id not in _SESSIONS:
        logger.info("Starting new HR interview session for learner %s", request.learner_id)
        return _start_session(request)

    logger.info("Continuing HR interview session %s", request.session_id)
    return _continue_session(request, _SESSIONS[request.session_id])
