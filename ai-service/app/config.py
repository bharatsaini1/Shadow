from functools import lru_cache
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    ai_service_api_key: str = "change-this-to-a-long-random-secret"
    groq_api_key: str = ""
    pinecone_api_key: str = ""
    pinecone_index_name: str = "mentriq-knowledge"
    pinecone_environment: str = "us-east-1"
    pinecone_host: str = ""
    langsmith_tracing: bool = False
    langsmith_endpoint: str = "https://api.smith.langchain.com"
    langsmith_api_key: str = ""
    langsmith_project: str = "MentriqShadow"
    anthropic_api_key: str = ""

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


@lru_cache
def get_settings() -> Settings:
    return Settings()
