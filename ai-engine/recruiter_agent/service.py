"""
Core business logic for RecruiterAgent.

Parses a recruiter's natural-language query into a required-skills
list (via the shared Claude API wrapper, with a naive keyword-overlap
fallback if the LLM is unavailable), then ranks all candidates in the
Digital Twin store by skill overlap and placement readiness.
"""

import json

from digital_twin.schema import DigitalTwin
from digital_twin.service import list_twins
from recruiter_agent.models import CandidateMatch, RecruiterAgentRequest, RecruiterAgentResponse
from shared.exceptions import LLMGenerationError
from shared.llm_client import generate_text
from shared.logging_config import get_logger

logger = get_logger(__name__)

_PARSE_SYSTEM_PROMPT = (
    "You extract structured search filters from a recruiter's natural-language "
    "candidate search query. Respond with valid JSON only, no markdown, "
    'matching this exact shape: {"required_skills": ["..."]}. '
    "Normalize skill names to common casing (e.g. 'Python', not 'python')."
)

_SKILL_WEIGHT = 0.6
_READINESS_WEIGHT = 0.4


def _known_skill_vocabulary() -> set[str]:
    """All skill names seen across every stored Digital Twin — used as a
    fallback vocabulary if the LLM parse step is unavailable."""
    vocabulary: set[str] = set()
    for twin in list_twins():
        vocabulary.update(s.name for s in twin.skills)
    return vocabulary


def _extract_required_skills(query: str) -> list[str]:
    try:
        raw_response = generate_text(system_prompt=_PARSE_SYSTEM_PROMPT, user_prompt=query, max_tokens=200)
        parsed = json.loads(raw_response)
        skills = parsed.get("required_skills", [])
        if skills:
            return skills
    except (LLMGenerationError, json.JSONDecodeError) as exc:
        logger.warning("Recruiter query parsing via LLM failed, falling back to keyword match: %s", exc)

    # Fallback: naive substring match against every skill name ever recorded.
    query_lower = query.lower()
    return [skill for skill in _known_skill_vocabulary() if skill.lower() in query_lower]


def _score_candidate(twin: DigitalTwin, required_skills: list[str]) -> tuple[float, list[str]]:
    twin_skill_names = {s.name.lower() for s in twin.skills}
    required_lower = [s.lower() for s in required_skills]

    matched = [skill for skill in required_skills if skill.lower() in twin_skill_names]
    skill_score = (len(matched) / len(required_lower)) if required_lower else 0.5

    readiness_score = (twin.placement_readiness.overall_score / 100) if twin.placement_readiness else 0.0

    total = (skill_score * _SKILL_WEIGHT) + (readiness_score * _READINESS_WEIGHT)
    return round(total * 100, 1), matched


def _build_explanation(twin: DigitalTwin, matched: list[str], required_skills: list[str]) -> str:
    readiness = f"{twin.placement_readiness.overall_score:.0f}" if twin.placement_readiness else "not yet computed"
    if required_skills:
        return (
            f"Matches {len(matched)}/{len(required_skills)} required skills "
            f"({', '.join(matched) or 'none'}); placement readiness score: {readiness}."
        )
    return f"No specific skills requested; ranked by placement readiness score: {readiness}."


def process(request: RecruiterAgentRequest) -> RecruiterAgentResponse:
    logger.info("Running recruiter search: %r", request.query)

    required_skills = _extract_required_skills(request.query)
    all_twins = list_twins()

    scored: list[CandidateMatch] = []
    for twin in all_twins:
        score, matched = _score_candidate(twin, required_skills)
        scored.append(
            CandidateMatch(
                learner_id=twin.learner_id,
                full_name=twin.full_name,
                match_score=score,
                matched_skills=matched,
                explanation=_build_explanation(twin, matched, required_skills),
            )
        )

    scored.sort(key=lambda c: c.match_score, reverse=True)

    return RecruiterAgentResponse(
        query=request.query,
        interpreted_skills=required_skills,
        candidates=scored[: request.top_k],
    )
