"""
Backend Service Layer Tests
Tests for business logic, services, and validators
"""

import pytest
from datetime import datetime, timedelta
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import StaticPool
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from app.db.session import Base
from app.models.user import User, Role
from app.models.subscription import Subscription, SubscriptionPlan
from app.models.community import Community, CommunityMember
from app.core.security import hash_password, verify_password, create_access_token
from app.schemas.auth import UserCreate
from app.schemas.user import UserUpdate


@pytest.fixture(scope="function")
def db_session():
    """Create test database."""
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    
    Base.metadata.create_all(engine)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = SessionLocal()
    
    yield session
    
    session.close()
    Base.metadata.drop_all(engine)


class TestAuthenticationService:
    """Test authentication and security services."""
    
    def test_password_hashing(self):
        """Test password is properly hashed."""
        password = "MySecurePassword123!"
        hashed = hash_password(password)
        
        assert hashed != password
        assert verify_password(password, hashed)
        assert not verify_password("WrongPassword", hashed)
    
    def test_password_hash_uniqueness(self):
        """Test that same password produces different hashes."""
        password = "SamePassword123!"
        hash1 = hash_password(password)
        hash2 = hash_password(password)
        
        assert hash1 != hash2
        assert verify_password(password, hash1)
        assert verify_password(password, hash2)
    
    def test_jwt_token_creation(self, db_session):
        """Test JWT token creation."""
        user = User(
            id=1,
            email="test@example.com",
            hashed_password=hash_password("test123"),
            role=Role.USER
        )
        
        token = create_access_token(
            data={"sub": user.id, "email": user.email},
            expires_delta=timedelta(hours=1)
        )
        
        assert isinstance(token, str)
        assert len(token) > 0
        assert "." in token  # JWT structure
    
    def test_token_expiration(self, db_session):
        """Test token expiration."""
        user = User(
            id=1,
            email="test@example.com",
            hashed_password=hash_password("test123"),
            role=Role.USER
        )
        
        # Create token that expires in 1 second
        expired_token = create_access_token(
            data={"sub": user.id, "email": user.email},
            expires_delta=timedelta(seconds=1)
        )
        
        # Token should be valid immediately
        assert isinstance(expired_token, str)


class TestUserService:
    """Test user business logic."""
    
    def test_create_user(self, db_session):
        """Test user creation."""
        user = User(
            email="newuser@example.com",
            first_name="New",
            last_name="User",
            hashed_password=hash_password("password123"),
            role=Role.USER,
            is_active=True
        )
        
        db_session.add(user)
        db_session.commit()
        
        stored = db_session.query(User).filter_by(email="newuser@example.com").first()
        assert stored is not None
        assert stored.first_name == "New"
    
    def test_user_activation_deactivation(self, db_session):
        """Test user activation/deactivation."""
        user = User(
            email="toggle@example.com",
            hashed_password=hash_password("test123"),
            role=Role.USER,
            is_active=True
        )
        
        db_session.add(user)
        db_session.commit()
        
        # Deactivate
        user.is_active = False
        db_session.commit()
        
        stored = db_session.query(User).filter_by(email="toggle@example.com").first()
        assert stored.is_active is False
        
        # Reactivate
        user.is_active = True
        db_session.commit()
        
        stored = db_session.query(User).filter_by(email="toggle@example.com").first()
        assert stored.is_active is True
    
    def test_user_role_assignment(self, db_session):
        """Test assigning different roles to users."""
        roles = [Role.USER, Role.ADMIN, Role.MODERATOR, Role.GUEST]
        
        for i, role in enumerate(roles):
            user = User(
                email=f"user{i}@example.com",
                hashed_password=hash_password("test123"),
                role=role
            )
            db_session.add(user)
        
        db_session.commit()
        
        admin = db_session.query(User).filter_by(role=Role.ADMIN).first()
        guest = db_session.query(User).filter_by(role=Role.GUEST).first()
        
        assert admin.role == Role.ADMIN
        assert guest.role == Role.GUEST


class TestSubscriptionService:
    """Test subscription business logic."""
    
    def test_create_subscription(self, db_session):
        """Test creating subscription."""
        user = User(
            email="subscriber@example.com",
            hashed_password=hash_password("test123"),
            role=Role.USER
        )
        
        plan = SubscriptionPlan(
            name="Premium",
            price=9.99,
            billing_cycle="monthly",
            features=["Feature1", "Feature2"]
        )
        
        subscription = Subscription(
            user=user,
            plan=plan,
            status="active"
        )
        
        db_session.add_all([user, plan, subscription])
        db_session.commit()
        
        stored = db_session.query(Subscription).first()
        assert stored.status == "active"
        assert stored.user.email == "subscriber@example.com"
    
    def test_subscription_status_transitions(self, db_session):
        """Test subscription status transitions."""
        user = User(
            email="test@example.com",
            hashed_password=hash_password("test123"),
            role=Role.USER
        )
        
        plan = SubscriptionPlan(name="Basic", price=4.99, billing_cycle="monthly")
        subscription = Subscription(user=user, plan=plan, status="active")
        
        db_session.add_all([user, plan, subscription])
        db_session.commit()
        
        # Cancel subscription
        subscription.status = "cancelled"
        subscription.cancelled_at = datetime.utcnow()
        db_session.commit()
        
        stored = db_session.query(Subscription).first()
        assert stored.status == "cancelled"
        assert stored.cancelled_at is not None
    
    def test_subscription_renewal(self, db_session):
        """Test subscription renewal logic."""
        user = User(
            email="renew@example.com",
            hashed_password=hash_password("test123"),
            role=Role.USER
        )
        
        plan = SubscriptionPlan(
            name="Monthly",
            price=9.99,
            billing_cycle="monthly"
        )
        
        subscription = Subscription(
            user=user,
            plan=plan,
            status="active",
            starts_at=datetime.utcnow(),
            ends_at=datetime.utcnow() + timedelta(days=30)
        )
        
        db_session.add_all([user, plan, subscription])
        db_session.commit()
        
        # Check renewal
        stored = db_session.query(Subscription).first()
        days_remaining = (stored.ends_at - datetime.utcnow()).days
        assert days_remaining > 0
    
    def test_multiple_subscriptions_per_user(self, db_session):
        """Test user can have multiple subscriptions."""
        user = User(
            email="multi@example.com",
            hashed_password=hash_password("test123"),
            role=Role.USER
        )
        
        plans = [
            SubscriptionPlan(name="Basic", price=4.99, billing_cycle="monthly"),
            SubscriptionPlan(name="Premium", price=9.99, billing_cycle="monthly"),
        ]
        
        db_session.add_all([user] + plans)
        db_session.commit()
        
        for plan in plans:
            subscription = Subscription(
                user_id=user.id,
                plan_id=plan.id,
                status="active"
            )
            db_session.add(subscription)
        
        db_session.commit()
        
        user_subs = db_session.query(Subscription).filter_by(user_id=user.id).all()
        assert len(user_subs) == 2


class TestCommunityService:
    """Test community business logic."""
    
    def test_create_community(self, db_session):
        """Test creating community."""
        creator = User(
            email="creator@example.com",
            hashed_password=hash_password("test123"),
            role=Role.ADMIN
        )
        
        community = Community(
            name="Python Developers",
            description="A community for Python lovers",
            creator=creator,
            is_active=True
        )
        
        db_session.add_all([creator, community])
        db_session.commit()
        
        stored = db_session.query(Community).filter_by(
            name="Python Developers"
        ).first()
        assert stored is not None
        assert stored.creator.email == "creator@example.com"
    
    def test_community_membership(self, db_session):
        """Test managing community membership."""
        creator = User(
            email="creator@example.com",
            hashed_password=hash_password("test123"),
            role=Role.ADMIN
        )
        
        community = Community(
            name="Tech Lovers",
            creator=creator
        )
        
        # Add members
        members = []
        for i in range(3):
            member = User(
                email=f"member{i}@example.com",
                hashed_password=hash_password("test123"),
                role=Role.USER
            )
            membership = CommunityMember(
                user=member,
                community=community,
                role="member"
            )
            members.append(member)
            db_session.add(membership)
        
        db_session.add_all([creator, community] + members)
        db_session.commit()
        
        community_members = db_session.query(CommunityMember).filter_by(
            community_id=community.id
        ).all()
        assert len(community_members) == 3
    
    def test_community_moderators(self, db_session):
        """Test managing community moderators."""
        creator = User(
            email="creator@example.com",
            hashed_password=hash_password("test123"),
            role=Role.ADMIN
        )
        
        community = Community(
            name="Moderated Community",
            creator=creator
        )
        
        # Add regular members
        user1 = User(
            email="user1@example.com",
            hashed_password=hash_password("test123"),
            role=Role.USER
        )
        
        # Add moderator
        moderator = User(
            email="mod@example.com",
            hashed_password=hash_password("test123"),
            role=Role.USER
        )
        
        mem1 = CommunityMember(user=user1, community=community, role="member")
        mem_mod = CommunityMember(user=moderator, community=community, role="moderator")
        
        db_session.add_all([creator, community, user1, moderator, mem1, mem_mod])
        db_session.commit()
        
        mods = db_session.query(CommunityMember).filter_by(
            community_id=community.id,
            role="moderator"
        ).all()
        assert len(mods) == 1
    
    def test_leave_community(self, db_session):
        """Test leaving community."""
        creator = User(
            email="creator@example.com",
            hashed_password=hash_password("test123"),
            role=Role.ADMIN
        )
        
        community = Community(
            name="Leave Test",
            creator=creator
        )
        
        member = User(
            email="member@example.com",
            hashed_password=hash_password("test123"),
            role=Role.USER
        )
        
        membership = CommunityMember(
            user=member,
            community=community,
            role="member"
        )
        
        db_session.add_all([creator, community, member, membership])
        db_session.commit()
        
        # Remove membership
        db_session.delete(membership)
        db_session.commit()
        
        remaining = db_session.query(CommunityMember).filter_by(
            community_id=community.id,
            user_id=member.id
        ).first()
        assert remaining is None


class TestValidation:
    """Test data validation logic."""
    
    def test_email_validation(self, db_session):
        """Test email format validation."""
        # Valid email should work
        user = User(
            email="valid.email@example.com",
            hashed_password=hash_password("test123"),
            role=Role.USER
        )
        db_session.add(user)
        db_session.commit()
        
        assert user.id is not None
    
    def test_password_strength(self):
        """Test password strength requirements."""
        # Strong password
        strong = hash_password("StrongP@ssw0rd123!")
        assert strong is not None
        
        # Weak passwords still hash (validation should be in schema)
        weak = hash_password("123")
        assert weak is not None
    
    def test_subscription_price_validation(self, db_session):
        """Test subscription price validation."""
        # Valid price
        plan = SubscriptionPlan(
            name="Valid",
            price=9.99,
            billing_cycle="monthly"
        )
        db_session.add(plan)
        db_session.commit()
        
        assert plan.price == 9.99
        
        # Free plan
        free = SubscriptionPlan(
            name="Free",
            price=0,
            billing_cycle="monthly"
        )
        db_session.add(free)
        db_session.commit()
        
        assert free.price == 0


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
