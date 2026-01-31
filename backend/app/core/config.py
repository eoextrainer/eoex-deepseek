from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "EOEX Platform"
    postgres_host: str = "localhost"
    postgres_port: int = 5432
    postgres_db: str = "eoex_main"
    postgres_user: str = "eoex_user"
    postgres_password: str = ""
    jwt_secret_key: str = ""
    encryption_key: str = ""
    api_gateway_key: str = ""

    enable_guest_access: bool = True
    enable_ai_features: bool = True
    enable_3d_elements: bool = True

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
