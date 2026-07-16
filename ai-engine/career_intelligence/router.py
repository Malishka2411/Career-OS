"""
FastAPI routes for CareerIntelligence.
Mounted in main.py under the prefix defined there.
"""

from fastapi import APIRouter, Depends

from career_intelligence.models import CareerIntelligenceRequest, CareerIntelligenceResponse
from career_intelligence.service import process
from shared.auth import verify_backend_request

router = APIRouter()


@router.get("/health")
def health():
    return {"status": "ok", "service": "career_intelligence"}


@router.post("/", response_model=CareerIntelligenceResponse, dependencies=[Depends(verify_backend_request)])
def run(request: CareerIntelligenceRequest):
    return process(request)
