"""
NEXUS TERMINAL — Scoring Engine
Pure Python weighted formula. AI never calls this.

Formula:
  base = valuation×0.25 + growth×0.25 + financial_health×0.20 + momentum×0.15 + sector_tailwind×0.15
  penalty = sum(WARN×-0.5 + FAIL×-1.0)
  final = clamp(base - penalty, 0, 10)

All sub-scores are on a 0–10 scale before weighting.
"""
from __future__ import annotations
import logging
import math
from typing import Any

logger = logging.getLogger("nexus.scoring")

WEIGHTS = {
    "valuation": 0.25,
    "growth": 0.25,
    "financial_health": 0.20,
    "momentum": 0.15,
    "sector_tailwind": 0.15,
}

PENALTY_MAP = {"WARN": -0.5, "FAIL": -1.0, "NA": 0.0, "PASS": 0.0}


def _clamp(value: float, lo: float = 0.0, hi: float = 10.0) -> float:
    return max(lo, min(hi, value))


def _score_pe(pe: float | None) -> float:
    """Lower P/E = better valuation (within reason)."""
    if pe is None or pe <= 0:
        return 5.0  # neutral if unavailable
    if pe < 10:
        return 9.0
    if pe < 15:
        return 8.0
    if pe < 20:
        return 7.0
    if pe < 25:
        return 6.0
    if pe < 35:
        return 5.0
    if pe < 50:
        return 3.0
    return 1.0


def _score_pb(pb: float | None) -> float:
    if pb is None or pb <= 0:
        return 5.0
    if pb < 1:
        return 9.0
    if pb < 2:
        return 7.0
    if pb < 4:
        return 5.0
    if pb < 8:
        return 3.0
    return 1.0


def _score_valuation(fundamentals: list) -> tuple[float, dict]:
    if not fundamentals:
        return 5.0, {"pe": None, "pb": None, "note": "No fundamentals — neutral score"}
    f = fundamentals[0]
    pe_score = _score_pe(f.pe)
    pb_score = _score_pb(f.pb)
    score = (pe_score + pb_score) / 2
    return score, {
        "pe": f.pe, "pe_score": pe_score,
        "pb": f.pb, "pb_score": pb_score,
        "combined": round(score, 2),
        "formula": "(score_pe + score_pb) / 2",
    }


def _score_growth(fundamentals: list) -> tuple[float, dict]:
    if not fundamentals:
        return 5.0, {"note": "No fundamentals — neutral score"}
    f = fundamentals[0]
    rev_growth = f.revenue_growth or 0
    profit_growth = f.profit_growth or 0

    def growth_pts(g: float) -> float:
        if g > 30: return 9.0
        if g > 20: return 8.0
        if g > 15: return 7.0
        if g > 10: return 6.0
        if g > 5:  return 5.0
        if g > 0:  return 4.0
        return 2.0

    rev_s = growth_pts(rev_growth * 100)
    pro_s = growth_pts(profit_growth * 100)
    score = (rev_s + pro_s) / 2
    return score, {
        "revenue_growth_pct": round(rev_growth * 100, 2),
        "profit_growth_pct": round(profit_growth * 100, 2),
        "revenue_score": rev_s, "profit_score": pro_s,
        "combined": round(score, 2),
        "formula": "(score_revenue_growth + score_profit_growth) / 2",
    }


def _score_financial_health(fundamentals: list, shareholdings: list) -> tuple[float, dict]:
    if not fundamentals:
        return 5.0, {"note": "No fundamentals"}
    f = fundamentals[0]
    de = f.debt_equity or 0
    ic = f.interest_coverage
    roe = f.roe or 0

    de_score = max(0, 10 - de * 2) if de >= 0 else 5.0
    ic_score = min(10, ic) if ic and ic > 0 else 3.0
    roe_score = min(10, roe / 2) if roe else 4.0

    score = (de_score + ic_score + roe_score) / 3
    return score, {
        "debt_equity": de, "de_score": round(de_score, 2),
        "interest_coverage": ic, "ic_score": round(ic_score, 2),
        "roe": roe, "roe_score": round(roe_score, 2),
        "combined": round(score, 2),
        "formula": "(score_de + score_ic + score_roe) / 3",
    }


def _score_momentum(prices: list) -> tuple[float, dict]:
    """1-month and 6-month return as proxy for momentum."""
    closes = [p.close for p in prices if p.close is not None]
    if len(closes) < 5:
        return 5.0, {"note": "Insufficient price data"}

    def safe_ret(closes, n_periods):
        if len(closes) < n_periods:
            return None
        return (closes[-1] / closes[-n_periods] - 1) * 100

    ret_1m  = safe_ret(closes, 22)
    ret_6m  = safe_ret(closes, 126)

    def momentum_pts(r):
        if r is None: return 5.0
        if r > 20:  return 9.0
        if r > 10:  return 7.0
        if r > 5:   return 6.0
        if r > 0:   return 5.0
        if r > -10: return 3.0
        return 1.0

    s1 = momentum_pts(ret_1m)
    s6 = momentum_pts(ret_6m)
    score = s1 * 0.4 + s6 * 0.6
    return score, {
        "return_1m_pct": round(ret_1m, 2) if ret_1m is not None else None,
        "return_6m_pct": round(ret_6m, 2) if ret_6m is not None else None,
        "score_1m": s1, "score_6m": s6,
        "combined": round(score, 2),
        "formula": "score_1m × 0.4 + score_6m × 0.6",
    }


def _score_sector_tailwind(stock, fundamentals: list) -> tuple[float, dict]:
    """
    Sector tailwind is qualitative — scored 5.0 (neutral) until sector index data
    is ingested and we can compare stock vs. sector index performance.
    """
    return 5.0, {"note": "Sector tailwind score pending sector index ingestion", "sector": stock.sector}


def compute_score(stock, fundamentals: list, shareholdings: list, prices: list, flags: list) -> dict:
    """
    Compute the full Nexus score. Returns structured result for display.
    AI must NEVER call this — Python calculates, AI explains.
    """
    val_score, val_inputs  = _score_valuation(fundamentals)
    grow_score, grow_inputs = _score_growth(fundamentals)
    fh_score, fh_inputs    = _score_financial_health(fundamentals, shareholdings)
    mom_score, mom_inputs  = _score_momentum(prices)
    sec_score, sec_inputs  = _score_sector_tailwind(stock, fundamentals)

    base = (
        val_score  * WEIGHTS["valuation"] +
        grow_score * WEIGHTS["growth"] +
        fh_score   * WEIGHTS["financial_health"] +
        mom_score  * WEIGHTS["momentum"] +
        sec_score  * WEIGHTS["sector_tailwind"]
    )

    penalty = sum(PENALTY_MAP.get(f["status"], 0) for f in flags)
    final = _clamp(base + penalty)

    return {
        "total_score": round(final, 2),
        "base_score": round(base, 2),
        "penalty": round(penalty, 2),
        "components": {
            "valuation": {
                "score": round(val_score, 2),
                "weight": WEIGHTS["valuation"],
                "contribution": round(val_score * WEIGHTS["valuation"], 3),
                "inputs": val_inputs,
            },
            "growth": {
                "score": round(grow_score, 2),
                "weight": WEIGHTS["growth"],
                "contribution": round(grow_score * WEIGHTS["growth"], 3),
                "inputs": grow_inputs,
            },
            "financial_health": {
                "score": round(fh_score, 2),
                "weight": WEIGHTS["financial_health"],
                "contribution": round(fh_score * WEIGHTS["financial_health"], 3),
                "inputs": fh_inputs,
            },
            "momentum": {
                "score": round(mom_score, 2),
                "weight": WEIGHTS["momentum"],
                "contribution": round(mom_score * WEIGHTS["momentum"], 3),
                "inputs": mom_inputs,
            },
            "sector_tailwind": {
                "score": round(sec_score, 2),
                "weight": WEIGHTS["sector_tailwind"],
                "contribution": round(sec_score * WEIGHTS["sector_tailwind"], 3),
                "inputs": sec_inputs,
            },
        },
        "formula": (
            "base = valuation×0.25 + growth×0.25 + financial_health×0.20 + momentum×0.15 + sector_tailwind×0.15\n"
            "penalty = Σ(WARN×-0.5 + FAIL×-1.0)\n"
            "final = clamp(base + penalty, 0, 10)"
        ),
        "flag_penalties": [
            {"rule": f["rule_name"], "status": f["status"], "penalty": PENALTY_MAP.get(f["status"], 0)}
            for f in flags if f["status"] in ("WARN", "FAIL")
        ],
    }
