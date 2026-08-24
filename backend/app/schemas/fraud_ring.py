from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional, List

class FraudRingBase(BaseModel):
    ring_id: str
    name: Optional[str] = None
    risk_score: float = 0.0
    severity: str = "LOW"
    account_count: int = 0
    transaction_count: int = 0
    total_amount: float = 0.0
    pattern_type: str
    status: str = "Active"

class FraudRingCreate(FraudRingBase):
    pass

class FraudRingResponse(FraudRingBase):
    id: int
    detected_at: datetime

    model_config = ConfigDict(from_attributes=True)
