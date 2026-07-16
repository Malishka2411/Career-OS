"""
FastAPI routes for HRSimulator.
Mounted in main.py under the prefix defined there.
"""

from fastapi import APIRouter, Depends

from hr_simulator.models import HRSimulatorRequest, HRSimulatorResponse
from hr_simulator.service import process
from shared.auth import verify_backend_request

router = APIRouter()


@router.get("/health")
def health():
    return {"status": "ok", "service": "hr_simulator"}


@router.post("/", response_model=HRSimulatorResponse, dependencies=[Depends(verify_backend_request)])
def run(request: HRSimulatorRequest):
    return process(request)
