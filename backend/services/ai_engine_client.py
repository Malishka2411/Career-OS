"""
AI Engine HTTP client — forwards requests from the backend to ai-engine
with the shared service token.
"""
import httpx
from fastapi import HTTPException
from core.config import settings


async def call_ai_engine(path: str, payload: dict) -> dict:
    """
    POST to ai-engine at the given path (e.g. '/resume-portfolio/')
    and return the JSON response.
    """
    url = f"{settings.AI_ENGINE_URL.rstrip('/')}{path}"
    headers = {"X-Service-Token": settings.AI_ENGINE_SECRET or ""}

    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            resp = await client.post(url, json=payload, headers=headers)
            resp.raise_for_status()
            return resp.json()
    except httpx.ConnectError:
        raise HTTPException(
            status_code=503,
            detail="AI Engine is not running. Start it with: uvicorn main:app --port 8001 in the ai-engine folder",
        )
    except httpx.HTTPStatusError as e:
        raise HTTPException(
            status_code=e.response.status_code,
            detail=f"AI Engine error: {e.response.text[:300]}",
        )
