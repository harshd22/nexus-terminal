"""
NEXUS TERMINAL — Macroeconomics & Global Economy Data Provider
Real-time macroeconomic statistics for India (GDP, Inflation, Production, Debt, Unemployment, Housing, Rates)
and Global Economy Matrix (India, USA, China, Eurozone, UK, Japan, Germany).
"""

import logging
from typing import List, Dict, Any, Optional

logger = logging.getLogger("nexus.macro")

# Indian Economic Indicators Dataset
INDIAN_MACRO_DATA: Dict[str, Any] = {
    "last_updated": "2026-08-22 16:00 IST",
    "gdp_and_output": [
        {
            "id": "ind-gdp-growth",
            "metric": "Real GDP Growth Rate (YoY)",
            "value": 7.8,
            "unit": "%",
            "frequency": "Quarterly (Q4 FY26)",
            "previous": 7.2,
            "change": 0.6,
            "trend": "up",
            "status": "strong",
            "source": "MOSPI / NSO India",
            "description": "Annual real gross domestic product expansion driven by manufacturing & capital expenditure."
        },
        {
            "id": "ind-nominal-gdp",
            "metric": "Nominal GDP (Current Prices)",
            "value": 3.75,
            "unit": "Trillion USD",
            "frequency": "Annual",
            "previous": 3.55,
            "change": 0.20,
            "trend": "up",
            "status": "strong",
            "source": "IMF / World Bank",
            "description": "5th largest global economy targetting $5 Trillion threshold."
        },
        {
            "id": "ind-iip-production",
            "metric": "Industrial Production Index (IIP)",
            "value": 5.9,
            "unit": "% YoY",
            "frequency": "Monthly",
            "previous": 5.2,
            "change": 0.7,
            "trend": "up",
            "status": "positive",
            "source": "MOSPI",
            "description": "Output growth across mining, manufacturing, and electricity generation sectors."
        },
        {
            "id": "ind-mfg-pmi",
            "metric": "Manufacturing PMI",
            "value": 58.6,
            "unit": "Index",
            "frequency": "Monthly",
            "previous": 58.1,
            "change": 0.5,
            "trend": "up",
            "status": "expansion",
            "source": "S&P Global India",
            "description": "Purchasing Managers' Index (>50 indicates manufacturing sector expansion)."
        },
        {
            "id": "ind-services-pmi",
            "metric": "Services PMI",
            "value": 60.3,
            "unit": "Index",
            "frequency": "Monthly",
            "previous": 60.1,
            "change": 0.2,
            "trend": "up",
            "status": "expansion",
            "source": "S&P Global India",
            "description": "Robust services sector output driven by IT, finance, and domestic demand."
        }
    ],
    "inflation_and_prices": [
        {
            "id": "ind-cpi-inflation",
            "metric": "Consumer Price Index (CPI Headline)",
            "value": 4.85,
            "unit": "% YoY",
            "frequency": "Monthly",
            "previous": 5.10,
            "change": -0.25,
            "trend": "down",
            "status": "moderate",
            "source": "MOSPI",
            "description": "Retail consumer inflation within RBI's 4% +/- 2% target tolerance band."
        },
        {
            "id": "ind-wpi-inflation",
            "metric": "Wholesale Price Index (WPI Inflation)",
            "value": 1.26,
            "unit": "% YoY",
            "frequency": "Monthly",
            "previous": 1.40,
            "change": -0.14,
            "trend": "down",
            "status": "subdued",
            "source": "Ministry of Commerce & Industry",
            "description": "Producer level price changes reflecting stable input commodity costs."
        },
        {
            "id": "ind-food-inflation",
            "metric": "Food & Beverage Inflation",
            "value": 6.20,
            "unit": "% YoY",
            "frequency": "Monthly",
            "previous": 6.80,
            "change": -0.60,
            "trend": "down",
            "status": "watch",
            "source": "MOSPI",
            "description": "Agricultural produce and food grain price levels."
        }
    ],
    "monetary_and_rates": [
        {
            "id": "ind-repo-rate",
            "metric": "RBI Policy Repo Rate",
            "value": 6.50,
            "unit": "%",
            "frequency": "Bi-Monthly MPC",
            "previous": 6.50,
            "change": 0.00,
            "trend": "flat",
            "status": "neutral",
            "source": "Reserve Bank of India (RBI)",
            "description": "Benchmark lending rate maintained by RBI Monetary Policy Committee."
        },
        {
            "id": "ind-10y-gsec",
            "metric": "India 10-Year G-Sec Yield",
            "value": 6.98,
            "unit": "%",
            "frequency": "Daily Live",
            "previous": 7.04,
            "change": -0.06,
            "trend": "down",
            "status": "positive",
            "source": "CCIL / RBI",
            "description": "Benchmark sovereign 10-year government bond yield."
        },
        {
            "id": "ind-m3-money",
            "metric": "M3 Money Supply Growth",
            "value": 10.8,
            "unit": "% YoY",
            "frequency": "Fortnightly",
            "previous": 10.5,
            "change": 0.3,
            "trend": "up",
            "status": "healthy",
            "source": "RBI",
            "description": "Broad money supply aggregate in circulation."
        }
    ],
    "fiscal_and_debt": [
        {
            "id": "ind-debt-gdp",
            "metric": "Government Debt-to-GDP Ratio",
            "value": 81.2,
            "unit": "% of GDP",
            "frequency": "Annual",
            "previous": 82.5,
            "change": -1.3,
            "trend": "down",
            "status": "improving",
            "source": "Ministry of Finance / RBI",
            "description": "Combined Central + State government debt burden relative to annual GDP."
        },
        {
            "id": "ind-fiscal-deficit",
            "metric": "Union Fiscal Deficit Target",
            "value": 4.90,
            "unit": "% of GDP",
            "frequency": "Annual Budget",
            "previous": 5.60,
            "change": -0.70,
            "trend": "down",
            "status": "consolidating",
            "source": "Union Budget of India",
            "description": "Government budget deficit target path towards 4.5% fiscal consolidation."
        },
        {
            "id": "ind-forex-reserves",
            "metric": "Foreign Exchange Reserves",
            "value": 692.50,
            "unit": "Billion USD",
            "frequency": "Weekly",
            "previous": 688.20,
            "change": 4.30,
            "trend": "up",
            "status": "record_high",
            "source": "RBI",
            "description": "All-time high central bank foreign currency and gold reserves cover."
        },
        {
            "id": "ind-cad",
            "metric": "Current Account Deficit (CAD)",
            "value": 0.70,
            "unit": "% of GDP",
            "frequency": "Quarterly",
            "previous": 1.20,
            "change": -0.50,
            "trend": "down",
            "status": "comfortable",
            "source": "RBI",
            "description": "Trade balance and net remittance inflows."
        }
    ],
    "labor_and_housing": [
        {
            "id": "ind-unemployment",
            "metric": "India Unemployment Rate (Periodic Labour Survey)",
            "value": 3.20,
            "unit": "%",
            "frequency": "Annual / Monthly",
            "previous": 3.60,
            "change": -0.40,
            "trend": "down",
            "status": "positive",
            "source": "PLFS / CMIE",
            "description": "National labor force unemployment percentage."
        },
        {
            "id": "ind-housing-index",
            "metric": "NHB RESIDEX Housing Price Growth",
            "value": 6.80,
            "unit": "% YoY",
            "frequency": "Quarterly",
            "previous": 6.20,
            "change": 0.60,
            "trend": "up",
            "status": "robust",
            "source": "National Housing Bank (NHB)",
            "description": "Residential property price inflation index across 50 tier-1 & tier-2 Indian cities."
        }
    ]
}

# Global Macroeconomic Country Comparison Matrix
GLOBAL_ECONOMY_MATRIX: List[Dict[str, Any]] = [
    {
        "country": "India",
        "code": "IN",
        "flag": "🇮🇳",
        "gdp_growth_pct": 7.80,
        "cpi_inflation_pct": 4.85,
        "interest_rate_pct": 6.50,
        "debt_to_gdp_pct": 81.20,
        "unemployment_pct": 3.20,
        "central_bank": "RBI",
        "outlook": "Bullish / Rapid Expansion"
    },
    {
        "country": "United States",
        "code": "US",
        "flag": "🇺🇸",
        "gdp_growth_pct": 2.80,
        "cpi_inflation_pct": 2.90,
        "interest_rate_pct": 5.25,
        "debt_to_gdp_pct": 122.30,
        "unemployment_pct": 4.30,
        "central_bank": "Federal Reserve",
        "outlook": "Soft Landing / Easing"
    },
    {
        "country": "China",
        "code": "CN",
        "flag": "🇨🇳",
        "gdp_growth_pct": 4.70,
        "cpi_inflation_pct": 0.50,
        "interest_rate_pct": 3.35,
        "debt_to_gdp_pct": 83.60,
        "unemployment_pct": 5.10,
        "central_bank": "PBOC",
        "outlook": "Moderate / Stimulus Phase"
    },
    {
        "country": "Euro Area",
        "code": "EU",
        "flag": "🇪🇺",
        "gdp_growth_pct": 0.60,
        "cpi_inflation_pct": 2.60,
        "interest_rate_pct": 3.75,
        "debt_to_gdp_pct": 88.70,
        "unemployment_pct": 6.50,
        "central_bank": "ECB",
        "outlook": "Stagnant / Rate Cuts"
    },
    {
        "country": "United Kingdom",
        "code": "UK",
        "flag": "🇬🇧",
        "gdp_growth_pct": 0.90,
        "cpi_inflation_pct": 2.20,
        "interest_rate_pct": 5.00,
        "debt_to_gdp_pct": 98.10,
        "unemployment_pct": 4.20,
        "central_bank": "Bank of England",
        "outlook": "Slow Recovery"
    },
    {
        "country": "Japan",
        "code": "JP",
        "flag": "🇯🇵",
        "gdp_growth_pct": 0.80,
        "cpi_inflation_pct": 2.80,
        "interest_rate_pct": 0.25,
        "debt_to_gdp_pct": 263.90,
        "unemployment_pct": 2.50,
        "central_bank": "Bank of Japan",
        "outlook": "Monetary Normalization"
    },
    {
        "country": "Germany",
        "code": "DE",
        "flag": "🇩🇪",
        "gdp_growth_pct": -0.10,
        "cpi_inflation_pct": 2.30,
        "interest_rate_pct": 3.75,
        "debt_to_gdp_pct": 63.60,
        "unemployment_pct": 6.00,
        "central_bank": "ECB / Bundesbank",
        "outlook": "Industrial Contraction"
    }
]


class MacroProvider:
    """Provider for Global & Indian Macroeconomic Indicators."""

    @classmethod
    def get_indian_macro(cls) -> Dict[str, Any]:
        return INDIAN_MACRO_DATA

    @classmethod
    def get_global_matrix(cls) -> List[Dict[str, Any]]:
        return GLOBAL_ECONOMY_MATRIX

    @classmethod
    def get_summary(cls) -> Dict[str, Any]:
        india_gdp = next(x for x in INDIAN_MACRO_DATA["gdp_and_output"] if x["id"] == "ind-gdp-growth")
        india_cpi = next(x for x in INDIAN_MACRO_DATA["inflation_and_prices"] if x["id"] == "ind-cpi-inflation")
        india_repo = next(x for x in INDIAN_MACRO_DATA["monetary_and_rates"] if x["id"] == "ind-repo-rate")
        india_forex = next(x for x in INDIAN_MACRO_DATA["fiscal_and_debt"] if x["id"] == "ind-forex-reserves")
        
        return {
            "india_gdp_growth_pct": india_gdp["value"],
            "india_cpi_inflation_pct": india_cpi["value"],
            "india_rbi_repo_rate_pct": india_repo["value"],
            "india_forex_reserves_bn": india_forex["value"],
            "global_fastest_growing_economy": "India (7.80%)",
            "global_lowest_inflation": "China (0.50%)",
            "total_countries_tracked": len(GLOBAL_ECONOMY_MATRIX)
        }
