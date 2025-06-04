from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from pydantic import BaseModel
from typing import List

router = APIRouter()

class MessageCreate(BaseModel):
    load_id: int
    message: str

@router.post("/")
async def send_message(message: MessageCreate, db: Session = Depends(get_db)):
    """Send a message between load owner and driver"""
    return {"message": "Message sending endpoint - implementation coming next"}

@router.get("/load/{load_id}")
async def get_messages(load_id: int, db: Session = Depends(get_db)):
    """Get all messages for a specific load"""
    return {"message": f"Message history endpoint for load {load_id} - implementation coming next"} 