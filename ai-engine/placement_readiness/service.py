"""
Core business logic for PlacementReadiness.

Aggregates signals already collected by other sub-systems (coding
history, skill assessments, interview results, resume quality,
projects, certifications) into one weighted Placement Readiness Score.
Purely a weighted-scoring model — no LLM call needed, since every
input is already a numeric signal living in the Digital Twin.
"""

from datetime import datetime, timezone

from digital_twin.schema import PlacementReadiness
from digital_twin.service import get_twin, upsert_twin
from placement_readiness.models import PlacementReadinessRequest, PlacementReadinessResponse
from shared.logging_config import get_logger

logger = get_logger(__name__)

# Must sum to 1.0. Tune these once real historical placement outcome
# data is available to validate which signals actually predict hiring.
_WEIGHTS = {
    "coding": 0.25,
    "technical_knowledge": 0.15,
    "communication": 0.20,
    "resume_quality": 0.15,
    "projects": 0.15,
    "certifications": 0.10,
}

_LOW_SCORE_THRESHOLD = 60.0

_SUGGESTIONS = {
    "coding": "Practice more coding problems to raise your correctness and efficiency scores.",
    "technical_knowledge": "Revisit foundational topics in your weakest assessed skills.",
    "communication": "Do another mock HR interview session to build communication confidence.",
    "resume_quality": "Regenerate your resume after adding recent projects or certifications.",
    "projects": "Add at least one more resume-worthy project — aim for 3-4 total.",
    "certifications": "Consider earning a relevant certification to strengthen your profile.",
}


def _score_coding(twin) -> float:
    if not twin.coding_history:
        return 0.0
    return sum(c.correctness_score for c in twin.coding_history) / len(twin.coding_history)


def _score_technical_knowledge(twin) -> float:
    if not twin.skills:
        return 0.0
    return sum(s.confidence_score for s in twin.skills) / len(twin.skills) * 100


def _score_communication(twin) -> float:
    hr_results = [i for i in twin.interview_history if i.interview_type == "hr" and i.communication_score is not None]
    if not hr_results:
        return 0.0
    return sum(i.communication_score for i in hr_results) / len(hr_results)


def _score_resume_quality(twin) -> float:
    return twin.resume.ats_score or 0.0


def _score_projects(twin) -> float:
    return min(100.0, len(twin.projects) * 25.0)


def _score_certifications(twin) -> float:
    return min(100.0, len(twin.certifications) * 33.0)


_SCORERS = {
    "coding": _score_coding,
    "technical_knowledge": _score_technical_knowledge,
    "communication": _score_communication,
    "resume_quality": _score_resume_quality,
    "projects": _score_projects,
    "certifications": _score_certifications,
}


def process(request: PlacementReadinessRequest) -> PlacementReadinessResponse:
    logger.info("Computing placement readiness for learner %s", request.learner_id)

    twin = get_twin(request.learner_id)

    breakdown = {name: round(scorer(twin), 1) for name, scorer in _SCORERS.items()}
    overall_score = round(sum(breakdown[name] * weight for name, weight in _WEIGHTS.items()), 1)

    suggestions = [
        _SUGGESTIONS[name] for name, score in breakdown.items() if score < _LOW_SCORE_THRESHOLD
    ]

    twin.placement_readiness = PlacementReadiness(
        overall_score=overall_score,
        breakdown=breakdown,
        last_computed_at=datetime.now(timezone.utc),
        improvement_suggestions=suggestions,
    )
    upsert_twin(twin)

    return PlacementReadinessResponse(
        learner_id=request.learner_id,
        overall_score=overall_score,
        breakdown=breakdown,
        improvement_suggestions=suggestions,
    )
