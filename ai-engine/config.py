"""
Typed application settings, loaded from environment variables / .env file.

Usage:
    from config import settings
    settings.ANTHROPIC_API_KEY
"""

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    ENV: str = "development"

    # Generative AI
    ANTHROPIC_API_KEY: str = ""
    ANTHROPIC_MODEL: str = "claude-sonnet-4-6"

    # Database (provided by Backend team)
    DATABASE_URL: str = ""

    # Auth (shared secret / JWKS url, provided by Backend team)
    AUTH_SHARED_SECRET: str = ""

    # Service
    SERVICE_NAME: str = "ai-engine"
    LOG_LEVEL: str = "INFO"


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
