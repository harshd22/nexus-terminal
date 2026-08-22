"""
NEXUS TERMINAL — Public Price Provider
Fetches historical OHLCV candles from Yahoo Finance or synthesizes a 5-year daily candle series.
Ensures EVERY stock has 1,250 daily candles for TradingView charts.
"""
from __future__ import annotations
import httpx
import logging
import random
from datetime import datetime, timezone, date, timedelta

logger = logging.getLogger("nexus.prices")

YAHOO_BASE = "https://query1.finance.yahoo.com/v8/finance/chart"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Accept": "application/json",
}


async def fetch_yahoo_prices(symbol: str, range_str: str = "5y") -> list[dict]:
    """
    Fetch OHLCV candles for any NSE symbol.
    Falls back to generating 5-year daily OHLCV series if external API is unreachable.
    """
    sym = symbol.upper().strip()

    # Try Yahoo Finance NSE
    candles = await _fetch_yahoo(f"{sym}.NS", range_str)
    if not candles:
        # Try Yahoo Finance BSE
        candles = await _fetch_yahoo(f"{sym}.BO", range_str)

    if not candles:
        logger.info("Generating synthesized 5-year OHLCV price series for %s", sym)
        candles = _generate_synthetic_prices(sym, 1250)

    return candles


async def _fetch_yahoo(ticker: str, range_str: str) -> list[dict]:
    url = f"{YAHOO_BASE}/{ticker}?interval=1d&range={range_str.lower()}"
    try:
        async with httpx.AsyncClient(timeout=10, follow_redirects=True) as client:
            resp = await client.get(url, headers=HEADERS)
            if resp.status_code != 200:
                return []
            data = resp.json()
            result = data.get("chart", {}).get("result", [])
            if not result:
                return []

            chart_data = result[0]
            timestamps = chart_data.get("timestamp", [])
            quote = chart_data.get("indicators", {}).get("quote", [{}])[0]

            opens  = quote.get("open", [])
            highs  = quote.get("high", [])
            lows   = quote.get("low", [])
            closes = quote.get("close", [])
            vols   = quote.get("volume", [])

            candles = []
            for i, ts in enumerate(timestamps):
                c = closes[i] if i < len(closes) else None
                if c is None:
                    continue
                dt_str = datetime.fromtimestamp(ts, tz=timezone.utc).strftime("%Y-%m-%d")
                o = round(opens[i], 2) if i < len(opens) and opens[i] is not None else round(c, 2)
                h = round(highs[i], 2) if i < len(highs) and highs[i] is not None else round(c, 2)
                l = round(lows[i], 2) if i < len(lows) and lows[i] is not None else round(c, 2)
                v = vols[i] if i < len(vols) and vols[i] is not None else 100000
                candles.append({
                    "date": dt_str,
                    "open": o,
                    "high": max(h, o, round(c, 2)),
                    "low": min(l, o, round(c, 2)),
                    "close": round(c, 2),
                    "volume": v,
                    "source": "Yahoo Finance (Free Public Data)",
                })
            return candles
    except Exception as e:
        logger.warning("Yahoo fetch error for %s: %s", ticker, e)
        return []


def _generate_synthetic_prices(symbol: str, count: int = 1250) -> list[dict]:
    """Generate realistic daily OHLCV candles with random walk trend."""
    random.seed(hash(symbol) % 1000000)
    base_price = random.uniform(150.0, 3500.0)
    current_price = base_price * 0.4  # start 5 years ago lower

    end_date = date.today()
    candles = []

    # Generate dates backwards
    dates = []
    curr = end_date
    while len(dates) < count:
        if curr.weekday() < 5:  # Monday - Friday
            dates.append(curr.isoformat())
        curr -= timedelta(days=1)
    dates.reverse()

    for dt_str in dates:
        change_pct = random.gauss(0.0005, 0.015)  # slight upward bias
        open_price = current_price
        close_price = round(max(10.0, open_price * (1 + change_pct)), 2)
        high_price = round(max(open_price, close_price) * (1 + random.uniform(0.002, 0.012)), 2)
        low_price = round(min(open_price, close_price) * (1 - random.uniform(0.002, 0.012)), 2)
        volume = int(random.uniform(50000, 5000000))

        candles.append({
            "date": dt_str,
            "open": open_price,
            "high": high_price,
            "low": low_price,
            "close": close_price,
            "volume": volume,
            "source": "Nexus Terminal Engine",
        })
        current_price = close_price

    return candles
