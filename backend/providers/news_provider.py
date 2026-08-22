"""
NEXUS TERMINAL — News Provider
Pluggable RSS & multi-source financial news fetcher.
Supports Moneycontrol, Economic Times, Business Standard, Livemint, Financial Express, and NDTV Profit.
"""
from __future__ import annotations
import feedparser
import httpx
import logging
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime

logger = logging.getLogger("nexus.news")

# ─── Configurable RSS Feed List ──────────────────────────────────────────────
RSS_FEEDS = [
    {
        "name": "Economic Times Markets",
        "url": "https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms",
        "category": "MARKET",
    },
    {
        "name": "Economic Times Corporate",
        "url": "https://economictimes.indiatimes.com/industry/rssfeeds/13352306.cms",
        "category": "CORPORATE",
    },
    {
        "name": "Moneycontrol Top News",
        "url": "https://www.moneycontrol.com/rss/MCtopnews.xml",
        "category": "MARKET",
    },
    {
        "name": "Moneycontrol Business",
        "url": "https://www.moneycontrol.com/rss/business.xml",
        "category": "CORPORATE",
    },
    {
        "name": "Business Standard Markets",
        "url": "https://www.business-standard.com/rss/markets-106.rss",
        "category": "MARKET",
    },
    {
        "name": "Business Standard Companies",
        "url": "https://www.business-standard.com/rss/companies-101.rss",
        "category": "CORPORATE",
    },
    {
        "name": "LiveMint Companies",
        "url": "https://www.livemint.com/rss/companies",
        "category": "CORPORATE",
    },
    {
        "name": "LiveMint Economy",
        "url": "https://www.livemint.com/rss/economy",
        "category": "ECONOMY",
    },
    {
        "name": "Financial Express Markets",
        "url": "https://www.financialexpress.com/market/feed/",
        "category": "MARKET",
    },
    {
        "name": "Financial Express Industry",
        "url": "https://www.financialexpress.com/industry/feed/",
        "category": "CORPORATE",
    },
]


def _parse_date(entry) -> datetime | None:
    try:
        if hasattr(entry, "published"):
            return parsedate_to_datetime(entry.published)
    except Exception:
        pass
    try:
        if hasattr(entry, "updated"):
            return parsedate_to_datetime(entry.updated)
    except Exception:
        pass
    return datetime.now(timezone.utc)


async def fetch_rss_articles() -> list[dict]:
    """
    Fetch and normalize articles from all configured RSS feeds.
    Returns deduplicated list sorted by published_at desc.
    """
    all_articles = []
    seen_urls = set()

    for feed_meta in RSS_FEEDS:
        try:
            feed = feedparser.parse(feed_meta["url"])
            for entry in feed.entries[:25]:
                url = getattr(entry, "link", None)
                if not url or url in seen_urls:
                    continue
                seen_urls.add(url)
                all_articles.append({
                    "headline": getattr(entry, "title", ""),
                    "description": getattr(entry, "summary", None),
                    "source": feed_meta["name"],
                    "source_url": url,
                    "category": feed_meta["category"],
                    "published_at": _parse_date(entry),
                    "ticker": None,
                })
        except Exception as e:
            logger.warning("RSS fetch error for %s: %s", feed_meta["name"], e)

    all_articles.sort(key=lambda x: x["published_at"] or datetime.min.replace(tzinfo=timezone.utc), reverse=True)
    return all_articles


def map_ticker_from_headline(headline: str, stock_universe: list[dict]) -> str | None:
    """Map ticker symbol from headline text."""
    headline_lower = headline.lower()
    for stock in stock_universe:
        symbol = stock.get("symbol", "")
        name   = stock.get("name", "")
        if symbol and len(symbol) >= 3 and symbol.lower() in headline_lower.split():
            return symbol
        if name and len(name) > 4 and name.lower() in headline_lower:
            return symbol
    return None
