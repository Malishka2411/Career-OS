"""
Core business logic for ProjectLab.

Generates a complete project specification (problem statement, tech
stack, dataset suggestions, architecture) tailored to a learner's
current skills and interests, then appends it to their Digital Twin
project list so it flows into Resume/Portfolio and Placement Readiness.
"""

import json

from digital_twin.schema import Project
from digital_twin.service import get_twin, upsert_twin
from project_lab.models import ProjectLabRequest, ProjectLabResponse, ProjectSpec
from shared.exceptions import LLMGenerationError
from shared.llm_client import generate_text
from shared.logging_config import get_logger

logger = get_logger(__name__)

_SYSTEM_PROMPT = (
    "You are a technical project mentor for early-career software/AI candidates. "
    "You design resume-worthy, appropriately-scoped project ideas — buildable in "
    "2-4 weeks, not research-lab scale. You always respond with valid JSON only, "
    "no markdown formatting, matching this exact shape: "
    '{"title": "...", "problem_statement": "...", "tech_stack": ["..."], '
    '"dataset_suggestions": ["..."], "architecture_overview": "..."}'
)


def _resolve_focus_area(request: ProjectLabRequest, twin) -> str:
    if request.focus_area:
        return request.focus_area
    if twin.career_interests:
        return twin.career_interests[0]
    return "general software engineering"


def _build_user_prompt(focus_area: str, twin) -> str:
    skills = ", ".join(s.name for s in twin.skills) or "no assessed skills yet — assume beginner-friendly"
    existing_titles = ", ".join(p.title for p in twin.projects) or "none yet"

    return (
        f"Learner's current skills: {skills}\n"
        f"Focus area for this project: {focus_area}\n"
        f"Projects they already have (avoid duplicating these): {existing_titles}\n\n"
        "Propose one new, resume-worthy project idea matching their current skill "
        "level. Respond with JSON only."
    )


def process(request: ProjectLabRequest) -> ProjectLabResponse:
    logger.info("Generating project spec for learner %s", request.learner_id)

    twin = get_twin(request.learner_id)
    focus_area = _resolve_focus_area(request, twin)
    user_prompt = _build_user_prompt(focus_area, twin)

    raw_response = generate_text(system_prompt=_SYSTEM_PROMPT, user_prompt=user_prompt, max_tokens=700)

    try:
        parsed = json.loads(raw_response)
        spec = ProjectSpec(**parsed)
    except (json.JSONDecodeError, TypeError) as exc:
        raise LLMGenerationError(f"Project Lab could not parse model output as valid JSON: {exc}")

    twin.projects.append(
        Project(
            title=spec.title,
            description=spec.problem_statement,
            tech_stack=spec.tech_stack,
            generated_by_ai=True,
        )
    )
    upsert_twin(twin)

    return ProjectLabResponse(learner_id=request.learner_id, project_spec=spec)
