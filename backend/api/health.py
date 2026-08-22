"""
NEXUS TERMINAL — Health Check API
"""
from datetime import datetime, timezone
from fastapi import APIRouter
from core.config import settings

router = APIRouter()


@router.get("/api/health")
async def health():
    return {
        "status": "operational",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "version": "1.0.0",
        "demo_mode": settings.demo_mode,
        "kite_configured": settings.kite_configured,
        "ai_configured": settings.ai_configured,
    }
