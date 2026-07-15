"""
AI Engine — main FastAPI entrypoint

Each sub-team mounts their own router here once it exists. Until a
sub-system's router is built, leave it commented out — don't merge
broken imports into main.

Run locally:
    uvicorn main:app --reload --port 8001
"""

from fastapi import FastAPI

app = FastAPI(
    title="XTRAGRAD AI CareerOS — AI Engine",
    description="Intelligence layer: skill assessment, generative pipelines, "
                 "assessment engine, interview simulation, digital twin, "
                 "placement readiness, and recruiter agent.",
    version="0.1.0",
)


@app.get("/health")
def health():
    return {"status": "ok", "service": "ai-engine"}


# ---------------------------------------------------------------------------
# Sub-system routers — uncomment as each sub-team's router.py is ready.
# Each sub-team is responsible for adding their own line here in their PR.
# ---------------------------------------------------------------------------

# from digital_twin.router import router as digital_twin_router
# app.include_router(digital_twin_router, prefix="/digital-twin", tags=["Digital Twin"])

# from career_intelligence.router import router as career_intelligence_router
# app.include_router(career_intelligence_router, prefix="/career-intelligence", tags=["Career Intelligence"])

# from learning_assistant.router import router as learning_assistant_router
# app.include_router(learning_assistant_router, prefix="/learning-assistant", tags=["Learning Assistant"])

# from resume_portfolio.router import router as resume_portfolio_router
# app.include_router(resume_portfolio_router, prefix="/resume-portfolio", tags=["Resume & Portfolio"])

# from project_lab.router import router as project_lab_router
# app.include_router(project_lab_router, prefix="/project-lab", tags=["Project Lab"])

# from technical_assessment.router import router as technical_assessment_router
# app.include_router(technical_assessment_router, prefix="/technical-assessment", tags=["Technical Assessment"])

# from hr_simulator.router import router as hr_simulator_router
# app.include_router(hr_simulator_router, prefix="/hr-simulator", tags=["HR Simulator"])

# from placement_readiness.router import router as placement_readiness_router
# app.include_router(placement_readiness_router, prefix="/placement-readiness", tags=["Placement Readiness"])

# from recruiter_agent.router import router as recruiter_agent_router
# app.include_router(recruiter_agent_router, prefix="/recruiter-agent", tags=["Recruiter Agent"])
