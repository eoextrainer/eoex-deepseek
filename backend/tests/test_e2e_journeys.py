"""
End-to-End (E2E) User Journey Tests
Tests simulating complete user flows from login to logout
"""

import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
import time
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent.parent))


class TestE2EUserJourneys:
    """End-to-end user journey tests."""
    
    @pytest.fixture(scope="class")
    def driver(self):
        """Initialize Selenium WebDriver."""
        options = webdriver.ChromeOptions()
        options.add_argument("--start-maximized")
        options.add_argument("--disable-blink-features=AutomationControlled")
        
        driver = webdriver.Chrome(options=options)
        driver.wait = WebDriverWait(driver, 10)
        
        yield driver
        
        driver.quit()
    
    def navigate_to_app(self, driver):
        """Navigate to the application."""
        driver.get("http://localhost:3000")
        time.sleep(2)
    
    def test_new_user_registration_flow(self, driver):
        """Test complete new user registration flow."""
        self.navigate_to_app(driver)
        
        # Click register link
        register_link = driver.wait.until(
            EC.element_to_be_clickable((By.LINK_TEXT, "Register"))
        )
        register_link.click()
        
        time.sleep(1)
        
        # Fill registration form
        driver.find_element(By.NAME, "first_name").send_keys("John")
        driver.find_element(By.NAME, "last_name").send_keys("Doe")
        driver.find_element(By.NAME, "email").send_keys(f"john{time.time()}@example.com")
        driver.find_element(By.NAME, "password").send_keys("SecurePass123!")
        driver.find_element(By.NAME, "password_confirm").send_keys("SecurePass123!")
        
        # Accept terms
        driver.find_element(By.NAME, "accept_terms").click()
        
        # Submit form
        submit_button = driver.find_element(By.ROLE, "button")
        submit_button.click()
        
        # Wait for success
        success_msg = driver.wait.until(
            EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'registration successful')]"))
        )
        assert success_msg.is_displayed()
    
    def test_user_login_logout_flow(self, driver):
        """Test user login and logout flow."""
        self.navigate_to_app(driver)
        
        # Click login button
        login_btn = driver.wait.until(
            EC.element_to_be_clickable((By.LINK_TEXT, "Sign In"))
        )
        login_btn.click()
        
        time.sleep(1)
        
        # Enter credentials
        email_field = driver.find_element(By.NAME, "email")
        password_field = driver.find_element(By.NAME, "password")
        
        email_field.send_keys("demo@eoex.com")
        password_field.send_keys("demo123")
        
        # Click login
        login_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Sign In')]")
        login_button.click()
        
        # Wait for redirect to workspace
        driver.wait.until(
            EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Workspace')]"))
        )
        
        # Logout
        profile_menu = driver.find_element(By.CLASS_NAME, "user-menu")
        profile_menu.click()
        
        logout_btn = driver.find_element(By.XPATH, "//button[contains(text(), 'Logout')]")
        logout_btn.click()
        
        # Should redirect to home
        driver.wait.until(
            EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Sign In')]"))
        )
    
    def test_view_subscriptions_flow(self, driver):
        """Test viewing subscriptions in workspace."""
        # First login
        self.test_user_login_logout_flow(driver)
        
        # Already in workspace after login
        time.sleep(2)
        
        # Click subscriptions tab
        subs_tab = driver.find_element(By.XPATH, "//button[contains(text(), 'Subscriptions')]")
        subs_tab.click()
        
        # Wait for subscription list to load
        sub_list = driver.wait.until(
            EC.presence_of_element_located((By.CLASS_NAME, "subscriptions-list"))
        )
        assert sub_list.is_displayed()
    
    def test_update_profile_flow(self, driver):
        """Test updating user profile."""
        # Login
        self.test_user_login_logout_flow(driver)
        
        # Click profile settings
        settings_btn = driver.find_element(By.CLASS_NAME, "settings-button")
        settings_btn.click()
        
        # Update first name
        first_name = driver.find_element(By.NAME, "first_name")
        first_name.clear()
        first_name.send_keys("UpdatedName")
        
        # Save changes
        save_btn = driver.find_element(By.XPATH, "//button[contains(text(), 'Save')]")
        save_btn.click()
        
        # Verify save message
        success_msg = driver.wait.until(
            EC.presence_of_element_located((By.CLASS_NAME, "success-message"))
        )
        assert "updated" in success_msg.text.lower()
    
    def test_theme_switching_flow(self, driver):
        """Test switching between themes."""
        self.navigate_to_app(driver)
        
        # Click theme settings
        theme_btn = driver.find_element(By.CLASS_NAME, "theme-button")
        theme_btn.click()
        
        time.sleep(1)
        
        # Switch to Netflix theme
        netflix_option = driver.find_element(By.XPATH, "//button[contains(text(), 'Netflix')]")
        netflix_option.click()
        
        # Verify theme changed
        body = driver.find_element(By.TAG_NAME, "body")
        assert "netflix" in body.get_attribute("class")
        
        # Switch to Disney+ theme
        theme_btn = driver.find_element(By.CLASS_NAME, "theme-button")
        theme_btn.click()
        
        time.sleep(1)
        
        disney_option = driver.find_element(By.XPATH, "//button[contains(text(), 'Disney')]")
        disney_option.click()
        
        assert "disney" in body.get_attribute("class")
    
    def test_language_switching_flow(self, driver):
        """Test switching languages."""
        self.navigate_to_app(driver)
        
        # Click language settings
        lang_btn = driver.find_element(By.CLASS_NAME, "language-button")
        lang_btn.click()
        
        time.sleep(1)
        
        languages = ["en", "es", "fr", "de", "it", "pt"]
        
        for lang in languages:
            lang_option = driver.find_element(By.XPATH, f"//button[contains(text(), '{lang}')]")
            lang_option.click()
            time.sleep(1)
    
    def test_create_subscription_flow(self, driver):
        """Test subscribing to a plan."""
        # Login first
        self.test_user_login_logout_flow(driver)
        
        # Go to subscriptions
        time.sleep(2)
        subs_tab = driver.find_element(By.XPATH, "//button[contains(text(), 'Subscriptions')]")
        subs_tab.click()
        
        # Click add subscription
        add_btn = driver.find_element(By.XPATH, "//button[contains(text(), 'Subscribe')]")
        add_btn.click()
        
        # Select plan
        basic_plan = driver.find_element(By.XPATH, "//button[contains(text(), 'Basic')]")
        basic_plan.click()
        
        # Confirm subscription
        confirm_btn = driver.find_element(By.XPATH, "//button[contains(text(), 'Confirm')]")
        confirm_btn.click()
        
        # Verify success
        success = driver.wait.until(
            EC.presence_of_element_located((By.CLASS_NAME, "success-message"))
        )
        assert success.is_displayed()
    
    def test_view_community_flow(self, driver):
        """Test viewing communities."""
        # Login
        self.test_user_login_logout_flow(driver)
        
        # Navigate to communities
        time.sleep(2)
        community_link = driver.find_element(By.XPATH, "//a[contains(text(), 'Community')]")
        community_link.click()
        
        # Wait for community list
        community_list = driver.wait.until(
            EC.presence_of_element_located((By.CLASS_NAME, "community-list"))
        )
        assert community_list.is_displayed()
    
    def test_join_community_flow(self, driver):
        """Test joining a community."""
        # Login
        self.test_user_login_logout_flow(driver)
        
        # Go to communities
        time.sleep(2)
        community_link = driver.find_element(By.XPATH, "//a[contains(text(), 'Community')]")
        community_link.click()
        
        # Click join on first community
        join_btn = driver.find_element(By.XPATH, "//button[contains(text(), 'Join')]")
        join_btn.click()
        
        # Verify join message
        success = driver.wait.until(
            EC.presence_of_element_located((By.CLASS_NAME, "success-message"))
        )
        assert "joined" in success.text.lower()
    
    def test_admin_panel_access_flow(self, driver):
        """Test accessing admin panel."""
        # Login with admin account
        self.navigate_to_app(driver)
        
        login_btn = driver.wait.until(
            EC.element_to_be_clickable((By.LINK_TEXT, "Sign In"))
        )
        login_btn.click()
        
        time.sleep(1)
        
        # Use admin credentials
        driver.find_element(By.NAME, "email").send_keys("admin@eoex.com")
        driver.find_element(By.NAME, "password").send_keys("admin123")
        
        login_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Sign In')]")
        login_button.click()
        
        # Navigate to admin
        time.sleep(2)
        admin_link = driver.find_element(By.XPATH, "//a[contains(text(), 'Admin')]")
        admin_link.click()
        
        # Verify admin dashboard
        dashboard = driver.wait.until(
            EC.presence_of_element_located((By.CLASS_NAME, "admin-dashboard"))
        )
        assert dashboard.is_displayed()
    
    def test_error_recovery_flow(self, driver):
        """Test handling and recovery from errors."""
        self.navigate_to_app(driver)
        
        # Try to login with invalid credentials
        login_btn = driver.wait.until(
            EC.element_to_be_clickable((By.LINK_TEXT, "Sign In"))
        )
        login_btn.click()
        
        time.sleep(1)
        
        # Enter invalid data
        driver.find_element(By.NAME, "email").send_keys("invalid@example.com")
        driver.find_element(By.NAME, "password").send_keys("wrongpass")
        
        login_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Sign In')]")
        login_button.click()
        
        # Should show error
        error_msg = driver.wait.until(
            EC.presence_of_element_located((By.CLASS_NAME, "error-message"))
        )
        assert error_msg.is_displayed()
        
        # Should still be on login page
        assert "login" in driver.current_url.lower()
    
    def test_responsive_mobile_flow(self, driver):
        """Test responsive design on mobile."""
        # Set mobile viewport
        driver.set_window_size(375, 667)
        
        self.navigate_to_app(driver)
        
        # Menu should be hamburger on mobile
        hamburger = driver.find_element(By.CLASS_NAME, "hamburger-menu")
        assert hamburger.is_displayed()
        
        # Click hamburger
        hamburger.click()
        
        # Menu should appear
        mobile_menu = driver.wait.until(
            EC.presence_of_element_located((By.CLASS_NAME, "mobile-menu"))
        )
        assert mobile_menu.is_displayed()
    
    def test_dark_mode_toggle_flow(self, driver):
        """Test dark mode toggle."""
        self.navigate_to_app(driver)
        
        # Find dark mode toggle
        dark_toggle = driver.find_element(By.CLASS_NAME, "dark-mode-toggle")
        dark_toggle.click()
        
        time.sleep(1)
        
        # Check dark mode class
        body = driver.find_element(By.TAG_NAME, "body")
        assert "dark" in body.get_attribute("class")
        
        # Toggle back
        dark_toggle.click()
        
        time.sleep(1)
        
        # Should be light mode now
        assert "dark" not in body.get_attribute("class")


class TestE2ENavigationFlow:
    """Test navigation flow between pages."""
    
    @pytest.fixture(scope="class")
    def driver(self):
        """Initialize WebDriver."""
        driver = webdriver.Chrome()
        driver.wait = WebDriverWait(driver, 10)
        yield driver
        driver.quit()
    
    def test_navigation_breadcrumbs(self, driver):
        """Test breadcrumb navigation."""
        driver.get("http://localhost:3000")
        
        # Login
        time.sleep(2)
        
        # Check breadcrumbs exist
        breadcrumbs = driver.find_elements(By.CLASS_NAME, "breadcrumb")
        assert len(breadcrumbs) > 0
    
    def test_back_button_navigation(self, driver):
        """Test back button functionality."""
        driver.get("http://localhost:3000")
        time.sleep(2)
        
        # Navigate to a page
        link = driver.find_element(By.XPATH, "//a")
        link.click()
        time.sleep(2)
        
        # Click browser back
        driver.back()
        time.sleep(1)
        
        # Should be back on previous page
        assert driver.current_url != "http://localhost:3000/login"


class TestE2EPerformance:
    """Test performance during E2E flows."""
    
    @pytest.fixture(scope="class")
    def driver(self):
        """Initialize WebDriver."""
        driver = webdriver.Chrome()
        driver.wait = WebDriverWait(driver, 10)
        yield driver
        driver.quit()
    
    def test_page_load_time(self, driver):
        """Test page load time."""
        import time
        
        start = time.time()
        driver.get("http://localhost:3000")
        end = time.time()
        
        load_time = end - start
        assert load_time < 5  # Should load in less than 5 seconds
    
    def test_interaction_responsiveness(self, driver):
        """Test interaction responsiveness."""
        driver.get("http://localhost:3000")
        time.sleep(2)
        
        import time
        
        start = time.time()
        button = driver.find_element(By.XPATH, "//button")
        button.click()
        end = time.time()
        
        response_time = end - start
        assert response_time < 1  # Should respond in less than 1 second


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
