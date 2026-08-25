import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from app.core.database import Base


class AgentActivity(Base):
    __tablename__ = "agent_activity"

    id = Column(Integer, primary_key=True, index=True)
    agent_id = Column(String, ForeignKey("agents.agent_id", ondelete="SET NULL"), index=True, nullable=True)
    investigation_id = Column(String, ForeignKey("investigations.investigation_id", ondelete="SET NULL"), index=True, nullable=True)
    agent_name = Column(String, nullable=False)
    action = Column(Text, nullable=False)
    target = Column(String, nullable=True)
    status = Column(String, nullable=False)
    icon = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, index=True)
