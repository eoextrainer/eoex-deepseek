"""
Database seeding script - Create roles and demo users.
"""
import os
import sys
from datetime import datetime

# Add parent directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from app.db.session import Base, engine, SessionLocal
from app.models.user import User, Role
from app.core.security import get_password_hash

def seed_roles():
    """Create roles in database."""
    db = SessionLocal()
    
    roles_data = [
        {"name": "system_admin"},
        {"name": "community_admin"},
        {"name": "community_moderator"},
        {"name": "user"},
        {"name": "guest"}
    ]
    
    for role_data in roles_data:
        existing = db.query(Role).filter(Role.name == role_data["name"]).first()
        if not existing:
            role = Role(**role_data)
            db.add(role)
    
    db.commit()
    db.close()
    print("✓ Roles seeded successfully")


def seed_demo_users():
    """Create demo users in database."""
    db = SessionLocal()
    
    # First ensure roles exist
    seed_roles()
    
    demo_users = [
        {
            "email": "sys-admin@eoex.com",
            "full_name": "System Admin",
            "password": "password123",
            "role": "system_admin"
        },
        {
            "email": "admin@eoex.com",
            "full_name": "Community Admin",
            "password": "password123",
            "role": "community_admin"
        },
        {
            "email": "moderator@eoex.com",
            "full_name": "Community Moderator",
            "password": "password123",
            "role": "community_moderator"
        },
        {
            "email": "user1@eoex.com",
            "full_name": "User One",
            "password": "password123",
            "role": "user"
        },
        {
            "email": "user2@eoex.com",
            "full_name": "User Two",
            "password": "password123",
            "role": "user"
        },
        {
            "email": "user3@eoex.com",
            "full_name": "User Three",
            "password": "password123",
            "role": "user"
        },
        {
            "email": "user4@eoex.com",
            "full_name": "User Four",
            "password": "password123",
            "role": "user"
        },
        {
            "email": "user5@eoex.com",
            "full_name": "User Five",
            "password": "password123",
            "role": "user"
        },
        {
            "email": "guest@eoex.com",
            "full_name": "Guest User",
            "password": "password123",
            "role": "guest"
        }
    ]
    
    for user_data in demo_users:
        existing = db.query(User).filter(User.email == user_data["email"]).first()
        if not existing:
            role = db.query(Role).filter(Role.name == user_data["role"]).first()
            if not role:
                continue

            user = User(
                email=user_data["email"],
                full_name=user_data["full_name"],
                hashed_password=get_password_hash(user_data["password"]),
                is_active=True,
                role_id=role.id,
                created_at=datetime.utcnow()
            )
            db.add(user)
    
    db.commit()
    db.close()
    print("✓ Demo users seeded successfully")


def main():
    """Run all seeding operations."""
    print("Initializing database...")
    
    # Create all tables
    Base.metadata.create_all(bind=engine)
    print("✓ Database tables created")
    
    # Seed data
    seed_roles()
    seed_demo_users()
    
    print("\n✓ Database seeding complete!")


if __name__ == "__main__":
    main()
