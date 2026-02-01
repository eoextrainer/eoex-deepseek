from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text, Float, func
from sqlalchemy.orm import relationship
from ..db.session import Base


class MarketingCampaign(Base):
    __tablename__ = "marketing_campaigns"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    objective = Column(Text, nullable=True)
    status = Column(String(50), default="draft")  # draft, planned, active, paused, completed
    channel = Column(String(100), nullable=False)
    budget = Column(Float, default=0)
    spend = Column(Float, default=0)
    impressions = Column(Integer, default=0)
    clicks = Column(Integer, default=0)
    conversions = Column(Integer, default=0)
    start_date = Column(DateTime, nullable=True)
    end_date = Column(DateTime, nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    creator = relationship("User")
