"""
NEXUS TERMINAL — Portfolio Engine
Pure Python calculations. No AI.
"""
from __future__ import annotations
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select


def compute_portfolio_stats(holdings: list[dict]) -> dict:
    total_invested = sum(
        (h.get("avg_price") or 0) * (h.get("quantity") or 0)
        for h in holdings
    )
    current_value = sum(
        (h.get("current_price") or 0) * (h.get("quantity") or 0)
        for h in holdings
    )
    overall_pnl = current_value - total_invested
    overall_pnl_pct = (overall_pnl / total_invested * 100) if total_invested > 0 else 0
    day_pnl = sum(h.get("day_pnl") or 0 for h in holdings)

    return {
        "total_invested": round(total_invested, 2),
        "current_value":  round(current_value, 2),
        "overall_pnl":    round(overall_pnl, 2),
        "overall_pnl_pct": round(overall_pnl_pct, 2),
        "day_pnl":        round(day_pnl, 2),
        "holdings_count": len(holdings),
    }


def compute_allocation(holdings: list[dict]) -> list[dict]:
    """Compute each holding's weight in portfolio for the donut chart."""
    total_value = sum(
        (h.get("current_price") or 0) * (h.get("quantity") or 0)
        for h in holdings
    )
    if total_value <= 0:
        return []
    segments = []
    for h in holdings:
        val = (h.get("current_price") or 0) * (h.get("quantity") or 0)
        weight_pct = val / total_value * 100
        overall_pnl = (
            ((h.get("current_price") or 0) - (h.get("avg_price") or 0))
            * (h.get("quantity") or 0)
        )
        segments.append({
            "symbol": h.get("symbol"),
            "current_value": round(val, 2),
            "weight_pct": round(weight_pct, 2),
            "day_pnl": h.get("day_pnl"),
            "overall_pnl": round(overall_pnl, 2),
        })
    return sorted(segments, key=lambda x: x["weight_pct"], reverse=True)


async def compute_portfolio_health(holdings: list[dict], db: AsyncSession) -> dict:
    """
    Value-weighted average of individual Nexus scores across holdings.
    Falls back to NA if scores are unavailable.
    """
    from database.models import Stock, Score
    from sqlalchemy import select

    total_value = sum(
        (h.get("current_price") or 0) * (h.get("quantity") or 0)
        for h in holdings
    )

    weighted_score = 0.0
    scored_count = 0
    flag_count = 0
    details = []

    for h in holdings:
        val = (h.get("current_price") or 0) * (h.get("quantity") or 0)
        weight = val / total_value if total_value > 0 else 0
        symbol = h.get("symbol", "")

        stock_result = await db.execute(select(Stock).where(Stock.symbol == symbol))
        stock = stock_result.scalar_one_or_none()

        if stock:
            score_result = await db.execute(
                select(Score)
                .where(Score.stock_id == stock.id)
                .order_by(Score.calculated_at.desc())
                .limit(1)
            )
            score = score_result.scalar_one_or_none()
            if score and score.total_score is not None:
                weighted_score += score.total_score * weight
                scored_count += 1
                details.append({
                    "symbol": symbol,
                    "score": score.total_score,
                    "weight_pct": round(weight * 100, 2),
                    "contribution": round(score.total_score * weight, 3),
                })

    return {
        "portfolio_health_score": round(weighted_score, 2) if scored_count > 0 else None,
        "holdings_count": len(holdings),
        "analyzed_count": scored_count,
        "red_flags_count": flag_count,
        "details": details,
        "formula": "Σ(stock_score × holding_weight) across all analyzed holdings",
        "note": "DATA_UNAVAILABLE — run /api/stocks/{symbol}/score for each holding to populate" if scored_count == 0 else None,
    }


def compute_breadth(winner_count: int, loser_count: int) -> dict:
    """
    Market breadth calculation.
    breadth_pct = (winners - losers) / (winners + losers) × 100
    """
    total = winner_count + loser_count
    if total == 0:
        return {"breadth_pct": 0.0, "ratio": None}
    breadth_pct = (winner_count - loser_count) / total * 100
    ratio = winner_count / loser_count if loser_count > 0 else None
    return {
        "breadth_pct": round(breadth_pct, 2),
        "ratio": round(ratio, 2) if ratio else None,
        "formula": "(winners - losers) / (winners + losers) × 100",
    }
