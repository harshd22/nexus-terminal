"""
NEXUS TERMINAL — Portfolio API
GET /api/portfolio
GET /api/portfolio/holdings
GET /api/portfolio/positions
GET /api/portfolio/allocation
GET /api/portfolio/health
"""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from database.db import get_db
from database.models import Holding, Position
from engines.portfolio import compute_portfolio_stats, compute_allocation, compute_portfolio_health
from providers.kite_provider import get_holdings_from_kite, get_positions_from_kite
from core.config import settings

router = APIRouter()


async def _get_holdings(db: AsyncSession) -> list[dict]:
    if settings.kite_configured:
        return await get_holdings_from_kite()
    # Demo mode — read from DB (seeded demo data)
    result = await db.execute(select(Holding).order_by(Holding.symbol))
    rows = result.scalars().all()
    return [
        {
            "symbol": h.symbol,
            "quantity": h.quantity,
            "avg_price": h.avg_price,
            "current_price": h.current_price,
            "pnl": h.pnl,
            "day_pnl": h.day_pnl,
            "source": "DEMO_DATA",
        }
        for h in rows
    ]


@router.get("")
async def portfolio_overview(db: AsyncSession = Depends(get_db)):
    holdings = await _get_holdings(db)
    stats = compute_portfolio_stats(holdings)
    return {
        **stats,
        "demo_mode": settings.demo_mode,
        "source": "Kite Connect" if settings.kite_configured else "DEMO_DATA",
    }


@router.get("/holdings")
async def portfolio_holdings(db: AsyncSession = Depends(get_db)):
    holdings = await _get_holdings(db)
    return {
        "holdings": holdings,
        "count": len(holdings),
        "demo_mode": settings.demo_mode,
    }


@router.get("/positions")
async def portfolio_positions(db: AsyncSession = Depends(get_db)):
    if settings.kite_configured:
        positions = await get_positions_from_kite()
    else:
        result = await db.execute(select(Position))
        rows = result.scalars().all()
        positions = [
            {"symbol": p.symbol, "quantity": p.quantity, "avg_price": p.avg_price,
             "current_price": p.current_price, "pnl": p.pnl, "source": "DEMO_DATA"}
            for p in rows
        ]
    return {"positions": positions, "count": len(positions), "demo_mode": settings.demo_mode}


@router.get("/allocation")
async def portfolio_allocation(db: AsyncSession = Depends(get_db)):
    holdings = await _get_holdings(db)
    allocation = compute_allocation(holdings)
    return {"allocation": allocation, "demo_mode": settings.demo_mode}


@router.get("/health")
async def portfolio_health(db: AsyncSession = Depends(get_db)):
    holdings = await _get_holdings(db)
    health = await compute_portfolio_health(holdings, db)
    return {"health": health, "demo_mode": settings.demo_mode}
