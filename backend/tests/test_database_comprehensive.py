"""
Comprehensive Database Layer Tests
Tests for database models, relationships, constraints, and seeding
"""

import pytest
from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import StaticPool
from datetime import datetime, timedelta
import sys
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.db.session import Base
from app.models.user import User, Role
from app.models.community import Community, CommunityMember
from app.models.subscription import Subscription, SubscriptionPlan
from app.core.security import hash_password, verify_password


@pytest.fixture(scope="function")
def db_session():
    """Create an in-memory SQLite database for testing."""
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


class TestDatabaseModels:
    """Test database model creation and validation."""
    
    def test_user_model_creation(self, db_session):
        """Test creating a user in the database."""
        user = User(
            email="test@example.com",
            first_name="Test",
            last_name="User",
            hashed_password=hash_password("password123"),
            role=Role.USER,
            is_active=True
        )
        
        db_session.add(user)
        db_session.commit()
        
        stored_user = db_session.query(User).filter_by(email="test@example.com").first()
        assert stored_user is not None
        assert stored_user.first_name == "Test"
        assert stored_user.last_name == "User"
        assert stored_user.role == Role.USER
        assert stored_user.is_active is True
    
    def test_user_password_hashing(self, db_session):
        """Test that passwords are properly hashed."""
        password = "SecurePassword123!"
        user = User(
            email="secure@example.com",
            hashed_password=hash_password(password),
            role=Role.USER
        )
        
        db_session.add(user)
        db_session.commit()
        
        stored_user = db_session.query(User).filter_by(email="secure@example.com").first()
        assert verify_password(password, stored_user.hashed_password)
        assert stored_user.hashed_password != password
    
    def test_subscription_plan_creation(self, db_session):
        """Test creating a subscription plan."""
        plan = SubscriptionPlan(
            name="Premium",
            description="Premium features",
            price=9.99,
            billing_cycle="monthly",
            is_active=True
        )
        
        db_session.add(plan)
        db_session.commit()
        
        stored_plan = db_session.query(SubscriptionPlan).filter_by(name="Premium").first()
        assert stored_plan is not None
        assert stored_plan.price == 9.99
        assert stored_plan.billing_cycle == "monthly"
    
    def test_user_subscription_relationship(self, db_session):
        """Test user-subscription relationship."""
        # Create user
        user = User(
            email="subscriber@example.com",
            hashed_password=hash_password("test123"),
            role=Role.USER
        )
        
        # Create plan
        plan = SubscriptionPlan(
            name="Basic",
            price=4.99,
            billing_cycle="monthly"
        )
        
        # Create subscription
        subscription = Subscription(
            user=user,
            plan=plan,
            status="active"
        )
        
        db_session.add_all([user, plan, subscription])
        db_session.commit()
        
        stored_sub = db_session.query(Subscription).first()
        assert stored_sub.user.email == "subscriber@example.com"
        assert stored_sub.plan.name == "Basic"
    
    def test_community_creation(self, db_session):
        """Test creating a community."""
        user = User(
            email="admin@example.com",
            hashed_password=hash_password("test123"),
            role=Role.ADMIN
        )
        
        community = Community(
            name="Python Developers",
            description="Community for Python developers",
            creator=user,
            is_active=True
        )
        
        db_session.add_all([user, community])
        db_session.commit()
        
        stored_community = db_session.query(Community).filter_by(name="Python Developers").first()
        assert stored_community is not None
        assert stored_community.creator.email == "admin@example.com"
    
    def test_community_membership(self, db_session):
        """Test community membership."""
        admin = User(
            email="admin@example.com",
            hashed_password=hash_password("test123"),
            role=Role.ADMIN
        )
        
        member = User(
            email="member@example.com",
            hashed_password=hash_password("test123"),
            role=Role.USER
        )
        
        community = Community(
            name="Tech Community",
            creator=admin
        )
        
        membership = CommunityMember(
            user=member,
            community=community,
            role="member"
        )
        
        db_session.add_all([admin, member, community, membership])
        db_session.commit()
        
        stored_membership = db_session.query(CommunityMember).first()
        assert stored_membership.user.email == "member@example.com"
        assert stored_membership.community.name == "Tech Community"
        assert stored_membership.role == "member"


class TestDatabaseConstraints:
    """Test database constraints and validations."""
    
    def test_unique_email_constraint(self, db_session):
        """Test that duplicate emails are rejected."""
        user1 = User(
            email="duplicate@example.com",
            hashed_password=hash_password("test123"),
            role=Role.USER
        )
        user2 = User(
            email="duplicate@example.com",
            hashed_password=hash_password("test123"),
            role=Role.USER
        )
        
        db_session.add(user1)
        db_session.commit()
        
        db_session.add(user2)
        with pytest.raises(Exception):  # IntegrityError
            db_session.commit()
    
    def test_required_fields(self, db_session):
        """Test that required fields cannot be null."""
        # Missing email
        user = User(
            hashed_password=hash_password("test123"),
            role=Role.USER
        )
        
        db_session.add(user)
        with pytest.raises(Exception):
            db_session.commit()
    
    def test_foreign_key_constraint(self, db_session):
        """Test foreign key relationships are enforced."""
        # Create subscription without plan
        subscription = Subscription(
            user_id=999,  # Non-existent user
            plan_id=999,  # Non-existent plan
            status="active"
        )
        
        db_session.add(subscription)
        with pytest.raises(Exception):  # IntegrityError
            db_session.commit()


class TestDatabaseQueries:
    """Test common database queries."""
    
    def test_query_all_active_users(self, db_session):
        """Test querying all active users."""
        # Create multiple users
        for i in range(5):
            user = User(
                email=f"user{i}@example.com",
                hashed_password=hash_password("test123"),
                role=Role.USER,
                is_active=(i % 2 == 0)  # Alternate active/inactive
            )
            db_session.add(user)
        
        db_session.commit()
        
        active_users = db_session.query(User).filter_by(is_active=True).all()
        assert len(active_users) == 3
    
    def test_query_user_subscriptions(self, db_session):
        """Test querying user subscriptions."""
        user = User(
            email="subscriber@example.com",
            hashed_password=hash_password("test123"),
            role=Role.USER
        )
        
        plan1 = SubscriptionPlan(name="Basic", price=4.99, billing_cycle="monthly")
        plan2 = SubscriptionPlan(name="Premium", price=9.99, billing_cycle="monthly")
        
        sub1 = Subscription(user=user, plan=plan1, status="active")
        sub2 = Subscription(user=user, plan=plan2, status="inactive")
        
        db_session.add_all([user, plan1, plan2, sub1, sub2])
        db_session.commit()
        
        subscriptions = db_session.query(Subscription).filter_by(user_id=user.id).all()
        assert len(subscriptions) == 2
        
        active_subs = db_session.query(Subscription).filter_by(
            user_id=user.id,
            status="active"
        ).all()
        assert len(active_subs) == 1
    
    def test_query_community_members(self, db_session):
        """Test querying community members."""
        creator = User(
            email="creator@example.com",
            hashed_password=hash_password("test123"),
            role=Role.ADMIN
        )
        
        community = Community(
            name="Test Community",
            creator=creator
        )
        
        # Add members
        members = []
        for i in range(5):
            member = User(
                email=f"member{i}@example.com",
                hashed_password=hash_password("test123"),
                role=Role.USER
            )
            membership = CommunityMember(
                user=member,
                community=community,
                role="member" if i > 0 else "moderator"
            )
            members.append(member)
            db_session.add(membership)
        
        db_session.add_all([creator, community] + members)
        db_session.commit()
        
        all_members = db_session.query(CommunityMember).filter_by(
            community_id=community.id
        ).all()
        assert len(all_members) == 5
        
        moderators = db_session.query(CommunityMember).filter_by(
            community_id=community.id,
            role="moderator"
        ).all()
        assert len(moderators) == 1


class TestDatabaseSeeding:
    """Test database seeding with initial data."""
    
    def test_seed_roles(self, db_session):
        """Test that roles are properly seeded."""
        # Assuming roles are created during initialization
        roles = db_session.query(Role).all()
        
        # Should have standard roles
        role_names = [role.name for role in roles if role]
        assert len(role_names) > 0
    
    def test_seed_subscription_plans(self, db_session):
        """Test that subscription plans are seeded."""
        plans = [
            SubscriptionPlan(name="Free", price=0, billing_cycle="monthly"),
            SubscriptionPlan(name="Basic", price=4.99, billing_cycle="monthly"),
            SubscriptionPlan(name="Premium", price=9.99, billing_cycle="monthly"),
        ]
        
        db_session.add_all(plans)
        db_session.commit()
        
        stored_plans = db_session.query(SubscriptionPlan).all()
        assert len(stored_plans) == 3
    
    def test_seed_demo_users(self, db_session):
        """Test seeding demo users."""
        demo_users = [
            User(
                email="demo@example.com",
                first_name="Demo",
                last_name="User",
                hashed_password=hash_password("demo123"),
                role=Role.USER,
                is_active=True
            ),
            User(
                email="admin@example.com",
                first_name="Admin",
                last_name="User",
                hashed_password=hash_password("admin123"),
                role=Role.ADMIN,
                is_active=True
            ),
        ]
        
        db_session.add_all(demo_users)
        db_session.commit()
        
        demo = db_session.query(User).filter_by(email="demo@example.com").first()
        admin = db_session.query(User).filter_by(email="admin@example.com").first()
        
        assert demo is not None
        assert admin is not None


class TestDatabaseIntegrity:
    """Test database integrity and data consistency."""
    
    def test_cascading_deletes(self, db_session):
        """Test that cascading deletes work properly."""
        user = User(
            email="cascade@example.com",
            hashed_password=hash_password("test123"),
            role=Role.USER
        )
        
        plan = SubscriptionPlan(name="Test", price=9.99, billing_cycle="monthly")
        subscription = Subscription(user=user, plan=plan, status="active")
        
        db_session.add_all([user, plan, subscription])
        db_session.commit()
        
        # Delete user
        db_session.delete(user)
        db_session.commit()
        
        # Subscription should be deleted (cascade)
        stored_sub = db_session.query(Subscription).filter_by(
            user_id=user.id
        ).first()
        assert stored_sub is None
    
    def test_timestamp_fields(self, db_session):
        """Test that timestamp fields are properly set."""
        user = User(
            email="timestamp@example.com",
            hashed_password=hash_password("test123"),
            role=Role.USER
        )
        
        db_session.add(user)
        db_session.commit()
        
        stored_user = db_session.query(User).filter_by(
            email="timestamp@example.com"
        ).first()
        
        assert stored_user.created_at is not None
        assert isinstance(stored_user.created_at, datetime)
    
    def test_data_persistence(self, db_session):
        """Test that data persists across transactions."""
        user = User(
            email="persistent@example.com",
            hashed_password=hash_password("test123"),
            role=Role.USER
        )
        
        db_session.add(user)
        db_session.commit()
        user_id = user.id
        
        # New session
        db_session.expunge_all()
        
        retrieved = db_session.query(User).filter_by(id=user_id).first()
        assert retrieved is not None
        assert retrieved.email == "persistent@example.com"


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
