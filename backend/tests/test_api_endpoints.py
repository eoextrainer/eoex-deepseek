"""
Comprehensive API Endpoint Tests
Tests for all API endpoints including auth, users, subscriptions, and communities
"""

import pytest
import json
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import StaticPool
import sys
from pathlib import Path
from datetime import datetime, timedelta

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.main import app
from app.db.session import Base, get_db
from app.models.user import User, Role
from app.models.subscription import SubscriptionPlan, Subscription
from app.core.security import hash_password, create_access_token
from app.schemas.auth import UserCreate


@pytest.fixture(scope="function")
def test_db():
    """Create test database."""
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    
    Base.metadata.create_all(engine)
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    
    def override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()
    
    app.dependency_overrides[get_db] = override_get_db
    yield TestingSessionLocal()
    Base.metadata.drop_all(engine)


@pytest.fixture
def client(test_db):
    """Create test client."""
    return TestClient(app)


@pytest.fixture
def test_user(test_db):
    """Create test user."""
    user = User(
        email="testuser@example.com",
        first_name="Test",
        last_name="User",
        hashed_password=hash_password("testpass123"),
        role=Role.USER,
        is_active=True
    )
    test_db.add(user)
    test_db.commit()
    test_db.refresh(user)
    return user


@pytest.fixture
def test_admin(test_db):
    """Create test admin user."""
    admin = User(
        email="admin@example.com",
        first_name="Admin",
        last_name="User",
        hashed_password=hash_password("adminpass123"),
        role=Role.ADMIN,
        is_active=True
    )
    test_db.add(admin)
    test_db.commit()
    test_db.refresh(admin)
    return admin


@pytest.fixture
def auth_headers(test_user):
    """Create authorization headers."""
    access_token = create_access_token(
        data={"sub": test_user.id, "email": test_user.email},
        expires_delta=timedelta(hours=1)
    )
    return {"Authorization": f"Bearer {access_token}"}


class TestAuthEndpoints:
    """Test authentication endpoints."""
    
    def test_register_user(self, client):
        """Test user registration."""
        response = client.post(
            "/api/v1/auth/register",
            json={
                "email": "newuser@example.com",
                "password": "SecurePass123!",
                "first_name": "New",
                "last_name": "User"
            }
        )
        
        assert response.status_code == 201
        data = response.json()
        assert data["email"] == "newuser@example.com"
        assert data["first_name"] == "New"
        assert "id" in data
    
    def test_register_duplicate_email(self, client, test_user):
        """Test that duplicate email registration fails."""
        response = client.post(
            "/api/v1/auth/register",
            json={
                "email": test_user.email,
                "password": "SecurePass123!",
                "first_name": "Duplicate",
                "last_name": "User"
            }
        )
        
        assert response.status_code == 400
    
    def test_login_success(self, client, test_user):
        """Test successful login."""
        response = client.post(
            "/api/v1/auth/login",
            json={
                "email": test_user.email,
                "password": "testpass123"
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
    
    def test_login_invalid_password(self, client, test_user):
        """Test login with invalid password."""
        response = client.post(
            "/api/v1/auth/login",
            json={
                "email": test_user.email,
                "password": "wrongpassword"
            }
        )
        
        assert response.status_code == 401
    
    def test_login_nonexistent_user(self, client):
        """Test login with non-existent user."""
        response = client.post(
            "/api/v1/auth/login",
            json={
                "email": "nonexistent@example.com",
                "password": "anypassword"
            }
        )
        
        assert response.status_code == 401
    
    def test_get_current_user(self, client, test_user, auth_headers):
        """Test getting current user info."""
        response = client.get(
            "/api/v1/users/me",
            headers=auth_headers
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == test_user.email
        assert data["id"] == test_user.id


class TestUserEndpoints:
    """Test user management endpoints."""
    
    def test_get_users_list(self, client, test_user, test_admin, auth_headers):
        """Test getting users list."""
        response = client.get(
            "/api/v1/users",
            headers=auth_headers
        )
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 2
    
    def test_get_user_by_id(self, client, test_user, auth_headers):
        """Test getting user by ID."""
        response = client.get(
            f"/api/v1/users/{test_user.id}",
            headers=auth_headers
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == test_user.id
        assert data["email"] == test_user.email
    
    def test_get_nonexistent_user(self, client, auth_headers):
        """Test getting non-existent user."""
        response = client.get(
            "/api/v1/users/99999",
            headers=auth_headers
        )
        
        assert response.status_code == 404
    
    def test_update_user_profile(self, client, test_user, auth_headers):
        """Test updating user profile."""
        response = client.put(
            f"/api/v1/users/{test_user.id}",
            headers=auth_headers,
            json={
                "first_name": "Updated",
                "last_name": "Name"
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["first_name"] == "Updated"
        assert data["last_name"] == "Name"
    
    def test_delete_user(self, client, test_user, auth_headers):
        """Test deleting user."""
        response = client.delete(
            f"/api/v1/users/{test_user.id}",
            headers=auth_headers
        )
        
        assert response.status_code == 204
        
        # Verify user is deleted
        response = client.get(
            f"/api/v1/users/{test_user.id}",
            headers=auth_headers
        )
        assert response.status_code == 404
    
    def test_unauthorized_access(self, client, test_user):
        """Test that unauthorized requests are rejected."""
        response = client.get(
            "/api/v1/users/me"
        )
        
        assert response.status_code == 401


class TestSubscriptionEndpoints:
    """Test subscription endpoints."""
    
    def test_get_subscription_plans(self, client, test_db, auth_headers):
        """Test getting subscription plans."""
        # Add test plans
        plans = [
            SubscriptionPlan(name="Basic", price=4.99, billing_cycle="monthly"),
            SubscriptionPlan(name="Premium", price=9.99, billing_cycle="monthly"),
        ]
        test_db.add_all(plans)
        test_db.commit()
        
        response = client.get(
            "/api/v1/subscriptions/plans",
            headers=auth_headers
        )
        
        assert response.status_code == 200
        data = response.json()
        assert len(data) >= 2
    
    def test_get_user_subscriptions(self, client, test_user, test_db, auth_headers):
        """Test getting user subscriptions."""
        plan = SubscriptionPlan(name="Premium", price=9.99, billing_cycle="monthly")
        test_db.add(plan)
        test_db.commit()
        
        subscription = Subscription(
            user_id=test_user.id,
            plan_id=plan.id,
            status="active"
        )
        test_db.add(subscription)
        test_db.commit()
        
        response = client.get(
            "/api/v1/subscriptions",
            headers=auth_headers
        )
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
    
    def test_create_subscription(self, client, test_user, test_db, auth_headers):
        """Test creating subscription."""
        plan = SubscriptionPlan(name="Basic", price=4.99, billing_cycle="monthly")
        test_db.add(plan)
        test_db.commit()
        
        response = client.post(
            "/api/v1/subscriptions",
            headers=auth_headers,
            json={
                "plan_id": plan.id
            }
        )
        
        assert response.status_code == 201
        data = response.json()
        assert data["status"] == "active"
    
    def test_cancel_subscription(self, client, test_user, test_db, auth_headers):
        """Test canceling subscription."""
        plan = SubscriptionPlan(name="Premium", price=9.99, billing_cycle="monthly")
        test_db.add(plan)
        test_db.commit()
        
        subscription = Subscription(
            user_id=test_user.id,
            plan_id=plan.id,
            status="active"
        )
        test_db.add(subscription)
        test_db.commit()
        
        response = client.delete(
            f"/api/v1/subscriptions/{subscription.id}",
            headers=auth_headers
        )
        
        assert response.status_code in [200, 204]


class TestCommunityEndpoints:
    """Test community endpoints."""
    
    def test_get_communities(self, client, auth_headers):
        """Test getting communities list."""
        response = client.get(
            "/api/v1/communities",
            headers=auth_headers
        )
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
    
    def test_create_community(self, client, auth_headers):
        """Test creating community."""
        response = client.post(
            "/api/v1/communities",
            headers=auth_headers,
            json={
                "name": "Test Community",
                "description": "A test community"
            }
        )
        
        assert response.status_code == 201
        data = response.json()
        assert data["name"] == "Test Community"
        assert "id" in data
    
    def test_get_community_by_id(self, client, test_user, test_db, auth_headers):
        """Test getting community by ID."""
        from app.models.community import Community
        
        community = Community(
            name="Test Community",
            description="Test",
            creator_id=test_user.id
        )
        test_db.add(community)
        test_db.commit()
        
        response = client.get(
            f"/api/v1/communities/{community.id}",
            headers=auth_headers
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "Test Community"


class TestAPIErrorHandling:
    """Test API error handling."""
    
    def test_invalid_json(self, client, auth_headers):
        """Test handling invalid JSON."""
        response = client.post(
            "/api/v1/auth/register",
            headers=auth_headers,
            data="invalid json{",
            headers={"Content-Type": "application/json"}
        )
        
        assert response.status_code == 422
    
    def test_missing_required_fields(self, client):
        """Test handling missing required fields."""
        response = client.post(
            "/api/v1/auth/register",
            json={
                "email": "test@example.com"
                # Missing password and other fields
            }
        )
        
        assert response.status_code == 422
    
    def test_invalid_email_format(self, client):
        """Test validation of email format."""
        response = client.post(
            "/api/v1/auth/register",
            json={
                "email": "invalid-email",
                "password": "SecurePass123!",
                "first_name": "Test",
                "last_name": "User"
            }
        )
        
        assert response.status_code == 422
    
    def test_rate_limiting(self, client):
        """Test rate limiting on endpoints."""
        # Make multiple rapid requests
        for i in range(10):
            response = client.get("/api/v1/health")
        
        # Should not all be 429 but system should handle it gracefully
        assert response.status_code in [200, 429]


class TestAPIResponseFormat:
    """Test API response format consistency."""
    
    def test_success_response_format(self, client, test_user, auth_headers):
        """Test that success responses follow expected format."""
        response = client.get(
            f"/api/v1/users/{test_user.id}",
            headers=auth_headers
        )
        
        assert response.status_code == 200
        data = response.json()
        
        # Check response structure
        assert isinstance(data, dict)
        assert "id" in data
        assert "email" in data
    
    def test_error_response_format(self, client):
        """Test that error responses follow expected format."""
        response = client.get(
            "/api/v1/users/99999",
            # No auth headers - should fail
        )
        
        assert response.status_code == 401
        data = response.json()
        
        # Error should have detail field
        assert "detail" in data or "error" in data


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
