"""
NEXUS TERMINAL — Kite Connect OAuth API
GET  /api/kite/login        — Redirect to Kite login
GET  /api/kite/callback     — Handle OAuth callback
GET  /api/kite/status       — Check connection status
POST /api/kite/logout       — Clear session
"""
from fastapi import APIRouter, HTTPException
from fastapi.responses import RedirectResponse
from core.config import settings

router = APIRouter()


@router.get("/login")
async def kite_login():
    if not settings.kite_configured:
        raise HTTPException(
            status_code=503,
            detail="Kite API key not configured. Set KITE_API_KEY in .env",
        )
    login_url = f"https://kite.zerodha.com/connect/login?api_key={settings.kite_api_key}&v=3"
    return RedirectResponse(url=login_url)


@router.get("/callback")
async def kite_callback(request_token: str = None):
    """Exchange request_token for access_token (stored in .env / session)."""
    if not request_token:
        raise HTTPException(status_code=400, detail="Missing request_token")
    if not settings.kite_configured:
        raise HTTPException(status_code=503, detail="Kite not configured")

    from providers.kite_provider import exchange_request_token
    access_token = await exchange_request_token(request_token)
    return {
        "status": "connected",
        "message": "Kite connected. Add the access_token to your .env as KITE_ACCESS_TOKEN",
        "access_token": access_token,
    }


@router.get("/status")
async def kite_status():
    return {
        "configured": settings.kite_configured,
        "connected": bool(settings.kite_access_token),
        "demo_mode": settings.demo_mode,
    }


@router.post("/logout")
async def kite_logout():
    return {"status": "logged_out", "message": "Clear KITE_ACCESS_TOKEN from .env to fully disconnect"}
