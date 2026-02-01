#!/usr/bin/env python3
"""
Script to create demo users in the database
"""
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PROJECT_ROOT))

from app.db.session import SessionLocal, engine, Base
from app.models.user import User, Role
from app.models.theme import Theme, UserPreference
from app.models.service import PlatformService, ExternalIntegration
from app.models.campaign import MarketingCampaign
from app.models.opportunity import Opportunity, UserIssue
from app.models.theme import Theme, UserPreference
from app.core.security import get_password_hash

# Create tables
Base.metadata.create_all(bind=engine)

db = SessionLocal()

try:
    # Create themes
    netflix_theme = db.query(Theme).filter(Theme.name == "Netflix").first()
    if not netflix_theme:
        netflix_theme = Theme(
            name="Netflix",
            primary_color="#000000",
            secondary_color="#221F1F",
            accent_color="#E50914",
            background_color="#000000",
            text_color="#FFFFFF",
            is_default=True,
            description="Netflix-inspired dark theme"
        )
        db.add(netflix_theme)
        db.flush()
    
    # Google Play store inspired theme
    google_play_theme = db.query(Theme).filter(Theme.name == "Google Play").first()
    if not google_play_theme:
        google_play_theme = Theme(
            name="Google Play",
            primary_color="#FFFFFF",
            secondary_color="#F5F5F5",
            accent_color="#1F71E5",
            background_color="#FFFFFF",
            text_color="#202124",
            is_default=False,
            description="Google Play Store inspired theme"
        )
        db.add(google_play_theme)
        db.flush()
    
    db.commit()
    
    # Create or get roles
    admin_role = db.query(Role).filter(Role.name == "system_admin").first()
    if not admin_role:
        admin_role = Role(name="system_admin")
        db.add(admin_role)
        db.flush()
    
    community_admin_role = db.query(Role).filter(Role.name == "community_admin").first()
    if not community_admin_role:
        community_admin_role = Role(name="community_admin")
        db.add(community_admin_role)
        db.flush()
    
    moderator_role = db.query(Role).filter(Role.name == "moderator").first()
    if not moderator_role:
        moderator_role = Role(name="moderator")
        db.add(moderator_role)
        db.flush()
    
    user_role = db.query(Role).filter(Role.name == "user").first()
    if not user_role:
        user_role = Role(name="user")
        db.add(user_role)
        db.flush()
    
    guest_role = db.query(Role).filter(Role.name == "guest").first()
    if not guest_role:
        guest_role = Role(name="guest")
        db.add(guest_role)
        db.flush()
    
    db.commit()
    
    # Demo users to create
    demo_users = [
        {
            "email": "admin@kcd-agency.com",
            "full_name": "Admin Plateforme",
            "password": "admin123",
            "role": admin_role,
        },
        {
            "email": "community.admin@kcd-agency.com",
            "full_name": "Admin Communauté",
            "password": "comm_admin123",
            "role": community_admin_role,
        },
        {
            "email": "moderator@kcd-agency.com",
            "full_name": "Modérateur",
            "password": "mod123",
            "role": moderator_role,
        },
        {
            "email": "brand@kcd-agency.com",
            "full_name": "Marque / Pro",
            "password": "brand123",
            "role": user_role,
        },
        {
            "email": "premium@kcd-agency.com",
            "full_name": "Talent Premium",
            "password": "premium123",
            "role": user_role,
        },
        {
            "email": "free@kcd-agency.com",
            "full_name": "Talent Free",
            "password": "free123",
            "role": user_role,
        },
        {
            "email": "guest@kcd-agency.com",
            "full_name": "Invité",
            "password": "guest123",
            "role": guest_role,
        }
    ]
    
    # Create users
    for user_data in demo_users:
        existing_user = db.query(User).filter(User.email == user_data["email"]).first()
        if not existing_user:
            user = User(
                email=user_data["email"],
                full_name=user_data["full_name"],
                hashed_password=get_password_hash(user_data["password"]),
                role_id=user_data["role"].id,
                is_active=True
            )
            db.add(user)
            db.flush()
            
            # Create user preference
            preference = UserPreference(
                user_id=user.id,
                theme_id=netflix_theme.id,
            )
            db.add(preference)
            print(f"Created user: {user_data['email']} / {user_data['password']}")
        else:
            print(f"User already exists: {user_data['email']}")
    
    db.commit()
    print("\nAll demo users created successfully!")

    # Create default themes
    theme_definitions = [
        {
            "name": "Netflix theme",
            "primary_color": "#141414",
            "secondary_color": "#221F1F",
            "accent_color": "#E50914",
            "background_color": "#0B0B0B",
            "text_color": "#FFFFFF",
            "is_default": True,
            "description": "Netflix-inspired dark theme",
        },
        {
            "name": "Play Games",
            "primary_color": "#0B2F1F",
            "secondary_color": "#0F4C81",
            "accent_color": "#34C759",
            "background_color": "#071A12",
            "text_color": "#EAF7FF",
            "is_default": False,
            "description": "Palette inspirée de Google Play Games",
        },
    ]

    for theme_data in theme_definitions:
        theme = db.query(Theme).filter(Theme.name == theme_data["name"]).first()
        if not theme:
            theme = Theme(**theme_data)
            db.add(theme)
    db.commit()

    default_theme = db.query(Theme).filter(Theme.is_default == True).first()
    users = db.query(User).all()
    for user in users:
        preference = db.query(UserPreference).filter(UserPreference.user_id == user.id).first()
        if not preference and default_theme:
            db.add(UserPreference(user_id=user.id, theme_id=default_theme.id))
    db.commit()

    # Seed platform services
    service_definitions = [
        {
            "name": "User Management",
            "description": "Gestion des utilisateurs et des rôles",
            "category": "core",
            "status": "active",
            "tier_access": "all",
            "endpoint_url": "https://api.kcd.local/users",
        },
        {
            "name": "Subscription Engine",
            "description": "Gestion des abonnements et plans",
            "category": "billing",
            "status": "active",
            "tier_access": "all",
            "endpoint_url": "https://api.kcd.local/subscriptions",
        },
        {
            "name": "AI Prompt Studio",
            "description": "Transcription des demandes en prompts IA",
            "category": "ai",
            "status": "active",
            "tier_access": "premium",
            "endpoint_url": "https://api.kcd.local/ai-prompts",
            "requires_approval": True,
        },
    ]

    for service_data in service_definitions:
        existing_service = db.query(PlatformService).filter(PlatformService.name == service_data["name"]).first()
        if not existing_service:
            db.add(PlatformService(**service_data))

    # Seed external integrations
    integration_definitions = [
        {
            "name": "CRM Partners",
            "base_url": "https://partners.kcd.local/crm",
            "auth_type": "oauth",
            "status": "active",
        },
        {
            "name": "Brand Insights",
            "base_url": "https://insights.kcd.local",
            "auth_type": "api_key",
            "status": "active",
        },
    ]

    for integration_data in integration_definitions:
        existing_integration = db.query(ExternalIntegration).filter(
            ExternalIntegration.name == integration_data["name"]
        ).first()
        if not existing_integration:
            db.add(ExternalIntegration(**integration_data))

    db.commit()

    # Seed marketing campaigns
    community_admin = db.query(User).filter(User.email == "community.admin@kcd-agency.com").first()
    if community_admin:
        campaign = db.query(MarketingCampaign).filter(MarketingCampaign.name == "Campagne Talent Premium").first()
        if not campaign:
            db.add(
                MarketingCampaign(
                    name="Campagne Talent Premium",
                    objective="Promouvoir le passage en Premium pour les talents",
                    status="active",
                    channel="social",
                    budget=12000,
                    spend=5400,
                    impressions=250000,
                    clicks=8200,
                    conversions=520,
                    created_by=community_admin.id,
                )
            )
    db.commit()

    # Seed opportunities and issues
    if not db.query(Opportunity).first():
        db.add_all([
            Opportunity(
                title="Défilé éditorial Paris",
                description="Shooting éditorial haute couture pour talent premium.",
                category="editorial",
                tier="premium",
                status="active",
            ),
            Opportunity(
                title="Runway Fashion Week",
                description="Casting runway pour nouvelle collection.",
                category="runway",
                tier="all",
                status="active",
            ),
        ])

    if not db.query(UserIssue).first():
        demo_user = db.query(User).filter(User.email == "free@kcd-agency.com").first()
        if demo_user:
            db.add(
                UserIssue(
                    user_id=demo_user.id,
                    title="Accès portfolio lent",
                    description="Le chargement du portfolio est lent sur mobile.",
                    category="UI/UX",
                    priority="medium",
                )
            )
    db.commit()
    
    # Print credentials table
    print("\n" + "="*70)
    print("DEMO USER CREDENTIALS")
    print("="*70)
    for user_data in demo_users:
        print(f"Email: {user_data['email']:<30} | Password: {user_data['password']:<15}")
    print("="*70)
    
finally:
    db.close()

