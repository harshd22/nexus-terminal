"""
NEXUS TERMINAL — Technical Indicators Engine
Pure Python/NumPy — no AI, no external TA library required.
Calculates: SMA, EMA, CAGR, 52W high/low, ATH, returns.
"""
from __future__ import annotations
import math
from typing import Optional


def _sma(closes: list[float], period: int) -> list[Optional[float]]:
    """Simple Moving Average — returns list same length as closes."""
    result = [None] * len(closes)
    for i in range(period - 1, len(closes)):
        result[i] = sum(closes[i - period + 1: i + 1]) / period
    return result


def _ema(closes: list[float], period: int) -> list[Optional[float]]:
    """Exponential Moving Average."""
    result = [None] * len(closes)
    if len(closes) < period:
        return result
    k = 2 / (period + 1)
    sma_start = sum(closes[:period]) / period
    result[period - 1] = sma_start
    for i in range(period, len(closes)):
        result[i] = closes[i] * k + result[i - 1] * (1 - k)
    return result


def _cagr(start: float, end: float, years: float) -> Optional[float]:
    """Compound Annual Growth Rate."""
    if start <= 0 or end <= 0 or years <= 0:
        return None
    return round((math.pow(end / start, 1 / years) - 1) * 100, 2)


def compute_technicals(closes: list[float]) -> dict:
    """
    Compute all technical indicators from a list of closing prices.
    Called with prices in chronological order (oldest first).
    """
    if not closes:
        return {}

    n = len(closes)
    current = closes[-1]

    # Moving averages
    dma_20  = _sma(closes, 20)[-1]
    dma_50  = _sma(closes, 50)[-1]
    dma_100 = _sma(closes, 100)[-1]
    dma_200 = _sma(closes, 200)[-1]

    # 52-week high/low
    w52 = closes[-252:] if n >= 252 else closes
    high_52w = max(w52)
    low_52w  = min(w52)

    # All-time high
    ath = max(closes)
    dist_ath_pct = round((current / ath - 1) * 100, 2) if ath > 0 else None

    # Returns
    ret_1y  = _cagr(closes[-252], current, 1) if n >= 252 else None
    ret_3y  = _cagr(closes[-756], current, 3) if n >= 756 else None
    ret_5y  = _cagr(closes[-1260], current, 5) if n >= 1260 else None

    # Full MA series (for chart overlay)
    sma_20_series  = _sma(closes, 20)
    sma_50_series  = _sma(closes, 50)
    sma_100_series = _sma(closes, 100)
    sma_200_series = _sma(closes, 200)

    return {
        "current_price": current,
        "dma_20":  round(dma_20, 2) if dma_20 else None,
        "dma_50":  round(dma_50, 2) if dma_50 else None,
        "dma_100": round(dma_100, 2) if dma_100 else None,
        "dma_200": round(dma_200, 2) if dma_200 else None,
        "high_52w": round(high_52w, 2),
        "low_52w":  round(low_52w, 2),
        "ath": round(ath, 2),
        "distance_from_ath_pct": dist_ath_pct,
        "return_1y_cagr": ret_1y,
        "return_3y_cagr": ret_3y,
        "return_5y_cagr": ret_5y,
        "sma_20_series":  [round(v, 2) if v else None for v in sma_20_series],
        "sma_50_series":  [round(v, 2) if v else None for v in sma_50_series],
        "sma_100_series": [round(v, 2) if v else None for v in sma_100_series],
        "sma_200_series": [round(v, 2) if v else None for v in sma_200_series],
    }
