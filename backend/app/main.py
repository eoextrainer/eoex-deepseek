"""Main FastAPI application"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api import user, auth, subscription, community
from app.db.session import engine, Base

# Create tables only if database is available
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"Warning: Could not create database tables: {e}")

app = FastAPI(
    title=settings.app_name,
    description="EOEX Platform - Multi-tiered Subscription Community Platform",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(user.router, prefix="/api/v1/users", tags=["users"])
app.include_router(subscription.router, prefix="/api/v1/subscriptions", tags=["subscriptions"])
app.include_router(community.router, prefix="/api/v1/communities", tags=["communities"])


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to EOEX Platform API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
async def health():
    """Health check endpoint"""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
