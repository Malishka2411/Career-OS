"""
Profile router — read and update learner profile.
Adapted to actual Supabase schema: integer user_id.
"""
from fastapi import APIRouter, Depends, HTTPException
import asyncpg

from core.database import get_db
from dependencies.auth import get_current_user
from schemas.profile import ProfileResponse, ProfileUpdateRequest

router = APIRouter(prefix="/profile", tags=["Profile"])


@router.get("", response_model=ProfileResponse)
async def get_profile(
    current_user: dict = Depends(get_current_user),
    db: asyncpg.Connection = Depends(get_db),
):
    user_id = current_user["id"]   # integer
    profile = await db.fetchrow("SELECT * FROM profiles WHERE user_id = $1", user_id)
    if not profile:
        # Auto-create profile if missing
        await db.execute(
            "INSERT INTO profiles (user_id) VALUES ($1) ON CONFLICT (user_id) DO NOTHING",
            user_id,
        )
        profile = await db.fetchrow("SELECT * FROM profiles WHERE user_id = $1", user_id)

    profile_dict = dict(profile) if profile else {}

    return ProfileResponse(
        user_id=str(user_id),
        full_name=current_user["name"],      # DB column is "name"
        email=current_user["email"],
        phone=current_user.get("phone") or "",
        college=current_user.get("college") or "",
        branch=current_user.get("branch") or "",
        year_of_study=current_user.get("year_of_study") or "",
        bio=profile_dict.get("bio") or "",
        skills=list(profile_dict.get("skills") or []),
        resume_score=profile_dict.get("resume_score") or 0.0,
        placement_score=profile_dict.get("placement_score") or 0.0,
        interviews_done=profile_dict.get("interviews_done") or 0,
        projects_generated=profile_dict.get("projects_generated") or 0,
        linkedin_url=profile_dict.get("linkedin_url") or "",
        github_url=profile_dict.get("github_url") or "",
        avatar_url=profile_dict.get("avatar_url") or "",
    )


@router.put("", response_model=dict)
async def update_profile(
    data: ProfileUpdateRequest,
    current_user: dict = Depends(get_current_user),
    db: asyncpg.Connection = Depends(get_db),
):
    user_id = current_user["id"]   # integer
    updates = data.model_dump(exclude_none=True)

    # Separate user-table fields from profile-table fields
    user_fields = {"full_name", "phone", "college", "branch", "year_of_study"}
    profile_fields = {"bio", "skills", "linkedin_url", "github_url", "avatar_url"}

    user_updates = {k: v for k, v in updates.items() if k in user_fields}
    profile_updates = {k: v for k, v in updates.items() if k in profile_fields}

    if user_updates:
        # Map full_name -> name for DB column
        db_user_updates = {("name" if k == "full_name" else k): v for k, v in user_updates.items()}
        set_clause = ", ".join(f"{k} = ${i+2}" for i, k in enumerate(db_user_updates.keys()))
        await db.execute(
            f"UPDATE users SET {set_clause}, updated_at = NOW() WHERE id = $1",
            user_id, *db_user_updates.values(),
        )

    if profile_updates:
        set_clause = ", ".join(f"{k} = ${i+2}" for i, k in enumerate(profile_updates.keys()))
        await db.execute(
            f"UPDATE profiles SET {set_clause}, updated_at = NOW() WHERE user_id = $1",
            user_id, *profile_updates.values(),
        )

    return {"message": "Profile updated successfully"}
