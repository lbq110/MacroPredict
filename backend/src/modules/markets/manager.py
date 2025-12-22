from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update, and_
from datetime import datetime
from src.modules.markets.models import Market, MarketStatus
from src.modules.assets.models import MacroEventHistory
from typing import List
import logging

logger = logging.getLogger(__name__)

class MarketManager:
    @staticmethod
    async def close_expired_markets(db: AsyncSession):
        """
        Transition OPEN markets to CLOSED when close_time is reached.
        """
        now = datetime.utcnow()
        stmt = (
            update(Market)
            .where(
                and_(
                    Market.status == MarketStatus.OPEN,
                    Market.close_time <= now
                )
            )
            .values(status=MarketStatus.CLOSED)
        )
        result = await db.execute(stmt)
        await db.commit()
        if result.rowcount > 0:
            logger.info(f"Closed {result.rowcount} expired markets")

    @staticmethod
    async def capture_t0_prices(db: AsyncSession, price_fetcher):
        """
        Identify markets at T0 (publish_time) and capture base_price if not yet captured.
        """
        now = datetime.utcnow()
        query = (
            select(Market, Asset.symbol)
            .join(MacroEventHistory, Market.event_id == MacroEventHistory.id)
            .join(Asset, Market.asset_id == Asset.id)
            .where(
                and_(
                    Market.status == MarketStatus.CLOSED,
                    MacroEventHistory.publish_time <= now,
                    Market.base_price == None
                )
            )
        )
        result = await db.execute(query)
        matches = result.all()
        
        for market, symbol in matches:
            price = await price_fetcher.fetch_current_price(symbol)
            market.base_price = price
            logger.info(f"Captured T0 base price {price} for market {market.id} ({symbol})")
        
        await db.commit()

    @staticmethod
    async def trigger_eligible_settlements(db: AsyncSession, price_fetcher, dispatch_settlement_task):
        """
        Find markets ready for settlement, fetch T30 price, and dispatch background tasks.
        """
        now = datetime.utcnow()
        query = (
            select(Market, Asset.symbol)
            .join(MacroEventHistory, Market.event_id == MacroEventHistory.id)
            .join(Asset, Market.asset_id == Asset.id)
            .where(
                and_(
                    Market.status == MarketStatus.CLOSED,
                    Market.settle_time <= now,
                    Market.base_price != None,
                    MacroEventHistory.actual_value != None
                )
            )
        )
        result = await db.execute(query)
        eligible = result.all()
        
        for market, symbol in eligible:
            # 1. Fetch T30 price
            t30_price = await price_fetcher.fetch_current_price(symbol)
            
            # 2. Dispatch background task
            dispatch_settlement_task.delay(market.id, t30_price)
            logger.info(f"Dispatched settlement task for market {market.id} with T30 price {t30_price}")
