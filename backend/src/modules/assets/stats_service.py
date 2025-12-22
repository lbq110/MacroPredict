import logging
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import and_
from src.modules.assets.models import AssetEventStats, MacroEventHistory, MacroEventType, ScenarioType
from src.modules.markets.models import Settlement, Market

logger = logging.getLogger(__name__)

async def update_asset_stats(db: AsyncSession, market_id: int):
    """
    Updates the AssetEventStats based on the outcome of a settled market.
    """
    try:
        # 1. Fetch relevant data
        query = (
            select(Market, Settlement, MacroEventHistory, MacroEventType)
            .join(Settlement, Market.id == Settlement.market_id)
            .join(MacroEventHistory, Market.event_id == MacroEventHistory.id)
            .join(MacroEventType, MacroEventHistory.type_id == MacroEventType.id)
            .where(Market.id == market_id)
        )
        result = await db.execute(query)
        data = result.first()
        
        if not data:
            logger.error(f"Could not find settlement data for market {market_id}")
            return

        market, settlement, event, event_type = data
        
        # 2. Determine Scenario (Above/Near/Below Forecast)
        actual = event.actual_value
        forecast = event.forecast_value
        tolerance = event_type.tolerance or 0.0001
        
        if actual > forecast + tolerance:
            scenario = ScenarioType.ABOVE
        elif actual < forecast - tolerance:
            scenario = ScenarioType.BELOW
        else:
            scenario = ScenarioType.NEAR
            
        # 3. Fetch or Create AssetEventStats
        stats_query = select(AssetEventStats).where(
            and_(
                AssetEventStats.asset_id == market.asset_id,
                AssetEventStats.event_type_id == event_type.id,
                AssetEventStats.scenario == scenario
            )
        )
        stats_result = await db.execute(stats_query)
        stats = stats_result.scalars().first()
        
        if not stats:
            stats = AssetEventStats(
                asset_id=market.asset_id,
                event_type_id=event_type.id,
                scenario=scenario,
                occurrence_count=0,
                up_count=0,
                down_count=0,
                avg_move_30m=0.0
            )
            db.add(stats)
            
        # 4. Update Stats
        # Incremental average move: new_avg = (old_avg * count + new_val) / (count + 1)
        move = abs(settlement.return_pct)
        stats.avg_move_30m = (stats.avg_move_30m * stats.occurrence_count + move) / (stats.occurrence_count + 1)
        
        stats.occurrence_count += 1
        
        if settlement.outcome == "UP":
            stats.up_count += 1
        elif settlement.outcome == "DOWN":
            stats.down_count += 1

        logger.info(f"Updated stats for Asset {market.asset_id}, EventType {event_type.id}, Scenario {scenario}")

    except Exception as e:
        logger.error(f"Failed to update asset stats for market {market_id}: {e}")
        # We don't raise here to avoid failing the whole settlement if stats update fails
