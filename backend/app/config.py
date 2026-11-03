import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

class Settings:
    PROJECT_NAME: str = "Analyze Aging: ระบบสารสนเทศและแดชบอร์ดสุขภาพผู้สูงอายุไทย"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    EVENT_YEAR: str = "2026"
    ADMIN_USERNAME: str = "admin"
    ADMIN_PASSWORD: str = "forum2026"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super-secret-key-aging-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24
    
    # Database URL: uses DATABASE_URL environment variable (PostgreSQL), falls back to SQLite for local dev
    DATABASE_URL: str = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR}/aging_data.db")

settings = Settings()
