from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

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

@router.post("/")
async def create_load(load: LoadCreate, db: Session = Depends(get_db)):
    """Create a new load request"""
    return {"message": "Load creation endpoint - implementation coming next"}

@router.get("/")
async def get_loads(db: Session = Depends(get_db)):
    """Get all available loads"""
    return {"message": "Load listing endpoint - implementation coming next"}

@router.get("/{load_id}")
async def get_load(load_id: int, db: Session = Depends(get_db)):
    """Get specific load details"""
    return {"message": f"Load details endpoint for ID {load_id} - implementation coming next"}

@router.post("/{load_id}/claim")
async def claim_load(load_id: int, db: Session = Depends(get_db)):
    """Claim a load (driver action)"""
    return {"message": f"Load claiming endpoint for ID {load_id} - implementation coming next"} 