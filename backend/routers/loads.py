from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from database import get_db, Load, LoadStatus, User, UserType
from pydantic import BaseModel, validator
from typing import List, Optional
from datetime import datetime
from routers.auth import get_current_user

router = APIRouter()

class LoadCreate(BaseModel):
    title: str
    description: str
    pickup_location: str
    delivery_location: str
    weight: Optional[float] = None
    dimensions: Optional[str] = None
    pickup_date: Optional[datetime] = None
    special_requirements: Optional[str] = None
    images: Optional[List[str]] = None  # List of image URLs

    @validator('weight')
    def validate_weight(cls, v):
        if v is not None and v <= 0:
            raise ValueError('Weight must be positive')
        return v

    @validator('pickup_date')
    def validate_pickup_date(cls, v):
        if v is not None and v < datetime.now():
            raise ValueError('Pickup date cannot be in the past')
        return v

class LoadUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    pickup_location: Optional[str] = None
    delivery_location: Optional[str] = None
    weight: Optional[float] = None
    dimensions: Optional[str] = None
    pickup_date: Optional[datetime] = None
    special_requirements: Optional[str] = None
    images: Optional[List[str]] = None

    @validator('weight')
    def validate_weight(cls, v):
        if v is not None and v <= 0:
            raise ValueError('Weight must be positive')
        return v

    @validator('pickup_date')
    def validate_pickup_date(cls, v):
        if v is not None and v < datetime.now():
            raise ValueError('Pickup date cannot be in the past')
        return v

class LoadResponse(BaseModel):
    id: int
    owner_id: int
    driver_id: Optional[int] = None
    title: str
    description: str
    pickup_location: str
    delivery_location: str
    status: str
    weight: Optional[float] = None
    dimensions: Optional[str] = None
    pickup_date: Optional[datetime] = None
    special_requirements: Optional[str] = None
    images: Optional[List[str]] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    # Owner information
    owner_name: Optional[str] = None
    owner_email: Optional[str] = None
    owner_phone: Optional[str] = None
    
    # Driver information (if assigned)
    driver_name: Optional[str] = None
    driver_email: Optional[str] = None
    driver_phone: Optional[str] = None

    class Config:
        from_attributes = True

@router.post("/", response_model=LoadResponse, status_code=status.HTTP_201_CREATED)
async def create_load(
    load: LoadCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new load request"""
    # Only load owners can create loads
    if current_user.user_type != UserType.LOAD_OWNER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only load owners can create loads"
        )
    
    # Convert images list to JSON string if provided
    images_json = None
    if load.images:
        import json
        images_json = json.dumps(load.images)
    
    # Create new load
    db_load = Load(
        owner_id=current_user.id,
        title=load.title,
        description=load.description,
        pickup_location=load.pickup_location,
        delivery_location=load.delivery_location,
        weight=load.weight,
        dimensions=load.dimensions,
        pickup_date=load.pickup_date,
        special_requirements=load.special_requirements,
        images=images_json,
        status=LoadStatus.POSTED
    )
    
    db.add(db_load)
    db.commit()
    db.refresh(db_load)
    
    # Prepare response with owner information
    response_data = LoadResponse(
        id=db_load.id,
        owner_id=db_load.owner_id,
        driver_id=db_load.driver_id,
        title=db_load.title,
        description=db_load.description,
        pickup_location=db_load.pickup_location,
        delivery_location=db_load.delivery_location,
        status=db_load.status.value,
        weight=db_load.weight,
        dimensions=db_load.dimensions,
        pickup_date=db_load.pickup_date,
        special_requirements=db_load.special_requirements,
        images=load.images,
        created_at=db_load.created_at,
        updated_at=db_load.updated_at,
        owner_name=current_user.name,
        owner_email=current_user.email,
        owner_phone=current_user.phone
    )
    
    return response_data

@router.get("/", response_model=List[LoadResponse])
async def get_loads(
    status_filter: Optional[str] = Query(None, alias="status"),
    db: Session = Depends(get_db)
):
    """Get all available loads with optional status filtering"""
    query = db.query(Load).join(User, Load.owner_id == User.id)
    
    if status_filter:
        try:
            status_enum = LoadStatus(status_filter)
            query = query.filter(Load.status == status_enum)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid status: {status_filter}"
            )
    
    loads = query.all()
    
    # Prepare response with owner and driver information
    response_loads = []
    for load in loads:
        # Parse images JSON
        images = None
        if load.images:
            import json
            try:
                images = json.loads(load.images)
            except:
                images = None
        
        # Get driver info if assigned
        driver_name = driver_email = driver_phone = None
        if load.driver_id:
            driver = db.query(User).filter(User.id == load.driver_id).first()
            if driver:
                driver_name = driver.name
                driver_email = driver.email
                driver_phone = driver.phone
        
        response_loads.append(LoadResponse(
            id=load.id,
            owner_id=load.owner_id,
            driver_id=load.driver_id,
            title=load.title,
            description=load.description,
            pickup_location=load.pickup_location,
            delivery_location=load.delivery_location,
            status=load.status.value,
            weight=load.weight,
            dimensions=load.dimensions,
            pickup_date=load.pickup_date,
            special_requirements=load.special_requirements,
            images=images,
            created_at=load.created_at,
            updated_at=load.updated_at,
            owner_name=load.owner.name,
            owner_email=load.owner.email,
            owner_phone=load.owner.phone,
            driver_name=driver_name,
            driver_email=driver_email,
            driver_phone=driver_phone
        ))
    
    return response_loads

@router.get("/my-loads", response_model=List[LoadResponse])
async def get_user_loads(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get loads for the current user (owner or driver)"""
    if current_user.user_type == UserType.LOAD_OWNER:
        # Get loads owned by this user
        loads = db.query(Load).filter(Load.owner_id == current_user.id).all()
    else:
        # Get loads assigned to this driver
        loads = db.query(Load).filter(Load.driver_id == current_user.id).all()
    
    # Prepare response with owner and driver information
    response_loads = []
    for load in loads:
        # Parse images JSON
        images = None
        if load.images:
            import json
            try:
                images = json.loads(load.images)
            except:
                images = None
        
        # Get owner info
        owner = db.query(User).filter(User.id == load.owner_id).first()
        
        # Get driver info if assigned
        driver_name = driver_email = driver_phone = None
        if load.driver_id:
            driver = db.query(User).filter(User.id == load.driver_id).first()
            if driver:
                driver_name = driver.name
                driver_email = driver.email
                driver_phone = driver.phone
        
        response_loads.append(LoadResponse(
            id=load.id,
            owner_id=load.owner_id,
            driver_id=load.driver_id,
            title=load.title,
            description=load.description,
            pickup_location=load.pickup_location,
            delivery_location=load.delivery_location,
            status=load.status.value,
            weight=load.weight,
            dimensions=load.dimensions,
            pickup_date=load.pickup_date,
            special_requirements=load.special_requirements,
            images=images,
            created_at=load.created_at,
            updated_at=load.updated_at,
            owner_name=owner.name if owner else None,
            owner_email=owner.email if owner else None,
            owner_phone=owner.phone if owner else None,
            driver_name=driver_name,
            driver_email=driver_email,
            driver_phone=driver_phone
        ))
    
    return response_loads

@router.get("/{load_id}", response_model=LoadResponse)
async def get_load(load_id: int, db: Session = Depends(get_db)):
    """Get a specific load by ID"""
    load = db.query(Load).filter(Load.id == load_id).first()
    
    if not load:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Load not found"
        )
    
    # Parse images JSON
    images = None
    if load.images:
        import json
        try:
            images = json.loads(load.images)
        except:
            images = None
    
    # Get owner info
    owner = db.query(User).filter(User.id == load.owner_id).first()
    
    # Get driver info if assigned
    driver_name = driver_email = driver_phone = None
    if load.driver_id:
        driver = db.query(User).filter(User.id == load.driver_id).first()
        if driver:
            driver_name = driver.name
            driver_email = driver.email
            driver_phone = driver.phone
    
    return LoadResponse(
        id=load.id,
        owner_id=load.owner_id,
        driver_id=load.driver_id,
        title=load.title,
        description=load.description,
        pickup_location=load.pickup_location,
        delivery_location=load.delivery_location,
        status=load.status.value,
        weight=load.weight,
        dimensions=load.dimensions,
        pickup_date=load.pickup_date,
        special_requirements=load.special_requirements,
        images=images,
        created_at=load.created_at,
        updated_at=load.updated_at,
        owner_name=owner.name if owner else None,
        owner_email=owner.email if owner else None,
        owner_phone=owner.phone if owner else None,
        driver_name=driver_name,
        driver_email=driver_email,
        driver_phone=driver_phone
    )

@router.put("/{load_id}", response_model=LoadResponse)
async def update_load(
    load_id: int,
    load_update: LoadUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a load (only by owner)"""
    load = db.query(Load).filter(Load.id == load_id).first()
    
    if not load:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Load not found"
        )
    
    # Check if current user is the owner
    if load.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only update your own loads"
        )
    
    # Update fields
    update_data = load_update.dict(exclude_unset=True)
    
    # Handle images separately
    if 'images' in update_data and update_data['images'] is not None:
        import json
        load.images = json.dumps(update_data['images'])
        del update_data['images']
    
    for field, value in update_data.items():
        setattr(load, field, value)
    
    load.updated_at = datetime.now()
    db.commit()
    db.refresh(load)
    
    # Parse images for response
    images = None
    if load.images:
        import json
        try:
            images = json.loads(load.images)
        except:
            images = None
    
    return LoadResponse(
        id=load.id,
        owner_id=load.owner_id,
        driver_id=load.driver_id,
        title=load.title,
        description=load.description,
        pickup_location=load.pickup_location,
        delivery_location=load.delivery_location,
        status=load.status.value,
        weight=load.weight,
        dimensions=load.dimensions,
        pickup_date=load.pickup_date,
        special_requirements=load.special_requirements,
        images=images,
        created_at=load.created_at,
        updated_at=load.updated_at,
        owner_name=current_user.name,
        owner_email=current_user.email,
        owner_phone=current_user.phone
    )

@router.delete("/{load_id}")
async def delete_load(
    load_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a load (only by owner)"""
    load = db.query(Load).filter(Load.id == load_id).first()
    
    if not load:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Load not found"
        )
    
    # Check if current user is the owner
    if load.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own loads"
        )
    
    db.delete(load)
    db.commit()
    
    return {"message": "Load deleted successfully"}

@router.post("/{load_id}/claim")
async def claim_load(
    load_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Claim a load (only by drivers)"""
    # Only drivers can claim loads
    if current_user.user_type != UserType.DRIVER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only drivers can claim loads"
        )
    
    load = db.query(Load).filter(Load.id == load_id).first()
    
    if not load:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Load not found"
        )
    
    if load.status != LoadStatus.POSTED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Load is not available for claiming"
        )
    
    # Assign driver and update status
    load.driver_id = current_user.id
    load.status = LoadStatus.CLAIMED
    load.updated_at = datetime.now()
    
    db.commit()
    db.refresh(load)
    
    return {"message": "Load claimed successfully", "load_id": load.id} 