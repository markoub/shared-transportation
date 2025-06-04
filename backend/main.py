from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import auth, loads, messages

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Shared Transportation API",
    description="API for load sharing platform - connecting load owners with drivers",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["authentication"])
app.include_router(loads.router, prefix="/api/loads", tags=["loads"])
app.include_router(messages.router, prefix="/api/messages", tags=["messages"])

@app.get("/")
async def root():
    return {"message": "Shared Transportation API", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"} 