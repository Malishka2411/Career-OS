"""
Request/response models specific to the PlacementReadiness sub-system.
Keep these separate from digital_twin/schema.py -- that file is the
shared learner profile; these are this endpoints own I/O shapes.
"""

from pydantic import BaseModel


class PlacementReadinessRequest(BaseModel):
    learner_id: str
    # TODO: add fields specific to this sub-system input


class PlacementReadinessResponse(BaseModel):
    learner_id: str
    # TODO: add fields specific to this sub-system output
