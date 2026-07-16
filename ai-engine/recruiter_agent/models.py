"""
Request/response models specific to the RecruiterAgent sub-system.
Keep these separate from digital_twin/schema.py -- that file is the
shared learner profile; these are this endpoints own I/O shapes.
"""

from pydantic import BaseModel


class RecruiterAgentRequest(BaseModel):
    learner_id: str
    # TODO: add fields specific to this sub-system input


class RecruiterAgentResponse(BaseModel):
    learner_id: str
    # TODO: add fields specific to this sub-system output
