from celery import Celery
from celery.schedules import crontab
from src.config.config import settings
from src.modules.markets.manager import MarketManager
from src.jobs.market_generator import generate_markets
from src.utils.data_fetcher import DataFetcher
from src.jobs.settlement_runner.worker import process_settlement
from src.common.database.database import engine
from sqlalchemy.ext.asyncio import async_sessionmaker
import asyncio
import logging

logger = logging.getLogger(__name__)

celery_app = Celery("macropredict", broker=f"redis://{settings.REDIS_HOST}:{settings.REDIS_PORT}/0")

SessionLocal = async_sessionmaker(autocommit=False, autoflush=False, bind=engine)

@celery_app.task
def run_market_maintenance():
    """
    Scheduled task to handle market lifecycle transitions.
    """
    loop = asyncio.get_event_loop()
    
    async def _run():
        async with SessionLocal() as db:
            # 1. Generate Markets for upcoming events
            await generate_markets()

            # 2. Close expired markets
            await MarketManager.close_expired_markets(db)
            
            # 3. Capture T0 prices
            await MarketManager.capture_t0_prices(db, DataFetcher)
            
            # 3. Trigger settlements
            await MarketManager.trigger_eligible_settlements(
                db, 
                DataFetcher, 
                process_settlement
            )

    loop.run_until_complete(_run())

# Example configuration for beat (usually in a separate config or main entry)
celery_app.conf.beat_schedule = {
    'market-maintenance-every-minute': {
        'task': 'src.jobs.scheduler.run_market_maintenance',
        'schedule': 60.0,
    },
}
