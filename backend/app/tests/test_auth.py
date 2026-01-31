"""Authentication API tests"""

import pytest
from app.db.session import get_db
from app.tests.conftest import client, TestingSessionLocal, override_get_db
from app.models.user import User, Role
from app.core.security import get_password_hash


def test_register_user(db):
    """Test user registration"""
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "test@example.com",
            "full_name": "Test User",
            "password": "testpassword123",
            "role_id": 3
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "test@example.com"
    assert data["full_name"] == "Test User"


def test_register_duplicate_email(db):
    """Test registration with duplicate email"""
    # First registration
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "duplicate@example.com",
            "full_name": "User One",
            "password": "password123",
            "role_id": 3
        }
    )
    
    # Attempt duplicate registration
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "duplicate@example.com",
            "full_name": "User Two",
            "password": "password456",
            "role_id": 3
        }
    )
    assert response.status_code == 400


def test_login_success(db):
    """Test successful user login"""
    # Register user first
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "login@example.com",
            "full_name": "Login User",
            "password": "password123",
            "role_id": 3
        }
    )
    
    # Login
    response = client.post(
        "/api/v1/auth/login",
        json={
            "email": "login@example.com",
            "password": "password123"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_invalid_credentials(db):
    """Test login with invalid credentials"""
    response = client.post(
        "/api/v1/auth/login",
        json={
            "email": "nonexistent@example.com",
            "password": "wrongpassword"
        }
    )
    assert response.status_code == 401
