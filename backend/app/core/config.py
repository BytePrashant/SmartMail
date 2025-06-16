from pydantic_settings import BaseSettings
from functools import lru_cache
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Settings(BaseSettings):
    # API Settings
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "SmartMail"
    
    # CORS Settings
    BACKEND_CORS_ORIGINS: list = [
        "http://localhost:5173",  # React dev server
        "http://127.0.0.1:5173",
    ]
    
    # Email Settings
    SMTP_SERVER: str = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))
    SENDER_EMAIL: str = os.getenv("SENDER_EMAIL", "")
    SENDER_PASSWORD: str = os.getenv("SENDER_PASSWORD", "")
    
    # Rate Limiting
    MAX_EMAILS_PER_RUN: int = 499
    DELAY_MIN_SECONDS: int = 5
    DELAY_MAX_SECONDS: int = 10
    BATCH_DELAY_SECONDS: int = 100
    BATCH_SIZE: int = 50
    
    # File Settings
    ALLOWED_FILE_TYPES: list = [".csv", ".xlsx"]
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB
    
    class Config:
        case_sensitive = True

@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()

# Create settings instance
settings = get_settings() 