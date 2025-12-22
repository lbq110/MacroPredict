from pydantic import BaseModel
from typing import Optional, Dict
from datetime import datetime
from enum import Enum

class MarketStatus(str, Enum):
    UPCOMING = "UPCOMING"
    OPEN = "OPEN"
    CLOSED = "CLOSED"
    SETTLED = "SETTLED"

class Market(BaseModel):
    id: str
    assetId: str
    eventId: str
    status: MarketStatus
    odds: Dict[str, float]

    class Config:
        from_attributes = True
