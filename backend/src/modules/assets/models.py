from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum as SQLEnum, UniqueConstraint
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum
from src.common.database.database import Base

class AssetCategory(str, enum.Enum):
    CRYPTO = "CRYPTO"
    EQUITY = "EQUITY"
    INDEX = "INDEX"
    FOREX = "FOREX"
    COMMODITY = "COMMODITY"
    RATES = "RATES"

class ScenarioType(str, enum.Enum):
    ABOVE = "ABOVE"
    NEAR = "NEAR"
    BELOW = "BELOW"

class SnapshotType(str, enum.Enum):
    T0 = "T0"
    T30 = "T30"

class Asset(Base):
    __tablename__ = "assets"

    id = Column(Integer, primary_key=True, index=True)
    asset_id = Column(String, unique=True, index=True, nullable=False) # Internal unique ID
    asset_class = Column(SQLEnum(AssetCategory), nullable=False)
    asset_subclass = Column(String, nullable=False) # e.g., L1, DeFi, CPI
    symbol = Column(String, index=True, nullable=False)
    name = Column(String, nullable=False)
    
    symbol_source = Column(String, nullable=False) # TradingView, Binance, CME, FRED
    quote_currency = Column(String, default="USD") # USD, USDT
    price_type = Column(String, nullable=False) # Spot, Index, Yield, Rate, Boolean
    decimal_precision = Column(Integer, default=2)
    settlement_source = Column(String, nullable=False) # Oracle, API, Manual
    trading_enabled = Column(Integer, default=1) # 1 for True, 0 for False (using Integer for SQLite compatibility if needed, or Boolean)
    
    current_price = Column(Float, nullable=True)
    last_updated = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    stats = relationship("AssetEventStats", back_populates="asset")
    snapshots = relationship("PriceSnapshot", back_populates="asset")

class MacroEventType(Base):
    __tablename__ = "macro_event_types"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True, nullable=False) # e.g., US_CPI_YOY
    name = Column(String, nullable=False)
    source = Column(String, nullable=True) # FRED, ISM, etc.
    frequency = Column(String, nullable=True) # Monthly, etc.
    tolerance = Column(Float, default=0.0)

    # Relationships
    events = relationship("MacroEventHistory", back_populates="event_type")
    stats = relationship("AssetEventStats", back_populates="event_type")

class MacroEventHistory(Base):
    __tablename__ = "macro_events_history"

    id = Column(Integer, primary_key=True, index=True)
    type_id = Column(Integer, ForeignKey("macro_event_types.id"), nullable=False)
    forecast_value = Column(Float, nullable=True)
    actual_value = Column(Float, nullable=True)
    publish_time = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    event_type = relationship("MacroEventType", back_populates="events")

class PriceSnapshot(Base):
    __tablename__ = "price_snapshots"

    id = Column(Integer, primary_key=True, index=True)
    asset_id = Column(Integer, ForeignKey("assets.id"), nullable=False)
    timestamp = Column(DateTime(timezone=True), nullable=False, index=True)
    price = Column(Float, nullable=False)
    snapshot_type = Column(SQLEnum(SnapshotType), nullable=False)

    # Relationships
    asset = relationship("Asset", back_populates="snapshots")

class AssetEventStats(Base):
    __tablename__ = "asset_event_stats"

    id = Column(Integer, primary_key=True, index=True)
    asset_id = Column(Integer, ForeignKey("assets.id"), nullable=False)
    event_type_id = Column(Integer, ForeignKey("macro_event_types.id"), nullable=False)
    scenario = Column(SQLEnum(ScenarioType), nullable=False)
    
    occurrence_count = Column(Integer, default=0)
    up_count = Column(Integer, default=0)
    down_count = Column(Integer, default=0)
    
    # Probabilities can be derived, but storing them for faster retrieval if needed
    # Or keep counts and derive in service/schema
    avg_move_30m = Column(Float, default=0.0)
    
    last_computed_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    __table_args__ = (
        UniqueConstraint('asset_id', 'event_type_id', 'scenario', name='_asset_event_scenario_uc'),
    )

    # Relationships
    asset = relationship("Asset", back_populates="stats")
    event_type = relationship("MacroEventType", back_populates="stats")
