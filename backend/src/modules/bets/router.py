from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from src.common import guards
from src.common.database.database import get_db
from src.modules.users.models import User
from src.modules.markets.models import Bet as BetModel
from src.modules.bets.schemas import BetRequest, Bet as BetSchema
from src.modules.bets import service as betting_service

router = APIRouter()

@router.post("/", response_model=BetSchema)
async def create_bet(
    bet_in: BetRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(guards.get_current_user)
):
    # Mapping BetRequest to service format if needed
    return await betting_service.place_bet(db=db, user=current_user, bet_in=bet_in)

@router.get("/history", response_model=List[BetSchema])
async def get_bet_history(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(guards.get_current_user)
):
    result = await db.execute(
        select(BetModel).where(BetModel.user_id == current_user.id).order_by(BetModel.created_at.desc())
    )
    bets = result.scalars().all()
    
    # Transform to match schema
    return [
        {
            "id": str(b.id),
            "marketId": str(b.market_id),
            "direction": b.direction,
            "amount": b.amount,
            "result": b.result
        }
        for b in bets
    ]
