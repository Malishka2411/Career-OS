"""
FastAPI routes for the Digital Twin store.
This is the module every other sub-system and Backend integrates with
first, since it's the shared learner profile.
"""

from fastapi import APIRouter, Depends

from digital_twin.schema import DigitalTwin
from digital_twin.service import create_twin, get_twin, upsert_twin
from shared.auth import verify_backend_request

router = APIRouter()


@router.get("/health")
def health():
    return {"status": "ok", "service": "digital_twin"}


@router.get("/{learner_id}", response_model=DigitalTwin, dependencies=[Depends(verify_backend_request)])
def read_twin(learner_id: str):
    return get_twin(learner_id)


@router.post("/{learner_id}", response_model=DigitalTwin, dependencies=[Depends(verify_backend_request)])
def initialize_twin(learner_id: str, full_name: str):
    return create_twin(learner_id, full_name)


@router.put("/", response_model=DigitalTwin, dependencies=[Depends(verify_backend_request)])
def replace_twin(twin: DigitalTwin):
    return upsert_twin(twin)
