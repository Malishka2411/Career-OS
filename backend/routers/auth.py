"""
Auth router — register, login, get current user.
Adapted to actual Supabase schema: users.id is INTEGER, users.name (not full_name).
"""
import hashlib
import os
from fastapi import APIRouter, Depends, HTTPException, status
import asyncpg

from core.security import hash_password, verify_password, create_access_token
from core.database import get_db
from dependencies.auth import get_current_user
from schemas.auth import LoginRequest, RegisterRequest, TokenResponse

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(data: RegisterRequest, db: asyncpg.Connection = Depends(get_db)):
    # Check existing user
    existing = await db.fetchrow("SELECT id FROM users WHERE email = $1", data.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    pw_hash = hash_password(data.password)

    # Insert — id is auto-generated SERIAL integer; users.name stores the display name
    row = await db.fetchrow(
        """
        INSERT INTO users (name, email, password_hash, role, phone, college, branch, year_of_study)
        VALUES ($1, $2, $3, 'student', $4, $5, $6, $7)
        RETURNING id, name, email, role
        """,
        data.full_name, data.email, pw_hash,
        data.phone or "", data.college or "", data.branch or "", data.year_of_study or "",
    )

    user_id = row["id"]

    # Create empty profile row if not already there
    await db.execute(
        "INSERT INTO profiles (user_id) VALUES ($1) ON CONFLICT (user_id) DO NOTHING",
        user_id,
    )

    token = create_access_token({"sub": str(user_id), "email": data.email})
    return TokenResponse(
        access_token=token,
        user_id=str(user_id),
        email=data.email,
        full_name=data.full_name,
        role="student",
    )


@router.post("/login", response_model=TokenResponse)
async def login(data: LoginRequest, db: asyncpg.Connection = Depends(get_db)):
    user = await db.fetchrow("SELECT * FROM users WHERE email = $1", data.email)
    if not user or not verify_password(data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({"sub": str(user["id"]), "email": user["email"]})
    return TokenResponse(
        access_token=token,
        user_id=str(user["id"]),
        email=user["email"],
        full_name=user["name"],   # DB column is "name"
        role=user["role"],
    )


@router.get("/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    return {
        "user_id": str(current_user["id"]),
        "email": current_user["email"],
        "full_name": current_user["name"],   # DB column is "name"
        "phone": current_user.get("phone", ""),
        "college": current_user.get("college", ""),
        "branch": current_user.get("branch", ""),
        "year_of_study": current_user.get("year_of_study", ""),
        "role": current_user["role"],
    }
