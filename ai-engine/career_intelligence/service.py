"""
Core business logic for CareerIntelligence.

Evaluates a learner's initial diagnostic quiz, derives a skill level per
skill, and generates a starter roadmap prioritizing the weakest skills
and the learner's stated career interests. This is the entry point that
seeds a learner's Digital Twin.

Scoring approach: difficulty-weighted accuracy per skill. This is a
transparent, explainable rule-based model — swap in a trained model
later if historical labeled data becomes available (see docs/architecture.md).
"""

from collections import defaultdict
from datetime import datetime, timezone

from career_intelligence.models import (
    CareerIntelligenceRequest,
    CareerIntelligenceResponse,
    RoadmapStep,
)
from digital_twin.schema import DigitalTwin, Skill, SkillLevel
from digital_twin.service import create_twin, get_twin, upsert_twin
from shared.exceptions import LearnerNotFoundError
from shared.logging_config import get_logger

logger = get_logger(__name__)

# Weighted-accuracy thresholds -> SkillLevel
_LEVEL_THRESHOLDS = [
    (0.4, SkillLevel.BEGINNER),
    (0.7, SkillLevel.INTERMEDIATE),
    (0.9, SkillLevel.ADVANCED),
]
_DEFAULT_LEVEL = SkillLevel.EXPERT


def _score_to_level(score: float) -> SkillLevel:
    for threshold, level in _LEVEL_THRESHOLDS:
        if score < threshold:
            return level
    return _DEFAULT_LEVEL


def _compute_skill_scores(request: CareerIntelligenceRequest) -> dict[str, float]:
    """Difficulty-weighted accuracy per skill, in [0, 1]."""
    weighted_correct: dict[str, float] = defaultdict(float)
    weighted_total: dict[str, float] = defaultdict(float)

    for response in request.quiz_responses:
        weighted_total[response.skill] += response.difficulty
        if response.correct:
            weighted_correct[response.skill] += response.difficulty

    return {
        skill: (weighted_correct[skill] / weighted_total[skill]) if weighted_total[skill] else 0.0
        for skill in weighted_total
    }


def _get_or_create_twin(learner_id: str) -> DigitalTwin:
    try:
        return get_twin(learner_id)
    except LearnerNotFoundError:
        logger.info("No existing Digital Twin for %s — creating one.", learner_id)
        return create_twin(learner_id, full_name="Unknown")


def _build_roadmap(skill_scores: dict[str, float], career_interests: list[str]) -> list[RoadmapStep]:
    steps: list[RoadmapStep] = []

    # Prioritize the 3 weakest assessed skills.
    weakest = sorted(skill_scores.items(), key=lambda item: item[1])[:3]
    for order, (skill, score) in enumerate(weakest, start=1):
        steps.append(
            RoadmapStep(
                order=order,
                focus_skill=skill,
                reason=f"Weakest assessed area (accuracy {score:.0%}) — prioritize foundational practice.",
            )
        )

    # Add one step per stated career interest not already covered by an assessed skill.
    covered = {s.lower() for s in skill_scores}
    next_order = len(steps) + 1
    for interest in career_interests:
        if interest.lower() not in covered:
            steps.append(
                RoadmapStep(
                    order=next_order,
                    focus_skill=interest,
                    reason="Aligns with stated career interest — no prior assessment data yet.",
                )
            )
            next_order += 1

    return steps


def process(request: CareerIntelligenceRequest) -> CareerIntelligenceResponse:
    logger.info("Running Career Intelligence assessment for learner %s", request.learner_id)

    skill_scores = _compute_skill_scores(request)
    assessed_skills = {skill: _score_to_level(score).value for skill, score in skill_scores.items()}

    twin = _get_or_create_twin(request.learner_id)

    now = datetime.now(timezone.utc)
    existing_by_name = {s.name: s for s in twin.skills}
    for skill, score in skill_scores.items():
        existing_by_name[skill] = Skill(
            name=skill,
            level=_score_to_level(score),
            confidence_score=round(score, 3),
            last_assessed=now,
        )
    twin.skills = list(existing_by_name.values())

    merged_interests = list(dict.fromkeys([*twin.career_interests, *request.career_interests]))
    twin.career_interests = merged_interests

    upsert_twin(twin)

    roadmap = _build_roadmap(skill_scores, request.career_interests)

    return CareerIntelligenceResponse(
        learner_id=request.learner_id,
        assessed_skills=assessed_skills,
        roadmap=roadmap,
        career_interests_confirmed=merged_interests,
    )
