"""
FastAPI routes for RecruiterAgent.
Mounted in main.py under the prefix defined there.
"""

from fastapi import APIRouter, Depends

from recruiter_agent.models import RecruiterAgentRequest, RecruiterAgentResponse
from recruiter_agent.service import process
from shared.auth import verify_backend_request

router = APIRouter()


@router.get("/health")
def health():
    return {"status": "ok", "service": "recruiter_agent"}


@router.post("/", response_model=RecruiterAgentResponse, dependencies=[Depends(verify_backend_request)])
def run(request: RecruiterAgentRequest):
    return process(request)
