# Load Sharing App - Product Requirements Document

## Overview
A platform that connects people who need to transport unusual or heavy loads with truck/van owners who can provide the service. Think "Uber for weird stuff that doesn't fit in regular cars."

## Core User Types
- **Load Owners**: People who need something transported
- **Drivers**: Truck/van owners who can transport loads

## MVP Features for Demo

### 1. User Registration & Profiles
**Load Owners:**
- Basic signup (name, email, phone)
- Location (pickup address)

**Drivers:**
- Basic signup (name, email, phone, license info)
- Vehicle details (truck type, max weight capacity, dimensions)
- Service area (city/region they operate in)

### 2. Post Load Request
**Load Owner can create a request with:**
- Load description (what needs to be moved)
- Dimensions and estimated weight
- Pickup location and address
- Delivery location and address
- Preferred pickup date/time
- Load photos (optional)
- Special requirements (fragile, hazardous, etc.)

### 3. Browse & Search Loads
**Drivers can:**
- View all available load requests in their area
- Filter by:
  - Weight range
  - Distance
  - Date range
  - Load type
- See load details and photos

### 4. Booking System
- Driver can "claim" a load request
- Load owner receives notification
- Load owner can accept or decline the driver
- Simple status tracking: Posted → Claimed → Accepted → In Transit → Delivered

### 5. Basic Communication
- In-app messaging between load owner and driver
- Phone number reveal after booking acceptance

### 6. Simple Dashboard
**Load Owners:**
- View their posted requests
- Track status of current loads
- Message their assigned driver

**Drivers:**
- View claimed/accepted loads
- Update delivery status
- Message load owners

## Technical Requirements (Demo-Focused)

### Database Tables (minimum)
- Users (id, name, email, phone, user_type, vehicle_info)
- Loads (id, owner_id, driver_id, title, description, pickup_location, delivery_location, status, weight, dimensions, pickup_date)
- Messages (id, load_id, sender_id, message, timestamp)

### Key Pages/Screens
1. Login/Signup
2. Dashboard (different for load owners vs drivers)
3. Post Load Request form
4. Browse Loads (driver view)
5. Load Details page
6. Simple messaging interface

### Demo Data
Pre-populate with sample loads:
- "Moving a vintage piano across town"
- "Transport art installation pieces"
- "Deliver restaurant equipment"
- "Move furniture for apartment relocation"

## Success Metrics for Demo
- User can post a load request in under 2 minutes
- Driver can find and claim a load in under 1 minute
- Basic end-to-end flow from posting to acceptance works smoothly

## Out of Scope (for demo)
- Payment processing
- Real-time GPS tracking
- Driver background checks
- Insurance handling
- Review/rating system
- Mobile app (web-only for demo)
- Advanced search filters
- Load scheduling calendar

## Demo Flow Scenario
1. Show load owner posting a "vintage motorcycle transport" request
2. Switch to driver view finding and claiming the load
3. Show load owner accepting the driver
4. Demonstrate basic messaging between parties
5. Show status updates (pickup → delivery)

## Implementation Priority
1. **Phase 1**: User auth, load posting, basic viewing
2. **Phase 2**: Claiming/booking system, status updates
3. **Phase 3**: Messaging, dashboard improvements

---

**Goal**: Create a working prototype that demonstrates the core value proposition in 15-20 minutes of development time with clean, intuitive UX that clearly shows how the platform solves the "weird load transport" problem.