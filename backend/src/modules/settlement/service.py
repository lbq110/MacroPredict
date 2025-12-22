from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker
from sqlalchemy.future import select
from decimal import Decimal
from datetime import datetime
from src.modules.markets.models import Market, MarketStatus, Bet, BetResult, BetDirection
from src.modules.wallet.models import Wallet, WalletLedger, TransactionType
from src.common.database.database import engine
import logging

logger = logging.getLogger(__name__)

# Create a sessionmaker for the worker (outside of FastAPI request context)
SessionLocal = async_sessionmaker(autocommit=False, autoflush=False, bind=engine)

class SettlementService:
    @staticmethod
    async def settle_market(market_id: int, settlement_price: float):
        """
        Calculates winners, updates bet statuses, and distributes payouts.
        Everything runs inside a single transaction.
        """
        async with SessionLocal() as db:
            try:
                # 1. Fetch Market with lock to prevent race conditions
                result = await db.execute(
                    select(Market).where(Market.id == market_id).with_for_update()
                )
                market = result.scalars().first()
                
                if not market:
                    logger.error(f"Market {market_id} not found")
                    return False
                
                if market.status == MarketStatus.SETTLED:
                    logger.warning(f"Market {market_id} already settled")
                    return True

                if market.base_price is None:
                    logger.error(f"Market {market_id} missing base_price")
                    return False

                market.settlement_price = settlement_price
                market.status = MarketStatus.SETTLED

                # 2. Determine Outcome
                price_change = settlement_price - market.base_price
                if price_change > 0:
                    winning_direction = BetDirection.UP
                elif price_change < 0:
                    winning_direction = BetDirection.DOWN
                else:
                    # Stagnant price - in binary market, usually House wins or push. 
                    # For MVP: treat as LOST for both directions.
                    winning_direction = None
                
                # 3. Resolve Bets
                result = await db.execute(
                    select(Bet).where(Bet.market_id == market_id, Bet.result == BetResult.PENDING)
                )
                bets = result.scalars().all()
                
                for bet in bets:
                    if winning_direction and bet.direction == winning_direction:
                        bet.result = BetResult.WON
                        # odds are stored as float, convert to Decimal for precise calculation
                        payout_amount = Decimal(str(bet.amount)) * Decimal(str(bet.odds))
                        
                        # 4. Update User Wallet
                        res_wallet = await db.execute(
                            select(Wallet).where(Wallet.user_id == bet.user_id).with_for_update()
                        )
                        wallet = res_wallet.scalars().first()
                        
                        if wallet:
                            wallet.balance += payout_amount
                            
                            # 5. Log Transaction
                            db_transaction = WalletLedger(
                                wallet_id=wallet.id,
                                type=TransactionType.PAYOUT,
                                amount=payout_amount,
                                reference_id=str(bet.id)
                            )
                            db.add(db_transaction)
                        else:
                            logger.error(f"Wallet not found for user_id {bet.user_id} in bet {bet.id}")
                    else:
                        bet.result = BetResult.LOST
                
                await db.commit()
                logger.info(f"Successfully settled market {market_id} with price {settlement_price}")
                return True
            except Exception as e:
                await db.rollback()
                logger.exception(f"Settlement failed for market {market_id}")
                return False
