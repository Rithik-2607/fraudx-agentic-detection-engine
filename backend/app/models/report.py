import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Text, JSON
from app.core.database import Base

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(String, unique=True, index=True, nullable=False)
    investigation_id = Column(String, index=True, nullable=False)
    report_type = Column(String, default="FRAUD_INVESTIGATION")  # FRAUD_INVESTIGATION, RING_ANALYSIS, RISK_ASSESSMENT, COUNTERMEASURE
    title = Column(String, nullable=False)
    summary = Column(Text, nullable=True)
    risk_score = Column(Float, default=0.0)
    confidence = Column(Float, default=0.0)
    content = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
