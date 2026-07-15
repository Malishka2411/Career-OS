"""
Digital Twin Schema — XTRAGRAD AI CareerOS
============================================

This is the SHARED DATA CONTRACT for the entire AI module and the primary
integration point with the Backend team.

Every other AI sub-system (Career Intelligence, Learning Assistant,
Resume/Portfolio Studio, Project Lab, Technical Assessment, HR Simulator,
Placement Readiness, Recruiter Agent) reads from and/or writes to this
schema. Changes here require review from the Digital Twin sub-team lead
AND the AI lead, since Backend's database models and Frontend's display
logic both depend on this shape.

Built with Pydantic so it doubles as:
  - request/response validation for FastAPI endpoints
  - the JSON contract shared with the Backend team
"""

from datetime import datetime, timezone
from enum import Enum
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


# ---------------------------------------------------------------------------
# Enums
# ---------------------------------------------------------------------------

class SkillLevel(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    EXPERT = "expert"


class InterviewStage(str, Enum):
    NOT_STARTED = "not_started"
    TECHNICAL_DONE = "technical_done"
    HR_DONE = "hr_done"
    COMPLETED = "completed"


# ---------------------------------------------------------------------------
# Sub-components of the Digital Twin
# ---------------------------------------------------------------------------

class Skill(BaseModel):
    name: str
    level: SkillLevel
    confidence_score: float = Field(ge=0, le=1, description="Model confidence in this rating, 0-1")
    last_assessed: datetime


class Certification(BaseModel):
    title: str
    issuer: str
    date_earned: datetime
    credential_url: Optional[str] = None


class Project(BaseModel):
    title: str
    description: str
    tech_stack: list[str]
    github_url: Optional[str] = None
    generated_by_ai: bool = False


class CodingSubmission(BaseModel):
    problem_id: str
    language: str
    correctness_score: float = Field(ge=0, le=100)
    efficiency_score: float = Field(ge=0, le=100)
    code_quality_score: float = Field(ge=0, le=100)
    submitted_at: datetime


class InterviewResult(BaseModel):
    interview_type: str  # "technical" or "hr"
    communication_score: Optional[float] = Field(default=None, ge=0, le=100)
    confidence_score: Optional[float] = Field(default=None, ge=0, le=100)
    professionalism_score: Optional[float] = Field(default=None, ge=0, le=100)
    feedback_summary: str
    completed_at: datetime


class ResumeData(BaseModel):
    current_version_url: Optional[str] = None
    last_generated_at: Optional[datetime] = None
    ats_score: Optional[float] = Field(default=None, ge=0, le=100)


class PlacementReadiness(BaseModel):
    overall_score: float = Field(ge=0, le=100)
    breakdown: dict[str, float]  # e.g. {"coding": 82, "communication": 75, ...}
    last_computed_at: datetime
    improvement_suggestions: list[str] = []


# ---------------------------------------------------------------------------
# The Digital Twin — top-level learner profile
# ---------------------------------------------------------------------------

class DigitalTwin(BaseModel):
    """
    The single, continuously evolving profile representing one learner.
    This is the object every AI sub-system reads from / writes to, and
    the object the Recruiter Agent queries against.
    """

    learner_id: str = Field(description="Unique ID, provided by Backend's user system")
    full_name: str
    career_interests: list[str] = []

    skills: list[Skill] = []
    certifications: list[Certification] = []
    projects: list[Project] = []
    coding_history: list[CodingSubmission] = []
    interview_history: list[InterviewResult] = []
    interview_stage: InterviewStage = InterviewStage.NOT_STARTED

    resume: ResumeData = ResumeData()
    placement_readiness: Optional[PlacementReadiness] = None

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(use_enum_values=True)


# ---------------------------------------------------------------------------
# Example (for quick manual testing / Backend reference)
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    example = DigitalTwin(
        learner_id="stu_00123",
        full_name="Jane Student",
        career_interests=["Machine Learning", "Backend Development"],
        skills=[
            Skill(name="Python", level=SkillLevel.ADVANCED, confidence_score=0.9, last_assessed=datetime.now(timezone.utc))
        ],
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    print(example.model_dump_json(indent=2))
