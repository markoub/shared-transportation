from sqlalchemy import create_engine, Column, Integer, String, DateTime, Text, ForeignKey, Enum, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy.sql import func
from decouple import config
import enum

# Database configuration
DATABASE_URL = config('DATABASE_URL', default='sqlite:///./shared_transport.db')

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Enums
class UserType(enum.Enum):
    LOAD_OWNER = "load_owner"
    DRIVER = "driver"

class LoadStatus(enum.Enum):
    POSTED = "posted"
    CLAIMED = "claimed"
    ACCEPTED = "accepted"
    IN_TRANSIT = "in_transit"
    DELIVERED = "delivered"

# Database Models
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    phone = Column(String(20), nullable=False)
    user_type = Column(Enum(UserType), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    
    # Driver-specific fields (JSON stored as text)
    vehicle_info = Column(Text, nullable=True)  # JSON: {type, capacity, dimensions}
    service_area = Column(String(200), nullable=True)
    license_info = Column(String(100), nullable=True)
    
    # Location for load owners
    location = Column(String(200), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    owned_loads = relationship("Load", foreign_keys="Load.owner_id", back_populates="owner")
    driver_loads = relationship("Load", foreign_keys="Load.driver_id", back_populates="driver")
    sent_messages = relationship("Message", back_populates="sender")

class Load(Base):
    __tablename__ = "loads"
    
    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    driver_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    pickup_location = Column(String(300), nullable=False)
    delivery_location = Column(String(300), nullable=False)
    status = Column(Enum(LoadStatus), default=LoadStatus.POSTED)
    
    weight = Column(Float, nullable=True)  # in kg
    dimensions = Column(String(100), nullable=True)  # "LxWxH in cm"
    pickup_date = Column(DateTime, nullable=True)
    
    special_requirements = Column(Text, nullable=True)
    images = Column(Text, nullable=True)  # JSON array of image URLs
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    owner = relationship("User", foreign_keys=[owner_id], back_populates="owned_loads")
    driver = relationship("User", foreign_keys=[driver_id], back_populates="driver_loads")
    messages = relationship("Message", back_populates="load")

class Message(Base):
    __tablename__ = "messages"
    
    id = Column(Integer, primary_key=True, index=True)
    load_id = Column(Integer, ForeignKey("loads.id"), nullable=False)
    sender_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    message = Column(Text, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    load = relationship("Load", back_populates="messages")
    sender = relationship("User", back_populates="sent_messages")

# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 