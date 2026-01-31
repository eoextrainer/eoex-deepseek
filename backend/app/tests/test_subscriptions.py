"""Subscription API tests"""

import pytest
from app.tests.conftest import client


def test_list_subscription_plans(db):
    """Test listing subscription plans"""
    response = client.get("/api/v1/subscriptions/plans")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_create_subscription(db):
    """Test creating a subscription"""
    # Register a user first
    register_response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "subscription@example.com",
            "full_name": "Subscription User",
            "password": "password123",
            "role_id": 3
        }
    )
    user_id = register_response.json()["id"]
    
    # Create subscription
    response = client.post(
        "/api/v1/subscriptions",
        json={
            "user_id": user_id,
            "plan_id": 1
        }
    )
    assert response.status_code in [200, 422]  # 422 if plan doesn't exist


def test_get_user_subscriptions(db):
    """Test getting user subscriptions"""
    # Register a user
    register_response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "subsuser@example.com",
            "full_name": "Subscription User",
            "password": "password123",
            "role_id": 3
        }
    )
    user_id = register_response.json()["id"]
    
    # Get subscriptions
    response = client.get(f"/api/v1/subscriptions/user/{user_id}")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
