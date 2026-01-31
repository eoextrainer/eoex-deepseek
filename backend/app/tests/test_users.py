"""User API tests"""

import pytest
from app.tests.conftest import client


def test_get_user(db):
    """Test getting a user"""
    # Register a user first
    register_response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "getuser@example.com",
            "full_name": "Get User Test",
            "password": "password123",
            "role_id": 3
        }
    )
    user_id = register_response.json()["id"]
    
    # Get user
    response = client.get(f"/api/v1/users/{user_id}")
    assert response.status_code == 200
    assert response.json()["email"] == "getuser@example.com"


def test_get_nonexistent_user(db):
    """Test getting a non-existent user"""
    response = client.get("/api/v1/users/9999")
    assert response.status_code == 404


def test_list_users(db):
    """Test listing users"""
    response = client.get("/api/v1/users")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_update_user(db):
    """Test updating user information"""
    # Register a user
    register_response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "updateuser@example.com",
            "full_name": "Update User",
            "password": "password123",
            "role_id": 3
        }
    )
    user_id = register_response.json()["id"]
    
    # Update user
    response = client.put(
        f"/api/v1/users/{user_id}",
        json={"full_name": "Updated Name"}
    )
    assert response.status_code == 200
    assert response.json()["full_name"] == "Updated Name"


def test_delete_user(db):
    """Test deactivating a user"""
    # Register a user
    register_response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "deleteuser@example.com",
            "full_name": "Delete User",
            "password": "password123",
            "role_id": 3
        }
    )
    user_id = register_response.json()["id"]
    
    # Delete (deactivate) user
    response = client.delete(f"/api/v1/users/{user_id}")
    assert response.status_code == 200
    assert "deactivated" in response.json()["message"]
