"""Marketing campaign endpoints"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..db.session import get_db
from ..models.campaign import MarketingCampaign
from ..models.user import User
from ..schemas.campaign_schema import (
    MarketingCampaignCreate,
    MarketingCampaignUpdate,
    MarketingCampaignResponse,
)
from ..core.security import get_current_user

router = APIRouter()


def _require_campaign_access(user: User) -> None:
    if user.role.name not in ["community_admin", "system_admin"]:
        raise HTTPException(status_code=403, detail="Not authorized")


@router.get("", response_model=list[MarketingCampaignResponse])
def list_campaigns(
    status: str | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_campaign_access(current_user)
    query = db.query(MarketingCampaign)
    if status:
        query = query.filter(MarketingCampaign.status == status)
    return query.order_by(MarketingCampaign.created_at.desc()).all()


@router.post("", response_model=MarketingCampaignResponse)
def create_campaign(
    campaign: MarketingCampaignCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_campaign_access(current_user)
    db_campaign = MarketingCampaign(**campaign.dict(), created_by=current_user.id)
    db.add(db_campaign)
    db.commit()
    db.refresh(db_campaign)
    return db_campaign


@router.patch("/{campaign_id}", response_model=MarketingCampaignResponse)
def update_campaign(
    campaign_id: int,
    update: MarketingCampaignUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_campaign_access(current_user)
    db_campaign = db.query(MarketingCampaign).filter(MarketingCampaign.id == campaign_id).first()
    if not db_campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")

    update_data = update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_campaign, field, value)

    db.commit()
    db.refresh(db_campaign)
    return db_campaign
