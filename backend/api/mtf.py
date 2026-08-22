"""
NEXUS TERMINAL — MTF Analytics API Router
Exposes /api/mtf endpoints serving data scraped directly from mtf.trading
"""
from fastapi import APIRouter
from providers.mtf_provider import fetch_mtf_data

router = APIRouter(prefix="/api/mtf", tags=["mtf"])


@router.get("")
async def get_mtf_analytics():
    """Returns full MTF dataset from mtf.trading."""
    data = await fetch_mtf_data()
    return data
