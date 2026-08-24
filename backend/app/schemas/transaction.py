from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional

class TransactionBase(BaseModel):
    transaction_id: str
    sender_account_id: str
    receiver_account_id: str
    amount: float
    currency: str = "₹"
    timestamp: datetime
    location: Optional[str] = None
    device_id: Optional[str] = None
    ip_address: Optional[str] = None
    transaction_type: str = "transfer"
    status: str = "NORMAL"
    risk_score: float = 0.0
    risk_level: str = "LOW"

class TransactionCreate(TransactionBase):
    pass

class TransactionResponse(TransactionBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
