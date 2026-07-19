"""
asyncpg database connection pool for Supabase PostgreSQL.
"""
import ssl
import asyncpg
from fastapi import Request

from core.config import settings

_pool: asyncpg.Pool | None = None


async def connect_db():
    global _pool
    raw_url = settings.DATABASE_URL

    # asyncpg does not accept the SQLAlchemy-style prefix
    url = raw_url.replace("postgresql+asyncpg://", "postgresql://")

    # Supabase requires SSL — create a context that doesn't verify hostname
    # (Supabase uses a wildcard cert that asyncpg strict mode rejects)
    ssl_ctx = ssl.create_default_context()
    ssl_ctx.check_hostname = False
    ssl_ctx.verify_mode = ssl.CERT_NONE

    try:
        _pool = await asyncpg.create_pool(
            url,
            min_size=1,
            max_size=10,
            ssl=ssl_ctx,
            command_timeout=30,
            # pgbouncer in transaction mode does not support prepared statements
            statement_cache_size=0,
        )
        await _create_tables()
    except Exception as e:
        print(f"[DB ERROR] Failed to connect: {e}")
        raise


async def disconnect_db():
    global _pool
    if _pool:
        await _pool.close()
        _pool = None


async def _create_tables():
    """Extend existing tables with any columns our backend needs that aren't there yet."""
    async with _pool.acquire() as conn:
        # Extend users table — base columns already exist (id, name, email, password_hash, role, created_at, updated_at)
        for col_def in [
            "phone TEXT DEFAULT ''",
            "college TEXT DEFAULT ''",
            "branch TEXT DEFAULT ''",
            "year_of_study TEXT DEFAULT ''",
        ]:
            col_name = col_def.split()[0]
            await conn.execute(
                f"ALTER TABLE users ADD COLUMN IF NOT EXISTS {col_def}"
            )

        # Extend profiles table — base columns already exist (id, user_id, skills_json, strengths_json, roadmap_json, skills_embedding)
        for col_def in [
            "bio TEXT DEFAULT ''",
            "skills TEXT[] DEFAULT '{}'",
            "resume_score FLOAT DEFAULT 0.0",
            "placement_score FLOAT DEFAULT 0.0",
            "interviews_done INT DEFAULT 0",
            "projects_generated INT DEFAULT 0",
            "linkedin_url TEXT DEFAULT ''",
            "github_url TEXT DEFAULT ''",
            "avatar_url TEXT DEFAULT ''",
        ]:
            await conn.execute(
                f"ALTER TABLE profiles ADD COLUMN IF NOT EXISTS {col_def}"
            )
        print("[DB] Table schema extensions applied.")


def get_pool() -> asyncpg.Pool:
    """Returns the global connection pool."""
    if _pool is None:
        raise RuntimeError("Database pool not initialised. Call connect_db() first.")
    return _pool


async def get_db(request: Request) -> asyncpg.Connection:
    """FastAPI dependency: yields a DB connection from the pool."""
    pool: asyncpg.Pool = request.app.state.pool
    async with pool.acquire() as conn:
        yield conn
