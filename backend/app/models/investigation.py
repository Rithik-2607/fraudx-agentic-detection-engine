import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from app.core.database import Base

class Investigation(Base):
    __tablename__ = "investigations"

    id = Column(Integer, primary_key=True, index=True)
    investigation_id = Column(String, unique=True, index=True, nullable=False)
    target_account_id = Column(String, index=True, nullable=False)
    fraud_ring_id = Column(String, index=True, nullable=True)
    risk_score = Column(Float, default=0.0)
    status = Column(String, default="RUNNING")  # RUNNING, EVIDENCE_GATHERING, RISK_ASSESSMENT, COUNTERMEASURE_PENDING, COMPLETED
    summary = Column(Text, nullable=True)
    confidence = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
