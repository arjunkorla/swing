from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def home():
    return {"message": "AI Swing Scanner Backend Running"}

from fastapi import FastAPI
from app.services.fyers_service import get_auth_url

app = FastAPI()

@app.get("/login")
def login():
    return {
        "auth_url": get_auth_url()
    }