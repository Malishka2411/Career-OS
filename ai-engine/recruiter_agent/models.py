"""
Request/response models specific to the RecruiterAgent sub-system.
Keep these separate from digital_twin/schema.py -- that file is the
shared learner profile; these are this endpoint's own I/O shapes.
"""

from pydantic import BaseModel


class RecruiterAgentRequest(BaseModel):
    query: str  # natural language, e.g. "Find AI engineers with Python and internship experience"
    top_k: int = 5


class CandidateMatch(BaseModel):
    learner_id: str
    full_name: str
    match_score: float
    matched_skills: list[str]
    explanation: str


class RecruiterAgentResponse(BaseModel):
    query: str
    interpreted_skills: list[str]
    candidates: list[CandidateMatch]
