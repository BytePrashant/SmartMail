#!/usr/bin/env python3
"""
Quick test to check if the backend is running
"""

import requests
import sys

def test_backend():
    base_url = "http://localhost:8000"
    
    print("🧪 Testing Backend Connection...")
    print("=" * 40)
    
    # Test 1: Basic health check
    try:
        response = requests.get(f"{base_url}/api/v1/health")
        print(f"✅ Health Check: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   Response: {data}")
        else:
            print(f"   Error: {response.text}")
    except requests.exceptions.ConnectionError:
        print("❌ Backend is NOT running!")
        print("   Start it with: cd backend && python -m uvicorn main:app --reload --port 8000")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False
    
    # Test 2: Email config endpoint
    try:
        response = requests.get(f"{base_url}/api/v1/email-config")
        print(f"✅ Email Config: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   Response: {data}")
        else:
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"❌ Error testing email config: {e}")
    
    print("=" * 40)
    print("✅ Backend is running and responding!")
    return True

if __name__ == "__main__":
    test_backend()
