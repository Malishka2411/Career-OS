"""
Request/response models specific to the LearningAssistant sub-system.
Keep these separate from digital_twin/schema.py -- that file is the
shared learner profile; these are this endpoint's own I/O shapes.
"""

from pydantic import BaseModel, Field


class LearningAssistantRequest(BaseModel):
    learner_id: str
    weeks_available: int = Field(default=4, ge=1, le=12)


class WeeklyGoal(BaseModel):
    week: int
    focus_skill: str
    current_level: str
    goal: str


class LearningAssistantResponse(BaseModel):
    learner_id: str
    weekly_plan: list[WeeklyGoal]
    next_recommended_topic: str | None
