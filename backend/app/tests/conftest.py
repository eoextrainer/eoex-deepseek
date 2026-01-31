"""Test configuration and fixtures"""

import pytest
from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from fastapi.testclient import TestClient
from app.db.session import Base, get_db

# Use in-memory SQLite for testing with proper configuration
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

# Enable foreign keys for SQLite
@event.listens_for(engine, "connect")
def set_sqlite_pragma(dbapi_conn, connection_record):
    cursor = dbapi_conn.cursor()
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create all tables
Base.metadata.create_all(bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


# Patch the imports before importing app
import sys
from app import main
from unittest.mock import patch

# Replace the session in the app
main.app.dependency_overrides[get_db] = override_get_db

# Also override the engine in db/session.py
from app.db import session as db_session
db_session.engine = engine
db_session.SessionLocal = TestingSessionLocal

client = TestClient(main.app)


@pytest.fixture(scope="function")
def db():
    """Create a fresh test database session"""
    return TestingSessionLocal()


@pytest.fixture
def test_client():
    return client
