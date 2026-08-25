import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from app.core.database import Base


class FraudRingMember(Base):
    __tablename__ = "fraud_ring_members"

    id = Column(Integer, primary_key=True, index=True)
    ring_id = Column(String, ForeignKey("fraud_rings.ring_id", ondelete="CASCADE"), index=True, nullable=False)
    account_id = Column(String, ForeignKey("accounts.account_id", ondelete="CASCADE"), index=True, nullable=False)
    role = Column(String, nullable=True)
    risk_score = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
