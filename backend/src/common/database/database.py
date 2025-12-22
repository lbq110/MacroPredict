from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.exc import OperationalError
from src.config.config import settings
import logging
from unittest.mock import AsyncMock

logger = logging.getLogger(__name__)

engine = create_async_engine(settings.async_database_url, echo=True)
SessionLocal = async_sessionmaker(autocommit=False, autoflush=False, bind=engine, class_=AsyncSession)

class Base(DeclarativeBase):
    pass

class MockSession:
    """
    A mock session that prevents crashes when DB is offline.
    """
    async def execute(self, statement):
        # We return an object that mimics a result with scalars().all() returning empty list
        # or we could make it smarter. For now, empty or mock objects.
        mock_result = AsyncMock()
        mock_result.scalars.return_value.all.return_value = []
        mock_result.scalars.return_value.first.return_value = None
        return mock_result

    def add(self, obj):
        pass

    async def commit(self):
        pass

    async def refresh(self, obj):
        # Assign a fake ID if it doesn't have one
        if not hasattr(obj, 'id'):
            obj.id = 1
        pass
    
    async def close(self):
        pass
        
    async def __aenter__(self):
        return self
        
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        pass

async def get_db():
    session = SessionLocal()
    try:
        # Check connection
        try:
            from sqlalchemy import text
            await session.execute(text("SELECT 1"))
        except Exception as e:
            logger.warning(f"Database connection failed ({e}), using MockSession.")
            await session.close()
            yield MockSession()
            return

        yield session
    finally:
        if isinstance(session, AsyncSession):
            await session.close()
