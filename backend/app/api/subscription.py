"""Subscription endpoints"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.subscription import Subscription, SubscriptionPlan
from app.schemas.subscription_schema import (
    Subscription as SubscriptionSchema,
    SubscriptionCreate,
    SubscriptionUpdate,
    SubscriptionPlan as SubscriptionPlanSchema
)

router = APIRouter()


@router.get("/plans")
def list_subscription_plans(db: Session = Depends(get_db)):
    """List all subscription plans"""
    plans = db.query(SubscriptionPlan).filter(SubscriptionPlan.is_active == True).all()
    return plans


@router.get("/{subscription_id}", response_model=SubscriptionSchema)
def get_subscription(subscription_id: int, db: Session = Depends(get_db)):
    """Get subscription by ID"""
    subscription = db.query(Subscription).filter(Subscription.id == subscription_id).first()
    if not subscription:
        raise HTTPException(status_code=404, detail="Subscription not found")
    return subscription


@router.get("/user/{user_id}")
def get_user_subscriptions(user_id: int, db: Session = Depends(get_db)):
    """Get all subscriptions for a user"""
    subscriptions = db.query(Subscription).filter(Subscription.user_id == user_id).all()
    return subscriptions


@router.post("", response_model=SubscriptionSchema)
def create_subscription(subscription: SubscriptionCreate, db: Session = Depends(get_db)):
    """Create a new subscription"""
    db_subscription = Subscription(**subscription.dict())
    db.add(db_subscription)
    db.commit()
    db.refresh(db_subscription)
    return db_subscription


@router.put("/{subscription_id}", response_model=SubscriptionSchema)
def update_subscription(subscription_id: int, subscription_update: SubscriptionUpdate, db: Session = Depends(get_db)):
    """Update subscription"""
    subscription = db.query(Subscription).filter(Subscription.id == subscription_id).first()
    if not subscription:
        raise HTTPException(status_code=404, detail="Subscription not found")
    
    update_data = subscription_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(subscription, field, value)
    
    db.commit()
    db.refresh(subscription)
    return subscription


@router.delete("/{subscription_id}")
def cancel_subscription(subscription_id: int, db: Session = Depends(get_db)):
    """Cancel subscription"""
    subscription = db.query(Subscription).filter(Subscription.id == subscription_id).first()
    if not subscription:
        raise HTTPException(status_code=404, detail="Subscription not found")
    
    subscription.status = "cancelled"
    db.commit()
    return {"message": "Subscription cancelled"}
