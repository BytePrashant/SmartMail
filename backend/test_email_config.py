#!/usr/bin/env python3
"""
Test script for email configuration system
Run this to test the email configuration endpoints
"""

import requests
import json

# Update this to match your backend URL
BASE_URL = "http://localhost:8000/api/v1"

def test_email_config():
    """Test the email configuration endpoints"""
    
    print("🧪 Testing Email Configuration System")
    print("=" * 50)
    
    # Test 1: Check if email config exists
    print("\n1. Checking current email configuration...")
    try:
        response = requests.get(f"{BASE_URL}/email-config")
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   Response: {json.dumps(data, indent=2)}")
        else:
            print(f"   Error: {response.text}")
    except Exception as e:
        print(f"   Error: {e}")
    
    # Test 2: Test Gmail configuration
    print("\n2. Testing Gmail configuration...")
    gmail_config = {
        "smtp_server": "smtp.gmail.com",
        "smtp_port": 587,
        "sender_email": "test@gmail.com",
        "sender_password": "test_password",
        "use_tls": True
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/email-config/test",
            json=gmail_config,
            headers={"Content-Type": "application/json"}
        )
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   Response: {json.dumps(data, indent=2)}")
        else:
            print(f"   Error: {response.text}")
    except Exception as e:
        print(f"   Error: {e}")
    
    # Test 3: Health check
    print("\n3. Testing health check endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   Response: {json.dumps(data, indent=2)}")
        else:
            print(f"   Error: {response.text}")
    except Exception as e:
        print(f"   Error: {e}")
    
    print("\n" + "=" * 50)
    print("✅ Testing completed!")

if __name__ == "__main__":
    test_email_config()
