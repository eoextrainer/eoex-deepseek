from pydantic_settings import BaseSettings
from pydantic import Field
import os


class Settings(BaseSettings):
    app_name: str = "KCD Talent Agency"
    postgres_host: str = Field(default="localhost", env="POSTGRES_HOST")
    postgres_port: int = Field(default=5432, env="POSTGRES_PORT")
    postgres_db: str = Field(default="eoex_main", env="POSTGRES_DB")
    postgres_user: str = Field(default="eoex_user", env="POSTGRES_USER")
    postgres_password: str = Field(default="", env="POSTGRES_PASSWORD")
    jwt_secret_key: str = Field(default="dev-secret-key-change-in-production", env="JWT_SECRET_KEY")
    encryption_key: str = Field(default="dev-encryption-key-change-in-production", env="ENCRYPTION_KEY")
    api_gateway_key: str = Field(default="dev-api-key-change-in-production", env="API_GATEWAY_KEY")

    enable_guest_access: bool = Field(default=True, env="ENABLE_GUEST_ACCESS")
    enable_ai_features: bool = Field(default=True, env="ENABLE_AI_FEATURES")
    enable_3d_elements: bool = Field(default=True, env="ENABLE_3D_ELEMENTS")
    
    # Database mode
    use_sqlite: bool = Field(default=False, env="USE_SQLITE")

    class Config:
        env_file = ".env"
        extra = "ignore"
        case_sensitive = False


settings = Settings()

# Validate critical settings in development
if not os.getenv("JWT_SECRET_KEY") and settings.jwt_secret_key == "dev-secret-key-change-in-production":
    print("⚠️  WARNING: Using default JWT_SECRET_KEY - CHANGE THIS IN PRODUCTION!")
