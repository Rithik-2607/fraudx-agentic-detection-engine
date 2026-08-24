from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional

class ReportBase(BaseModel):
    report_id: str
    investigation_id: str
    report_type: str = "FRAUD_INVESTIGATION"
    title: str
    summary: Optional[str] = None
    risk_score: float = 0.0
    confidence: float = 0.0
    content: Optional[str] = None

class ReportCreate(ReportBase):
    pass

class ReportResponse(ReportBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
