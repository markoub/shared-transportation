# Shared Transportation Platform

A platform that connects people who need to transport unusual or heavy loads with truck/van owners who can provide the service. Think "Uber for weird stuff that doesn't fit in regular cars."

## Project Structure

```
shared-transportation/
├── backend/           # FastAPI Python backend
├── frontend/          # Next.js React frontend  
├── testing/           # Playwright e2e tests
├── PRD.md            # Product Requirements Document
└── README.md         # This file
```

## Features Implemented (Issue #1)

✅ **Project Structure Setup**
- Backend folder with FastAPI Python setup
- Frontend folder with Next.js initialization
- Testing folder for Playwright e2e tests

✅ **Database Schema**
- Users table (id, name, email, phone, user_type, vehicle_info)
- Loads table (id, owner_id, driver_id, title, description, pickup_location, delivery_location, status, weight, dimensions, pickup_date)
- Messages table (id, load_id, sender_id, message, timestamp)

✅ **Demo Data**
- Sample users (load owners and drivers)
- Demo loads including "vintage piano", "art installation", "restaurant equipment", "furniture move", and "vintage motorcycle"
- Sample messages for demonstration

✅ **Dependencies**
- Backend: requirements.txt with FastAPI, SQLAlchemy, authentication, testing
- Frontend: package.json with Next.js, React, Tailwind CSS, TypeScript

✅ **Basic API Structure**
- Authentication endpoints (/api/auth/register, /api/auth/login)
- Load management endpoints (/api/loads/)
- Messaging endpoints (/api/messages/)

✅ **Frontend Homepage**
- Clean, modern UI with Tailwind CSS
- Separate sections for Load Owners and Drivers
- Navigation to registration and login

✅ **End-to-End Testing**
- Playwright tests covering API endpoints
- Frontend functionality tests
- Database seeding verification

## Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Seed demo data
python seed_data.py

# Start the server
uvicorn main:app --reload --port 8000
```

The backend will be available at http://localhost:8000

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at http://localhost:3000

### Running Tests

```bash
cd testing
npm install
npx playwright install
npm test
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Loads
- `GET /api/loads/` - List all loads
- `POST /api/loads/` - Create new load
- `GET /api/loads/{id}` - Get load details
- `POST /api/loads/{id}/claim` - Claim a load (driver)

### Messages
- `POST /api/messages/` - Send message
- `GET /api/messages/load/{load_id}` - Get messages for load

## Demo Data

The system comes pre-populated with:

**Users:**
- Sarah Johnson (Load Owner) - sarah@example.com
- Mike Chen (Load Owner) - mike@example.com  
- Tom Rodriguez (Driver) - tom@example.com
- Lisa Wong (Driver) - lisa@example.com

**Demo Loads:**
- Moving a vintage piano across town
- Transport art installation pieces
- Deliver restaurant equipment
- Move furniture for apartment relocation
- Vintage motorcycle transport (pre-claimed for demo)

All demo accounts use password: `demo123`

## Technology Stack

**Backend:**
- FastAPI (Python web framework)
- SQLAlchemy (ORM)
- SQLite (Database)
- Pydantic (Data validation)
- Passlib + bcrypt (Password hashing)

**Frontend:**
- Next.js 15 (React framework)
- TypeScript
- Tailwind CSS (Styling)
- Axios (HTTP client)

**Testing:**
- Playwright (E2E testing)
- pytest (Backend unit tests)

## Development Status

This implements **Issue #1: Set up project structure and database** which includes:

- ✅ Project folder structure
- ✅ Database schema and models
- ✅ Basic API endpoints (placeholder implementations)
- ✅ Frontend homepage and navigation
- ✅ Demo data seeding
- ✅ End-to-end testing setup
- ✅ Both frontend and backend can start without errors

## Next Steps

The foundation is now ready for implementing the core features:
- Issue #2: User authentication system
- Issue #3: Load posting functionality  
- Issue #4: Load browsing for drivers
- Issue #5: Load claiming system

## Contributing

1. Each feature should be implemented in a separate branch
2. Write tests first, then implement functionality
3. Ensure all tests pass before merging
4. Follow the existing code structure and patterns 