from src.config.config import settings
from src.modules.settlement.service import SettlementService

import asyncio

@celery_app.task(name="app.workers.settlement.process_settlement")
def process_settlement(market_id: int, settlement_price: float):
    """
    Background worker task to trigger settlement.
    """
    loop = asyncio.get_event_loop()
    return loop.run_until_complete(SettlementService.settle_market(market_id, settlement_price))
