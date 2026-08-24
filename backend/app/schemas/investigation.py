from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional

class InvestigationBase(BaseModel):
    investigation_id: str
    target_account_id: str
    fraud_ring_id: Optional[str] = None
    risk_score: float = 0.0
    status: str = "RUNNING"
    summary: Optional[str] = None
    confidence: float = 0.0

class InvestigationCreate(InvestigationBase):
    pass

class InvestigationResponse(InvestigationBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
