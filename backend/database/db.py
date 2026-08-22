"""
NEXUS TERMINAL — Database Setup
SQLAlchemy async engine — SQLite default, PostgreSQL-ready via DATABASE_URL
"""
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase

from core.config import settings

# Ensure aiosqlite is used for SQLite URLs
database_url = settings.database_url
if database_url.startswith("sqlite:///") and "aiosqlite" not in database_url:
    database_url = database_url.replace("sqlite:///", "sqlite+aiosqlite:///")

engine = create_async_engine(
    database_url,
    echo=settings.app_env == "development",
    connect_args={"check_same_thread": False} if "sqlite" in database_url else {},
)

AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


class Base(DeclarativeBase):
    pass


async def get_db() -> AsyncSession:
    """FastAPI dependency — yields a DB session."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise


async def init_db():
    """Create all tables on startup."""
    from database import models  # noqa: F401 — imports trigger model registration
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
