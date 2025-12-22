import asyncio
import logging
from decimal import Decimal
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker
from sqlalchemy.future import select
from sqlalchemy import delete
from src.common.database.database import engine
from src.modules.markets.models import Market, MarketStatus, Bet, BetResult, Settlement
from src.modules.wallet.models import Wallet, WalletLedger, TransactionType

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

SessionLocal = async_sessionmaker(autocommit=False, autoflush=False, bind=engine)

async def rollback_market_settlement(market_id: int):
    """
    Safely undoes a settlement for a specific market.
    """
    async with SessionLocal() as db:
        try:
            # 1. Lock market and find settlement
            result = await db.execute(
                select(Market).where(Market.id == market_id).with_for_update()
            )
            market = result.scalars().first()
            
            if not market:
                raise Exception(f"Market {market_id} not found")
            
            if market.status != MarketStatus.SETTLED:
                logger.warning(f"Market {market_id} is not settled. Status: {market.status}")
                return

            result = await db.execute(
                select(Settlement).where(Settlement.market_id == market_id)
            )
            settlement = result.scalars().first()
            
            if not settlement:
                raise Exception(f"Settlement record not found for market {market_id}")

            settlement_ref = f"settlement:{settlement.id}"

            # 2. Find and Reverse Wallet Ledger entries
            result = await db.execute(
                select(WalletLedger).where(WalletLedger.reference_id == settlement_ref)
            )
            payouts = result.scalars().all()
            
            logger.info(f"Found {len(payouts)} payouts to reverse for market {market_id}")

            for payout in payouts:
                # Reverse payout on wallet
                res_wallet = await db.execute(
                    select(Wallet).where(Wallet.user_id == payout.wallet_id).with_for_update()
                )
                wallet = res_wallet.scalars().first()
                
                if wallet:
                    # Create reversal ledger entry
                    reversal_amount = -payout.amount
                    reversal_ledger = WalletLedger(
                        wallet_id=wallet.user_id,
                        type=TransactionType.SETTLEMENT_REVERSAL,
                        amount=reversal_amount,
                        reference_id=f"reversal:{settlement_ref}"
                    )
                    db.add(reversal_ledger)
                    
                    wallet.balance += reversal_amount
                    logger.info(f"Reversed {payout.amount} for user {wallet.user_id}")

            # 3. Reset Bets to PENDING
            await db.execute(
                Bet.__table__.update()
                .where(Bet.market_id == market_id)
                .values(result=BetResult.PENDING)
            )

            # 4. Reset Market to CLOSED
            market.status = MarketStatus.CLOSED
            market.settlement_price = None

            # 5. Remove Settlement Record (to allow re-settlement)
            await db.delete(settlement)

            await db.commit()
            logger.info(f"Market {market_id} settlement rolled back successfully.")

        except Exception as e:
            await db.rollback()
            logger.error(f"Rollback failed for market {market_id}: {str(e)}")
            raise

async def rollback_and_recalculate(market_id: int):
    """
    Rollback and then immediately trigger re-settlement.
    This effectively "recalculates" the market.
    """
    await rollback_market_settlement(market_id)
    # Import inside to avoid circular dependency if any
    from src.jobs.settlement_runner.run_settlement import settle_market
    await settle_market(market_id)

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        print("Usage: python -m src.jobs.settlement_runner.rollback_settlement <market_id>")
        sys.exit(1)
    
    m_id = int(sys.argv[1])
    asyncio.run(rollback_market_settlement(m_id))
