"""
NEXUS TERMINAL — Red Flag Rules Engine
Seven pure Python rules. No AI. No guessing.
Every rule returns a structured result with STATUS, VALUE, THRESHOLD, FORMULA, EXPLANATION, SOURCE, DATE.

Statuses:
    PASS  — Rule condition not triggered
    WARN  — Approaching threshold
    FAIL  — Rule condition triggered (red flag)
    NA    — Data unavailable (never becomes PASS)
"""
from __future__ import annotations
from datetime import date
from typing import Any
import logging

logger = logging.getLogger("nexus.red_flags")

# Financial sector SIC-style keywords — skip debt rules for these
FINANCIAL_SECTORS = {"Banking", "NBFC", "Insurance", "Financial Services", "Finance"}


def _na(rule_id: int, rule_name: str, reason: str) -> dict:
    return {
        "rule_id": rule_id,
        "rule_name": rule_name,
        "status": "NA",
        "value": None,
        "threshold": None,
        "formula": None,
        "explanation": f"DATA UNAVAILABLE — {reason}",
        "source": None,
        "data_date": None,
    }


def _result(
    rule_id: int,
    rule_name: str,
    status: str,
    value: Any,
    threshold: Any,
    formula: str,
    explanation: str,
    source: str,
    data_date: date | None,
) -> dict:
    return {
        "rule_id": rule_id,
        "rule_name": rule_name,
        "status": status,
        "value": round(float(value), 4) if value is not None else None,
        "threshold": threshold,
        "formula": formula,
        "explanation": explanation,
        "source": source,
        "data_date": data_date.isoformat() if data_date else None,
    }


# ─── RULE 1: Promoter Pledge > 20% ───────────────────────────────────────────
def rule_promoter_pledge(stock, shareholdings: list) -> dict:
    RULE_ID, RULE_NAME = 1, "PROMOTER PLEDGE > 20%"
    if not shareholdings:
        return _na(RULE_ID, RULE_NAME, "No shareholding data")
    latest = shareholdings[0]
    pledge = latest.promoter_pledge_pct
    if pledge is None:
        return _na(RULE_ID, RULE_NAME, "Pledge data not available")

    formula = "promoter_pledge_pct > 20%"
    if pledge > 20:
        status = "FAIL"
        explanation = (
            f"Promoter has pledged {pledge:.1f}% of shares — above 20% threshold. "
            "High pledging signals financial stress and forced-selling risk."
        )
    elif pledge > 10:
        status = "WARN"
        explanation = f"Promoter pledge at {pledge:.1f}% — below 20% but elevated. Monitor for increases."
    else:
        status = "PASS"
        explanation = f"Promoter pledge at {pledge:.1f}% — within safe threshold."

    return _result(RULE_ID, RULE_NAME, status, pledge, 20.0, formula, explanation,
                   latest.source or "Screener.in", latest.data_date)


# ─── RULE 2: Negative Cash Flow + Positive Profit ─────────────────────────────
def rule_cash_profit_mismatch(stock, fundamentals: list) -> dict:
    RULE_ID, RULE_NAME = 2, "CASH FLOW vs PROFIT MISMATCH"
    if not fundamentals:
        return _na(RULE_ID, RULE_NAME, "No fundamentals data")
    latest = fundamentals[0]
    ocf = latest.operating_cash_flow
    profit = latest.net_profit
    if ocf is None or profit is None:
        return _na(RULE_ID, RULE_NAME, "Operating cash flow or net profit missing")

    formula = "operating_cash_flow < 0 AND net_profit > 0"
    if profit > 0 and ocf < 0:
        status = "FAIL"
        explanation = (
            f"Reported profit ₹{profit:.0f}Cr but operating cash flow is ₹{ocf:.0f}Cr. "
            "Negative OCF with positive profit suggests aggressive accrual accounting or working capital issues."
        )
    elif profit > 0 and ocf < profit * 0.5:
        status = "WARN"
        explanation = (
            f"Operating cash flow ₹{ocf:.0f}Cr is less than 50% of net profit ₹{profit:.0f}Cr. "
            "Low cash conversion ratio warrants monitoring."
        )
    else:
        status = "PASS"
        explanation = f"Cash flow ₹{ocf:.0f}Cr broadly consistent with profit ₹{profit:.0f}Cr."

    return _result(RULE_ID, RULE_NAME, status, ocf, 0, formula, explanation,
                   latest.source or "Screener.in", latest.data_date)


# ─── RULE 3: Receivables Growing 1.5x Faster Than Revenue ────────────────────
def rule_receivables_growth(stock, fundamentals: list) -> dict:
    RULE_ID, RULE_NAME = 3, "RECEIVABLES GROWING > 1.5× REVENUE GROWTH"
    if len(fundamentals) < 2:
        return _na(RULE_ID, RULE_NAME, "Need at least 2 periods of data")
    curr = fundamentals[0]
    prev = fundamentals[1]
    # For receivables we use revenue as proxy when receivables not stored separately
    if curr.revenue is None or prev.revenue is None:
        return _na(RULE_ID, RULE_NAME, "Revenue data unavailable")
    rev_growth = (curr.revenue - prev.revenue) / abs(prev.revenue) if prev.revenue else None
    if rev_growth is None:
        return _na(RULE_ID, RULE_NAME, "Cannot compute revenue growth")

    formula = "receivables_growth > 1.5 × revenue_growth"
    # When we have actual receivables, use them. Else NA.
    return _na(RULE_ID, RULE_NAME, "Receivables data not ingested yet — check Screener for trade receivables")


# ─── RULE 4: Debt/Equity > 2 (skip financials) ───────────────────────────────
def rule_debt_equity(stock, fundamentals: list) -> dict:
    RULE_ID, RULE_NAME = 4, "DEBT/EQUITY > 2"
    sector = (stock.sector or "").strip()
    if any(fs.lower() in sector.lower() for fs in FINANCIAL_SECTORS):
        return _result(RULE_ID, RULE_NAME, "NA", None, 2.0,
                       "Skipped for financial sector companies",
                       f"Rule skipped — {sector} companies carry structural debt; D/E not meaningful here.",
                       "Rules Engine", None)
    if not fundamentals:
        return _na(RULE_ID, RULE_NAME, "No fundamentals data")
    latest = fundamentals[0]
    de = latest.debt_equity
    if de is None:
        return _na(RULE_ID, RULE_NAME, "Debt/Equity ratio not available")

    formula = "debt / equity > 2"
    if de > 2:
        status = "FAIL"
        explanation = f"Debt/Equity ratio {de:.2f} — above 2× threshold. High leverage risk."
    elif de > 1:
        status = "WARN"
        explanation = f"Debt/Equity ratio {de:.2f} — elevated but below 2× threshold."
    else:
        status = "PASS"
        explanation = f"Debt/Equity ratio {de:.2f} — within healthy range."

    return _result(RULE_ID, RULE_NAME, status, de, 2.0, formula, explanation,
                   latest.source or "Screener.in", latest.data_date)


# ─── RULE 5: Interest Coverage < 2 ───────────────────────────────────────────
def rule_interest_coverage(stock, fundamentals: list) -> dict:
    RULE_ID, RULE_NAME = 5, "INTEREST COVERAGE < 2"
    if not fundamentals:
        return _na(RULE_ID, RULE_NAME, "No fundamentals data")
    latest = fundamentals[0]
    ic = latest.interest_coverage
    if ic is None:
        return _na(RULE_ID, RULE_NAME, "Interest coverage not available")

    formula = "EBIT / interest_expense < 2"
    if ic < 1:
        status = "FAIL"
        explanation = f"Interest coverage {ic:.2f}× — company cannot cover interest from operating profit."
    elif ic < 2:
        status = "FAIL"
        explanation = f"Interest coverage {ic:.2f}× — below 2× safety threshold. Debt servicing risk."
    elif ic < 3:
        status = "WARN"
        explanation = f"Interest coverage {ic:.2f}× — marginally above threshold. Monitor closely."
    else:
        status = "PASS"
        explanation = f"Interest coverage {ic:.2f}× — adequate."

    return _result(RULE_ID, RULE_NAME, status, ic, 2.0, formula, explanation,
                   latest.source or "Screener.in", latest.data_date)


# ─── RULE 6: Promoter Holding Falling 3+ Quarters ────────────────────────────
def rule_promoter_falling(stock, shareholdings: list) -> dict:
    RULE_ID, RULE_NAME = 6, "PROMOTER HOLDING FALLING ≥ 3 QUARTERS"
    if len(shareholdings) < 3:
        return _na(RULE_ID, RULE_NAME, f"Only {len(shareholdings)} quarters of data — need ≥3")

    sorted_sh = sorted(shareholdings, key=lambda x: x.quarter, reverse=True)
    last3 = sorted_sh[:3]
    holdings = [s.promoter_pct for s in last3 if s.promoter_pct is not None]
    if len(holdings) < 3:
        return _na(RULE_ID, RULE_NAME, "Promoter holding data missing for ≥3 quarters")

    # Check consecutive decline: [most_recent, older, oldest]
    is_falling = all(holdings[i] < holdings[i + 1] for i in range(len(holdings) - 1))
    current = holdings[0]
    oldest = holdings[-1]
    change = current - oldest

    formula = "promoter_pct[Q-0] < promoter_pct[Q-1] < promoter_pct[Q-2]"
    if is_falling:
        status = "FAIL"
        explanation = (
            f"Promoter holding has fallen consistently for {len(holdings)} quarters. "
            f"Current: {current:.1f}% vs {len(holdings)-1} quarters ago: {oldest:.1f}% (Δ {change:+.1f}%). "
            "Sustained promoter selling is a significant red flag."
        )
    else:
        status = "PASS"
        explanation = f"Promoter holding stable or increasing. Current: {current:.1f}%."

    return _result(RULE_ID, RULE_NAME, status, current, None, formula, explanation,
                   last3[0].source or "Screener.in", last3[0].data_date)


# ─── RULE 7: Auditor Change ───────────────────────────────────────────────────
def rule_auditor_change(stock, fundamentals: list) -> dict:
    """
    Auditor change detection requires parsing annual report notes.
    This engine checks for a flag set during fundamentals ingestion.
    """
    RULE_ID, RULE_NAME = 7, "AUDITOR CHANGE"
    # Check if auditor_changed flag was set during ingestion
    # For now, returns NA until auditor data is ingested
    return _na(RULE_ID, RULE_NAME,
               "Auditor change detection requires annual report parsing — "
               "will be populated when BSE/NSE announcement feed is ingested")


# ─── MAIN RUNNER ─────────────────────────────────────────────────────────────
def run_red_flags(stock, fundamentals: list, shareholdings: list) -> list[dict]:
    """
    Run all 7 rules.
    Returns a list of rule results ordered by rule_id.
    AI must NEVER call this function — it is for display + evidence pack only.
    """
    rules = [
        rule_promoter_pledge(stock, shareholdings),
        rule_cash_profit_mismatch(stock, fundamentals),
        rule_receivables_growth(stock, fundamentals),
        rule_debt_equity(stock, fundamentals),
        rule_interest_coverage(stock, fundamentals),
        rule_promoter_falling(stock, shareholdings),
        rule_auditor_change(stock, fundamentals),
    ]
    logger.info(
        "Red flags for %s: %s",
        stock.symbol,
        {r["rule_name"]: r["status"] for r in rules},
    )
    return rules
