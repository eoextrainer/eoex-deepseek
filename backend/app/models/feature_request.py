"""Feature Request model"""
from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import relationship
from ..db.session import Base


class FeatureRequest(Base):
    __tablename__ = "feature_requests"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    status = Column(String(50), default="pending")  # pending, approved, rejected, implemented
    priority = Column(String(50), default="medium")  # low, medium, high
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    user = relationship("User", back_populates="feature_requests")
    ai_prompts = relationship("AIPrompt", back_populates="feature_request")


class AIPrompt(Base):
    __tablename__ = "ai_prompts"

    id = Column(Integer, primary_key=True, index=True)
    feature_request_id = Column(Integer, ForeignKey("feature_requests.id"), nullable=False)
    prompt_text = Column(Text, nullable=False)
    response = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    
    feature_request = relationship("FeatureRequest", back_populates="ai_prompts")
