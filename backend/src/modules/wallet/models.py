from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum as SQLEnum, Numeric
from sqlalchemy.sql import func
import enum
from sqlalchemy.orm import relationship
from src.common.database.database import Base

class TransactionType(str, enum.Enum):
    BET_PLACEMENT = "bet_placement"
    PAYOUT = "payout"
    DEPOSIT = "deposit"
    WITHDRAWAL = "withdrawal"
    REFUND = "refund"
    SETTLEMENT_REVERSAL = "settlement_reversal"

class Wallet(Base):
    __tablename__ = "wallets"

    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    # Use Numeric for financial correctness
    balance = Column(Numeric(precision=18, scale=8), default=0.0)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    ledger = relationship("WalletLedger", back_populates="wallet")

class WalletLedger(Base):
    __tablename__ = "wallet_ledger"

    id = Column(Integer, primary_key=True, index=True)
    wallet_id = Column(Integer, ForeignKey("wallets.user_id"), nullable=False, index=True)
    type = Column(SQLEnum(TransactionType), nullable=False)
    amount = Column(Numeric(precision=18, scale=8), nullable=False)
    # reference_id can point to a bet_id or a deposit_id
    reference_id = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    wallet = relationship("Wallet", back_populates="ledger")
