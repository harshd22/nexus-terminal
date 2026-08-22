"""
NEXUS TERMINAL — Rankings Engine
Computes top performers by 1-year CAGR from price history.
No external ranking service — calculated entirely from stored prices.
"""
from __future__ import annotations
from datetime import date, timedelta
import math
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database.models import Stock, Price
from engines.technicals import _cagr


async def compute_top_performers(
    category: str,  # LARGE / MID / SMALL
    limit: int,
    db: AsyncSession,
) -> list[dict]:
    """Rank stocks by 1-year return for the given market cap category."""
    result = await db.execute(
        select(Stock).where(
            Stock.is_active == True,
            Stock.market_cap_category == category,
        )
    )
    stocks = result.scalars().all()

    performers = []
    today = date.today()
    one_year_ago = today - timedelta(days=365)

    for stock in stocks:
        # Get latest close
        latest_result = await db.execute(
            select(Price)
            .where(Price.stock_id == stock.id, Price.date <= today)
            .order_by(Price.date.desc())
            .limit(1)
        )
        latest_price = latest_result.scalar_one_or_none()

        # Get ~1 year ago close
        ago_result = await db.execute(
            select(Price)
            .where(Price.stock_id == stock.id, Price.date >= one_year_ago - timedelta(days=5))
            .order_by(Price.date)
            .limit(1)
        )
        ago_price = ago_result.scalar_one_or_none()

        if not latest_price or not ago_price:
            continue
        if not latest_price.close or not ago_price.close:
            continue

        ret_1y = _cagr(ago_price.close, latest_price.close, 1)
        if ret_1y is None:
            continue

        performers.append({
            "symbol": stock.symbol,
            "name": stock.name,
            "sector": stock.sector,
            "market_cap_category": stock.market_cap_category,
            "current_price": latest_price.close,
            "return_1y_pct": ret_1y,
            "price_date": latest_price.date.isoformat(),
        })

    # Sort by 1Y return descending
    performers.sort(key=lambda x: x["return_1y_pct"], reverse=True)
    for i, p in enumerate(performers):
        p["rank"] = i + 1

    return performers[:limit]
