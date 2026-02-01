"""Theme and user preference models"""
from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import relationship
from ..db.session import Base


class Theme(Base):
    __tablename__ = "themes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    primary_color = Column(String(10), nullable=False)
    secondary_color = Column(String(10), nullable=False)
    accent_color = Column(String(10), nullable=False)
    background_color = Column(String(10), nullable=False)
    text_color = Column(String(10), nullable=False)
    is_default = Column(Boolean, default=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now())


class UserPreference(Base):
    __tablename__ = "user_preferences"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True)
    theme_id = Column(Integer, ForeignKey("themes.id"), nullable=False)
    language = Column(String(10), default="en")
    notifications_enabled = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    user = relationship("User", back_populates="preference")
    theme = relationship("Theme")


class UserImpersonation(Base):
    __tablename__ = "user_impersonations"

    id = Column(Integer, primary_key=True, index=True)
    moderator_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    impersonated_user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    start_time = Column(DateTime, server_default=func.now())
    end_time = Column(DateTime, nullable=True)
    reason = Column(Text, nullable=True)
