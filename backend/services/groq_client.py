"""
Groq LLM wrapper — used by backend routers that call Groq directly
(when it is simpler than proxying through the ai-engine).
"""
import os
import httpx
from core.config import settings


async def groq_chat(system_prompt: str, user_prompt: str, max_tokens: int = 1024) -> str:
    """Call Groq OpenAI-compatible endpoint and return the assistant message."""
    headers = {
        "Authorization": f"Bearer {settings.GROQ_API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": settings.GROK_MODEL,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        "max_tokens": max_tokens,
        "temperature": 0.7,
    }
    async with httpx.AsyncClient(timeout=60.0) as client:
        resp = await client.post(settings.GROK_API_URL, headers=headers, json=payload)
        resp.raise_for_status()
        data = resp.json()
        return data["choices"][0]["message"]["content"]
