import requests
import os

BASE_URL = "https://api-t1.fyers.in/api/v3"

def get_auth_url():
    return (
        f"{BASE_URL}/generate-authcode?"
        f"client_id={os.getenv('FYERS_APP_ID')}"
        f"&redirect_uri={os.getenv('FYERS_REDIRECT_URI')}"
        f"&response_type=code"
        f"&state=sample"
    )