"""Opportunity and Issue API endpoints"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..db.session import get_db
from ..models.opportunity import Opportunity, UserIssue
from ..models.user import User
from ..schemas.opportunity_schema import (
    OpportunityCreate,
    OpportunityResponse,
    UserIssueCreate,
    UserIssueUpdate,
    UserIssueResponse,
)
from ..core.security import get_current_user

router = APIRouter()


# Opportunities endpoints
@router.get("/opportunities", response_model=list[OpportunityResponse])
def get_opportunities(
    tier: str = None,
    category: str = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get opportunities filtered by tier and category"""
    query = db.query(Opportunity).filter(Opportunity.status == "active")
    
    if tier:
        query = query.filter((Opportunity.tier == tier) | (Opportunity.tier == "all"))
    if category:
        query = query.filter(Opportunity.category == category)
    
    return query.all()


@router.post("/opportunities", response_model=OpportunityResponse)
def create_opportunity(
    opportunity: OpportunityCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create opportunity (moderators/admins only)"""
    if current_user.role.name not in ["system_admin", "moderator"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db_opportunity = Opportunity(**opportunity.dict())
    db.add(db_opportunity)
    db.commit()
    db.refresh(db_opportunity)
    return db_opportunity


# Issues endpoints
@router.post("/issues", response_model=UserIssueResponse)
def create_issue(
    issue: UserIssueCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create user issue"""
    db_issue = UserIssue(
        user_id=current_user.id,
        **issue.dict()
    )
    db.add(db_issue)
    db.commit()
    db.refresh(db_issue)
    return db_issue


@router.get("/issues/my-issues", response_model=list[UserIssueResponse])
def get_my_issues(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get current user's issues"""
    issues = db.query(UserIssue).filter(UserIssue.user_id == current_user.id).all()
    return issues


@router.get("/issues/all", response_model=list[UserIssueResponse])
def get_all_issues(
    status_filter: str = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get all issues (moderators/admins only)"""
    if current_user.role.name not in ["system_admin", "moderator"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    query = db.query(UserIssue)
    if status_filter:
        query = query.filter(UserIssue.status == status_filter)
    return query.all()


@router.patch("/issues/{issue_id}", response_model=UserIssueResponse)
def update_issue(
    issue_id: int,
    update: UserIssueUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update issue status"""
    db_issue = db.query(UserIssue).filter(UserIssue.id == issue_id).first()
    if not db_issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    
    if current_user.id != db_issue.user_id and current_user.role.name not in ["system_admin", "moderator"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    if update.status:
        db_issue.status = update.status
    if update.priority:
        db_issue.priority = update.priority
    
    db.commit()
    db.refresh(db_issue)
    return db_issue
