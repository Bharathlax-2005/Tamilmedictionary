from pathlib import Path
from typing import List, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent
ENV_FILE = BASE_DIR / ".env"


class Settings(BaseSettings):
    # MongoDB
    MONGODB_URI: Optional[str] = None
    MONGODB_DB_NAME: Optional[str] = None

    # JWT
    SECRET_KEY: Optional[str] = None
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Admin Seed
    ADMIN_USERNAME: Optional[str] = None
    ADMIN_EMAIL: Optional[str] = None
    ADMIN_PASSWORD: Optional[str] = None

    # CORS
    CORS_ORIGINS: Optional[str] = None

    # File upload storage
    UPLOADS_DIR: str = "uploads"

    # SMTP
    SMTP_HOST: Optional[str] = None
    SMTP_PORT: int = 587
    SMTP_USER: Optional[str] = None
    SMTP_PASS: Optional[str] = None
    SMTP_FROM: Optional[str] = None

    @property
    def cors_origins_list(self) -> List[str]:
        origins = self.CORS_ORIGINS or "http://localhost:5173,http://localhost:5174"
        return [o.strip() for o in origins.split(",") if o.strip()]

    model_config = SettingsConfigDict(
        env_file=(str(BASE_DIR / ".env"), str(BASE_DIR.parent / ".env"), ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()
