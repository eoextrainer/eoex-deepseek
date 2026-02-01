"""Feature request schemas"""
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class FeatureRequestBase(BaseModel):
    title: str
    description: str
    priority: Optional[str] = "medium"


class FeatureRequestCreate(FeatureRequestBase):
    pass


class FeatureRequestUpdate(BaseModel):
    status: Optional[str] = None
    priority: Optional[str] = None


class FeatureRequestResponse(FeatureRequestBase):
    id: int
    user_id: int
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class AIPromptCreate(BaseModel):
    prompt_text: str


class AIPromptResponse(BaseModel):
    id: int
    feature_request_id: int
    prompt_text: str
    response: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
