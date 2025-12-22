import asyncio
import logging
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker
from sqlalchemy.future import select
from sqlalchemy import and_, exists
from src.common.database.database import engine
from src.modules.markets.models import Market, MarketStatus
from src.modules.assets.models import Asset, MacroEventHistory

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

SessionLocal = async_sessionmaker(autocommit=False, autoflush=False, bind=engine)

async def generate_markets():
    """
    Scans for MacroEventHistory that don't have associated Markets yet and creates them.
    Logic: Link all assets of a relevant category to the event if needed, 
    or simply link specific assets. For MVP, we link all assets to upcoming events.
    """
    async with SessionLocal() as db:
        try:
            # 1. Find upcoming events (T-24h to T+48h for buffer)
            # focusing on events that don't have a market yet
            now = datetime.utcnow()
            horizon = now + timedelta(hours=48)
            
            # Find all assets
            asset_result = await db.execute(select(Asset))
            assets = asset_result.scalars().all()
            
            if not assets:
                logger.warning("No assets found to create markets for.")
                return

            event_query = (
                select(MacroEventHistory)
                .where(
                    and_(
                        MacroEventHistory.publish_time > now,
                        MacroEventHistory.publish_time <= horizon
                    )
                )
            )
            event_result = await db.execute(event_query)
            events = event_result.scalars().all()
            
            created_count = 0
            for event in events:
                for asset in assets:
                    # Check if market already exists for this (asset, event)
                    market_exists = await db.execute(
                        select(exists().where(
                            and_(
                                Market.asset_id == asset.id,
                                Market.event_id == event.id
                            )
                        ))
                    )
                    if not market_exists.scalar():
                        # Create Market
                        # close_time = T-1h, settle_time = T+30m
                        market = Market(
                            asset_id=asset.id,
                            event_id=event.id,
                            status=MarketStatus.OPEN, # Or UPCOMING if publish_time is far
                            close_time=event.publish_time - timedelta(hours=1),
                            settle_time=event.publish_time + timedelta(minutes=30)
                        )
                        # Adjustment: If now is already past close_time, status should be CLOSED
                        if now >= market.close_time:
                            market.status = MarketStatus.CLOSED
                        
                        db.add(market)
                        created_count += 1
            
            if created_count > 0:
                await db.commit()
                logger.info(f"Created {created_count} new markets.")
            else:
                logger.debug("No new markets to create.")

        except Exception as e:
            await db.rollback()
            logger.error(f"Market generation failed: {e}")

if __name__ == "__main__":
    asyncio.run(generate_markets())
