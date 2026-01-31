"""Subscription schemas"""

from pydantic import BaseModel
from datetime import datetime


class SubscriptionPlanBase(BaseModel):
    name: str
    description: str | None = None


class SubscriptionPlanCreate(SubscriptionPlanBase):
    pass


class SubscriptionPlan(SubscriptionPlanBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True


class SubscriptionBase(BaseModel):
    user_id: int
    plan_id: int


class SubscriptionCreate(SubscriptionBase):
    pass


class SubscriptionUpdate(BaseModel):
    plan_id: int | None = None
    status: str | None = None


class Subscription(SubscriptionBase):
    id: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
