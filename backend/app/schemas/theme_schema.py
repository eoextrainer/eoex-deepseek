"""Theme and preference schemas"""
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ThemeBase(BaseModel):
    name: str
    primary_color: str
    secondary_color: str
    accent_color: str
    background_color: str
    text_color: str
    description: Optional[str] = None


class ThemeCreate(ThemeBase):
    is_default: Optional[bool] = False


class ThemeResponse(ThemeBase):
    id: int
    is_default: bool
    created_at: datetime

    class Config:
        from_attributes = True


class UserPreferenceBase(BaseModel):
    theme_id: int
    language: Optional[str] = "en"
    notifications_enabled: Optional[bool] = True


class UserPreferenceCreate(UserPreferenceBase):
    pass


class UserPreferenceUpdate(BaseModel):
    theme_id: Optional[int] = None
    language: Optional[str] = None
    notifications_enabled: Optional[bool] = None


class UserPreferenceResponse(UserPreferenceBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
