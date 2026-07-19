"""
Resume routes — analyze resume text via Groq, also proxies to ai-engine for advanced analysis.
"""
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional
import asyncpg

from core.database import get_db
from dependencies.auth import get_current_user
from services.groq_client import groq_chat

router = APIRouter(prefix="/resume", tags=["Resume"])


class ResumeAnalyzeRequest(BaseModel):
    resume_text: str
    target_role: Optional[str] = "Software Engineer"


@router.post("/analyze")
async def analyze_resume(
    data: ResumeAnalyzeRequest,
    current_user: dict = Depends(get_current_user),
    db: asyncpg.Connection = Depends(get_db),
):
    system = (
        "You are an expert ATS resume reviewer. "
        "Analyze the given resume and respond with a JSON object with exactly these keys: "
        '{"ats_score": <0-100 float>, "strengths": ["..."], "weaknesses": ["..."], '
        '"missing_keywords": ["..."], "improvement_tips": ["..."], "summary": "..."}'
        " No markdown, only valid JSON."
    )
    user_prompt = (
        f"Target Role: {data.target_role}\n\nResume Text:\n{data.resume_text[:3000]}"
    )
    import json
    raw = await groq_chat(system, user_prompt, max_tokens=800)
    try:
        result = json.loads(raw)
    except Exception:
        result = {"raw_feedback": raw, "ats_score": 0}

    # Update resume_score in profile
    score = result.get("ats_score", 0)
    await db.execute(
        "UPDATE profiles SET resume_score = $1, updated_at = NOW() WHERE user_id = $2",
        float(score), current_user["id"],
    )
    return result


@router.post("/summary")
async def generate_summary(
    current_user: dict = Depends(get_current_user),
    db: asyncpg.Connection = Depends(get_db),
):
    """Generate LinkedIn/resume summary based on profile."""
    profile = await db.fetchrow(
        "SELECT * FROM profiles WHERE user_id = $1", current_user["id"]
    )
    skills = list(profile["skills"]) if profile and profile.get("skills") else []
    system = "You are a professional resume writer. Write concise summaries in JSON."
    user_prompt = (
        f"Name: {current_user['name']}\n"
        f"Branch: {current_user.get('branch', '')}\n"
        f"Skills: {', '.join(skills) or 'not listed'}\n"
        "Write a 3-sentence resume summary and 2-sentence LinkedIn summary. "
        'Return JSON: {"resume_summary": "...", "linkedin_summary": "..."}'
    )
    import json
    raw = await groq_chat(system, user_prompt, max_tokens=400)
    try:
        return json.loads(raw)
    except Exception:
        return {"raw": raw}
