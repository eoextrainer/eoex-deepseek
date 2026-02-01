from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class ImpersonationBase(BaseModel):
    impersonated_user_id: int
    reason: Optional[str] = None


class ImpersonationCreate(ImpersonationBase):
    pass


class ImpersonationResponse(BaseModel):
    id: int
    moderator_id: int
    impersonated_user_id: int
    start_time: datetime
    end_time: Optional[datetime] = None
    reason: Optional[str] = None

    class Config:
        from_attributes = True
