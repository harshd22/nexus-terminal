"""
NEXUS TERMINAL — Evidence Pack Builder
Assembles all verified data before any AI call.
Every item has: value, source, timestamp.
AI receives ONLY this pack — never raw DB access.
"""
from __future__ import annotations
import json
import hashlib
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from database.models import Stock, Price, Fundamental, Shareholding, NewsArticle, RedFlag, Score
from engines.red_flags import run_red_flags
from engines.scoring import compute_score
from engines.technicals import compute_technicals


async def build_evidence_pack(stock: Stock, db: AsyncSession) -> dict:
    """Build a structured evidence pack for AI consumption."""
    ts = datetime.now(timezone.utc).isoformat()

    # Prices
    price_result = await db.execute(
        select(Price)
        .where(Price.stock_id == stock.id)
        .order_by(Price.date.desc())
        .limit(252)
    )
    prices = list(reversed(price_result.scalars().all()))
    closes = [p.close for p in prices if p.close is not None]
    technicals = compute_technicals(closes) if closes else {}

    # Fundamentals
    fund_result = await db.execute(
        select(Fundamental)
        .where(Fundamental.stock_id == stock.id)
        .order_by(Fundamental.data_date.desc())
        .limit(8)
    )
    fundamentals = fund_result.scalars().all()

    # Shareholding
    sh_result = await db.execute(
        select(Shareholding)
        .where(Shareholding.stock_id == stock.id)
        .order_by(Shareholding.quarter.desc())
        .limit(5)
    )
    shareholdings = sh_result.scalars().all()

    # News (latest 10)
    news_result = await db.execute(
        select(NewsArticle)
        .where(NewsArticle.stock_id == stock.id)
        .order_by(NewsArticle.published_at.desc())
        .limit(10)
    )
    news = news_result.scalars().all()

    # Red flags + score
    flags = run_red_flags(stock, fundamentals, shareholdings)
    score = compute_score(stock, fundamentals, shareholdings, prices, flags)

    pack = {
        "company": {
            "symbol": stock.symbol,
            "name": stock.name,
            "sector": stock.sector,
            "industry": stock.industry,
            "source": "NSE/Kite",
            "timestamp": ts,
        },
        "price": {
            "current": closes[-1] if closes else None,
            "return_1y_cagr": technicals.get("return_1y_cagr"),
            "return_3y_cagr": technicals.get("return_3y_cagr"),
            "return_5y_cagr": technicals.get("return_5y_cagr"),
            "high_52w": technicals.get("high_52w"),
            "low_52w": technicals.get("low_52w"),
            "ath": technicals.get("ath"),
            "dma_50": technicals.get("dma_50"),
            "dma_200": technicals.get("dma_200"),
            "source": prices[0].source if prices else "DATA_UNAVAILABLE",
            "timestamp": ts,
        },
        "fundamentals": [
            {
                "period": f.period,
                "revenue": f.revenue,
                "net_profit": f.net_profit,
                "eps": f.eps,
                "pe": f.pe,
                "pb": f.pb,
                "roe": f.roe,
                "roce": f.roce,
                "debt_equity": f.debt_equity,
                "interest_coverage": f.interest_coverage,
                "revenue_growth": f.revenue_growth,
                "profit_growth": f.profit_growth,
                "ebitda_margin": f.ebitda_margin,
                "source": f.source,
                "data_date": f.data_date.isoformat() if f.data_date else None,
            }
            for f in fundamentals
        ],
        "shareholding": [
            {
                "quarter": s.quarter,
                "promoter_pct": s.promoter_pct,
                "fii_pct": s.fii_pct,
                "dii_pct": s.dii_pct,
                "public_pct": s.public_pct,
                "promoter_pledge_pct": s.promoter_pledge_pct,
                "source": s.source,
            }
            for s in shareholdings
        ],
        "news": [
            {
                "headline": n.headline,
                "source": n.source,
                "published_at": n.published_at.isoformat() if n.published_at else None,
                "category": n.category,
            }
            for n in news
        ],
        "red_flags": flags,
        "score": score,
        "generated_at": ts,
        "instructions_for_ai": (
            "You are receiving a verified evidence pack. "
            "NEVER invent numbers. NEVER introduce facts not in this pack. "
            "NEVER give buy/sell recommendations. "
            "Every factual claim MUST cite its source from this pack. "
            "If data is missing, say DATA UNAVAILABLE. "
            "You may only explain and analyze — Python has already calculated all numbers."
        ),
    }

    # Hash the pack for caching
    pack_json = json.dumps(pack, default=str, sort_keys=True)
    pack["evidence_hash"] = hashlib.sha256(pack_json.encode()).hexdigest()[:16]

    return pack
