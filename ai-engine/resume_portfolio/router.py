"""
FastAPI routes for ResumePortfolio.
Mounted in main.py under the prefix defined there.
"""

from fastapi import APIRouter, Depends

from resume_portfolio.models import ResumePortfolioRequest, ResumePortfolioResponse
from resume_portfolio.service import process
from shared.auth import verify_backend_request

router = APIRouter()


@router.get("/health")
def health():
    return {"status": "ok", "service": "resume_portfolio"}


@router.post("/", response_model=ResumePortfolioResponse, dependencies=[Depends(verify_backend_request)])
def run(request: ResumePortfolioRequest):
    return process(request)
