"""
Placement readiness prediction router powered by Groq.
"""
import json
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional, List
import asyncpg

from core.database import get_db
from dependencies.auth import get_current_user
from services.groq_client import groq_chat

router = APIRouter(prefix="/readiness", tags=["Readiness"])


class ReadinessRequest(BaseModel):
    cgpa: Optional[float] = 7.0
    coding_score: Optional[float] = 60.0  # out of 100
    communication_score: Optional[float] = 7.0  # out of 10
    skills: Optional[List[str]] = []
    target_companies: Optional[List[str]] = ["TCS", "Infosys", "Wipro"]


@router.post("/predict")
async def predict_readiness(
    data: ReadinessRequest,
    current_user: dict = Depends(get_current_user),
    db: asyncpg.Connection = Depends(get_db),
):
    skills_str = ", ".join(data.skills) if data.skills else "basic programming"
    companies_str = ", ".join(data.target_companies) if data.target_companies else "service companies"

    system = "You are a placement prediction AI. Evaluate student placement readiness as JSON."
    user_prompt = (
        f"Student Profile:\n"
        f"- CGPA: {data.cgpa}/10\n"
        f"- Coding Score: {data.coding_score}/100\n"
        f"- Communication: {data.communication_score}/10\n"
        f"- Skills: {skills_str}\n"
        f"- Target Companies: {companies_str}\n"
        "Predict placement readiness and provide actionable feedback. "
        'Return JSON: {"placement_score": <0-100>, "verdict": "High/Medium/Low", "strengths": ["..."], "gaps": ["..."], "action_plan": ["..."]}'
    )
    raw = await groq_chat(system, user_prompt, max_tokens=700)
    try:
        result = json.loads(raw)
    except Exception:
        result = {"raw": raw}

    # Save placement score
    score = result.get("placement_score", 0)
    await db.execute(
        "UPDATE profiles SET placement_score = $1, updated_at = NOW() WHERE user_id = $2",
        float(score), current_user["id"],
    )
    return result
