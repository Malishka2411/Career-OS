"""
Application settings loaded from backend/.env
"""
from pathlib import Path
from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict

# Locate .env relative to THIS file — works wherever uvicorn is launched from
_ENV_FILE = Path(__file__).parent.parent / ".env"  # backend/.env


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=_ENV_FILE,
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # Database (Supabase PostgreSQL)
    DATABASE_URL: str = ""

    # JWT
    JWT_SECRET_KEY: str = "supersecretkeychangeinprod"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # CORS
    CORS_ORIGINS: str = "http://localhost:5500,http://127.0.0.1:5500,http://localhost:3000,http://127.0.0.1:3000"

    # Frontend URL (Netlify deployed URL — added to CORS automatically)
    FRONTEND_URL: str = ""

    # AI Engine (internal service)
    AI_ENGINE_URL: str = "http://localhost:8001"
    AI_ENGINE_SECRET: str = ""

    # Groq LLM (used by backend services directly if needed)
    GROQ_API_KEY: str = ""
    GROK_API_URL: str = "https://api.groq.com/openai/v1/chat/completions"
    GROK_MODEL: str = "llama-3.1-8b-instant"

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.CORS_ORIGINS.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
