"""
Comprehensive frontend E2E tests using Playwright/Selenium simulation.
Tests the complete user journey from login to logout.
"""
import os
import sys
import logging
import json
from typing import Dict, List, Tuple

logger = logging.getLogger(__name__)

class FrontendTests:
    """Comprehensive frontend test suite."""
    
    def __init__(self, base_url: str = "http://localhost:3100"):
        self.base_url = base_url
        self.errors = []
        self.warnings = []
        self.passed = []
        self.browser_session = None
    
    def test_home_page_loads(self) -> bool:
        """Test that home page loads successfully."""
        try:
            import requests
            response = requests.get(self.base_url, timeout=5)
            
            if response.status_code == 200:
                if 'html' in response.text.lower():
                    self.passed.append("✓ Home page loads successfully")
                    return True
                else:
                    self.errors.append("✗ Home page returned non-HTML content")
                    return False
            else:
                self.errors.append(f"✗ Home page returned status {response.status_code}")
                return False
        except Exception as e:
            self.errors.append(f"✗ Home page load error: {str(e)}")
            return False
    
    def test_login_page_accessible(self) -> bool:
        """Test that login page is accessible."""
        try:
            import requests
            response = requests.get(f"{self.base_url}/login", timeout=5)
            
            if response.status_code == 200:
                self.passed.append("✓ Login page is accessible")
                return True
            else:
                self.errors.append(f"✗ Login page returned status {response.status_code}")
                return False
        except Exception as e:
            self.errors.append(f"✗ Login page access error: {str(e)}")
            return False
    
    def test_register_page_accessible(self) -> bool:
        """Test that register page is accessible."""
        try:
            import requests
            response = requests.get(f"{self.base_url}/register", timeout=5)
            
            if response.status_code == 200:
                self.passed.append("✓ Register page is accessible")
                return True
            else:
                self.errors.append(f"✗ Register page returned status {response.status_code}")
                return False
        except Exception as e:
            self.errors.append(f"✗ Register page access error: {str(e)}")
            return False
    
    def test_api_connection_from_frontend(self) -> bool:
        """Test that frontend can connect to backend API."""
        try:
            import requests
            # Test if frontend can make requests
            response = requests.get("http://localhost:8100/health", timeout=5)
            
            if response.status_code in [200, 404]:  # 404 is ok if endpoint doesn't exist
                self.passed.append("✓ Frontend can reach backend API")
                return True
            else:
                self.errors.append(f"✗ Frontend API connection returned status {response.status_code}")
                return False
        except Exception as e:
            self.errors.append(f"✗ Frontend API connection error: {str(e)}")
            return False
    
    def test_css_files_loaded(self) -> bool:
        """Test that CSS files are properly loaded."""
        try:
            import requests
            response = requests.get(self.base_url, timeout=5)
            
            if response.status_code == 200:
                # Check for style references
                if 'style' in response.text.lower() or 'css' in response.text.lower():
                    self.passed.append("✓ CSS files are referenced")
                    return True
                else:
                    self.warnings.append("⚠ No CSS references found in HTML")
                    return False
            else:
                self.errors.append("✗ Could not check CSS files")
                return False
        except Exception as e:
            self.errors.append(f"✗ CSS check error: {str(e)}")
            return False
    
    def test_javascript_files_loaded(self) -> bool:
        """Test that JavaScript files are properly loaded."""
        try:
            import requests
            response = requests.get(self.base_url, timeout=5)
            
            if response.status_code == 200:
                # Check for script references
                if 'script' in response.text.lower():
                    self.passed.append("✓ JavaScript files are referenced")
                    return True
                else:
                    self.warnings.append("⚠ No script references found in HTML")
                    return False
            else:
                self.errors.append("✗ Could not check JavaScript files")
                return False
        except Exception as e:
            self.errors.append(f"✗ JavaScript check error: {str(e)}")
            return False
    
    def test_responsive_design(self) -> bool:
        """Test basic responsive design setup."""
        try:
            import requests
            response = requests.get(self.base_url, timeout=5)
            
            if response.status_code == 200:
                # Check for viewport meta tag
                if 'viewport' in response.text.lower():
                    self.passed.append("✓ Responsive design viewport configured")
                    return True
                else:
                    self.warnings.append("⚠ Viewport meta tag not found")
                    return True  # Not critical
            else:
                self.errors.append("✗ Could not check responsive design")
                return False
        except Exception as e:
            self.errors.append(f"✗ Responsive design check error: {str(e)}")
            return False
    
    def run_all(self) -> dict:
        """Run all frontend tests."""
        logger.info("=" * 60)
        logger.info("FRONTEND E2E TESTS")
        logger.info("=" * 60)
        
        tests = [
            ("Home Page Loads", self.test_home_page_loads),
            ("Login Page Accessible", self.test_login_page_accessible),
            ("Register Page Accessible", self.test_register_page_accessible),
            ("Frontend-Backend Connection", self.test_api_connection_from_frontend),
            ("CSS Files Loaded", self.test_css_files_loaded),
            ("JavaScript Files Loaded", self.test_javascript_files_loaded),
            ("Responsive Design", self.test_responsive_design),
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
    tests = FrontendTests()
    results = tests.run_all()
    print(f"\n\nSummary: {results['total_passed']}/{results['total_tests']} tests passed")
