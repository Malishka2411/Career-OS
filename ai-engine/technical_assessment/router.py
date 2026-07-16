"""
FastAPI routes for TechnicalAssessment.
Mounted in main.py under the prefix defined there.
"""

from fastapi import APIRouter, Depends

from shared.auth import verify_backend_request
from technical_assessment.models import TechnicalAssessmentRequest, TechnicalAssessmentResponse
from technical_assessment.service import process

router = APIRouter()


@router.get("/health")
def health():
    return {"status": "ok", "service": "technical_assessment"}


@router.post("/", response_model=TechnicalAssessmentResponse, dependencies=[Depends(verify_backend_request)])
def run(request: TechnicalAssessmentRequest):
    return process(request)
