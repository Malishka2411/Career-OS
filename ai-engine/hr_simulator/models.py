"""
Request/response models specific to the HRSimulator sub-system.
Keep these separate from digital_twin/schema.py -- that file is the
shared learner profile; these are this endpoint's own I/O shapes.
"""

from pydantic import BaseModel


class HRSimulatorRequest(BaseModel):
    learner_id: str
    session_id: str | None = None  # omit to start a new interview session
    candidate_message: str | None = None  # the candidate's spoken/typed answer


class HREvaluation(BaseModel):
    communication_score: float
    confidence_score: float
    professionalism_score: float
    feedback_summary: str


class HRSimulatorResponse(BaseModel):
    learner_id: str
    session_id: str
    agent_message: str | None  # the interviewer's next question (None once complete)
    is_complete: bool
    evaluation: HREvaluation | None = None
