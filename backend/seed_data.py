from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base, User, Load, Message, UserType, LoadStatus
from passlib.context import CryptContext
import json
from datetime import datetime, timedelta

# Create tables
Base.metadata.create_all(bind=engine)

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def create_demo_data():
    """Create demo data as specified in PRD"""
    db = SessionLocal()
    
    try:
        # Create demo users
        
        # Load Owners
        load_owner1 = User(
            name="Sarah Johnson",
            email="sarah@example.com",
            phone="+1-555-0101",
            user_type=UserType.LOAD_OWNER,
            hashed_password=hash_password("demo123"),
            location="Downtown Seattle, WA"
        )
        
        load_owner2 = User(
            name="Mike Chen",
            email="mike@example.com", 
            phone="+1-555-0102",
            user_type=UserType.LOAD_OWNER,
            hashed_password=hash_password("demo123"),
            location="Portland, OR"
        )
        
        # Drivers
        driver1 = User(
            name="Tom Rodriguez",
            email="tom@example.com",
            phone="+1-555-0201",
            user_type=UserType.DRIVER,
            hashed_password=hash_password("demo123"),
            vehicle_info=json.dumps({
                "type": "Pickup Truck",
                "capacity": "1000 kg",
                "dimensions": "200x150x100 cm"
            }),
            service_area="Seattle Metro Area",
            license_info="CDL-A WA123456"
        )
        
        driver2 = User(
            name="Lisa Wong",
            email="lisa@example.com",
            phone="+1-555-0202", 
            user_type=UserType.DRIVER,
            hashed_password=hash_password("demo123"),
            vehicle_info=json.dumps({
                "type": "Box Truck",
                "capacity": "2000 kg",
                "dimensions": "400x200x200 cm"
            }),
            service_area="Pacific Northwest",
            license_info="CDL-B OR789012"
        )
        
        # Add users to database
        db.add_all([load_owner1, load_owner2, driver1, driver2])
        db.commit()
        
        # Create demo loads (from PRD)
        loads = [
            Load(
                owner_id=load_owner1.id,
                title="Moving a vintage piano across town",
                description="Need to transport a 1920s baby grand piano from my current home to new apartment. Very delicate and valuable. Requires experienced movers.",
                pickup_location="Capitol Hill, Seattle, WA",
                delivery_location="Ballard, Seattle, WA", 
                weight=300.0,
                dimensions="150x140x100 cm",
                pickup_date=datetime.now() + timedelta(days=3),
                special_requirements="Fragile, requires piano moving equipment",
                status=LoadStatus.POSTED
            ),
            Load(
                owner_id=load_owner2.id,
                title="Transport art installation pieces",
                description="Moving large metal sculptures for gallery exhibition. 5 pieces total, some are quite heavy and awkward shapes.",
                pickup_location="Artist Studio, Portland, OR",
                delivery_location="Downtown Gallery, Seattle, WA",
                weight=800.0,
                dimensions="Various sizes, largest: 300x200x150 cm",
                pickup_date=datetime.now() + timedelta(days=5),
                special_requirements="Fragile artwork, needs padding and careful handling",
                status=LoadStatus.POSTED
            ),
            Load(
                owner_id=load_owner1.id,
                title="Deliver restaurant equipment",
                description="Commercial kitchen equipment delivery - includes industrial oven, prep tables, and refrigeration unit.",
                pickup_location="Restaurant Supply Store, Tacoma, WA",
                delivery_location="New Restaurant Location, Bellevue, WA",
                weight=1200.0,
                dimensions="Multiple items, largest: 180x90x200 cm",
                pickup_date=datetime.now() + timedelta(days=7),
                special_requirements="Heavy items, loading dock access required",
                status=LoadStatus.POSTED
            ),
            Load(
                owner_id=load_owner2.id,
                title="Move furniture for apartment relocation",
                description="Complete apartment move - sofa, dining set, bedroom furniture, boxes. Moving from 2BR to 1BR so some items need storage.",
                pickup_location="Apartment 3B, Portland, OR",
                delivery_location="New Apartment, Vancouver, WA",
                weight=600.0,
                dimensions="Full apartment worth, largest item: 220x100x90 cm",
                pickup_date=datetime.now() + timedelta(days=10),
                special_requirements="Some items fragile, need moving blankets",
                status=LoadStatus.POSTED
            ),
            # Demo load for the specific scenario in PRD
            Load(
                owner_id=load_owner1.id,
                title="Vintage motorcycle transport",
                description="1975 Honda CB750 needs transport from seller to my garage. Bike is not running, will need to be loaded/unloaded carefully.",
                pickup_location="Garage Sale, Everett, WA", 
                delivery_location="My Garage, Renton, WA",
                weight=220.0,
                dimensions="210x80x120 cm",
                pickup_date=datetime.now() + timedelta(days=1),
                special_requirements="Non-running motorcycle, needs ramp loading",
                status=LoadStatus.CLAIMED,
                driver_id=driver1.id  # Pre-claimed for demo
            )
        ]
        
        # Add loads to database
        db.add_all(loads)
        db.commit()
        
        # Create some demo messages for the claimed load
        demo_messages = [
            Message(
                load_id=loads[4].id,  # vintage motorcycle
                sender_id=driver1.id,
                message="Hi! I've claimed your motorcycle transport request. I have experience with vintage bikes and a proper ramp. When would be best for pickup?"
            ),
            Message(
                load_id=loads[4].id,
                sender_id=load_owner1.id,
                message="Great! Tomorrow afternoon around 2 PM would work well. The bike is in the garage at the address listed. Thanks for being careful with it!"
            ),
            Message(
                load_id=loads[4].id,
                sender_id=driver1.id,
                message="Perfect! I'll be there at 2 PM tomorrow with my truck and proper equipment. See you then!"
            )
        ]
        
        db.add_all(demo_messages)
        db.commit()
        
        print("Demo data created successfully!")
        print(f"Created {len([load_owner1, load_owner2, driver1, driver2])} users")
        print(f"Created {len(loads)} loads")
        print(f"Created {len(demo_messages)} messages")
        
    except Exception as e:
        db.rollback()
        print(f"Error creating demo data: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    create_demo_data() 