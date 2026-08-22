"""
NEXUS TERMINAL — Macroeconomics & Global Economy API Router
Endpoints:
  GET /api/macro/india  - Full breakdown of Indian macro economic indicators
  GET /api/macro/global - Global macroeconomic country comparison matrix
  GET /api/macro/summary - Top aggregate KPI metrics
"""

from fastapi import APIRouter
from providers.macro_provider import MacroProvider

router = APIRouter()

@router.get("/india")
def get_indian_macro_data():
    """Get Indian macroeconomic indicators (GDP, CPI, IIP, Debt, Unemployment, Housing, Rates)."""
    return MacroProvider.get_indian_macro()

@router.get("/global")
def get_global_country_matrix():
    """Get Global macroeconomic comparison matrix (India vs US, China, EU, UK, Japan, Germany)."""
    return MacroProvider.get_global_matrix()

@router.get("/summary")
def get_macro_summary():
    """Get aggregate macroeconomic summary KPIs."""
    return MacroProvider.get_summary()
