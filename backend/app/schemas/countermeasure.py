from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional

class CountermeasureBase(BaseModel):
    action_id: str
    account_id: str
    investigation_id: Optional[str] = None
    action_type: str
    reason: Optional[str] = None
    risk_score: float = 0.0
    status: str = "Pending Approval"

class CountermeasureCreate(CountermeasureBase):
    pass

class CountermeasureResponse(CountermeasureBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
