"""
Learning roadmap router powered by Groq.
"""
import json
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional, List

from dependencies.auth import get_current_user
from services.groq_client import groq_chat

router = APIRouter(prefix="/learning", tags=["Learning"])


class RoadmapRequest(BaseModel):
    goal: str  # e.g. "Become a Full Stack Developer"
    current_skills: Optional[List[str]] = []
    timeframe_months: Optional[int] = 6


@router.post("/roadmap")
async def generate_roadmap(
    data: RoadmapRequest,
    current_user: dict = Depends(get_current_user),
):
    skills_str = ", ".join(data.current_skills) if data.current_skills else "beginner"
    system = "You are a career coach. Generate structured learning roadmaps as JSON."
    user_prompt = (
        f"Goal: {data.goal}\n"
        f"Current Skills: {skills_str}\n"
        f"Timeframe: {data.timeframe_months} months\n"
        "Create a month-by-month learning roadmap. "
        'Return JSON: {"goal": "...", "roadmap": [{"month": 1, "topic": "...", "resources": ["..."], "projects": ["..."]}]}'
    )
    raw = await groq_chat(system, user_prompt, max_tokens=1000)
    try:
        return json.loads(raw)
    except Exception:
        return {"goal": data.goal, "raw": raw}


@router.post("/course-recommendations")
async def recommend_courses(
    current_user: dict = Depends(get_current_user),
):
    system = "You are an online learning advisor. Recommend courses as JSON."
    user_prompt = (
        f"Student branch: {current_user.get('branch', 'CSE')}\n"
        f"Year: {current_user.get('year_of_study', '3rd Year')}\n"
        "Recommend 5 top free online courses for placement preparation. "
        'Return JSON: {"courses": [{"title": "...", "platform": "...", "url": "...", "duration": "..."}]}'
    )
    raw = await groq_chat(system, user_prompt, max_tokens=600)
    try:
        return json.loads(raw)
    except Exception:
        return {"raw": raw}
