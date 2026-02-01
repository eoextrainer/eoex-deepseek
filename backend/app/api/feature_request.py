"""Feature Request API endpoints"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..db.session import get_db
from ..models.feature_request import FeatureRequest, AIPrompt
from ..models.user import User
from ..schemas.feature_request_schema import (
    FeatureRequestCreate,
    FeatureRequestUpdate,
    FeatureRequestResponse,
    AIPromptCreate,
    AIPromptResponse,
)
from ..core.security import get_current_user

router = APIRouter()


@router.post("/", response_model=FeatureRequestResponse)
def create_feature_request(
    request: FeatureRequestCreate,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user),
):
    """Create a new feature request"""
    feature_request = FeatureRequest(
        user_id=current_user_id,
        title=request.title,
        description=request.description,
        priority=request.priority,
    )
    db.add(feature_request)
    db.commit()
    db.refresh(feature_request)
    return feature_request


@router.get("/my-requests", response_model=list[FeatureRequestResponse])
def get_my_feature_requests(
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user),
):
    """Get current user's feature requests"""
    requests = db.query(FeatureRequest).filter(
        FeatureRequest.user_id == current_user_id
    ).all()
    return requests


@router.get("/all", response_model=list[FeatureRequestResponse])
def get_all_feature_requests(
    status_filter: str = None,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user),
):
    """Get all feature requests (moderators/admins only)"""
    current_user = db.query(User).filter(User.id == current_user_id).first()
    if current_user.role.name not in ["system_admin", "community_admin", "moderator"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    query = db.query(FeatureRequest)
    if status_filter:
        query = query.filter(FeatureRequest.status == status_filter)
    return query.all()


@router.patch("/{request_id}", response_model=FeatureRequestResponse)
def update_feature_request(
    request_id: int,
    update: FeatureRequestUpdate,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user),
):
    """Update feature request status (moderators/admins only)"""
    current_user = db.query(User).filter(User.id == current_user_id).first()
    if current_user.role.name not in ["system_admin", "community_admin", "moderator"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    feature_request = db.query(FeatureRequest).filter(FeatureRequest.id == request_id).first()
    if not feature_request:
        raise HTTPException(status_code=404, detail="Feature request not found")
    
    if update.status:
        feature_request.status = update.status
    if update.priority:
        feature_request.priority = update.priority
    
    db.commit()
    db.refresh(feature_request)
    return feature_request


@router.post("/{request_id}/ai-prompts", response_model=AIPromptResponse)
def create_ai_prompt(
    request_id: int,
    prompt: AIPromptCreate,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user),
):
    """Create AI prompt for feature request"""
    feature_request = db.query(FeatureRequest).filter(FeatureRequest.id == request_id).first()
    if not feature_request:
        raise HTTPException(status_code=404, detail="Feature request not found")
    
    ai_prompt = AIPrompt(
        feature_request_id=request_id,
        prompt_text=prompt.prompt_text,
    )
    db.add(ai_prompt)
    db.commit()
    db.refresh(ai_prompt)
    return ai_prompt
