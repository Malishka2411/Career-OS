"""
Dashboard router — aggregate stats for student.
"""
from fastapi import APIRouter, Depends
import asyncpg

from core.database import get_db
from dependencies.auth import get_current_user

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/stats")
async def get_stats(
    current_user: dict = Depends(get_current_user),
    db: asyncpg.Connection = Depends(get_db),
):
    user_id = current_user["id"]   # integer
    profile = await db.fetchrow(
        "SELECT resume_score, placement_score, interviews_done, projects_generated FROM profiles WHERE user_id = $1",
        user_id,
    )
    return {
        "user": {
            "full_name": current_user["name"],   # DB column is "name"
            "email": current_user["email"],
            "college": current_user.get("college", ""),
            "branch": current_user.get("branch", ""),
            "year_of_study": current_user.get("year_of_study", ""),
        },
        "stats": {
            "resume_score": profile["resume_score"] if profile else 0.0,
            "placement_score": profile["placement_score"] if profile else 0.0,
            "interviews_done": profile["interviews_done"] if profile else 0,
            "projects_generated": profile["projects_generated"] if profile else 0,
        },
    }
