from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional

class AgentBase(BaseModel):
    agent_id: str
    name: str
    agent_type: str
    status: str = "Active"
    description: Optional[str] = None
    tasks_completed: int = 0
    items_analyzed: int = 0

class AgentCreate(AgentBase):
    pass

class AgentResponse(AgentBase):
    id: int
    last_activity: datetime

    model_config = ConfigDict(from_attributes=True)
