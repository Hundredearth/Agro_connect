import os
import time
import sys
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def get_driver():
    chrome_options = Options()
    # Configure options for CI (GitHub Actions) / Headless
    chrome_options.add_argument("--headless=new")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--window-size=1920,1080")
    
    # In CI, chromedriver is usually preinstalled on PATH.
    # We try default setup first.
    try:
        driver = webdriver.Chrome(options=chrome_options)
        return driver
    except Exception as e:
        print(f"Standard webdriver launch failed, trying with service: {e}")
        # Return fallback or re-raise
        raise e

def run_e2e_tests():
    app_url = os.environ.get("AGROCONNECT_APP_URL", "http://localhost:5173")
    print(f"Starting E2E Selenium Tests against target: {app_url}")
    
    driver = None
    try:
        driver = get_driver()
        wait = WebDriverWait(driver, 10)
        
        # 1. Access the Authentication Page
        driver.get(app_url)
        print("Page loaded. Title:", driver.title)
        
        # 2. Check login elements are present
        email_input = wait.until(EC.presence_of_element_located((By.NAME, "email")))
        password_input = driver.find_element(By.NAME, "password")
        submit_btn = driver.find_element(By.XPATH, "//button[@type='submit']")
        
        print("Login page components verified.")
        
        # 3. Toggle between English / Tamil translation checking
        lang_buttons = driver.find_elements(By.XPATH, "//button[@type='button']")
        for btn in lang_buttons:
            if btn.text == "EN" or "தமிழ்" in btn.text:
                btn.click()
                time.sleep(0.5)
                print(f"Clicked language button: {btn.text}")
                
        # 4. Check sign up mode switch
        signup_toggle = driver.find_element(By.XPATH, "//*[contains(text(), 'Sign Up') or contains(text(), 'பதிவு செய்')]")
        signup_toggle.click()
        time.sleep(0.5)
        print("Successfully toggled to Sign Up screen.")
        
        # Verify signup components appear
        fullName_input = wait.until(EC.presence_of_element_located((By.NAME, "fullName")))
        phone_input = driver.find_element(By.NAME, "phone")
        address_input = driver.find_element(By.NAME, "address")
        role_select = driver.find_element(By.NAME, "role")
        
        print("Signup page components verified.")
        
        # 5. Toggle roles and verify role-specific fields show up
        # Switch to Seller role
        role_select.send_keys("Seller")
        time.sleep(0.5)
        company_input = wait.until(EC.presence_of_element_located((By.NAME, "companyName")))
        print("Role selection: Seller validated (companyName input is visible).")
        
        # Switch to Farmer role
        role_select.send_keys("Farmer")
        time.sleep(0.5)
        farmSize_input = wait.until(EC.presence_of_element_located((By.NAME, "farmSize")))
        print("Role selection: Farmer validated (farmSize input is visible).")
        
        # Switch back to Login mode
        signin_toggle = driver.find_element(By.XPATH, "//*[contains(text(), 'Sign In') or contains(text(), 'உள்நுழையவும்')]")
        signin_toggle.click()
        time.sleep(0.5)
        print("Successfully toggled back to Login screen.")
        
        print("All E2E UI sanity tests passed successfully!")
        
    except Exception as e:
        print(f"E2E Test Execution failed: {e}")
        if driver:
            # Capture screenshot on failure for debugging in CI
            driver.save_screenshot("failure_screenshot.png")
            print("Saved failure screenshot to failure_screenshot.png")
        sys.exit(1)
    finally:
        if driver:
            driver.quit()

if __name__ == "__main__":
    run_e2e_tests()
