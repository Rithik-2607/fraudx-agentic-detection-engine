import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from app.core.database import Base


class InvestigationEvent(Base):
    __tablename__ = "investigation_events"

    id = Column(Integer, primary_key=True, index=True)
    investigation_id = Column(String, ForeignKey("investigations.investigation_id", ondelete="CASCADE"), index=True, nullable=False)
    event_type = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    status = Column(String, default="completed")
    occurred_at = Column(DateTime, default=datetime.datetime.utcnow)
