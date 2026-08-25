import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime
from app.core.database import Base


class SimulationRun(Base):
    __tablename__ = "simulation_runs"

    id = Column(Integer, primary_key=True, index=True)
    run_id = Column(String, unique=True, index=True, nullable=False)
    target_account_id = Column(String, index=True, nullable=False)
    investigation_id = Column(String, nullable=True)
    status = Column(String, default="STARTED")
    risk_score = Column(Float, nullable=True)
    started_at = Column(DateTime, default=datetime.datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
