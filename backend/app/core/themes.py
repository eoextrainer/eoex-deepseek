"""Theme definitions and seeding"""
from sqlalchemy.orm import Session
from .models.theme import Theme

THEME_DEFINITIONS = {
    "netflix_user": {
        "name": "Netflix User Theme",
        "primary_color": "#141414",
        "secondary_color": "#221F1F",
        "accent_color": "#E50914",
        "background_color": "#0B0B0B",
        "text_color": "#FFFFFF",
        "is_default": False,
        "description": "Netflix-inspired dark theme for regular users"
    },
    "netflix_guest": {
        "name": "Netflix Guest Theme",
        "primary_color": "#221F1F",
        "secondary_color": "#2F2F2F",
        "accent_color": "#CCCCCC",
        "background_color": "#141414",
        "text_color": "#FFFFFF",
        "is_default": False,
        "description": "Netflix guest theme with limited features"
    },
    "disney_moderator": {
        "name": "Disney+ Moderator Theme",
        "primary_color": "#113CCF",
        "secondary_color": "#040514",
        "accent_color": "#0B65F5",
        "background_color": "#040514",
        "text_color": "#FFFFFF",
        "is_default": False,
        "description": "Disney+ inspired theme for moderators"
    },
    "salesforce_community_admin": {
        "name": "Salesforce Admin Theme",
        "primary_color": "#00A1DE",
        "secondary_color": "#F3F3F3",
        "accent_color": "#0070D2",
        "background_color": "#FFFFFF",
        "text_color": "#000000",
        "is_default": False,
        "description": "Salesforce Lightning theme for community admins"
    },
    "salesforce_system_admin": {
        "name": "Salesforce Setup Theme",
        "primary_color": "#0070D2",
        "secondary_color": "#F3F3F3",
        "accent_color": "#00A1DE",
        "background_color": "#F5F5F5",
        "text_color": "#14111B",
        "is_default": False,
        "description": "Salesforce setup theme for system admins"
    },
    "google_play_games": {
        "name": "Google Play Games Theme",
        "primary_color": "#202124",
        "secondary_color": "#292A2D",
        "accent_color": "#8AB4F8",
        "background_color": "#121212",
        "text_color": "#FFFFFF",
        "is_default": True,
        "description": "Google Play Store games theme"
    }
}

def seed_themes(db: Session):
    """Seed default themes into database"""
    for theme_key, theme_data in THEME_DEFINITIONS.items():
        existing = db.query(Theme).filter(Theme.name == theme_data["name"]).first()
        if not existing:
            theme = Theme(**theme_data)
            db.add(theme)
    db.commit()
