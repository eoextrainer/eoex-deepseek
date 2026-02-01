"""Role-based feature endpoints tests"""
from fastapi.testclient import TestClient
from app.tests.conftest import client
from app.models.user import User, Role
from app.models.theme import UserImpersonation
from app.core.security import get_password_hash, create_access_token


def _create_role(db, name: str) -> Role:
    role = db.query(Role).filter(Role.name == name).first()
    if not role:
        role = Role(name=name)
        db.add(role)
        db.commit()
        db.refresh(role)
    return role


def _create_user(db, email: str, role_name: str) -> User:
    role = _create_role(db, role_name)
    user = db.query(User).filter(User.email == email).first()
    if not user:
        user = User(
            email=email,
            full_name=email.split("@")[0],
            hashed_password=get_password_hash("password123"),
            role_id=role.id,
            is_active=True,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    return user


def _auth_headers(user: User) -> dict:
    token = create_access_token(subject=str(user.id), role=user.role.name)
    return {"Authorization": f"Bearer {token}"}


def test_campaign_access(db):
    community_admin = _create_user(db, "community.admin@test.com", "community_admin")
    regular_user = _create_user(db, "user@test.com", "user")

    response = client.post(
        "/api/v1/campaigns",
        json={
            "name": "Campagne Test",
            "objective": "Test",
            "channel": "social",
        },
        headers=_auth_headers(community_admin),
    )
    assert response.status_code == 200

    forbidden = client.post(
        "/api/v1/campaigns",
        json={
            "name": "Campagne Refusée",
            "objective": "Test",
            "channel": "email",
        },
        headers=_auth_headers(regular_user),
    )
    assert forbidden.status_code == 403


def test_service_access(db):
    system_admin = _create_user(db, "admin@test.com", "system_admin")
    moderator = _create_user(db, "moderator@test.com", "moderator")

    response = client.post(
        "/api/v1/services",
        json={
            "name": "User Engine",
            "description": "Manage users",
            "category": "core",
        },
        headers=_auth_headers(system_admin),
    )
    assert response.status_code == 200

    forbidden = client.post(
        "/api/v1/services",
        json={
            "name": "Forbidden Service",
            "description": "Nope",
            "category": "core",
        },
        headers=_auth_headers(moderator),
    )
    assert forbidden.status_code == 403


def test_impersonation_rules(db):
    moderator = _create_user(db, "mod@test.com", "moderator")
    target_user = _create_user(db, "target@test.com", "user")
    system_admin = _create_user(db, "super@test.com", "system_admin")

    response = client.post(
        "/api/v1/impersonations/start",
        json={
            "impersonated_user_id": target_user.id,
            "reason": "Support review",
        },
        headers=_auth_headers(moderator),
    )
    assert response.status_code == 200

    blocked = client.post(
        "/api/v1/impersonations/start",
        json={
            "impersonated_user_id": system_admin.id,
            "reason": "Not allowed",
        },
        headers=_auth_headers(moderator),
    )
    assert blocked.status_code == 400
