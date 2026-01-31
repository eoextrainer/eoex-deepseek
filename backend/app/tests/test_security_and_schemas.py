"""Simple unit tests without database dependencies"""

import pytest
from app.core.security import verify_password, get_password_hash, create_access_token
from pydantic import ValidationError
from app.schemas.user_schema import UserCreate, UserLogin


def test_password_hashing():
    """Test password hashing"""
    password = "test_password_123"  # Must be under 72 bytes
    hashed = get_password_hash(password)
    assert hashed != password
    assert verify_password(password, hashed)
    assert not verify_password("wrong_password", hashed)


def test_access_token_creation():
    """Test JWT token creation"""
    token = create_access_token(subject="1", role="admin")
    assert token is not None
    assert isinstance(token, str)
    assert "." in token  # JWT has 3 parts separated by dots


def test_user_create_schema():
    """Test user creation schema validation"""
    valid_user = UserCreate(
        email="test@example.com",
        full_name="Test User",
        password="password123",
        role_id=3
    )
    assert valid_user.email == "test@example.com"
    assert valid_user.full_name == "Test User"


def test_user_login_schema():
    """Test user login schema validation"""
    login = UserLogin(
        email="user@example.com",
        password="password123"
    )
    assert login.email == "user@example.com"
    assert login.password == "password123"


def test_invalid_email():
    """Test invalid email validation"""
    with pytest.raises(ValidationError):
        UserCreate(
            email="invalid_email",
            full_name="Test User",
            password="password123",
            role_id=3
        )


def test_invalid_login_email():
    """Test invalid email in login"""
    with pytest.raises(ValidationError):
        UserLogin(
            email="not_an_email",
            password="password123"
        )
