"""
Comprehensive API endpoint tests.
"""
import os
import sys
import logging
import json
import requests
from typing import Dict, Any

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

logger = logging.getLogger(__name__)

class APITests:
    """Comprehensive API test suite."""
    
    def __init__(self, base_url: str = "http://localhost:8100/api/v1"):
        self.base_url = base_url
        self.errors = []
        self.warnings = []
        self.passed = []
        self.token = None
        self.headers = {"Content-Type": "application/json"}
    
    def test_health_check(self) -> bool:
        """Test API health endpoint."""
        try:
            response = requests.get(f"{self.base_url.replace('/api/v1', '')}/health")
            if response.status_code == 200:
                self.passed.append("✓ Health check passed")
                return True
            else:
                self.errors.append(f"✗ Health check failed: {response.status_code}")
                return False
        except Exception as e:
            self.errors.append(f"✗ Health check error: {str(e)}")
            return False
    
    def test_auth_login(self) -> bool:
        """Test authentication login."""
        try:
            payload = {
                "email": "sys-admin@eoex.com",
                "password": "password123"
            }
            response = requests.post(
                f"{self.base_url}/auth/login",
                json=payload,
                headers=self.headers
            )
            
            if response.status_code == 200:
                data = response.json()
                if "access_token" in data:
                    self.token = data["access_token"]
                    self.headers["Authorization"] = f"Bearer {self.token}"
                    self.passed.append("✓ Authentication login successful")
                    return True
                else:
                    self.errors.append("✗ Login response missing access_token")
                    return False
            else:
                self.errors.append(f"✗ Login failed: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            self.errors.append(f"✗ Login error: {str(e)}")
            return False
    
    def test_get_current_user(self) -> bool:
        """Test getting current user info."""
        try:
            if not self.token:
                self.warnings.append("⚠ Skipping current user test - no token")
                return False
            
            response = requests.get(
                f"{self.base_url}/users/me",
                headers=self.headers
            )
            
            if response.status_code == 200:
                self.passed.append("✓ Get current user successful")
                return True
            else:
                self.errors.append(f"✗ Get current user failed: {response.status_code}")
                return False
        except Exception as e:
            self.errors.append(f"✗ Get current user error: {str(e)}")
            return False
    
    def test_list_users(self) -> bool:
        """Test listing users."""
        try:
            if not self.token:
                self.warnings.append("⚠ Skipping list users test - no token")
                return False
            
            response = requests.get(
                f"{self.base_url}/users",
                headers=self.headers
            )
            
            if response.status_code == 200:
                users = response.json()
                self.passed.append(f"✓ List users successful: {len(users) if isinstance(users, list) else 'unknown'} users")
                return True
            else:
                self.errors.append(f"✗ List users failed: {response.status_code}")
                return False
        except Exception as e:
            self.errors.append(f"✗ List users error: {str(e)}")
            return False
    
    def test_get_subscriptions(self) -> bool:
        """Test getting subscriptions."""
        try:
            if not self.token:
                self.warnings.append("⚠ Skipping subscriptions test - no token")
                return False
            
            response = requests.get(
                f"{self.base_url}/subscriptions",
                headers=self.headers
            )
            
            if response.status_code == 200:
                self.passed.append("✓ Get subscriptions successful")
                return True
            else:
                self.errors.append(f"✗ Get subscriptions failed: {response.status_code}")
                return False
        except Exception as e:
            self.errors.append(f"✗ Get subscriptions error: {str(e)}")
            return False
    
    def test_get_communities(self) -> bool:
        """Test getting communities."""
        try:
            response = requests.get(
                f"{self.base_url}/communities",
                headers=self.headers
            )
            
            if response.status_code in [200, 401]:  # 401 is ok if not authenticated
                self.passed.append("✓ Get communities endpoint exists")
                return True
            else:
                self.errors.append(f"✗ Get communities failed: {response.status_code}")
                return False
        except Exception as e:
            self.errors.append(f"✗ Get communities error: {str(e)}")
            return False
    
    def run_all(self) -> dict:
        """Run all API tests."""
        logger.info("=" * 60)
        logger.info("API ENDPOINT TESTS")
        logger.info("=" * 60)
        
        tests = [
            ("Health Check", self.test_health_check),
            ("Authentication Login", self.test_auth_login),
            ("Get Current User", self.test_get_current_user),
            ("List Users", self.test_list_users),
            ("Get Subscriptions", self.test_get_subscriptions),
            ("Get Communities", self.test_get_communities),
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
                logger.error(f"CRASH: {test_name}")
        
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
    tests = APITests()
    results = tests.run_all()
    print(f"\n\nSummary: {results['total_passed']}/{results['total_tests']} tests passed")
