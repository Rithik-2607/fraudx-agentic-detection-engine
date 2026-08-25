import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from app.core.database import Base


class FraudRingEdge(Base):
    __tablename__ = "fraud_ring_edges"

    id = Column(Integer, primary_key=True, index=True)
    ring_id = Column(String, ForeignKey("fraud_rings.ring_id", ondelete="CASCADE"), index=True, nullable=False)
    source_account_id = Column(String, ForeignKey("accounts.account_id", ondelete="CASCADE"), nullable=False)
    target_account_id = Column(String, ForeignKey("accounts.account_id", ondelete="CASCADE"), nullable=False)
    transaction_count = Column(Integer, default=0)
    total_amount = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
