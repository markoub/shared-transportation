from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from database import get_db, User, UserType
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
import json

router = APIRouter()

# Security configurations
security = HTTPBearer()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT Configuration
SECRET_KEY = "your-secret-key-here"  # In production, use environment variable
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    user_type: str
    password: str
    # Load owner specific fields
    location: Optional[str] = None
    # Driver specific fields
    license_info: Optional[str] = None
    service_area: Optional[str] = None
    vehicle_info: Optional[Dict[str, Any]] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: str
    user_type: str
    location: Optional[str] = None
    license_info: Optional[str] = None
    service_area: Optional[str] = None
    vehicle_info: Optional[Dict[str, Any]] = None
    created_at: datetime

class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# Utility functions
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
    return user

def format_user_response(user: User) -> UserResponse:
    """Format user for response, including vehicle_info parsing for drivers"""
    vehicle_info = None
    if user.vehicle_info:
        try:
            vehicle_info = json.loads(user.vehicle_info)
        except json.JSONDecodeError:
            vehicle_info = None
    
    return UserResponse(
        id=user.id,
        name=user.name,
        email=user.email,
        phone=user.phone,
        user_type=user.user_type.value,
        location=user.location,
        license_info=user.license_info,
        service_area=user.service_area,
        vehicle_info=vehicle_info,
        created_at=user.created_at
    )

@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def register_user(user: UserCreate, db: Session = Depends(get_db)):
    """Register a new user (load owner or driver)"""
    
    # Check if email already exists
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Validate user type
    try:
        user_type_enum = UserType(user.user_type)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Invalid user type. Must be 'load_owner' or 'driver'"
        )
    
    # Hash password
    hashed_password = hash_password(user.password)
    
    # Prepare vehicle info for drivers
    vehicle_info_json = None
    if user.vehicle_info:
        vehicle_info_json = json.dumps(user.vehicle_info)
    
    # Create user
    db_user = User(
        name=user.name,
        email=user.email,
        phone=user.phone,
        user_type=user_type_enum,
        hashed_password=hashed_password,
        location=user.location,
        license_info=user.license_info,
        service_area=user.service_area,
        vehicle_info=vehicle_info_json
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": db_user.email}, expires_delta=access_token_expires
    )
    
    # Format response
    user_response = format_user_response(db_user)
    
    return AuthResponse(
        access_token=access_token,
        user=user_response
    )

@router.post("/login", response_model=AuthResponse)
async def login_user(credentials: UserLogin, db: Session = Depends(get_db)):
    """Authenticate user and return access token"""
    
    # Find user by email
    user = db.query(User).filter(User.email == credentials.email).first()
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    # Format response
    user_response = format_user_response(user)
    
    return AuthResponse(
        access_token=access_token,
        user=user_response
    )

@router.post("/logout")
async def logout_user(current_user: User = Depends(get_current_user)):
    """Logout user (client-side token invalidation)"""
    return {"message": "Successfully logged out"}

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user information"""
    return format_user_response(current_user) 