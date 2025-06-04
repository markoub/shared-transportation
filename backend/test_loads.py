import pytest
import requests
import json
from datetime import datetime, timedelta

BASE_URL = "http://localhost:8000"

class TestLoadPosting:
    """Test suite for load posting functionality - Issue #3"""
    
    @classmethod
    def setup_class(cls):
        """Set up test data"""
        cls.load_owner_data = {
            "name": "Test Load Owner",
            "email": "loadowner@test.com",
            "phone": "+1-555-0123",
            "user_type": "load_owner",
            "password": "testpass123",
            "location": "Seattle, WA"
        }
        
        cls.driver_data = {
            "name": "Test Driver",
            "email": "driver@test.com", 
            "phone": "+1-555-0124",
            "user_type": "driver",
            "password": "testpass123",
            "license_info": "CDL-A",
            "vehicle_type": "Box Truck",
            "vehicle_capacity": "5000",
            "vehicle_dimensions": "6x3x3 meters",
            "service_area": "Seattle Metro Area"
        }
        
        cls.valid_load_data = {
            "title": "Test Load - Moving Piano",
            "description": "Need to move a baby grand piano from my house to new apartment. Very delicate and valuable.",
            "pickup_location": "123 Main St, Seattle, WA",
            "delivery_location": "456 Oak Ave, Bellevue, WA",
            "weight": 300.0,
            "dimensions": "150x140x100 cm",
            "pickup_date": (datetime.now() + timedelta(days=1)).isoformat(),
            "special_requirements": "Fragile, requires piano moving equipment"
        }
        
        # Register test users
        requests.post(f"{BASE_URL}/api/auth/register", json=cls.load_owner_data)
        requests.post(f"{BASE_URL}/api/auth/register", json=cls.driver_data)
        
        # Login and get tokens
        login_response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": cls.load_owner_data["email"],
            "password": cls.load_owner_data["password"]
        })
        cls.load_owner_token = login_response.json()["access_token"]
        
        login_response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": cls.driver_data["email"],
            "password": cls.driver_data["password"]
        })
        cls.driver_token = login_response.json()["access_token"]

    def test_create_load_success(self):
        """Test successful load creation"""
        headers = {"Authorization": f"Bearer {self.load_owner_token}"}
        response = requests.post(f"{BASE_URL}/api/loads/", json=self.valid_load_data, headers=headers)
        
        assert response.status_code == 201
        data = response.json()
        assert data["title"] == self.valid_load_data["title"]
        assert data["description"] == self.valid_load_data["description"]
        assert data["pickup_location"] == self.valid_load_data["pickup_location"]
        assert data["delivery_location"] == self.valid_load_data["delivery_location"]
        assert data["weight"] == self.valid_load_data["weight"]
        assert data["dimensions"] == self.valid_load_data["dimensions"]
        assert data["special_requirements"] == self.valid_load_data["special_requirements"]
        assert data["status"] == "posted"
        assert "id" in data
        assert "created_at" in data
        assert "owner_id" in data

    def test_create_load_requires_authentication(self):
        """Test that load creation requires authentication"""
        response = requests.post(f"{BASE_URL}/api/loads/", json=self.valid_load_data)
        assert response.status_code == 401

    def test_create_load_requires_load_owner(self):
        """Test that only load owners can create loads"""
        headers = {"Authorization": f"Bearer {self.driver_token}"}
        response = requests.post(f"{BASE_URL}/api/loads/", json=self.valid_load_data, headers=headers)
        assert response.status_code == 403
        assert "Only load owners can create loads" in response.json()["detail"]

    def test_create_load_validation_required_fields(self):
        """Test validation for required fields"""
        headers = {"Authorization": f"Bearer {self.load_owner_token}"}
        
        # Test missing title
        invalid_data = self.valid_load_data.copy()
        del invalid_data["title"]
        response = requests.post(f"{BASE_URL}/api/loads/", json=invalid_data, headers=headers)
        assert response.status_code == 422
        
        # Test missing description
        invalid_data = self.valid_load_data.copy()
        del invalid_data["description"]
        response = requests.post(f"{BASE_URL}/api/loads/", json=invalid_data, headers=headers)
        assert response.status_code == 422
        
        # Test missing pickup_location
        invalid_data = self.valid_load_data.copy()
        del invalid_data["pickup_location"]
        response = requests.post(f"{BASE_URL}/api/loads/", json=invalid_data, headers=headers)
        assert response.status_code == 422
        
        # Test missing delivery_location
        invalid_data = self.valid_load_data.copy()
        del invalid_data["delivery_location"]
        response = requests.post(f"{BASE_URL}/api/loads/", json=invalid_data, headers=headers)
        assert response.status_code == 422

    def test_create_load_validation_weight(self):
        """Test weight validation"""
        headers = {"Authorization": f"Bearer {self.load_owner_token}"}
        
        # Test negative weight
        invalid_data = self.valid_load_data.copy()
        invalid_data["weight"] = -10.0
        response = requests.post(f"{BASE_URL}/api/loads/", json=invalid_data, headers=headers)
        assert response.status_code == 422
        assert "Weight must be positive" in str(response.json())

    def test_create_load_validation_pickup_date(self):
        """Test pickup date validation"""
        headers = {"Authorization": f"Bearer {self.load_owner_token}"}
        
        # Test past date
        invalid_data = self.valid_load_data.copy()
        invalid_data["pickup_date"] = (datetime.now() - timedelta(days=1)).isoformat()
        response = requests.post(f"{BASE_URL}/api/loads/", json=invalid_data, headers=headers)
        assert response.status_code == 422
        assert "Pickup date cannot be in the past" in str(response.json())

    def test_create_load_optional_fields(self):
        """Test that optional fields work correctly"""
        headers = {"Authorization": f"Bearer {self.load_owner_token}"}
        
        # Create load with only required fields
        minimal_data = {
            "title": "Minimal Load",
            "description": "Basic description",
            "pickup_location": "Point A",
            "delivery_location": "Point B"
        }
        
        response = requests.post(f"{BASE_URL}/api/loads/", json=minimal_data, headers=headers)
        assert response.status_code == 201
        data = response.json()
        assert data["weight"] is None
        assert data["dimensions"] is None
        assert data["pickup_date"] is None
        assert data["special_requirements"] is None

    def test_get_loads_list(self):
        """Test getting list of all loads"""
        response = requests.get(f"{BASE_URL}/api/loads/")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        # Should contain loads created in previous tests
        assert len(data) >= 1

    def test_get_loads_list_filters_by_status(self):
        """Test filtering loads by status"""
        response = requests.get(f"{BASE_URL}/api/loads/?status=posted")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        # All returned loads should have status 'posted'
        for load in data:
            assert load["status"] == "posted"

    def test_get_load_by_id(self):
        """Test getting specific load by ID"""
        # First create a load
        headers = {"Authorization": f"Bearer {self.load_owner_token}"}
        create_response = requests.post(f"{BASE_URL}/api/loads/", json=self.valid_load_data, headers=headers)
        load_id = create_response.json()["id"]
        
        # Get the load
        response = requests.get(f"{BASE_URL}/api/loads/{load_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == load_id
        assert data["title"] == self.valid_load_data["title"]

    def test_get_load_by_invalid_id(self):
        """Test getting load with invalid ID"""
        response = requests.get(f"{BASE_URL}/api/loads/99999")
        assert response.status_code == 404

    def test_update_load_success(self):
        """Test successful load update"""
        # First create a load
        headers = {"Authorization": f"Bearer {self.load_owner_token}"}
        create_response = requests.post(f"{BASE_URL}/api/loads/", json=self.valid_load_data, headers=headers)
        load_id = create_response.json()["id"]
        
        # Update the load
        update_data = {
            "title": "Updated Load Title",
            "description": "Updated description"
        }
        response = requests.put(f"{BASE_URL}/api/loads/{load_id}", json=update_data, headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == update_data["title"]
        assert data["description"] == update_data["description"]

    def test_update_load_requires_authentication(self):
        """Test that load update requires authentication"""
        response = requests.put(f"{BASE_URL}/api/loads/1", json={"title": "Updated"})
        assert response.status_code == 401

    def test_update_load_requires_ownership(self):
        """Test that only load owner can update their loads"""
        # Create load as load owner
        headers = {"Authorization": f"Bearer {self.load_owner_token}"}
        create_response = requests.post(f"{BASE_URL}/api/loads/", json=self.valid_load_data, headers=headers)
        load_id = create_response.json()["id"]
        
        # Try to update as driver
        driver_headers = {"Authorization": f"Bearer {self.driver_token}"}
        response = requests.put(f"{BASE_URL}/api/loads/{load_id}", json={"title": "Hacked"}, headers=driver_headers)
        assert response.status_code == 403

    def test_delete_load_success(self):
        """Test successful load deletion"""
        # First create a load
        headers = {"Authorization": f"Bearer {self.load_owner_token}"}
        create_response = requests.post(f"{BASE_URL}/api/loads/", json=self.valid_load_data, headers=headers)
        load_id = create_response.json()["id"]
        
        # Delete the load
        response = requests.delete(f"{BASE_URL}/api/loads/{load_id}", headers=headers)
        assert response.status_code == 200
        
        # Verify it's deleted
        get_response = requests.get(f"{BASE_URL}/api/loads/{load_id}")
        assert get_response.status_code == 404

    def test_delete_load_requires_authentication(self):
        """Test that load deletion requires authentication"""
        response = requests.delete(f"{BASE_URL}/api/loads/1")
        assert response.status_code == 401

    def test_delete_load_requires_ownership(self):
        """Test that only load owner can delete their loads"""
        # Create load as load owner
        headers = {"Authorization": f"Bearer {self.load_owner_token}"}
        create_response = requests.post(f"{BASE_URL}/api/loads/", json=self.valid_load_data, headers=headers)
        load_id = create_response.json()["id"]
        
        # Try to delete as driver
        driver_headers = {"Authorization": f"Bearer {self.driver_token}"}
        response = requests.delete(f"{BASE_URL}/api/loads/{load_id}", headers=driver_headers)
        assert response.status_code == 403

    def test_get_user_loads(self):
        """Test getting loads for specific user"""
        headers = {"Authorization": f"Bearer {self.load_owner_token}"}
        
        # Create a load
        requests.post(f"{BASE_URL}/api/loads/", json=self.valid_load_data, headers=headers)
        
        # Get user's loads
        response = requests.get(f"{BASE_URL}/api/loads/my-loads", headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 1
        # All loads should belong to the authenticated user
        for load in data:
            assert load["owner_id"] is not None

if __name__ == "__main__":
    pytest.main([__file__, "-v"]) 