"""
Request/response models specific to the ResumePortfolio sub-system.
Keep these separate from digital_twin/schema.py -- that file is the
shared learner profile; these are this endpoint's own I/O shapes.
"""

from pydantic import BaseModel


class ResumePortfolioRequest(BaseModel):
    learner_id: str
    tone: str = "professional"  # "professional" | "concise" | "enthusiastic"


class ResumePortfolioResponse(BaseModel):
    learner_id: str
    resume_summary: str
    linkedin_summary: str
    ats_score: float
