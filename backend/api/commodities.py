"""
NEXUS TERMINAL — Commodities & Forex API Router
Endpoints:
  GET /api/commodities/all     - All commodities pricing (Gold, Silver, Crude, Gas, Cotton)
  GET /api/commodities/forex   - Forex cross rates matrix (USD/INR, EUR/INR, GBP/INR, $DXY)
  GET /api/commodities/summary - Aggregate market summary metrics
"""

from fastapi import APIRouter
from providers.commodities_forex_provider import CommoditiesForexProvider

router = APIRouter()

@router.get("/all")
def get_all_commodities():
    """Get all commodities pricing (Gold, Silver, Crude, Natural Gas, Copper, Cotton)."""
    return CommoditiesForexProvider.get_all_commodities()

@router.get("/forex")
def get_forex_matrix():
    """Get Forex cross rates matrix (USD/INR, EUR/INR, GBP/INR, JPY/INR, $DXY Index)."""
    return CommoditiesForexProvider.get_forex_matrix()

@router.get("/summary")
def get_commodities_summary():
    """Get aggregate commodities and forex summary metrics."""
    return CommoditiesForexProvider.get_summary()
