"""
FastAPI routes for LearningAssistant.
Mounted in main.py under the prefix defined there.
"""

from fastapi import APIRouter, Depends

from learning_assistant.models import LearningAssistantRequest, LearningAssistantResponse
from learning_assistant.service import process
from shared.auth import verify_backend_request

router = APIRouter()


@router.get("/health")
def health():
    return {"status": "ok", "service": "learning_assistant"}


@router.post("/", response_model=LearningAssistantResponse, dependencies=[Depends(verify_backend_request)])
def run(request: LearningAssistantRequest):
    return process(request)
