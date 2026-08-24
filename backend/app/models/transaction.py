import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime
from app.core.database import Base

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    transaction_id = Column(String, unique=True, index=True, nullable=False)
    sender_account_id = Column(String, index=True, nullable=False)
    receiver_account_id = Column(String, index=True, nullable=False)
    amount = Column(Float, nullable=False)
    currency = Column(String, default="₹")
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    location = Column(String, nullable=True)
    device_id = Column(String, nullable=True)
    ip_address = Column(String, nullable=True)
    transaction_type = Column(String, default="transfer")  # transfer, payment
    status = Column(String, default="NORMAL")  # NORMAL, SUSPICIOUS, UNDER_INVESTIGATION, FLAGGED
    risk_score = Column(Float, default=0.0)
    risk_level = Column(String, default="LOW")  # LOW, MEDIUM, HIGH, CRITICAL
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
