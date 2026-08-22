"""
NEXUS TERMINAL — Test Suite
Tests for: red flags, scoring, CAGR, MA, portfolio, breadth, missing data.
All pure Python — no DB, no API, no AI.
"""
import pytest
from unittest.mock import MagicMock
from engines.red_flags import (
    run_red_flags,
    rule_promoter_pledge,
    rule_cash_profit_mismatch,
    rule_debt_equity,
    rule_interest_coverage,
    rule_promoter_falling,
)
from engines.scoring import compute_score
from engines.technicals import _sma, _ema, _cagr, compute_technicals
from engines.portfolio import compute_portfolio_stats, compute_allocation, compute_breadth


# ─── Fixtures ────────────────────────────────────────────────────────────────

def make_stock(sector="Technology"):
    s = MagicMock()
    s.symbol = "TESTCO"
    s.sector = sector
    return s


def make_fundamental(**kwargs):
    defaults = {
        "pe": 20.0, "pb": 3.0, "roe": 15.0, "roce": 18.0,
        "debt_equity": 0.5, "interest_coverage": 5.0,
        "revenue": 1000.0, "net_profit": 150.0,
        "operating_cash_flow": 130.0, "free_cash_flow": 100.0,
        "revenue_growth": 0.15, "profit_growth": 0.20,
        "ebitda_margin": 0.25,
        "source": "Screener.in", "data_date": None,
    }
    defaults.update(kwargs)
    f = MagicMock()
    for k, v in defaults.items():
        setattr(f, k, v)
    return f


def make_shareholding(quarter="Q1FY27", promoter_pct=55.0, pledge=5.0):
    s = MagicMock()
    s.quarter = quarter
    s.promoter_pct = promoter_pct
    s.promoter_pledge_pct = pledge
    s.source = "Screener.in"
    s.data_date = None
    return s


def make_price(close: float):
    p = MagicMock()
    p.close = close
    return p


# ─── Red Flag Tests ──────────────────────────────────────────────────────────

class TestPromoterPledge:
    def test_pass_low_pledge(self):
        sh = [make_shareholding(pledge=5.0)]
        result = rule_promoter_pledge(make_stock(), sh)
        assert result["status"] == "PASS"

    def test_warn_elevated_pledge(self):
        sh = [make_shareholding(pledge=15.0)]
        result = rule_promoter_pledge(make_stock(), sh)
        assert result["status"] == "WARN"

    def test_fail_high_pledge(self):
        sh = [make_shareholding(pledge=25.0)]
        result = rule_promoter_pledge(make_stock(), sh)
        assert result["status"] == "FAIL"

    def test_na_missing_data(self):
        result = rule_promoter_pledge(make_stock(), [])
        assert result["status"] == "NA"

    def test_na_missing_pledge_field(self):
        sh = [make_shareholding(pledge=None)]
        result = rule_promoter_pledge(make_stock(), sh)
        assert result["status"] == "NA"

    def test_idempotent(self):
        """Same input always yields same output."""
        sh = [make_shareholding(pledge=22.0)]
        r1 = rule_promoter_pledge(make_stock(), sh)
        r2 = rule_promoter_pledge(make_stock(), sh)
        assert r1["status"] == r2["status"]
        assert r1["value"] == r2["value"]


class TestCashProfitMismatch:
    def test_fail_negative_ocf_positive_profit(self):
        f = [make_fundamental(operating_cash_flow=-50.0, net_profit=100.0)]
        result = rule_cash_profit_mismatch(make_stock(), f)
        assert result["status"] == "FAIL"

    def test_pass_positive_both(self):
        f = [make_fundamental(operating_cash_flow=120.0, net_profit=100.0)]
        result = rule_cash_profit_mismatch(make_stock(), f)
        assert result["status"] == "PASS"

    def test_na_missing_data(self):
        result = rule_cash_profit_mismatch(make_stock(), [])
        assert result["status"] == "NA"

    def test_na_missing_ocf(self):
        f = [make_fundamental(operating_cash_flow=None, net_profit=100.0)]
        result = rule_cash_profit_mismatch(make_stock(), f)
        assert result["status"] == "NA"


class TestDebtEquity:
    def test_pass_low_de(self):
        f = [make_fundamental(debt_equity=0.3)]
        result = rule_debt_equity(make_stock(), f)
        assert result["status"] == "PASS"

    def test_warn_moderate_de(self):
        f = [make_fundamental(debt_equity=1.5)]
        result = rule_debt_equity(make_stock(), f)
        assert result["status"] == "WARN"

    def test_fail_high_de(self):
        f = [make_fundamental(debt_equity=3.0)]
        result = rule_debt_equity(make_stock(), f)
        assert result["status"] == "FAIL"

    def test_na_financial_sector(self):
        f = [make_fundamental(debt_equity=5.0)]
        result = rule_debt_equity(make_stock(sector="Banking"), f)
        assert result["status"] == "NA"

    def test_na_missing_data(self):
        f = [make_fundamental(debt_equity=None)]
        result = rule_debt_equity(make_stock(), f)
        assert result["status"] == "NA"


class TestInterestCoverage:
    def test_pass_high_coverage(self):
        f = [make_fundamental(interest_coverage=8.0)]
        result = rule_interest_coverage(make_stock(), f)
        assert result["status"] == "PASS"

    def test_fail_below_2(self):
        f = [make_fundamental(interest_coverage=1.5)]
        result = rule_interest_coverage(make_stock(), f)
        assert result["status"] == "FAIL"

    def test_na_missing_data(self):
        f = [make_fundamental(interest_coverage=None)]
        result = rule_interest_coverage(make_stock(), f)
        assert result["status"] == "NA"


class TestPromoterFalling:
    def test_fail_consecutive_decline(self):
        sh = [
            make_shareholding("Q3FY27", 52.0),
            make_shareholding("Q2FY27", 54.0),
            make_shareholding("Q1FY27", 56.0),
        ]
        result = rule_promoter_falling(make_stock(), sh)
        assert result["status"] == "FAIL"

    def test_pass_stable(self):
        sh = [
            make_shareholding("Q3FY27", 55.0),
            make_shareholding("Q2FY27", 54.0),
            make_shareholding("Q1FY27", 55.0),
        ]
        result = rule_promoter_falling(make_stock(), sh)
        assert result["status"] == "PASS"

    def test_na_insufficient_data(self):
        sh = [make_shareholding("Q1FY27", 55.0)]
        result = rule_promoter_falling(make_stock(), sh)
        assert result["status"] == "NA"


# ─── Technicals Tests ────────────────────────────────────────────────────────

class TestTechnicals:
    def test_sma_basic(self):
        closes = [10.0, 20.0, 30.0, 40.0, 50.0]
        result = _sma(closes, 3)
        assert result[0] is None
        assert result[1] is None
        assert result[2] == pytest.approx(20.0)
        assert result[4] == pytest.approx(40.0)

    def test_sma_period_too_long(self):
        result = _sma([1.0, 2.0], 5)
        assert all(v is None for v in result)

    def test_cagr_basic(self):
        result = _cagr(100.0, 200.0, 5)
        assert result == pytest.approx(14.87, abs=0.1)

    def test_cagr_zero_start(self):
        assert _cagr(0, 100, 5) is None

    def test_cagr_negative(self):
        assert _cagr(-100, 100, 5) is None

    def test_compute_technicals_empty(self):
        assert compute_technicals([]) == {}

    def test_compute_technicals_basic(self):
        closes = [100.0] * 300
        result = compute_technicals(closes)
        assert result["dma_20"] == pytest.approx(100.0)
        assert result["dma_50"] == pytest.approx(100.0)
        assert result["high_52w"] == pytest.approx(100.0)
        assert result["ath"] == pytest.approx(100.0)


# ─── Portfolio Tests ─────────────────────────────────────────────────────────

class TestPortfolio:
    def _make_holding(self, symbol, qty, avg, current, day_pnl=0):
        return {
            "symbol": symbol,
            "quantity": qty,
            "avg_price": avg,
            "current_price": current,
            "pnl": (current - avg) * qty,
            "day_pnl": day_pnl,
        }

    def test_basic_stats(self):
        holdings = [self._make_holding("A", 10, 100, 120, day_pnl=50)]
        stats = compute_portfolio_stats(holdings)
        assert stats["total_invested"] == pytest.approx(1000.0)
        assert stats["current_value"] == pytest.approx(1200.0)
        assert stats["overall_pnl"] == pytest.approx(200.0)

    def test_allocation_weights(self):
        holdings = [
            self._make_holding("A", 1, 100, 100),
            self._make_holding("B", 1, 100, 300),
        ]
        alloc = compute_allocation(holdings)
        assert len(alloc) == 2
        total_pct = sum(a["weight_pct"] for a in alloc)
        assert total_pct == pytest.approx(100.0, abs=0.1)
        # B should be 75%
        b = next(a for a in alloc if a["symbol"] == "B")
        assert b["weight_pct"] == pytest.approx(75.0)

    def test_empty_holdings(self):
        stats = compute_portfolio_stats([])
        assert stats["total_invested"] == 0
        assert stats["current_value"] == 0


# ─── Breadth Tests ───────────────────────────────────────────────────────────

class TestBreadth:
    def test_basic_breadth(self):
        result = compute_breadth(700, 300)
        assert result["breadth_pct"] == pytest.approx(40.0)

    def test_equal_breadth(self):
        result = compute_breadth(500, 500)
        assert result["breadth_pct"] == pytest.approx(0.0)

    def test_all_winners(self):
        result = compute_breadth(1000, 0)
        assert result["breadth_pct"] == pytest.approx(100.0)
        assert result["ratio"] is None  # division by zero handled

    def test_all_losers(self):
        result = compute_breadth(0, 1000)
        assert result["breadth_pct"] == pytest.approx(-100.0)

    def test_zero_total(self):
        result = compute_breadth(0, 0)
        assert result["breadth_pct"] == 0.0


# ─── Scoring Tests ───────────────────────────────────────────────────────────

class TestScoring:
    def test_score_range(self):
        stock = make_stock()
        f = [make_fundamental()]
        sh = [make_shareholding()]
        prices = [make_price(float(i)) for i in range(100, 400)]
        flags = run_red_flags(stock, f, sh)
        score = compute_score(stock, f, sh, prices, flags)
        assert 0.0 <= score["total_score"] <= 10.0

    def test_penalty_reduces_score(self):
        stock = make_stock()
        # High debt = FAIL
        f_bad  = [make_fundamental(debt_equity=3.0, interest_coverage=1.0)]
        f_good = [make_fundamental(debt_equity=0.1, interest_coverage=10.0)]
        sh = [make_shareholding()]
        prices = [make_price(float(i)) for i in range(100, 400)]
        flags_bad  = run_red_flags(stock, f_bad, sh)
        flags_good = run_red_flags(stock, f_good, sh)
        score_bad  = compute_score(stock, f_bad, sh, prices, flags_bad)
        score_good = compute_score(stock, f_good, sh, prices, flags_good)
        assert score_good["total_score"] >= score_bad["total_score"]

    def test_score_idempotent(self):
        stock = make_stock()
        f = [make_fundamental()]
        sh = [make_shareholding()]
        prices = [make_price(100.0)] * 300
        flags = run_red_flags(stock, f, sh)
        s1 = compute_score(stock, f, sh, prices, flags)
        s2 = compute_score(stock, f, sh, prices, flags)
        assert s1["total_score"] == s2["total_score"]
