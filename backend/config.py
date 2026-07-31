from pathlib import Path
from typing import List, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent
ENV_FILE = BASE_DIR / ".env"


class Settings(BaseSettings):
    # MongoDB
    MONGODB_URI: str = "mongodb://localhost:27017"
    MONGODB_DB_NAME: str = "tamilmedictionary"

    # JWT
    SECRET_KEY: str = "change-this-to-a-long-random-secret-key-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Admin Seed
    ADMIN_USERNAME: str = "admin"
    ADMIN_EMAIL: str = "admin@tamilmedictionary.com"
    ADMIN_PASSWORD: str = "Admin@1234"

    # CORS
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:5174"

    # File upload storage
    UPLOADS_DIR: str = "uploads"

    # SMTP
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: Optional[str] = ""
    SMTP_PASS: Optional[str] = ""
    SMTP_FROM: Optional[str] = ""

    @property
    def cors_origins_list(self) -> List[str]:
        return [o.strip() for o in self.CORS_ORIGINS.split(",") if o.strip()]

    model_config = SettingsConfigDict(
        env_file=str(ENV_FILE),
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()
