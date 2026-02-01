from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class MarketingCampaignBase(BaseModel):
    name: str
    objective: Optional[str] = None
    status: Optional[str] = "draft"
    channel: str
    budget: Optional[float] = 0
    spend: Optional[float] = 0
    impressions: Optional[int] = 0
    clicks: Optional[int] = 0
    conversions: Optional[int] = 0
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None


class MarketingCampaignCreate(MarketingCampaignBase):
    pass


class MarketingCampaignUpdate(BaseModel):
    objective: Optional[str] = None
    status: Optional[str] = None
    channel: Optional[str] = None
    budget: Optional[float] = None
    spend: Optional[float] = None
    impressions: Optional[int] = None
    clicks: Optional[int] = None
    conversions: Optional[int] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None


class MarketingCampaignResponse(MarketingCampaignBase):
    id: int
    created_by: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
