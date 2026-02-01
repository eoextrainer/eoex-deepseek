"""User impersonation endpoints"""
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..db.session import get_db
from ..models.theme import UserImpersonation
from ..models.user import User
from ..schemas.impersonation_schema import ImpersonationCreate, ImpersonationResponse
from ..core.security import get_current_user

router = APIRouter()


def _require_moderator(user: User) -> None:
    if user.role.name not in ["moderator", "system_admin"]:
        raise HTTPException(status_code=403, detail="Not authorized")


@router.get("", response_model=list[ImpersonationResponse])
def list_impersonations(
    active_only: bool = False,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_moderator(current_user)
    query = db.query(UserImpersonation)
    if active_only:
        query = query.filter(UserImpersonation.end_time.is_(None))
    return query.order_by(UserImpersonation.start_time.desc()).all()


@router.post("/start", response_model=ImpersonationResponse)
def start_impersonation(
    payload: ImpersonationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_moderator(current_user)
    target_user = db.query(User).filter(User.id == payload.impersonated_user_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")
    if target_user.role.name == "system_admin":
        raise HTTPException(status_code=400, detail="Cannot impersonate system admin")

    record = UserImpersonation(
        moderator_id=current_user.id,
        impersonated_user_id=payload.impersonated_user_id,
        reason=payload.reason,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@router.post("/{impersonation_id}/end", response_model=ImpersonationResponse)
def end_impersonation(
    impersonation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_moderator(current_user)
    record = db.query(UserImpersonation).filter(UserImpersonation.id == impersonation_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Impersonation not found")

    record.end_time = datetime.utcnow()
    db.commit()
    db.refresh(record)
    return record
