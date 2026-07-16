"""
FastAPI routes for PlacementReadiness.
Mounted in main.py under the prefix defined there.
"""

from fastapi import APIRouter, Depends

from placement_readiness.models import PlacementReadinessRequest, PlacementReadinessResponse
from placement_readiness.service import process
from shared.auth import verify_backend_request

router = APIRouter()


@router.get("/health")
def health():
    return {"status": "ok", "service": "placement_readiness"}


@router.post("/", response_model=PlacementReadinessResponse, dependencies=[Depends(verify_backend_request)])
def run(request: PlacementReadinessRequest):
    return process(request)
