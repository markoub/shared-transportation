from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from pydantic import BaseModel

router = APIRouter()

class UserCreate(BaseModel):
    name: str
    email: str
    phone: str
    user_type: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

@router.post("/register")
async def register_user(user: UserCreate, db: Session = Depends(get_db)):
    """Register a new user (load owner or driver)"""
    return {"message": "User registration endpoint - implementation coming next"}

@router.post("/login")
async def login_user(credentials: UserLogin, db: Session = Depends(get_db)):
    """Authenticate user and return access token"""
    return {"message": "User login endpoint - implementation coming next"}

@router.post("/logout")
async def logout_user():
    """Logout user"""
    return {"message": "User logout endpoint - implementation coming next"} 