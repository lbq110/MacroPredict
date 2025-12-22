from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from src.common import guards
from src.common.database.database import get_db
from src.modules.users.models import User
from src.modules.wallet.models import Wallet as WalletModel, WalletLedger as TransactionModel
from src.modules.wallet.schemas import Wallet as WalletSchema

router = APIRouter()

@router.get("/", response_model=WalletSchema)
async def get_wallet(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(guards.get_current_user)
):
    result = await db.execute(select(WalletModel).where(WalletModel.user_id == current_user.id))
    wallet = result.scalars().first()
    if not wallet:
        # Initialize wallet if it doesn't exist (e.g., first login)
        wallet = WalletModel(user_id=current_user.id, balance=0.0)
        db.add(wallet)
        await db.commit()
        await db.refresh(wallet)
    return wallet
