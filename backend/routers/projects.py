"""
Project ideas generator router powered by Groq.
"""
import json
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional, List
import asyncpg

from core.database import get_db
from dependencies.auth import get_current_user
from services.groq_client import groq_chat

router = APIRouter(prefix="/projects", tags=["Projects"])


class ProjectRequest(BaseModel):
    skills: Optional[List[str]] = []
    difficulty: Optional[str] = "intermediate"  # beginner | intermediate | advanced
    domain: Optional[str] = "Web Development"
    count: Optional[int] = 3


@router.post("/generate")
async def generate_projects(
    data: ProjectRequest,
    current_user: dict = Depends(get_current_user),
    db: asyncpg.Connection = Depends(get_db),
):
    skills_str = ", ".join(data.skills) if data.skills else "general programming"
    system = "You are a software project mentor. Generate project ideas as JSON."
    user_prompt = (
        f"Student skills: {skills_str}\n"
        f"Difficulty: {data.difficulty}\nDomain: {data.domain}\n"
        f"Generate {data.count} project ideas. "
        'Return JSON: {"projects": [{"title": "...", "description": "...", "tech_stack": ["..."], "features": ["..."], "estimated_days": 30}]}'
    )
    raw = await groq_chat(system, user_prompt, max_tokens=800)
    try:
        result = json.loads(raw)
    except Exception:
        result = {"projects": [{"title": "Project", "description": raw}]}

    # Increment projects_generated counter
    count = len(result.get("projects", []))
    if count:
        await db.execute(
            "UPDATE profiles SET projects_generated = projects_generated + $1, updated_at = NOW() WHERE user_id = $2",
            count, current_user["id"],
        )
    return result
