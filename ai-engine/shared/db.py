"""
Shared database client used by all sub-systems to read/write the
Digital Twin and other persisted data.

This is a thin placeholder — swap the implementation once the Backend
team confirms whether the AI Engine talks to Postgres directly, or
through a Backend-owned internal API instead. Keeping this in one file
means that decision only has to change in one place.

Usage:
    from shared.db import get_db

    async def some_service_function():
        db = get_db()
        row = await db.fetch_one(...)
"""

from functools import lru_cache

from config import settings
from shared.logging_config import get_logger

logger = get_logger(__name__)


class DBClient:
    """
    Placeholder DB client. Replace internals with the real driver
    (e.g. asyncpg, SQLAlchemy async engine, or a Backend-internal HTTP
    client) once the integration approach is confirmed.
    """

    def __init__(self, database_url: str):
        self.database_url = database_url
        self._connected = False

    async def connect(self) -> None:
        if not self.database_url:
            logger.warning("DATABASE_URL not set — running with no DB connection.")
            return
        # TODO: replace with real connection logic, e.g.:
        # self._pool = await asyncpg.create_pool(self.database_url)
        self._connected = True
        logger.info("DB client connected.")

    async def disconnect(self) -> None:
        if self._connected:
            # TODO: await self._pool.close()
            self._connected = False
            logger.info("DB client disconnected.")

    async def fetch_one(self, query: str, *args):
        raise NotImplementedError("Wire up the real DB driver here.")

    async def execute(self, query: str, *args):
        raise NotImplementedError("Wire up the real DB driver here.")


@lru_cache
def get_db() -> DBClient:
    return DBClient(settings.DATABASE_URL)
