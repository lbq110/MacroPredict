from pydantic import BaseModel
from enum import Enum

class BetDirection(str, Enum):
    UP = "UP"
    DOWN = "DOWN"

class BetResult(str, Enum):
    WIN = "WIN"
    LOSE = "LOSE"
    PENDING = "PENDING"

class BetRequest(BaseModel):
    marketId: str
    direction: BetDirection
    amount: float

class Bet(BaseModel):
    id: str
    marketId: str
    direction: BetDirection
    amount: float
    result: BetResult

    class Config:
        from_attributes = True

BetCreate = BetRequest
