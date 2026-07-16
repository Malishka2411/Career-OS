"""
Request/response models specific to the PlacementReadiness sub-system.
Keep these separate from digital_twin/schema.py -- that file is the
shared learner profile; these are this endpoint's own I/O shapes.
"""

from pydantic import BaseModel


class PlacementReadinessRequest(BaseModel):
    learner_id: str


class PlacementReadinessResponse(BaseModel):
    learner_id: str
    overall_score: float
    breakdown: dict[str, float]
    improvement_suggestions: list[str]
