"""
FastAPI routes for ProjectLab.
Mounted in main.py under the prefix defined there.
"""

from fastapi import APIRouter, Depends

from project_lab.models import ProjectLabRequest, ProjectLabResponse
from project_lab.service import process
from shared.auth import verify_backend_request

router = APIRouter()


@router.get("/health")
def health():
    return {"status": "ok", "service": "project_lab"}


@router.post("/", response_model=ProjectLabResponse, dependencies=[Depends(verify_backend_request)])
def run(request: ProjectLabRequest):
    return process(request)
