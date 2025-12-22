from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional
from src.common.database.database import get_db
from src.modules.markets.models import Market as MarketModel
from src.modules.markets.schemas import Market

router = APIRouter()

@router.get("/", response_model=List[Market])
async def list_markets(assetId: Optional[str] = None, db: AsyncSession = Depends(get_db)):
    query = select(MarketModel)
    if assetId:
        query = query.where(MarketModel.asset_id == assetId)
    
    result = await db.execute(query)
    markets = result.scalars().all()
    
    # Transform to match schema (e.g. odds might need transformation)
    return [
        {
            "id": str(m.id),
            "assetId": str(m.asset_id),
            "eventId": str(m.event_id),
            "status": m.status, # Market still has 'status' (UPCOMING/OPEN/CLOSED/SETTLED)
            "odds": m.odds if hasattr(m, 'odds') else {"UP": 1.9, "DOWN": 1.9}
        }
        for m in markets
    ]
