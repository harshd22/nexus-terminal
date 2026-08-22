"""
NEXUS TERMINAL — Application Configuration
Reads from .env file via pydantic-settings
"""
from functools import lru_cache
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # Application
    app_env: str = "development"
    app_secret_key: str = "nexus-dev-secret"

    # CORS
    cors_origins: List[str] = ["http://localhost:3000"]

    # Database
    database_url: str = "sqlite+aiosqlite:///./nexus_terminal.db"

    # Kite Connect
    kite_api_key: str = ""
    kite_api_secret: str = ""
    kite_access_token: str = ""
    kite_redirect_url: str = "http://localhost:8000/api/kite/callback"

    # Screener
    screener_session_cookie: str = ""

    # Ollama AI
    ollama_base_url: str = "http://localhost:11434"
    ollama_model: str = "llama3.2"

    # OpenAI (optional)
    openai_api_key: str = ""
    openai_model: str = "gpt-4o-mini"

    # Cache
    cache_ttl_seconds: int = 300
    breadth_poll_interval: int = 30

    # Market Hours (IST)
    market_open_hour: int = 9
    market_open_minute: int = 15
    market_close_hour: int = 15
    market_close_minute: int = 30

    @property
    def kite_configured(self) -> bool:
        return bool(self.kite_api_key and self.kite_api_secret)

    @property
    def demo_mode(self) -> bool:
        return not self.kite_configured

    @property
    def ai_configured(self) -> bool:
        return bool(self.ollama_base_url or self.openai_api_key)


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
