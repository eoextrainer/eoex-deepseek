from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class PlatformServiceBase(BaseModel):
    name: str
    description: Optional[str] = None
    category: str
    status: Optional[str] = "active"
    tier_access: Optional[str] = "all"
    endpoint_url: Optional[str] = None
    requires_approval: Optional[bool] = False


class PlatformServiceCreate(PlatformServiceBase):
    pass


class PlatformServiceUpdate(BaseModel):
    description: Optional[str] = None
    category: Optional[str] = None
    status: Optional[str] = None
    tier_access: Optional[str] = None
    endpoint_url: Optional[str] = None
    requires_approval: Optional[bool] = None


class PlatformServiceResponse(PlatformServiceBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ExternalIntegrationBase(BaseModel):
    name: str
    base_url: str
    auth_type: Optional[str] = "api_key"
    status: Optional[str] = "active"


class ExternalIntegrationCreate(ExternalIntegrationBase):
    pass


class ExternalIntegrationUpdate(BaseModel):
    base_url: Optional[str] = None
    auth_type: Optional[str] = None
    status: Optional[str] = None


class ExternalIntegrationResponse(ExternalIntegrationBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ServiceExchangeBase(BaseModel):
    direction: str
    status: Optional[str] = "queued"
    payload_preview: Optional[str] = None


class ServiceExchangeCreate(ServiceExchangeBase):
    pass


class ServiceExchangeResponse(ServiceExchangeBase):
    id: int
    integration_id: int
    created_at: datetime

    class Config:
        from_attributes = True
