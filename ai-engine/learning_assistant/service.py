"""
Core business logic for LearningAssistant.

Generates a week-by-week study plan by prioritizing the learner's
lowest-mastery skills (from the Digital Twin, populated by Career
Intelligence / Technical Assessment). This is a lightweight stand-in
for a full knowledge-tracing model (e.g. BKT/DKT) — see
docs/architecture.md for the upgrade path once enough activity data
exists to train one.
"""

from digital_twin.schema import DigitalTwin, SkillLevel
from digital_twin.service import get_twin
from learning_assistant.models import (
    LearningAssistantRequest,
    LearningAssistantResponse,
    WeeklyGoal,
)
from shared.logging_config import get_logger

logger = get_logger(__name__)

_NEXT_LEVEL = {
    SkillLevel.BEGINNER: SkillLevel.INTERMEDIATE,
    SkillLevel.INTERMEDIATE: SkillLevel.ADVANCED,
    SkillLevel.ADVANCED: SkillLevel.EXPERT,
    SkillLevel.EXPERT: SkillLevel.EXPERT,
}


def _weakest_skills(twin: DigitalTwin, count: int):
    ranked = sorted(twin.skills, key=lambda s: s.confidence_score)
    return ranked[:count] if ranked else []


def process(request: LearningAssistantRequest) -> LearningAssistantResponse:
    logger.info("Generating learning plan for learner %s", request.learner_id)

    twin = get_twin(request.learner_id)

    if not twin.skills:
        return LearningAssistantResponse(
            learner_id=request.learner_id,
            weekly_plan=[],
            next_recommended_topic=None,
        )

    weakest = _weakest_skills(twin, request.weeks_available)
    weekly_plan: list[WeeklyGoal] = []

    for week in range(1, request.weeks_available + 1):
        # Cycle through weakest skills if there are fewer skills than weeks.
        skill = weakest[(week - 1) % len(weakest)]
        current_level = SkillLevel(skill.level) if not isinstance(skill.level, SkillLevel) else skill.level
        target_level = _NEXT_LEVEL[current_level]
        weekly_plan.append(
            WeeklyGoal(
                week=week,
                focus_skill=skill.name,
                current_level=current_level.value,
                goal=f"Move '{skill.name}' from {current_level.value} to {target_level.value} "
                     f"through targeted practice and one applied mini-project.",
            )
        )

    return LearningAssistantResponse(
        learner_id=request.learner_id,
        weekly_plan=weekly_plan,
        next_recommended_topic=weakest[0].name,
    )
