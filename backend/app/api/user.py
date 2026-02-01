"""User endpoints"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..db.session import get_db
from ..models.user import User, Role
from ..schemas.user_schema import User as UserSchema, UserUpdate, Role as RoleSchema
from ..core.security import verify_token, get_current_user

router = APIRouter()


@router.get("/me", response_model=UserSchema)
def get_current_user_endpoint(current_user_id: int = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get current user information"""
    user = db.query(User).filter(User.id == current_user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.get("/roles", response_model=list[RoleSchema])
def list_roles(db: Session = Depends(get_db)):
    """List all roles"""
    return db.query(Role).order_by(Role.id.asc()).all()


@router.get("")
def list_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """List all users (without sensitive data)"""
    users = db.query(User).offset(skip).limit(limit).all()
    # Filter out hashed_password in response
    return users


@router.get("/{user_id}", response_model=UserSchema)
def get_user(user_id: int, db: Session = Depends(get_db)):
    """Get user by ID"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    # Don't expose hashed password
    return user


@router.put("/{user_id}", response_model=UserSchema)
def update_user(
    user_id: int,
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user),
):
    """Update user information"""
    current_user = db.query(User).filter(User.id == current_user_id).first()
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if current_user.role.name != "system_admin" and current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized")

    if user_update.role_id is not None or user_update.is_active is not None:
        if current_user.role.name != "system_admin":
            raise HTTPException(status_code=403, detail="Role changes require system admin")

    update_data = user_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        if field == "password":
            from app.core.security import get_password_hash
            value = get_password_hash(value)
        setattr(user, field, value)

    db.commit()
    db.refresh(user)
    return user


@router.delete("/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user),
):
    """Delete user (soft delete)"""
    current_user = db.query(User).filter(User.id == current_user_id).first()
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if current_user.role.name != "system_admin" and current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized")

    user.is_active = False
    db.commit()
    return {"message": "User deactivated"}
