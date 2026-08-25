import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from app.core.database import Base


class InvestigationEvidence(Base):
    __tablename__ = "investigation_evidence"

    id = Column(Integer, primary_key=True, index=True)
    evidence_id = Column(String, unique=True, index=True, nullable=False)
    investigation_id = Column(String, ForeignKey("investigations.investigation_id", ondelete="CASCADE"), index=True, nullable=False)
    category = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    severity = Column(String, default="INFO")
    confidence = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
