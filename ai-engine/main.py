"""
AI Engine — main FastAPI entrypoint

All sub-system routers are mounted here. Each sub-team owns their own
router.py/service.py/models.py inside their folder; this file just
wires them together.

Run locally:
    uvicorn main:app --reload --port 8001
"""

from fastapi import FastAPI

from career_intelligence.router import router as career_intelligence_router
from digital_twin.router import router as digital_twin_router
from hr_simulator.router import router as hr_simulator_router
from learning_assistant.router import router as learning_assistant_router
from placement_readiness.router import router as placement_readiness_router
from project_lab.router import router as project_lab_router
from recruiter_agent.router import router as recruiter_agent_router
from resume_portfolio.router import router as resume_portfolio_router
from shared.exceptions import register_exception_handlers
from shared.logging_config import get_logger
from technical_assessment.router import router as technical_assessment_router

logger = get_logger(__name__)

app = FastAPI(
    title="XTRAGRAD AI CareerOS — AI Engine",
    description="Intelligence layer: skill assessment, generative pipelines, "
                 "assessment engine, interview simulation, digital twin, "
                 "placement readiness, and recruiter agent.",
    version="0.1.0",
)

register_exception_handlers(app)


@app.get("/health")
def health():
    return {"status": "ok", "service": "ai-engine"}


# ---------------------------------------------------------------------------
# Sub-system routers
# ---------------------------------------------------------------------------

app.include_router(digital_twin_router, prefix="/digital-twin", tags=["Digital Twin"])
app.include_router(career_intelligence_router, prefix="/career-intelligence", tags=["Career Intelligence"])
app.include_router(learning_assistant_router, prefix="/learning-assistant", tags=["Learning Assistant"])
app.include_router(resume_portfolio_router, prefix="/resume-portfolio", tags=["Resume & Portfolio"])
app.include_router(project_lab_router, prefix="/project-lab", tags=["Project Lab"])
app.include_router(technical_assessment_router, prefix="/technical-assessment", tags=["Technical Assessment"])
app.include_router(hr_simulator_router, prefix="/hr-simulator", tags=["HR Simulator"])
app.include_router(placement_readiness_router, prefix="/placement-readiness", tags=["Placement Readiness"])
app.include_router(recruiter_agent_router, prefix="/recruiter-agent", tags=["Recruiter Agent"])
