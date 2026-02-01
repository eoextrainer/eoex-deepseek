"""Opportunity and Issue models"""
from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import relationship
from ..db.session import Base


class Opportunity(Base):
    __tablename__ = "opportunities"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(100), nullable=False)  # subscription_tier, service_type, etc
    tier = Column(String(50), nullable=False)  # premium, free, all
    status = Column(String(50), default="active")  # active, archived, closed
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    opportunity_filters = relationship("OpportunityFilter", back_populates="opportunity")


class OpportunityFilter(Base):
    __tablename__ = "opportunity_filters"

    id = Column(Integer, primary_key=True, index=True)
    opportunity_id = Column(Integer, ForeignKey("opportunities.id"), nullable=False)
    filter_name = Column(String(100), nullable=False)
    filter_value = Column(String(255), nullable=False)
    
    opportunity = relationship("Opportunity", back_populates="opportunity_filters")


class UserIssue(Base):
    __tablename__ = "user_issues"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    status = Column(String(50), default="open")  # open, in_progress, resolved, closed
    priority = Column(String(50), default="medium")  # low, medium, high
    category = Column(String(100), nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    user = relationship("User", back_populates="issues")
