"""Pydantic schemas for user profile."""
from typing import Optional, List
from pydantic import BaseModel


class ProfileResponse(BaseModel):
    user_id: str
    full_name: str
    email: str
    phone: str
    college: str
    branch: str
    year_of_study: str
    bio: str
    skills: List[str]
    resume_score: float
    placement_score: float
    interviews_done: int
    projects_generated: int
    linkedin_url: str
    github_url: str
    avatar_url: str


class ProfileUpdateRequest(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    college: Optional[str] = None
    branch: Optional[str] = None
    year_of_study: Optional[str] = None
    bio: Optional[str] = None
    skills: Optional[List[str]] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    avatar_url: Optional[str] = None
