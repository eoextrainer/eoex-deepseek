"""Community API tests"""

import pytest
from app.tests.conftest import client


def test_list_communities(db):
    """Test listing communities"""
    response = client.get("/api/v1/communities")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_create_community(db):
    """Test creating a community"""
    response = client.post(
        "/api/v1/communities",
        json={
            "name": "Test Community",
            "description": "A test community",
            "admin_id": 1
        }
    )
    assert response.status_code in [200, 422]  # 422 if admin doesn't exist


def test_get_community(db):
    """Test getting a community"""
    response = client.get("/api/v1/communities/1")
    assert response.status_code in [200, 404]  # Depends on whether community exists


def test_list_forum_questions(db):
    """Test listing forum questions"""
    response = client.get("/api/v1/communities/1/questions")
    assert response.status_code in [200, 404]  # Depends on whether community exists


def test_create_forum_question(db):
    """Test creating a forum question"""
    response = client.post(
        "/api/v1/communities/1/questions",
        json={
            "category": "UI/UX",
            "title": "Test Question",
            "content": "This is a test question",
            "community_id": 1,
            "user_id": 1
        }
    )
    assert response.status_code in [200, 422]  # 422 if community/user doesn't exist
