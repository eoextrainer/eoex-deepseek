"""Main FastAPI application"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .api import user, auth, subscription, community, feature_request, opportunity, theme, campaign, service, impersonation
from .db.session import engine, Base

# Create tables only if database is available
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"Warning: Could not create database tables: {e}")

app = FastAPI(
    title=settings.app_name,
    description="KCD Talent Agency - Plateforme professionnelle de mise en relation talents et marques",
    version="1.0.0"
)

# Configure CORS - allow_credentials and allow_origins["*"] cannot be used together
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3100",
        "http://localhost:3101",
        "http://127.0.0.1:3100",
        "http://127.0.0.1:3101",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(user.router, prefix="/api/v1/users", tags=["users"])
app.include_router(subscription.router, prefix="/api/v1/subscriptions", tags=["subscriptions"])
app.include_router(community.router, prefix="/api/v1/communities", tags=["communities"])
app.include_router(campaign.router, prefix="/api/v1/campaigns", tags=["campaigns"])
app.include_router(feature_request.router, prefix="/api/v1/feature-requests", tags=["feature_requests"])
app.include_router(opportunity.router, prefix="/api/v1/platform", tags=["opportunities_issues"])
app.include_router(theme.router, prefix="/api/v1/themes", tags=["themes"])
app.include_router(service.router, prefix="/api/v1", tags=["services"])
app.include_router(impersonation.router, prefix="/api/v1/impersonations", tags=["impersonations"])


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Bienvenue sur l'API KCD Talent Agency",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
async def health():
    """Health check endpoint"""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8100)
