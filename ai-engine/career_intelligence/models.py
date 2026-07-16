"""
Request/response models specific to the CareerIntelligence sub-system.
Keep these separate from digital_twin/schema.py -- that file is the
shared learner profile; these are this endpoint's own I/O shapes.
"""

from pydantic import BaseModel, Field


class QuizResponse(BaseModel):
    """One answered question from the initial diagnostic assessment."""
    skill: str
    correct: bool
    difficulty: int = Field(default=1, ge=1, le=3, description="1=easy, 2=medium, 3=hard")


class CareerIntelligenceRequest(BaseModel):
    learner_id: str
    quiz_responses: list[QuizResponse] = []
    career_interests: list[str] = []


class RoadmapStep(BaseModel):
    order: int
    focus_skill: str
    reason: str


class CareerIntelligenceResponse(BaseModel):
    learner_id: str
    assessed_skills: dict[str, str]  # skill name -> SkillLevel value
    roadmap: list[RoadmapStep]
    career_interests_confirmed: list[str]
