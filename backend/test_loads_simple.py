import pytest
import requests
import json
from datetime import datetime, timedelta

BASE_URL = "http://localhost:8000"

class TestLoadPostingSimple:
    """Simplified test suite for load posting functionality - Issue #3"""
    
    @classmethod
    def setup_class(cls):
        """Set up test data"""
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

    def test_create_load_success(self):
        """Test successful load creation"""
        response = requests.post(f"{BASE_URL}/api/loads/", json=self.valid_load_data)
        
        assert response.status_code == 201
        data = response.json()
        
        # Verify response structure
        assert "id" in data
        assert data["title"] == self.valid_load_data["title"]
        assert data["description"] == self.valid_load_data["description"]
        assert data["pickup_location"] == self.valid_load_data["pickup_location"]
        assert data["delivery_location"] == self.valid_load_data["delivery_location"]
        assert data["weight"] == self.valid_load_data["weight"]
        assert data["dimensions"] == self.valid_load_data["dimensions"]
        assert data["special_requirements"] == self.valid_load_data["special_requirements"]
        assert data["status"] == "posted"
        assert data["owner_id"] == 1  # Demo owner ID
        assert data["driver_id"] is None
        assert "created_at" in data
        assert "owner_name" in data
        assert "owner_email" in data
        assert "owner_phone" in data

    def test_create_load_validation_required_fields(self):
        """Test validation for required fields"""
        # Test missing title
        invalid_data = self.valid_load_data.copy()
        del invalid_data["title"]
        
        response = requests.post(f"{BASE_URL}/api/loads/", json=invalid_data)
        assert response.status_code == 422
        
        # Test missing description
        invalid_data = self.valid_load_data.copy()
        del invalid_data["description"]
        
        response = requests.post(f"{BASE_URL}/api/loads/", json=invalid_data)
        assert response.status_code == 422
        
        # Test missing pickup_location
        invalid_data = self.valid_load_data.copy()
        del invalid_data["pickup_location"]
        
        response = requests.post(f"{BASE_URL}/api/loads/", json=invalid_data)
        assert response.status_code == 422
        
        # Test missing delivery_location
        invalid_data = self.valid_load_data.copy()
        del invalid_data["delivery_location"]
        
        response = requests.post(f"{BASE_URL}/api/loads/", json=invalid_data)
        assert response.status_code == 422

    def test_create_load_validation_weight(self):
        """Test weight validation"""
        # Test negative weight
        invalid_data = self.valid_load_data.copy()
        invalid_data["weight"] = -100
        
        response = requests.post(f"{BASE_URL}/api/loads/", json=invalid_data)
        assert response.status_code == 422

    def test_create_load_optional_fields(self):
        """Test load creation with only required fields"""
        minimal_data = {
            "title": "Minimal Load",
            "description": "Basic load with minimal information",
            "pickup_location": "Point A",
            "delivery_location": "Point B"
        }
        
        response = requests.post(f"{BASE_URL}/api/loads/", json=minimal_data)
        assert response.status_code == 201
        
        data = response.json()
        assert data["title"] == minimal_data["title"]
        assert data["weight"] is None
        assert data["dimensions"] is None
        assert data["pickup_date"] is None
        assert data["special_requirements"] is None

    def test_get_loads_list(self):
        """Test retrieving list of loads"""
        response = requests.get(f"{BASE_URL}/api/loads/")
        
        assert response.status_code == 200
        data = response.json()
        
        assert isinstance(data, list)
        assert len(data) > 0  # Should have demo data
        
        # Check structure of first load
        load = data[0]
        required_fields = [
            "id", "owner_id", "title", "description", "pickup_location", 
            "delivery_location", "status", "created_at", "owner_name", 
            "owner_email", "owner_phone"
        ]
        for field in required_fields:
            assert field in load

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
        """Test retrieving a specific load by ID"""
        # First get the list to find a valid ID
        list_response = requests.get(f"{BASE_URL}/api/loads/")
        loads = list_response.json()
        
        if loads:
            load_id = loads[0]["id"]
            response = requests.get(f"{BASE_URL}/api/loads/{load_id}")
            
            assert response.status_code == 200
            data = response.json()
            
            assert data["id"] == load_id
            assert "title" in data
            assert "description" in data

    def test_get_load_by_invalid_id(self):
        """Test retrieving load with invalid ID"""
        response = requests.get(f"{BASE_URL}/api/loads/99999")
        
        assert response.status_code == 404

    def test_update_load_success(self):
        """Test successful load update"""
        # First create a load
        create_response = requests.post(f"{BASE_URL}/api/loads/", json=self.valid_load_data)
        created_load = create_response.json()
        load_id = created_load["id"]
        
        # Update the load
        update_data = {
            "title": "Updated Load Title",
            "description": "Updated description"
        }
        
        response = requests.put(f"{BASE_URL}/api/loads/{load_id}", json=update_data)
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["title"] == update_data["title"]
        assert data["description"] == update_data["description"]
        # Other fields should remain unchanged
        assert data["pickup_location"] == self.valid_load_data["pickup_location"]

    def test_delete_load_success(self):
        """Test successful load deletion"""
        # First create a load
        create_response = requests.post(f"{BASE_URL}/api/loads/", json=self.valid_load_data)
        created_load = create_response.json()
        load_id = created_load["id"]
        
        # Delete the load
        response = requests.delete(f"{BASE_URL}/api/loads/{load_id}")
        
        assert response.status_code == 200
        
        # Verify load is deleted
        get_response = requests.get(f"{BASE_URL}/api/loads/{load_id}")
        assert get_response.status_code == 404

    def test_get_user_loads(self):
        """Test retrieving user's loads"""
        response = requests.get(f"{BASE_URL}/api/loads/my-loads")
        
        assert response.status_code == 200
        data = response.json()
        
        assert isinstance(data, list)

if __name__ == "__main__":
    pytest.main([__file__, "-v"]) 