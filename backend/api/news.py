"""
NEXUS TERMINAL — News API
GET /api/news                   — News feed with optional category filter
POST /api/news/ingest           — Trigger manual RSS ingestion
"""
from typing import Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_

from database.db import get_db
from database.models import NewsArticle, Stock
from providers.news_provider import fetch_rss_articles, map_ticker_from_headline

router = APIRouter()


@router.get("")
async def get_news(
    category: Optional[str] = Query(None, description="MARKET | CORPORATE | ECONOMY"),
    limit: int = Query(50, description="Max articles to return"),
    db: AsyncSession = Depends(get_db),
):
    """
    Get live news articles. Auto-ingests fresh RSS articles if database is empty.
    """
    await _ensure_news_populated(db)

    query = select(NewsArticle).order_by(NewsArticle.published_at.desc()).limit(limit)
    if category:
        query = select(NewsArticle).where(NewsArticle.category == category.upper()).order_by(NewsArticle.published_at.desc()).limit(limit)

    result = await db.execute(query)
    articles = result.scalars().all()

    return {
        "category": category.upper() if category else "ALL",
        "articles": [
            {
                "id": a.id,
                "headline": a.headline,
                "description": a.description,
                "source": a.source,
                "source_url": a.source_url,
                "category": a.category,
                "published_at": a.published_at.isoformat() if a.published_at else None,
                "ticker": a.ticker,
                "sentiment": a.sentiment or "NEUTRAL",
            }
            for a in articles
        ],
        "count": len(articles),
        "source": "RSS Aggregator (Moneycontrol, Economic Times, Livemint)",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


@router.post("/ingest")
async def ingest_news(db: AsyncSession = Depends(get_db)):
    """Trigger manual RSS news ingestion."""
    added = await _ingest_rss(db)
    return {"status": "ok", "articles_added": added}


async def _ensure_news_populated(db: AsyncSession):
    res = await db.execute(select(NewsArticle).limit(1))
    if not res.scalar_one_or_none():
        await _ingest_rss(db)


async def _ingest_rss(db: AsyncSession) -> int:
    articles = await fetch_rss_articles()
    if not articles:
        return 0

    # Get existing URLs to avoid duplicates
    res = await db.execute(select(NewsArticle.source_url))
    existing_urls = set(res.scalars().all())

    # Get stocks for ticker mapping
    sres = await db.execute(select(Stock))
    stocks = [{"symbol": s.symbol, "name": s.name} for s in sres.scalars().all()]

    added = 0
    for a in articles:
        if not a["source_url"] or a["source_url"] in existing_urls:
            continue

        ticker = map_ticker_from_headline(a["headline"], stocks)
        stock_id = None
        if ticker:
            st_res = await db.execute(select(Stock.id).where(Stock.symbol == ticker))
            stock_id = st_res.scalar_one_or_none()

        article = NewsArticle(
            stock_id=stock_id,
            headline=a["headline"],
            description=a["description"],
            source=a["source"],
            source_url=a["source_url"],
            category=a["category"],
            published_at=a["published_at"],
            ticker=ticker,
            sentiment="POSITIVE" if any(w in a["headline"].lower() for w in ["profit", "surge", "gain", "up", "record", "jump", "growth", "high"]) else "NEGATIVE" if any(w in a["headline"].lower() for w in ["fall", "drop", "loss", "down", "plunge", "decline", "cut", "risk"]) else "NEUTRAL",
        )
        db.add(article)
        existing_urls.add(a["source_url"])
        added += 1

    if added > 0:
        await db.commit()
    return added
