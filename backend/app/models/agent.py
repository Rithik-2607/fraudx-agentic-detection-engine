import datetime
from sqlalchemy import Column, Integer, String, DateTime
from app.core.database import Base

class Agent(Base):
    __tablename__ = "agents"

    id = Column(Integer, primary_key=True, index=True)
    agent_id = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    agent_type = Column(String, nullable=False)
    status = Column(String, default="Active")  # Active, Standby, Offline
    description = Column(String, nullable=True)
    tasks_completed = Column(Integer, default=0)
    items_analyzed = Column(Integer, default=0)
    last_activity = Column(DateTime, default=datetime.datetime.utcnow)
