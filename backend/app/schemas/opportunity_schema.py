"""Opportunity and Issue schemas"""
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class OpportunityBase(BaseModel):
    title: str
    description: str
    category: str
    tier: str


class OpportunityCreate(OpportunityBase):
    pass


class OpportunityResponse(OpportunityBase):
    id: int
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class UserIssueBase(BaseModel):
    title: str
    description: str
    category: str
    priority: Optional[str] = "medium"


class UserIssueCreate(UserIssueBase):
    pass


class UserIssueUpdate(BaseModel):
    status: Optional[str] = None
    priority: Optional[str] = None


class UserIssueResponse(UserIssueBase):
    id: int
    user_id: int
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
