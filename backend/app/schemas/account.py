from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional

class AccountBase(BaseModel):
    account_id: str
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    device_id: Optional[str] = None
    ip_address: Optional[str] = None
    account_status: str = "ACTIVE"
    risk_score: float = 0.0

class AccountCreate(AccountBase):
    pass

class AccountResponse(AccountBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
