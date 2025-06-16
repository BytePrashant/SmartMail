from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging
import uvicorn

from app.core.config import settings
from app.api.routes import router as api_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(api_router)

@app.get("/")
async def root():
    """Root endpoint - redirects to API docs."""
    return {
        "message": f"Welcome to {settings.PROJECT_NAME}",
        "docs_url": "/docs",
        "api_url": settings.API_V1_STR
    }

if __name__ == "__main__":
    logger.info(f"Starting {settings.PROJECT_NAME} API server...")
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
    
