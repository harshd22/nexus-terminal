"""
NEXUS TERMINAL — Fixed Income & Bond Market Intelligence Provider
Coverage:
  1. Indian Sovereign G-Sec Yield Curve (91D T-Bill to 30Y G-Sec)
  2. Corporate & PSU Bonds (AAA/AA+ papers with yield spreads)
  3. Sovereign Gold Bonds (SGB) secondary market pricing & gold parity
"""

import logging
from typing import List, Dict, Any, Optional

logger = logging.getLogger("nexus.bonds")

# G-Sec Yield Curve Dataset
GSEC_YIELD_CURVE: List[Dict[str, Any]] = [
    {
        "id": "gsec-91d",
        "tenor": "91-Day T-Bill",
        "tenor_years": 0.25,
        "type": "Treasury Bill",
        "yield_pct": 6.72,
        "previous_yield_pct": 6.75,
        "change_bp": -3.0,
        "coupon_pct": 0.0,
        "price": 98.35,
        "volume_cr": 4250.0
    },
    {
        "id": "gsec-182d",
        "tenor": "182-Day T-Bill",
        "tenor_years": 0.50,
        "type": "Treasury Bill",
        "yield_pct": 6.78,
        "previous_yield_pct": 6.80,
        "change_bp": -2.0,
        "coupon_pct": 0.0,
        "price": 96.72,
        "volume_cr": 2890.0
    },
    {
        "id": "gsec-364d",
        "tenor": "364-Day T-Bill",
        "tenor_years": 1.0,
        "type": "Treasury Bill",
        "yield_pct": 6.82,
        "previous_yield_pct": 6.84,
        "change_bp": -2.0,
        "coupon_pct": 0.0,
        "price": 93.62,
        "volume_cr": 3540.0
    },
    {
        "id": "gsec-3y",
        "tenor": "3-Year G-Sec",
        "tenor_years": 3.0,
        "type": "Sovereign Bond",
        "yield_pct": 6.88,
        "previous_yield_pct": 6.91,
        "change_bp": -3.0,
        "coupon_pct": 7.06,
        "price": 100.48,
        "volume_cr": 5120.0
    },
    {
        "id": "gsec-5y",
        "tenor": "5-Year G-Sec",
        "tenor_years": 5.0,
        "type": "Sovereign Bond",
        "yield_pct": 6.92,
        "previous_yield_pct": 6.95,
        "change_bp": -3.0,
        "coupon_pct": 7.17,
        "price": 101.05,
        "volume_cr": 8450.0
    },
    {
        "id": "gsec-10y",
        "tenor": "10-Year Benchmark G-Sec",
        "tenor_years": 10.0,
        "type": "Sovereign Bond (Benchmark)",
        "yield_pct": 6.98,
        "previous_yield_pct": 7.04,
        "change_bp": -6.0,
        "coupon_pct": 7.10,
        "price": 100.82,
        "volume_cr": 18450.0
    },
    {
        "id": "gsec-30y",
        "tenor": "30-Year Long G-Sec",
        "tenor_years": 30.0,
        "type": "Sovereign Bond",
        "yield_pct": 7.12,
        "previous_yield_pct": 7.16,
        "change_bp": -4.0,
        "coupon_pct": 7.30,
        "price": 102.15,
        "volume_cr": 3200.0
    }
]

# Corporate & PSU Bonds Dataset
CORPORATE_BONDS: List[Dict[str, Any]] = [
    {
        "id": "corp-rec-2029",
        "issuer": "REC Limited (Power Finance)",
        "symbol": "RECLTD29",
        "rating": "AAA (STABLE)",
        "category": "PSU Financial",
        "coupon_pct": 7.55,
        "ytm_pct": 7.42,
        "spread_over_gsec_bp": 50,
        "price": 100.65,
        "maturity_date": "2029-06-15",
        "face_value": 100000,
        "min_qty": 1
    },
    {
        "id": "corp-pfc-2030",
        "issuer": "Power Finance Corporation",
        "symbol": "PFC30",
        "rating": "AAA (STABLE)",
        "category": "PSU Financial",
        "coupon_pct": 7.60,
        "ytm_pct": 7.48,
        "spread_over_gsec_bp": 56,
        "price": 100.50,
        "maturity_date": "2030-03-20",
        "face_value": 100000,
        "min_qty": 1
    },
    {
        "id": "corp-nabard-2028",
        "issuer": "NABARD (National Agriculture Bank)",
        "symbol": "NABARD28",
        "rating": "AAA (STABLE)",
        "category": "Apex Institution",
        "coupon_pct": 7.45,
        "ytm_pct": 7.35,
        "spread_over_gsec_bp": 43,
        "price": 100.40,
        "maturity_date": "2028-11-10",
        "face_value": 100000,
        "min_qty": 1
    },
    {
        "id": "corp-hdfc-2031",
        "issuer": "HDFC Bank Ltd (Tier II)",
        "symbol": "HDFCB2031",
        "rating": "AAA (STABLE)",
        "category": "Private Bank",
        "coupon_pct": 7.80,
        "ytm_pct": 7.65,
        "spread_over_gsec_bp": 73,
        "price": 100.90,
        "maturity_date": "2031-09-28",
        "face_value": 100000,
        "min_qty": 1
    },
    {
        "id": "corp-lt-finance-2027",
        "issuer": "L&T Finance Holdings",
        "symbol": "LTFH27",
        "rating": "AAA (STABLE)",
        "category": "Private NBFC",
        "coupon_pct": 8.05,
        "ytm_pct": 7.85,
        "spread_over_gsec_bp": 93,
        "price": 101.20,
        "maturity_date": "2027-05-18",
        "face_value": 100000,
        "min_qty": 1
    },
    {
        "id": "corp-tata-capital-2028",
        "issuer": "Tata Capital Financial Services",
        "symbol": "TATACAP28",
        "rating": "AAA (STABLE)",
        "category": "Conglomerate NBFC",
        "coupon_pct": 7.95,
        "ytm_pct": 7.78,
        "spread_over_gsec_bp": 86,
        "price": 100.75,
        "maturity_date": "2028-08-25",
        "face_value": 100000,
        "min_qty": 1
    }
]

# Sovereign Gold Bonds (SGB) Secondary Market Dataset
SGB_MARKET: List[Dict[str, Any]] = [
    {
        "id": "sgb-2031-series-i",
        "symbol": "SGBMAY31",
        "series": "SGB 2023-24 Series I",
        "coupon_pct": 2.50,
        "market_price_per_gram": 15890,
        "gold_spot_parity_price": 16045,
        "discount_premium_pct": -0.96,
        "status": "Discount",
        "issue_price": 5923,
        "maturity_date": "2031-05-24",
        "volume_units": 1420
    },
    {
        "id": "sgb-2030-series-iv",
        "symbol": "SGBFEB30",
        "series": "SGB 2022-23 Series IV",
        "coupon_pct": 2.50,
        "market_price_per_gram": 15760,
        "gold_spot_parity_price": 16045,
        "discount_premium_pct": -1.77,
        "status": "Discount",
        "issue_price": 5611,
        "maturity_date": "2030-02-28",
        "volume_units": 2150
    },
    {
        "id": "sgb-2029-series-iii",
        "symbol": "SGBNOV29",
        "series": "SGB 2021-22 Series III",
        "coupon_pct": 2.50,
        "market_price_per_gram": 15710,
        "gold_spot_parity_price": 16045,
        "discount_premium_pct": -2.08,
        "status": "Discount",
        "issue_price": 4761,
        "maturity_date": "2029-11-16",
        "volume_units": 1890
    },
    {
        "id": "sgb-2028-series-iv",
        "symbol": "SGBMAR28",
        "series": "SGB 2019-20 Series IV",
        "coupon_pct": 2.50,
        "market_price_per_gram": 15980,
        "gold_spot_parity_price": 16045,
        "discount_premium_pct": -0.40,
        "status": "Par",
        "issue_price": 4260,
        "maturity_date": "2028-03-17",
        "volume_units": 3100
    }
]


class BondsProvider:
    """Provider for Sovereign G-Secs, Corporate Papers, and Sovereign Gold Bonds (SGBs)."""

    @classmethod
    def get_yield_curve(cls) -> List[Dict[str, Any]]:
        return GSEC_YIELD_CURVE

    @classmethod
    def get_corporate_bonds(cls) -> List[Dict[str, Any]]:
        return CORPORATE_BONDS

    @classmethod
    def get_sgb_market(cls) -> List[Dict[str, Any]]:
        return SGB_MARKET

    @classmethod
    def get_summary(cls) -> Dict[str, Any]:
        gsec_10y = next(x for x in GSEC_YIELD_CURVE if x["id"] == "gsec-10y")
        gsec_5y = next(x for x in GSEC_YIELD_CURVE if x["id"] == "gsec-5y")
        avg_corp_spread = sum(x["spread_over_gsec_bp"] for x in CORPORATE_BONDS) / len(CORPORATE_BONDS)
        
        return {
            "benchmark_10y_gsec_yield": gsec_10y["yield_pct"],
            "benchmark_10y_gsec_change_bp": gsec_10y["change_bp"],
            "gsec_5y_yield": gsec_5y["yield_pct"],
            "avg_aaa_corporate_spread_bp": round(avg_corp_spread, 1),
            "spot_gold_reference_per_gram": 16045,
            "total_sgb_issues_tracked": len(SGB_MARKET),
            "total_corporate_bonds": len(CORPORATE_BONDS)
        }
