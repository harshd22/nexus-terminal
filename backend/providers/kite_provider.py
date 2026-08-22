"""
NEXUS TERMINAL — Kite Connect Provider
Wraps kiteconnect library. Never exposes credentials to frontend.
Falls back to demo mode when not configured.
"""
from __future__ import annotations
import logging
from core.config import settings

logger = logging.getLogger("nexus.kite")

_kite = None


def _get_kite():
    global _kite
    if _kite is not None:
        return _kite
    if not settings.kite_configured:
        return None
    try:
        from kiteconnect import KiteConnect
        k = KiteConnect(api_key=settings.kite_api_key)
        if settings.kite_access_token:
            k.set_access_token(settings.kite_access_token)
        _kite = k
        return _kite
    except ImportError:
        logger.warning("kiteconnect package not installed")
        return None
    except Exception as e:
        logger.error("Kite init error: %s", e)
        return None


async def exchange_request_token(request_token: str) -> str:
    """Exchange request_token for access_token."""
    kite = _get_kite()
    if not kite:
        raise RuntimeError("Kite not configured")
    import hashlib
    data = kite.generate_session(request_token, api_secret=settings.kite_api_secret)
    return data.get("access_token", "")


async def get_holdings_from_kite() -> list[dict]:
    kite = _get_kite()
    if not kite or not settings.kite_access_token:
        logger.info("Kite not connected — returning empty holdings")
        return []
    try:
        holdings = kite.holdings()
        return [
            {
                "symbol": h["tradingsymbol"],
                "quantity": h["quantity"],
                "avg_price": h["average_price"],
                "current_price": h["last_price"],
                "pnl": h["pnl"],
                "day_pnl": h.get("day_change", 0) * h.get("quantity", 0),
                "source": "Kite Connect",
            }
            for h in holdings
        ]
    except Exception as e:
        logger.error("Kite holdings error: %s", e)
        return []


async def get_positions_from_kite() -> list[dict]:
    kite = _get_kite()
    if not kite or not settings.kite_access_token:
        return []
    try:
        positions = kite.positions().get("net", [])
        return [
            {
                "symbol": p["tradingsymbol"],
                "quantity": p["quantity"],
                "avg_price": p["average_price"],
                "current_price": p["last_price"],
                "pnl": p["pnl"],
                "source": "Kite Connect",
            }
            for p in positions
        ]
    except Exception as e:
        logger.error("Kite positions error: %s", e)
        return []


async def get_historical_prices(symbol: str, from_date: str, to_date: str, interval: str = "day") -> list[dict]:
    """
    Fetch historical OHLCV from Kite.
    interval: minute | 3minute | 5minute | 10minute | 15minute | 30minute | 60minute | day
    """
    kite = _get_kite()
    if not kite or not settings.kite_access_token:
        logger.info("Kite not connected — cannot fetch historical prices for %s", symbol)
        return []
    try:
        # Need instrument token — look it up
        instruments = kite.instruments("NSE")
        token = next(
            (i["instrument_token"] for i in instruments if i["tradingsymbol"] == symbol.upper()),
            None,
        )
        if not token:
            logger.warning("Instrument token not found for %s", symbol)
            return []
        data = kite.historical_data(token, from_date, to_date, interval)
        return [
            {
                "date": d["date"].strftime("%Y-%m-%d") if hasattr(d["date"], "strftime") else str(d["date"]),
                "open": d["open"],
                "high": d["high"],
                "low": d["low"],
                "close": d["close"],
                "volume": d["volume"],
            }
            for d in data
        ]
    except Exception as e:
        logger.error("Kite historical data error for %s: %s", symbol, e)
        return []
