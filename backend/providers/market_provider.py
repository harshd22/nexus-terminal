"""
NEXUS TERMINAL — Market Data Provider
Fetches live index quotes and market breadth.
Uses Kite when connected, falls back to NSE public data otherwise.
"""
from __future__ import annotations
import httpx
import logging
from datetime import datetime, timezone

logger = logging.getLogger("nexus.market")

NSE_INDICES = [
    {"name": "NIFTY 50",     "nse_key": "NIFTY 50"},
    {"name": "SENSEX",       "nse_key": "SENSEX"},
    {"name": "BANK NIFTY",   "nse_key": "NIFTY BANK"},
    {"name": "NIFTY IT",     "nse_key": "NIFTY IT"},
    {"name": "NIFTY AUTO",   "nse_key": "NIFTY AUTO"},
    {"name": "NIFTY PHARMA", "nse_key": "NIFTY PHARMA"},
    {"name": "NIFTY FMCG",   "nse_key": "NIFTY FMCG"},
    {"name": "NIFTY METAL",  "nse_key": "NIFTY METAL"},
    {"name": "NIFTY REALTY", "nse_key": "NIFTY REALTY"},
]

NSE_BASE_URL = "https://www.nseindia.com"
NSE_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Accept": "application/json",
    "Referer": "https://www.nseindia.com/",
}


async def get_index_quotes() -> list[dict]:
    """
    Fetch live index quotes.
    Returns structured data with source + timestamp.
    """
    try:
        async with httpx.AsyncClient(
            headers=NSE_HEADERS, timeout=10, follow_redirects=True
        ) as client:
            # Get session cookie first
            await client.get(NSE_BASE_URL)
            resp = await client.get(f"{NSE_BASE_URL}/api/allIndices")
            resp.raise_for_status()
            data = resp.json().get("data", [])

            result = []
            ts = datetime.now(timezone.utc).isoformat()

            for index_meta in NSE_INDICES:
                entry = next(
                    (d for d in data if d.get("index") == index_meta["nse_key"]),
                    None,
                )
                if entry:
                    result.append({
                        "name": index_meta["name"],
                        "symbol": index_meta["nse_key"],
                        "value": entry.get("last"),
                        "change": entry.get("change"),
                        "change_pct": entry.get("percentChange"),
                        "high": entry.get("high"),
                        "low": entry.get("low"),
                        "open": entry.get("open"),
                        "previous_close": entry.get("previousClose"),
                        "source": "NSE India",
                        "source_url": "https://www.nseindia.com/api/allIndices",
                        "timestamp": ts,
                        "status": "LIVE",
                    })
                else:
                    result.append({
                        "name": index_meta["name"],
                        "symbol": index_meta["nse_key"],
                        "value": None,
                        "source": "NSE India",
                        "timestamp": ts,
                        "status": "SOURCE_UNAVAILABLE",
                    })
            return result
    except Exception as e:
        logger.error("Failed to fetch index quotes: %s", e)
        ts = datetime.now(timezone.utc).isoformat()
        return [
            {
                "name": idx["name"],
                "symbol": idx["nse_key"],
                "value": None,
                "source": "NSE India",
                "timestamp": ts,
                "status": "SOURCE_UNAVAILABLE",
            }
            for idx in NSE_INDICES
        ]


async def get_breadth_observation() -> dict | None:
    """
    Fetch current market breadth from NSE.
    Returns winner_count, loser_count, unchanged_count.
    """
    try:
        async with httpx.AsyncClient(
            headers=NSE_HEADERS, timeout=10, follow_redirects=True
        ) as client:
            await client.get(NSE_BASE_URL)
            resp = await client.get(f"{NSE_BASE_URL}/api/market-data-pre-open?key=ALL")
            resp.raise_for_status()
            data = resp.json().get("data", [])

            winners = sum(1 for d in data if d.get("metadata", {}).get("change", 0) > 0)
            losers  = sum(1 for d in data if d.get("metadata", {}).get("change", 0) < 0)
            unchanged = len(data) - winners - losers
            total = len(data)
            breadth_pct = (winners - losers) / (winners + losers) * 100 if (winners + losers) > 0 else 0.0

            return {
                "winner_count": winners,
                "loser_count": losers,
                "unchanged_count": unchanged,
                "total_count": total,
                "breadth_pct": round(breadth_pct, 2),
                "source": "NSE India",
            }
    except Exception as e:
        logger.warning("Breadth fetch failed: %s", e)
        return None
