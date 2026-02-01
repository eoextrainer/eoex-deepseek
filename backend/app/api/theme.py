"""Theme and User Preferences API endpoints"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..db.session import get_db
from ..models.theme import Theme, UserPreference
from ..models.user import User
from ..schemas.theme_schema import (
    ThemeCreate,
    ThemeResponse,
    UserPreferenceCreate,
    UserPreferenceUpdate,
    UserPreferenceResponse,
)
from ..core.security import get_current_user

router = APIRouter()


@router.get("/themes", response_model=list[ThemeResponse])
def get_all_themes(db: Session = Depends(get_db)):
    """Get all available themes"""
    themes = db.query(Theme).all()
    return themes


@router.post("/themes", response_model=ThemeResponse)
def create_theme(
    theme: ThemeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create new theme (system admin only)"""
    if current_user.role.name != "system_admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db_theme = Theme(**theme.dict())
    db.add(db_theme)
    db.commit()
    db.refresh(db_theme)
    return db_theme


@router.get("/preferences/my-preference", response_model=UserPreferenceResponse)
def get_my_preference(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get current user's preferences"""
    preference = db.query(UserPreference).filter(
        UserPreference.user_id == current_user.id
    ).first()
    
    if not preference:
        # Create default preference if not exists
        default_theme = db.query(Theme).filter(Theme.is_default == True).first()
        if not default_theme:
            # Create Netflix theme as default
            default_theme = Theme(
                name="Netflix theme",
                primary_color="#141414",
                secondary_color="#221F1F",
                accent_color="#E50914",
                background_color="#0B0B0B",
                text_color="#FFFFFF",
                is_default=True,
                description="Netflix-inspired dark theme"
            )
            db.add(default_theme)
            db.commit()
        
        preference = UserPreference(
            user_id=current_user.id,
            theme_id=default_theme.id,
        )
        db.add(preference)
        db.commit()
        db.refresh(preference)
    
    return preference


@router.put("/preferences/my-preference", response_model=UserPreferenceResponse)
def update_my_preference(
    update: UserPreferenceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update current user's preferences"""
    preference = db.query(UserPreference).filter(
        UserPreference.user_id == current_user.id
    ).first()
    
    if not preference:
        raise HTTPException(status_code=404, detail="Preference not found")
    
    if update.theme_id:
        theme = db.query(Theme).filter(Theme.id == update.theme_id).first()
        if not theme:
            raise HTTPException(status_code=404, detail="Theme not found")
        preference.theme_id = update.theme_id
    
    if update.language:
        preference.language = update.language
    
    if update.notifications_enabled is not None:
        preference.notifications_enabled = update.notifications_enabled
    
    db.commit()
    db.refresh(preference)
    return preference
