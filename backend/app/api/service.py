"""Platform services and integrations endpoints"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..db.session import get_db
from ..models.service import PlatformService, ExternalIntegration, ServiceExchange
from ..models.user import User
from ..schemas.service_schema import (
    PlatformServiceCreate,
    PlatformServiceUpdate,
    PlatformServiceResponse,
    ExternalIntegrationCreate,
    ExternalIntegrationUpdate,
    ExternalIntegrationResponse,
    ServiceExchangeCreate,
    ServiceExchangeResponse,
)
from ..core.security import get_current_user

router = APIRouter()


def _require_system_admin(user: User) -> None:
    if user.role.name != "system_admin":
        raise HTTPException(status_code=403, detail="Not authorized")


@router.get("/services", response_model=list[PlatformServiceResponse])
def list_services(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    _require_system_admin(current_user)
    return db.query(PlatformService).order_by(PlatformService.created_at.desc()).all()


@router.post("/services", response_model=PlatformServiceResponse)
def create_service(
    service: PlatformServiceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_system_admin(current_user)
    db_service = PlatformService(**service.dict())
    db.add(db_service)
    db.commit()
    db.refresh(db_service)
    return db_service


@router.patch("/services/{service_id}", response_model=PlatformServiceResponse)
def update_service(
    service_id: int,
    update: PlatformServiceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_system_admin(current_user)
    db_service = db.query(PlatformService).filter(PlatformService.id == service_id).first()
    if not db_service:
        raise HTTPException(status_code=404, detail="Service not found")

    update_data = update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_service, field, value)

    db.commit()
    db.refresh(db_service)
    return db_service


@router.get("/integrations", response_model=list[ExternalIntegrationResponse])
def list_integrations(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    _require_system_admin(current_user)
    return db.query(ExternalIntegration).order_by(ExternalIntegration.created_at.desc()).all()


@router.post("/integrations", response_model=ExternalIntegrationResponse)
def create_integration(
    integration: ExternalIntegrationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_system_admin(current_user)
    db_integration = ExternalIntegration(**integration.dict())
    db.add(db_integration)
    db.commit()
    db.refresh(db_integration)
    return db_integration


@router.patch("/integrations/{integration_id}", response_model=ExternalIntegrationResponse)
def update_integration(
    integration_id: int,
    update: ExternalIntegrationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_system_admin(current_user)
    db_integration = db.query(ExternalIntegration).filter(ExternalIntegration.id == integration_id).first()
    if not db_integration:
        raise HTTPException(status_code=404, detail="Integration not found")

    update_data = update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_integration, field, value)

    db.commit()
    db.refresh(db_integration)
    return db_integration


@router.post("/integrations/{integration_id}/exchanges", response_model=ServiceExchangeResponse)
def log_exchange(
    integration_id: int,
    exchange: ServiceExchangeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_system_admin(current_user)
    db_integration = db.query(ExternalIntegration).filter(ExternalIntegration.id == integration_id).first()
    if not db_integration:
        raise HTTPException(status_code=404, detail="Integration not found")

    db_exchange = ServiceExchange(
        integration_id=integration_id,
        direction=exchange.direction,
        status=exchange.status,
        payload_preview=exchange.payload_preview,
    )
    db.add(db_exchange)
    db.commit()
    db.refresh(db_exchange)
    return db_exchange
