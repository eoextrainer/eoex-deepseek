from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import relationship
from ..db.session import Base


class PlatformService(Base):
    __tablename__ = "platform_services"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, unique=True)
    description = Column(Text, nullable=True)
    category = Column(String(100), nullable=False)
    status = Column(String(50), default="active")  # active, degraded, offline
    tier_access = Column(String(50), default="all")  # free, premium, all
    endpoint_url = Column(String(255), nullable=True)
    requires_approval = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())


class ExternalIntegration(Base):
    __tablename__ = "external_integrations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, unique=True)
    base_url = Column(String(255), nullable=False)
    auth_type = Column(String(50), default="api_key")  # api_key, oauth, none
    status = Column(String(50), default="active")  # active, paused, disabled
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    exchanges = relationship("ServiceExchange", back_populates="integration")


class ServiceExchange(Base):
    __tablename__ = "service_exchanges"

    id = Column(Integer, primary_key=True, index=True)
    integration_id = Column(Integer, ForeignKey("external_integrations.id"), nullable=False)
    direction = Column(String(50), nullable=False)  # inbound, outbound
    status = Column(String(50), default="queued")  # queued, success, failed
    payload_preview = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    integration = relationship("ExternalIntegration", back_populates="exchanges")
