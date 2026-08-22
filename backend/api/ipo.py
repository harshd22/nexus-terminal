"""
NEXUS TERMINAL — IPO API Router
Endpoints for Upcoming, Active, and Listed IPOs with GMP, Subscription stats, and Registrar information.
"""

from typing import Optional
from fastapi import APIRouter, HTTPException, Query
from providers.ipo_provider import IPOProvider

router = APIRouter()


@router.get("", summary="Get list of IPOs")
async def get_ipos(
    status: Optional[str] = Query(None, description="Filter by status: active, upcoming, listed, all"),
    category: Optional[str] = Query(None, description="Filter by category: mainboard, sme, all")
):
    """Retrieve tracked Indian Mainboard & SME IPOs with live GMP and subscription metrics."""
    return IPOProvider.get_all_ipos(status=status, category=category)


@router.get("/summary", summary="Get IPO summary metrics")
async def get_ipo_summary():
    """Retrieve aggregate market statistics for IPOs."""
    return IPOProvider.get_summary()


@router.get("/{ipo_id}", summary="Get detailed information for a specific IPO")
async def get_ipo_detail(ipo_id: str):
    """Retrieve deep prospectus, subscription, timeline, and registrar data for a specific IPO."""
    ipo = IPOProvider.get_ipo_by_id(ipo_id)
    if not ipo:
        raise HTTPException(status_code=404, detail=f"IPO with id or symbol '{ipo_id}' not found.")
    return ipo
