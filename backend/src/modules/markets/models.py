from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum as SQLEnum
import enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from src.common.database.database import Base

class MarketStatus(str, enum.Enum):
    UPCOMING = "UPCOMING"
    OPEN = "OPEN"
    CLOSED = "CLOSED"
    SETTLED = "SETTLED"

class BetDirection(str, enum.Enum):
    UP = "UP"
    DOWN = "DOWN"

class BetResult(str, enum.Enum):
    PENDING = "PENDING"
    WON = "WON"
    LOST = "LOST"
    CANCELLED = "CANCELLED"

class Market(Base):
    __tablename__ = "markets"

    id = Column(Integer, primary_key=True, index=True)
    asset_id = Column(Integer, ForeignKey("assets.id"), nullable=False)
    event_id = Column(Integer, ForeignKey("macro_events_history.id"), nullable=False) # Fixed FK
    status = Column(SQLEnum(MarketStatus), default=MarketStatus.UPCOMING)
    close_time = Column(DateTime(timezone=True), nullable=False) # T-1h
    settle_time = Column(DateTime(timezone=True), nullable=False) # T+30m
    
    # Snapshot at T=publish_time
    base_price = Column(Float, nullable=True)
    # Resulting price at T+30m
    settlement_price = Column(Float, nullable=True)

    # Relationships
    bets = relationship("Bet", back_populates="market")
    settlement = relationship("Settlement", back_populates="market", uselist=False)

class Bet(Base):
    __tablename__ = "bets"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    market_id = Column(Integer, ForeignKey("markets.id"), nullable=False)
    amount = Column(Float, nullable=False)
    direction = Column(SQLEnum(BetDirection), nullable=False)
    odds = Column(Float, default=2.0) # Simplified fixed odds for MVP
    result = Column(SQLEnum(BetResult), default=BetResult.PENDING)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    market = relationship("Market", back_populates="bets")

class Settlement(Base):
    __tablename__ = "settlements"

    id = Column(Integer, primary_key=True, index=True)
    market_id = Column(Integer, ForeignKey("markets.id"), nullable=False, unique=True)
    return_pct = Column(Float, nullable=False)
    outcome = Column(String, nullable=False) # UP, DOWN, FLAT
    price_at_t0 = Column(Float, nullable=False)
    price_at_t30 = Column(Float, nullable=False)
    settled_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    market = relationship("Market", back_populates="settlement")
