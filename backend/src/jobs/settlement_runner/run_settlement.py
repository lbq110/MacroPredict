import asyncio
import logging
from datetime import timedelta
from decimal import Decimal
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker
from sqlalchemy.future import select
from sqlalchemy import and_, exists, text
from src.common.database.database import engine
from src.modules.markets.models import Market, MarketStatus, Bet, BetResult, Settlement
from src.modules.assets.models import MacroEventHistory, PriceSnapshot, SnapshotType
from src.modules.wallet.models import Wallet, WalletLedger, TransactionType
from src.modules.assets.stats_service import update_asset_stats

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

SessionLocal = async_sessionmaker(autocommit=False, autoflush=False, bind=engine)

def resolve_outcome(return_pct: float) -> str:
    """
    Direction resolution logic.
    """
    if return_pct > 0.0001: # Small threshold for 'UP'
        return 'UP'
    elif return_pct < -0.0001: # Small threshold for 'DOWN'
        return 'DOWN'
    else:
        return 'FLAT'

async def apply_wallet_payout(db: AsyncSession, user_id: int, amount: Decimal, ref: str):
    """
    Wallet update logic (append-only ledger + balance update).
    """
    # SELECT ... FOR UPDATE
    result = await db.execute(
        select(Wallet).where(Wallet.user_id == user_id).with_for_update()
    )
    wallet = result.scalars().first()
    
    if not wallet:
        raise Exception(f"Wallet not found for user {user_id}")

    # Insert ledger entry
    ledger_entry = WalletLedger(
        wallet_id=user_id,
        type=TransactionType.PAYOUT,
        amount=amount,
        reference_id=ref
    )
    db.add(ledger_entry)

    # Update balance
    wallet.balance += amount
    logger.info(f"Payout {amount} applied to user {user_id}. Ref: {ref}")

async def settle_all_bets(db: AsyncSession, market_id: int, outcome: str, settlement_id: int):
    """
    Iterate and settle all bets for a market.
    """
    result = await db.execute(
        select(Bet).where(Bet.market_id == market_id, Bet.result == BetResult.PENDING)
    )
    bets = result.scalars().all()

    for bet in bets:
        is_win = (bet.direction.value == outcome)
        
        # Calculate payout: principal + profit
        # Assuming odds are multiplier (e.g., 1.9)
        payout = Decimal(0)
        if is_win:
            payout = Decimal(str(bet.amount)) * Decimal(str(bet.odds))

        # Update bet result
        bet.result = BetResult.WON if is_win else BetResult.LOST
        # Note: We can add settlement_id to Bet model if needed, 
        # but here we use the reference in wallet transaction.

        if payout > 0:
            await apply_wallet_payout(
                db=db,
                user_id=bet.user_id,
                amount=payout,
                ref=f"settlement:{settlement_id}"
            )

async def refund_market_bets(db: AsyncSession, market_id: int):
    """
    Refunds all pending bets for a cancelled market.
    """
    result = await db.execute(
        select(Bet).where(Bet.market_id == market_id, Bet.result == BetResult.PENDING)
    )
    bets = result.scalars().all()

    for bet in bets:
        # Create refund ledger entry
        refund_amount = Decimal(str(bet.amount))
        
        # Lock wallet
        res_wallet = await db.execute(
            select(Wallet).where(Wallet.user_id == bet.user_id).with_for_update()
        )
        wallet = res_wallet.scalars().first()
        
        if wallet:
            ledger_entry = WalletLedger(
                wallet_id=wallet.user_id,
                type=TransactionType.REFUND,
                amount=refund_amount,
                reference_id=f"refund:market:{market_id}"
            )
            db.add(ledger_entry)
            wallet.balance += refund_amount
            
            # Update bet result
            bet.result = BetResult.CANCELLED
            logger.info(f"Refunded {refund_amount} to user {bet.user_id} for market {market_id}")

async def settle_market(market_id: int):
    """
    Core settlement logic for a single market.
    """
    async with SessionLocal() as db:
        try:
            # 1. Lock market for update
            result = await db.execute(
                select(Market).where(Market.id == market_id).with_for_update()
            )
            market = result.scalars().first()
            
            if not market:
                raise Exception(f"Market {market_id} not found")

            # 2. Fetch event data
            result = await db.execute(
                select(MacroEventHistory).where(MacroEventHistory.id == market.event_id)
            )
            event = result.scalars().first()

            if not event or event.actual_value is None:
                raise Exception(f"Event {market.event_id} actual value is missing")

            assert market.status == MarketStatus.CLOSED

            # 3. Get Price Snapshots (T0 and T30)
            # T0: event.publish_time
            # T30: event.publish_time + 30m
            
            # Use market's stored prices as primary, fallback to snapshots
            price_t0 = market.base_price
            price_t30 = market.settlement_price

            # If not in market, try PriceSnapshot table
            if price_t0 is None:
                res_t0 = await db.execute(
                    select(PriceSnapshot.price).where(
                        PriceSnapshot.asset_id == market.asset_id,
                        PriceSnapshot.timestamp <= event.publish_time
                    ).order_by(PriceSnapshot.timestamp.desc()).limit(1)
                )
                price_t0 = res_t0.scalar()

            if price_t30 is None:
                res_t30 = await db.execute(
                    select(PriceSnapshot.price).where(
                        PriceSnapshot.asset_id == market.asset_id,
                        PriceSnapshot.timestamp <= event.publish_time + timedelta(minutes=30)
                    ).order_by(PriceSnapshot.timestamp.desc()).limit(1)
                )
                price_t30 = res_t30.scalar()

            if price_t0 is None or price_t30 is None:
                logger.warning(f"Missing price snapshots for market {market_id}. Cancelling market.")
                await refund_market_bets(db, market_id)
                market.status = MarketStatus.SETTLED # Or add CANCELLED status, for now SETTLED with no log
                await db.commit()
                return

            # 4. Resolve Outcome
            return_pct = (price_t30 - price_t0) / price_t0
            outcome = resolve_outcome(return_pct)

            # 5. Insert Settlement (Idempotency Guard)
            settlement = Settlement(
                market_id=market.id,
                return_pct=return_pct,
                outcome=outcome,
                price_at_t0=price_t0,
                price_at_t30=price_t30
            )
            db.add(settlement)
            await db.flush() # Get settlement.id

            # 6. Settle Bets and Payout
            await settle_all_bets(
                db=db,
                market_id=market.id,
                outcome=outcome,
                settlement_id=settlement.id
            )

            # 7. Update Market Status
            market.status = MarketStatus.SETTLED
            market.settlement_price = price_t30
            
            # 8. Update Historical Stats
            await update_asset_stats(db, market_id)
            
            await db.commit()
            logger.info(f"Market {market_id} settled successfully. Outcome: {outcome}")

        except Exception as e:
            await db.rollback()
            logger.error(f"Failed to settle market {market_id}: {str(e)}")
            raise

async def run_settlement_job():
    """
    Job entry point: Scan ready markets and settle them.
    """
    async with SessionLocal() as db:
        # Find markets ready for settlement (Idempotency check included)
        # 1. Status is CLOSED
        # 2. Event has actual_value
        # 3. NOT EXISTS in settlement_logs
        
        query = (
            select(Market.id)
            .join(MacroEventHistory, Market.event_id == MacroEventHistory.id)
            .where(
                and_(
                    Market.status == MarketStatus.CLOSED,
                    MacroEventHistory.actual_value != None,
                    ~exists().where(Settlement.market_id == Market.id)
                )
            )
        )
        
        result = await db.execute(query)
        market_ids = result.scalars().all()

        if not market_ids:
            logger.info("No markets ready for settlement.")
            return

        logger.info(f"Found {len(market_ids)} markets ready for settlement.")

        for m_id in market_ids:
            try:
                await settle_market(m_id)
            except Exception:
                # Individual market failures shouldn't stop the job
                continue

if __name__ == "__main__":
    asyncio.run(run_settlement_job())
