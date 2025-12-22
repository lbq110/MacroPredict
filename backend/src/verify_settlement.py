import asyncio
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker
from sqlalchemy import text
from src.common.database.database import engine
from src.modules.markets.models import Market, MarketStatus, Bet, BetDirection, BetResult
from src.modules.assets.models import Asset, MacroEventType, MacroEventHistory, AssetCategory
from src.modules.wallet.models import Wallet, WalletLedger, TransactionType
from src.modules.users.models import User
from src.jobs.settlement_runner.run_settlement import run_settlement_job
from src.jobs.settlement_runner.rollback_settlement import rollback_market_settlement, rollback_and_recalculate
from src.jobs.market_generator import generate_markets
from src.modules.assets.models import AssetEventStats, ScenarioType
from datetime import datetime, timedelta
from decimal import Decimal
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

SessionLocal = async_sessionmaker(autocommit=False, autoflush=False, bind=engine)

async def setup_test_data(db: AsyncSession):
    """
    Setup a test asset, event, user, and market.
    """
    logger.info("Setting up test data...")
    
    # 1. Create User & Wallet
    user = User(username="testuser", email="test@example.com", hashed_password="hashed_password")
    db.add(user)
    await db.flush()
    
    wallet = Wallet(user_id=user.id, balance=Decimal("1000.00"))
    db.add(wallet)
    
    # 2. Create Asset
    asset = Asset(
        asset_id="Crypto:L1:BTC_TEST", 
        asset_class=AssetCategory.CRYPTO, 
        asset_subclass="L1",
        symbol="BTC_TEST", 
        name="Bitcoin Test",
        symbol_source="Test",
        price_type="Spot",
        settlement_source="Manual"
    )
    db.add(asset)
    await db.flush()
    
    # 3. Create Event Type & History
    event_type = MacroEventType(code="TEST_CPI", name="Test CPI")
    db.add(event_type)
    await db.flush()
    
    publish_time = datetime.utcnow() - timedelta(minutes=45) # T0 was 45 mins ago
    event = MacroEventHistory(
        type_id=event_type.id,
        forecast_value=3.0,
        actual_value=3.5, # T0 happened
        publish_time=publish_time
    )
    db.add(event)
    await db.flush()
    
    # 4. Create Market
    market = Market(
        asset_id=asset.id,
        event_id=event.id,
        status=MarketStatus.OPEN,
        close_time=publish_time - timedelta(hours=1),
        settle_time=publish_time + timedelta(minutes=30),
        base_price=50000.0,
        settlement_price=51000.0 # T30 achieved
    )
    db.add(market)
    await db.flush()
    
    # 5. Place Bet
    bet = Bet(
        user_id=user.id,
        market_id=market.id,
        amount=100.0,
        direction=BetDirection.UP,
        odds=1.9,
        result=BetResult.PENDING
    )
    db.add(bet)
    
    # Deduct bet amount from wallet (simulating betting process)
    wallet.balance -= Decimal("100.00")
    
    await db.commit()
    return market.id, user.id

async def run_simulation():
            # 1. SETUP EVENT
            m_id, u_id = await setup_test_data(db)
            
            # 2. TEST AUTO-GENERATION
            logger.info("--- TESTING AUTO-GENERATION ---")
            await generate_markets()
            # In setup_test_data we already created one, but generate_markets should handle buffers
            
            # 3. Prepare market for settlement
            result = await db.execute(text(f"UPDATE markets SET status = 'CLOSED' WHERE id = {m_id}"))
            await db.commit()
            
            logger.info(f"Market {m_id} is now CLOSED. Running settlement job...")

            # 3. Run Job
            await run_settlement_job()
            
            # 4. Verify
            await db.refresh(await db.get(Wallet, u_id))
            wallet = await db.get(Wallet, u_id)
            logger.info(f"Final Wallet Balance: {wallet.balance}")
            # Expected: 900 (after bet) + 190 (win) = 1090
            
            result = await db.execute(text(f"SELECT result FROM bets WHERE market_id = {m_id}"))
            bet_result = result.scalar()
            logger.info(f"Bet Result: {bet_result}")
            
            result = await db.execute(text(f"SELECT outcome FROM settlements WHERE market_id = {m_id}"))
            outcome = result.scalar()
            logger.info(f"Settlement Outcome: {outcome}")

            # 4.5 VERIFY STATS
            result = await db.execute(select(AssetEventStats))
            stats = result.scalars().all()
            for s in stats:
                logger.info(f"Stats: Asset={s.asset_id}, Scenario={s.scenario}, Count={s.occurrence_count}, Up={s.up_count}")

            # 5. TEST ROLLBACK
            logger.info(f"--- STARTING ROLLBACK TEST FOR MARKET {m_id} ---")
            await rollback_market_settlement(m_id)
            
            # Verify Reset
            await db.refresh(await db.get(Wallet, u_id))
            wallet = await db.get(Wallet, u_id)
            logger.info(f"Wallet Balance after Rollback: {wallet.balance}")
            # Should be 900 again
            
            result = await db.execute(text(f"SELECT result FROM bets WHERE market_id = {m_id}"))
            bet_result = result.scalar()
            logger.info(f"Bet Result after Rollback: {bet_result}")
            # Should be PENDING
            
            result = await db.execute(text(f"SELECT count(*) FROM settlements WHERE market_id = {m_id}"))
            settlement_count = result.scalar()
            logger.info(f"Settlement records count: {settlement_count}")
            # Should be 0
            
            # Check Ledger for reversal
            result = await db.execute(text(f"SELECT type, amount FROM wallet_ledger WHERE wallet_id = {u_id} AND type = 'SETTLEMENT_REVERSAL'"))
            reversal = result.all()
            logger.info(f"Reversal entries found: {reversal}")

            # 6. TEST RECALCULATION (Settle again with different price)
            logger.info(f"--- STARTING RECALCULATION TEST ---")
            # Simulate a "correction" in T30 price
            await db.execute(text(f"UPDATE markets SET settlement_price = 45000.0 WHERE id = {m_id}"))
            await db.commit()
            
            # Outcome should change to 'DOWN' (was UP 50k -> 51k, now 50k -> 45k)
            await run_settlement_job()
            
            # Verify Second Settlement
            await db.refresh(await db.get(Wallet, u_id))
            wallet = await db.get(Wallet, u_id)
            logger.info(f"Final Wallet Balance after Recalc: {wallet.balance}")
            # Should remain 900 (because user bet UP but result is DOWN)
            
            result = await db.execute(text(f"SELECT result FROM bets WHERE market_id = {m_id}"))
            logger.info(f"Bet Result after Recalc: {result.scalar()}")
            
            result = await db.execute(text(f"SELECT outcome FROM settlements WHERE market_id = {m_id}"))
            logger.info(f"New Settlement Outcome: {result.scalar()}")

            # 7. TEST INVALID DATA (REFUND)
            logger.info("--- TESTING INVALID DATA / REFUND FLOW ---")
            # Create a market with NO prices
            market_refund = Market(
                asset_id=1, # BTC_TEST
                event_id=1, 
                status=MarketStatus.CLOSED,
                close_time=datetime.utcnow(),
                settle_time=datetime.utcnow(),
                base_price=None, # Trigger refund
                settlement_price=None
            )
            db.add(market_refund)
            await db.flush()
            
            # Place bet
            bet_refund = Bet(
                user_id=u_id,
                market_id=market_refund.id,
                amount=50.0,
                direction=BetDirection.UP,
                odds=1.9,
                result=BetResult.PENDING
            )
            db.add(bet_refund)
            # Deduct
            wallet = await db.get(Wallet, u_id)
            wallet.balance -= Decimal("50.0")
            await db.commit()
            
            logger.info(f"Balance before refund test: {wallet.balance}")
            
            await run_settlement_job()
            
            await db.refresh(wallet)
            logger.info(f"Balance after refund test: {wallet.balance}")
            # Should be back up by 50
            
            result = await db.execute(text(f"SELECT result FROM bets WHERE id = {bet_refund.id}"))
            logger.info(f"Bet Result after Refund: {result.scalar()}")

        except Exception as e:
            logger.error(f"Simulation failed: {e}")
            await db.rollback()

if __name__ == "__main__":
    asyncio.run(run_simulation())
