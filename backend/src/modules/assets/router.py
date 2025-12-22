from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional
from src.common.database.database import get_db, MockSession
from src.modules.assets.models import Asset as AssetModel, MacroEventHistory as MacroEventModel, AssetCategory
from src.modules.assets.schemas import Asset, AssetDetail, MacroEvent
from src.utils.data_fetcher import DataFetcher
import random
from datetime import datetime, timedelta

router = APIRouter()

async def get_simulated_assets():
    """Helper to generate simulated assets if DB is down"""
    symbols = {
        "BTC": {"class": AssetCategory.CRYPTO, "price": await DataFetcher.fetch_current_price("BTC")},
        "ETH": {"class": AssetCategory.CRYPTO, "price": await DataFetcher.fetch_current_price("ETH")},
        "SP500": {"class": AssetCategory.INDEX, "price": await DataFetcher.fetch_current_price("SP500")},
        "GOLD": {"class": AssetCategory.COMMODITY, "price": await DataFetcher.fetch_current_price("GOLD")},
        "SILVER": {"class": AssetCategory.COMMODITY, "price": await DataFetcher.fetch_current_price("SILVER")},
        "US10Y": {"class": AssetCategory.RATES, "price": await DataFetcher.fetch_current_price("US10Y")},
    }
    assets = []
    for i, (sym, data) in enumerate(symbols.items()):
        assets.append(AssetModel(
            id=i+1,
            asset_id=sym,
            asset_class=data["class"],
            asset_subclass="Major",
            symbol=sym,
            name=sym, # Simplified
            symbol_source="Simulated",
            quote_currency="USD",
            price_type="Spot",
            settlement_source="Simulated",
            current_price=data["price"],
            decimal_precision=2,
            trading_enabled=1, # Coerces to True
            last_updated=datetime.utcnow()
        ))
    return assets

@router.get("/", response_model=List[Asset])
async def list_assets(db: AsyncSession = Depends(get_db)):
    try:
        if isinstance(db, MockSession):
            return await get_simulated_assets()
            
        result = await db.execute(select(AssetModel))
        assets = result.scalars().all()
        
        if not assets:
            return await get_simulated_assets()
            
        return assets
    except Exception:
        # Fallback if query fails even with valid session
        return await get_simulated_assets()

@router.get("/{assetId}", response_model=AssetDetail)
async def get_asset(assetId: str, db: AsyncSession = Depends(get_db)):
    asset = None
    if not isinstance(db, MockSession):
        try:
            result = await db.execute(select(AssetModel).where(AssetModel.asset_id == assetId))
            asset = result.scalars().first()
        except Exception:
            pass
            
    if not asset:
        # Check simulation
        sim_assets = await get_simulated_assets()
        asset = next((a for a in sim_assets if a.asset_id == assetId or a.symbol == assetId), None)
        
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    
    # In a real app, we would fetch scenario stats and historical points here
    # Putting dummy data for now to match the schema
    dummy_stats = {
        "aboveForecast": {"count": 10, "upProbability": 0.6, "downProbability": 0.4, "avgMove30m": 0.005},
        "nearForecast": {"count": 20, "upProbability": 0.5, "downProbability": 0.5, "avgMove30m": 0.002},
        "belowForecast": {"count": 15, "upProbability": 0.3, "downProbability": 0.7, "avgMove30m": 0.008}
    }
    dummy_points = [
        {"time": "2025-01-01", "forecast": 100.0, "actual": 102.0},
        {"time": "2025-02-01", "forecast": 101.0, "actual": 100.5}
    ]
    
    return {
        **asset.__dict__,
        "scenarioStats": dummy_stats,
        "forecastVsActual": dummy_points
    }

@router.get("/calendar", response_model=List[MacroEvent])
async def list_calendar(assetId: Optional[str] = None, db: AsyncSession = Depends(get_db)):
    if isinstance(db, MockSession):
        # Return dummy calendar
        return [
            MacroEventModel(
                id=1,
                type_id=1,
                publish_time=datetime.utcnow() + timedelta(hours=24),
                forecast_value=3.4,
                actual_value=None
            )
        ]

    # In a real app, we would filter by assetId if provided
    try:
        result = await db.execute(select(MacroEventModel).order_by(MacroEventModel.publish_time.asc()))
        events = result.scalars().all()
        if not events:
             return [
                MacroEventModel(
                    id=1,
                    type_id=1,
                    publish_time=datetime.utcnow() + timedelta(hours=24),
                    forecast_value=3.4,
                    actual_value=None
                )
            ]
        return events
    except Exception:
          return [
                MacroEventModel(
                    id=1,
                    type_id=1,
                    publish_time=datetime.utcnow() + timedelta(hours=24),
                    forecast_value=3.4,
                    actual_value=None
                )
            ]
