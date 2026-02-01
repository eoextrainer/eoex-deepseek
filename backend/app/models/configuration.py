from sqlalchemy import Boolean, Column, DateTime, Integer, String, Text, func, JSON
from ..db.session import Base


class ThemeConfig(Base):
    __tablename__ = "theme_configs"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    description = Column(String(500), nullable=True)
    colors = Column(JSON, nullable=False)  # Store theme colors as JSON
    is_default = Column(Boolean, default=False)
    is_custom = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())


class LanguageConfig(Base):
    __tablename__ = "language_configs"

    id = Column(Integer, primary_key=True, index=True)
    language_code = Column(String(10), unique=True, nullable=False)  # e.g., 'en', 'de', 'fr'
    language_name = Column(String(100), nullable=False)
    translations = Column(JSON, nullable=False)  # Store translations as JSON
    is_rtl = Column(Boolean, default=False)  # Right-to-left support
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
