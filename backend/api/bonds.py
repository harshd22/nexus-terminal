"""
NEXUS TERMINAL — Bonds & Fixed Income API Router
Endpoints:
  GET /api/bonds/yield-curve - G-Sec Yield Curve dataset
  GET /api/bonds/corporate   - High-grade Corporate & PSU bonds
  GET /api/bonds/sgb         - Sovereign Gold Bonds secondary market
  GET /api/bonds/summary     - Aggregate yield & spread summary
"""

from fastapi import APIRouter
from providers.bonds_provider import BondsProvider

router = APIRouter()

@router.get("/yield-curve")
def get_yield_curve():
    """Get Sovereign G-Sec Yield Curve dataset (91D T-Bill to 30Y G-Sec)."""
    return BondsProvider.get_yield_curve()

@router.get("/corporate")
def get_corporate_bonds():
    """Get Corporate & PSU Bonds table with yield spreads."""
    return BondsProvider.get_corporate_bonds()

@router.get("/sgb")
def get_sgb_market():
    """Get Sovereign Gold Bonds (SGB) secondary market pricing & gold parity."""
    return BondsProvider.get_sgb_market()

@router.get("/summary")
def get_bonds_summary():
    """Get aggregate bond market summary metrics."""
    return BondsProvider.get_summary()
