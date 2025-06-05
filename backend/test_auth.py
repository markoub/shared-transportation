import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database import Base, get_db, User, UserType
from main import app
import json

# Create test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

@pytest.fixture(scope="function")
def setup_database():
    # Create tables
    Base.metadata.create_all(bind=engine)
    yield
    # Drop tables
    Base.metadata.drop_all(bind=engine)

class TestUserAuthentication:
    
    def test_register_load_owner_success(self, setup_database):
        """Test successful load owner registration"""
        user_data = {
            "name": "John Doe",
            "email": "john@example.com",
            "phone": "+1-555-0123",
            "user_type": "load_owner",
            "password": "password123",
            "location": "Seattle, WA"
        }
        
        response = client.post("/api/auth/register", json=user_data)
        
        assert response.status_code == 201
        data = response.json()
        assert "access_token" in data
        assert "user" in data
        assert data["user"]["email"] == "john@example.com"
        assert data["user"]["user_type"] == "load_owner"
        assert "id" in data["user"]
        assert "hashed_password" not in data["user"]  # Password should not be returned
    
    def test_register_driver_success(self, setup_database):
        """Test successful driver registration"""
        user_data = {
            "name": "Jane Smith",
            "email": "jane@example.com",
            "phone": "+1-555-0124",
            "user_type": "driver",
            "password": "password123",
            "license_info": "CDL-A WA123456",
            "service_area": "Seattle Metro Area",
            "vehicle_info": {
                "type": "Pickup Truck",
                "capacity": 1000,
                "dimensions": "200x150x100"
            }
        }
        
        response = client.post("/api/auth/register", json=user_data)
        
        assert response.status_code == 201
        data = response.json()
        assert "access_token" in data
        assert "user" in data
        assert data["user"]["email"] == "jane@example.com"
        assert data["user"]["user_type"] == "driver"
        assert "id" in data["user"]
        assert "license_info" in data["user"]
        assert "service_area" in data["user"]
        assert "vehicle_info" in data["user"]
    
    def test_register_duplicate_email(self, setup_database):
        """Test registration with duplicate email fails"""
        user_data = {
            "name": "John Doe",
            "email": "john@example.com",
            "phone": "+1-555-0123",
            "user_type": "load_owner",
            "password": "password123"
        }
        
        # First registration should succeed
        response1 = client.post("/api/auth/register", json=user_data)
        assert response1.status_code == 201
        
        # Second registration with same email should fail
        response2 = client.post("/api/auth/register", json=user_data)
        assert response2.status_code == 400
        assert "Email already registered" in response2.json()["detail"]
    
    def test_register_invalid_user_type(self, setup_database):
        """Test registration with invalid user type fails"""
        user_data = {
            "name": "John Doe",
            "email": "john@example.com",
            "phone": "+1-555-0123",
            "user_type": "invalid_type",
            "password": "password123"
        }
        
        response = client.post("/api/auth/register", json=user_data)
        assert response.status_code == 422  # Validation error
    
    def test_register_missing_fields(self, setup_database):
        """Test registration with missing required fields fails"""
        user_data = {
            "name": "John Doe",
            "email": "john@example.com"
            # Missing phone, user_type, password
        }
        
        response = client.post("/api/auth/register", json=user_data)
        assert response.status_code == 422  # Validation error
    
    def test_login_success(self, setup_database):
        """Test successful login"""
        # First register a user
        user_data = {
            "name": "John Doe",
            "email": "john@example.com",
            "phone": "+1-555-0123",
            "user_type": "load_owner",
            "password": "password123"
        }
        client.post("/api/auth/register", json=user_data)
        
        # Then login
        login_data = {
            "email": "john@example.com",
            "password": "password123"
        }
        
        response = client.post("/api/auth/login", json=login_data)
        
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["user"]["email"] == "john@example.com"
        assert data["user"]["user_type"] == "load_owner"
    
    def test_login_invalid_email(self, setup_database):
        """Test login with non-existent email fails"""
        login_data = {
            "email": "nonexistent@example.com",
            "password": "password123"
        }
        
        response = client.post("/api/auth/login", json=login_data)
        assert response.status_code == 401
        assert "Invalid credentials" in response.json()["detail"]
    
    def test_login_invalid_password(self, setup_database):
        """Test login with wrong password fails"""
        # First register a user
        user_data = {
            "name": "John Doe",
            "email": "john@example.com",
            "phone": "+1-555-0123",
            "user_type": "load_owner",
            "password": "password123"
        }
        client.post("/api/auth/register", json=user_data)
        
        # Then try login with wrong password
        login_data = {
            "email": "john@example.com",
            "password": "wrongpassword"
        }
        
        response = client.post("/api/auth/login", json=login_data)
        assert response.status_code == 401
        assert "Invalid credentials" in response.json()["detail"]
    
    def test_protected_endpoint_requires_authentication(self, setup_database):
        """Test that protected endpoints require authentication"""
        # Try to access a protected endpoint without token
        response = client.get("/api/auth/me")
        assert response.status_code == 403  # FastAPI HTTPBearer returns 403 when no token provided
    
    def test_protected_endpoint_with_valid_token(self, setup_database):
        """Test accessing protected endpoint with valid token"""
        # Register and login to get token
        user_data = {
            "name": "John Doe",
            "email": "john@example.com",
            "phone": "+1-555-0123",
            "user_type": "load_owner",
            "password": "password123"
        }
        client.post("/api/auth/register", json=user_data)
        
        login_data = {
            "email": "john@example.com",
            "password": "password123"
        }
        login_response = client.post("/api/auth/login", json=login_data)
        token = login_response.json()["access_token"]
        
        # Use token to access protected endpoint
        headers = {"Authorization": f"Bearer {token}"}
        response = client.get("/api/auth/me", headers=headers)
        
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == "john@example.com"
    
    def test_logout_functionality(self, setup_database):
        """Test logout functionality"""
        # Register and login first
        user_data = {
            "name": "John Doe",
            "email": "john@example.com",
            "phone": "+1-555-0123",
            "user_type": "load_owner",
            "password": "password123"
        }
        client.post("/api/auth/register", json=user_data)
        
        login_data = {
            "email": "john@example.com",
            "password": "password123"
        }
        login_response = client.post("/api/auth/login", json=login_data)
        token = login_response.json()["access_token"]
        
        # Logout
        headers = {"Authorization": f"Bearer {token}"}
        response = client.post("/api/auth/logout", headers=headers)
        
        assert response.status_code == 200
        assert "Successfully logged out" in response.json()["message"]
    
    def test_password_hashing(self, setup_database):
        """Test that passwords are properly hashed in database"""
        user_data = {
            "name": "John Doe",
            "email": "john@example.com",
            "phone": "+1-555-0123",
            "user_type": "load_owner",
            "password": "password123"
        }
        
        response = client.post("/api/auth/register", json=user_data)
        assert response.status_code == 201
        
        # Check that password is hashed in database
        db = TestingSessionLocal()
        user = db.query(User).filter(User.email == "john@example.com").first()
        assert user is not None
        assert user.hashed_password != "password123"  # Password should be hashed
        assert user.hashed_password.startswith("$2b$")  # bcrypt hash format
        db.close() 