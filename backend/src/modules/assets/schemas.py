from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class Asset(BaseModel):
    id: int
    asset_id: str
    asset_class: str
    asset_subclass: str
    symbol: str
    name: str
    symbol_source: str
    quote_currency: str
    price_type: str
    decimal_precision: int
    settlement_source: str
    trading_enabled: bool
    current_price: Optional[float] = None
    change24h: Optional[float] = None
    nextEvent: Optional[str] = None

    class Config:
        from_attributes = True

class ScenarioDetail(BaseModel):
    count: int
    upProbability: float
    downProbability: float
    avgMove30m: float

class ScenarioStats(BaseModel):
    aboveForecast: ScenarioDetail
    nearForecast: ScenarioDetail
    belowForecast: ScenarioDetail

class ForecastActualPoint(BaseModel):
    time: str
    forecast: float
    actual: float

class AssetDetail(Asset):
    scenarioStats: ScenarioStats
    forecastVsActual: List[ForecastActualPoint]

class MacroEvent(BaseModel):
    id: str
    name: str
    publishTime: datetime
    forecast: float
    previous: float
    actual: Optional[float] = None

    class Config:
        from_attributes = True
