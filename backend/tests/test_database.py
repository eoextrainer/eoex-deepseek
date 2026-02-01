"""
Comprehensive database tests including seeding verification.
"""
import os
import sys
import logging
from datetime import datetime
from sqlalchemy import inspect, text
from sqlalchemy.orm import Session

# Add parent directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from app.db.session import engine, SessionLocal
from app.models.user import User, Role
from app.models.community import Community
from app.models.subscription import Subscription
from app.models.configuration import ThemeConfig, LanguageConfig

logger = logging.getLogger(__name__)

class DatabaseTests:
    """Comprehensive database test suite."""
    
    def __init__(self):
        self.errors = []
        self.warnings = []
        self.passed = []
        
    def test_connection(self) -> bool:
        """Test database connection."""
        try:
            with engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            self.passed.append("✓ Database connection successful")
            return True
        except Exception as e:
            self.errors.append(f"✗ Database connection failed: {str(e)}")
            return False
    
    def test_tables_exist(self) -> bool:
        """Test that all required tables exist."""
        try:
            inspector = inspect(engine)
            tables = inspector.get_table_names()
            
            required_tables = [
                'users',
                'roles',
                'subscriptions',
                'subscription_plans',
                'communities',
                'community_members',
                'forum_questions',
                'forum_answers',
                'theme_configs',
                'language_configs'
            ]
            missing_tables = [t for t in required_tables if t not in tables]
            
            if missing_tables:
                self.errors.append(f"✗ Missing tables: {missing_tables}")
                return False
            
            self.passed.append(f"✓ All required tables exist: {required_tables}")
            return True
        except Exception as e:
            self.errors.append(f"✗ Table inspection failed: {str(e)}")
            return False
    
    def test_roles_seeded(self) -> bool:
        """Test that roles are properly seeded."""
        try:
            db = SessionLocal()
            roles = db.query(Role).all()
            
            if not roles:
                self.errors.append("✗ No roles found in database")
                return False
            
            expected_roles = {'system_admin', 'community_admin', 'community_moderator', 'user', 'guest'}
            existing_roles = {role.name for role in roles}
            missing_roles = expected_roles - existing_roles
            
            if missing_roles:
                self.errors.append(f"✗ Missing roles: {missing_roles}")
                return False
            
            self.passed.append(f"✓ All roles seeded correctly: {existing_roles}")
            db.close()
            return True
        except Exception as e:
            self.errors.append(f"✗ Role seeding check failed: {str(e)}")
            return False
    
    def test_demo_users_exist(self) -> bool:
        """Test that demo users are seeded."""
        try:
            db = SessionLocal()
            users = db.query(User).all()
            
            if not users:
                self.errors.append("✗ No users found in database")
                return False
            
            user_emails = {user.email for user in users}
            required_users = {
                'sys-admin@eoex.com',
                'admin@eoex.com',
                'moderator@eoex.com',
                'user1@eoex.com',
                'user2@eoex.com',
                'user3@eoex.com',
                'user4@eoex.com',
                'user5@eoex.com',
                'guest@eoex.com'
            }
            missing_users = required_users - user_emails
            
            if missing_users:
                self.warnings.append(f"⚠ Missing demo users: {missing_users}")
            
            self.passed.append(f"✓ Demo users exist: {user_emails}")
            db.close()
            return len(missing_users) == 0
        except Exception as e:
            self.errors.append(f"✗ Demo user check failed: {str(e)}")
            return False
    
    def test_user_role_relationships(self) -> bool:
        """Test that users have valid role assignments."""
        try:
            db = SessionLocal()
            users_without_role = db.query(User).filter(User.role_id == None).count()

            if users_without_role > 0:
                self.errors.append(f"✗ Found {users_without_role} users without roles")
                return False

            role_count = db.query(Role).count()
            if role_count == 0:
                self.errors.append("✗ No roles found for user-role linkage")
                return False

            self.passed.append("✓ User-role relationships configured via role_id")
            db.close()
            return True
        except Exception as e:
            self.errors.append(f"✗ User-role relationship check failed: {str(e)}")
            return False
    
    def test_data_integrity(self) -> bool:
        """Test data integrity constraints."""
        try:
            db = SessionLocal()
            
            # Check for NULL email addresses
            null_emails = db.query(User).filter(User.email == None).count()
            if null_emails > 0:
                self.errors.append(f"✗ Found {null_emails} users with NULL emails")
                return False
            
            # Check for duplicate emails
            from sqlalchemy import func
            duplicates = db.query(User.email, func.count(User.id)).group_by(User.email).having(func.count(User.id) > 1).all()
            if duplicates:
                self.errors.append(f"✗ Found duplicate emails: {duplicates}")
                return False
            
            self.passed.append("✓ Data integrity checks passed")
            db.close()
            return True
        except Exception as e:
            self.errors.append(f"✗ Data integrity check failed: {str(e)}")
            return False
    
    def run_all(self) -> dict:
        """Run all database tests."""
        logger.info("=" * 60)
        logger.info("DATABASE TESTS")
        logger.info("=" * 60)
        
        tests = [
            ("Database Connection", self.test_connection),
            ("Tables Exist", self.test_tables_exist),
            ("Roles Seeded", self.test_roles_seeded),
            ("Demo Users Exist", self.test_demo_users_exist),
            ("User-Role Relationships", self.test_user_role_relationships),
            ("Data Integrity", self.test_data_integrity),
        ]
        
        results = {}
        for test_name, test_func in tests:
            try:
                passed = test_func()
                results[test_name] = passed
                logger.info(f"{'PASS' if passed else 'FAIL'}: {test_name}")
            except Exception as e:
                self.errors.append(f"✗ {test_name} crashed: {str(e)}")
                results[test_name] = False
                logger.error(f"CRASH: {test_name} - {str(e)}")
        
        # Log results
        for msg in self.passed:
            logger.info(msg)
        for msg in self.warnings:
            logger.warning(msg)
        for msg in self.errors:
            logger.error(msg)
        
        return {
            "passed": results,
            "errors": self.errors,
            "warnings": self.warnings,
            "total_passed": sum(1 for v in results.values() if v),
            "total_tests": len(results)
        }


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    tests = DatabaseTests()
    results = tests.run_all()
    print(f"\n\nSummary: {results['total_passed']}/{results['total_tests']} tests passed")
