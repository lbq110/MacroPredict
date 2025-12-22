from sqlalchemy.ext.asyncio import AsyncSession
from src.modules.bets.schemas import BetCreate
from src.modules.users.models import User
from src.modules.markets.models import Bet, Market
from src.modules.wallet.models import Wallet, WalletLedger, TransactionType
from fastapi import HTTPException

async def place_bet(db: AsyncSession, user: User, bet_in: BetCreate):
    # 1. Check Market
    market = await db.get(Market, bet_in.market_id)
    if not market:
        raise HTTPException(status_code=404, detail="Market not found")
    
    # 2. Check Wallet
    result = await db.execute(select(Wallet).where(Wallet.user_id == user.id))
    wallet = result.scalars().first()
    if not wallet or wallet.balance < bet_in.amount:
        raise HTTPException(status_code=400, detail="Insufficient balance")
    
    # 3. Create Bet
    db_bet = Bet(
        user_id=user.id,
        market_id=bet_in.market_id,
        direction=bet_in.direction,
        amount=bet_in.amount,
        odds=1.9 # Placeholder for fixed odds
    )
    db.add(db_bet)
    
    # 4. Deduct Balance & Log
    wallet.balance -= bet_in.amount
    transaction = WalletLedger(
        wallet_id=wallet.id,
        amount=-bet_in.amount,
        type=TransactionType.BET_PLACEMENT,
        reference_id=str(db_bet.id)
    )
    db.add(transaction)
    
    await db.commit()
    await db.refresh(db_bet)
    return db_bet

from sqlalchemy.future import select # Inner import fix
