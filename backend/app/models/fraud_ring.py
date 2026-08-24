import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime
from app.core.database import Base

class FraudRing(Base):
    __tablename__ = "fraud_rings"

    id = Column(Integer, primary_key=True, index=True)
    ring_id = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=True)
    risk_score = Column(Float, default=0.0)
    severity = Column(String, default="LOW")  # LOW, MEDIUM, HIGH, CRITICAL
    account_count = Column(Integer, default=0)
    transaction_count = Column(Integer, default=0)
    total_amount = Column(Float, default=0.0)
    pattern_type = Column(String, nullable=False)  # CIRCULAR_FLOW, RAPID_TRANSFER_CHAIN, LAYERING, FUNNEL_NETWORK, SHARED_DEVICE_CLUSTER, MULTI_ACCOUNT_CLUSTER
    status = Column(String, default="Active")  # Active, Monitoring, Resolved
    detected_at = Column(DateTime, default=datetime.datetime.utcnow)
