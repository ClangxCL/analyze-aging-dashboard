import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

class Settings:
    PROJECT_NAME: str = "ElderHealth Forum 2026"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    EVENT_YEAR: str = os.getenv("EVENT_YEAR", "2026")
    
    # Database URL: uses DATABASE_URL environment variable (PostgreSQL), falls back to SQLite for local dev
    DATABASE_URL: str = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR}/forum2026.db")
    
    # JWT Settings
    JWT_SECRET: str = os.getenv("JWT_SECRET", "forum-2026-secret-key-moph-thailand-super-secure")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # Upload Directories
    UPLOAD_DIR: Path = BASE_DIR / "uploads"
    DOCS_DIR: Path = UPLOAD_DIR / "documents"
    BANNERS_DIR: Path = UPLOAD_DIR / "banners"
    SCHEDULES_DIR: Path = UPLOAD_DIR / "schedules"

settings = Settings()

# Ensure directories exist
settings.DOCS_DIR.mkdir(parents=True, exist_ok=True)
settings.BANNERS_DIR.mkdir(parents=True, exist_ok=True)
settings.SCHEDULES_DIR.mkdir(parents=True, exist_ok=True)
