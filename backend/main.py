"""
FastAPI Backend — XTRAGRAD AI CareerOS
Entry point: uvicorn main:app --reload --port 8000
"""
from contextlib import asynccontextmanager

import asyncpg
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.config import settings
from core.database import connect_db, disconnect_db

# Routers
from routers.auth import router as auth_router
from routers.profile import router as profile_router
from routers.dashboard import router as dashboard_router
from routers.resume import router as resume_router
from routers.interview import router as interview_router
from routers.projects import router as projects_router
from routers.learning import router as learning_router
from routers.readiness import router as readiness_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await connect_db()
    # Make pool accessible via request.app.state
    from core.database import _pool
    app.state.pool = _pool
    yield
    # Shutdown
    await disconnect_db()


app = FastAPI(
    title="XTRAGRAD AI CareerOS — Backend API",
    description="FastAPI backend with Supabase PostgreSQL and Groq AI integration",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# -------------------------------------------------------
# CORS — allow frontend dev server and file:// origins
# -------------------------------------------------------
cors_origins = settings.cors_origins_list
# Always include localhost dev ports
for port in [5500, 5173, 3000, 8080]:
    for host in ["http://localhost", "http://127.0.0.1"]:
        origin = f"{host}:{port}"
        if origin not in cors_origins:
            cors_origins.append(origin)

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------------------------------
# Health check
# -------------------------------------------------------
@app.get("/health", tags=["Health"])
def health():
    return {"status": "ok", "service": "backend", "version": "1.0.0"}


# -------------------------------------------------------
# Routers
# -------------------------------------------------------
app.include_router(auth_router)
app.include_router(profile_router)
app.include_router(dashboard_router)
app.include_router(resume_router)
app.include_router(interview_router)
app.include_router(projects_router)
app.include_router(learning_router)
app.include_router(readiness_router)
