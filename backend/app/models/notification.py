import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime
from app.core.database import Base

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    notification_id = Column(String, unique=True, index=True, nullable=False)
    title = Column(String, nullable=False)
    message = Column(String, nullable=True)
    severity = Column(String, default="INFO")  # INFO, WARNING, HIGH, CRITICAL
    read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
