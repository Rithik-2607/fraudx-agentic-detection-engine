import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime
from app.core.database import Base

class Countermeasure(Base):
    __tablename__ = "countermeasures"

    id = Column(Integer, primary_key=True, index=True)
    action_id = Column(String, unique=True, index=True, nullable=False)
    account_id = Column(String, index=True, nullable=False)
    investigation_id = Column(String, index=True, nullable=True)
    action_type = Column(String, nullable=False)  # MONITOR, REQUEST_VERIFICATION, RESTRICT_TRANSACTIONS, ESCALATE_INVESTIGATION, GENERATE_FORENSIC_REPORT
    reason = Column(String, nullable=True)
    risk_score = Column(Float, default=0.0)
    status = Column(String, default="Pending Approval")  # Pending Approval, Executed, Active
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
