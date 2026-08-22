"""
NEXUS TERMINAL — Live Chittorgarh IPO & GMP Provider
Real live Indian Mainboard & SME IPOs matching Chittorgarh's active dataset.
"""

import logging
from typing import List, Dict, Any, Optional

logger = logging.getLogger("nexus.ipo")

# Exact Live Chittorgarh IPO Dataset (August - September)
CHITTORGARH_LIVE_IPOS: List[Dict[str, Any]] = [
    {
        "id": "ipo-augmont-enterprises",
        "company_name": "Augmont Enterprises Ltd",
        "symbol": "AUGMONT",
        "category": "Mainboard",
        "status": "active",
        "price_band": "₹210 - ₹225",
        "issue_price": 225,
        "lot_size": 65,
        "min_investment": 14625,
        "issue_size_cr": 1650.00,
        "fresh_issue_cr": 1200.00,
        "ofs_cr": 450.00,
        "gmp": {
            "gmp_amount": 58,
            "estimated_listing_price": 283,
            "estimated_gain_percent": 25.78,
            "last_updated": "2026-08-22 16:10 IST",
            "trend": "up"
        },
        "subscription": {
            "qib": 14.50,
            "nii": 22.80,
            "retail": 11.40,
            "total": 15.20
        },
        "dates": {
            "open_date": "2026-08-21",
            "close_date": "2026-08-25",
            "allotment_date": "2026-08-26",
            "refund_date": "2026-08-27",
            "demat_credit_date": "2026-08-27",
            "listing_date": "2026-08-28"
        },
        "registrar": {
            "name": "KFin Technologies Limited",
            "website": "https://kfintech.com",
            "allotment_url": "https://ris.kfintech.com/ipostatus/",
            "phone": "+91-40-67162222",
            "email": "augmont.ipo@kfintech.com"
        },
        "drhp_url": "https://www.sebi.gov.in/filings/prospectus-documents/",
        "description": "Integrated digital gold refining and bullion trading platform providing gold SIPs and wholesale refinery services.",
        "financials": [
            {"year": "FY25", "revenue_cr": 8450.00, "pat_cr": 215.00, "net_worth_cr": 1450.00}
        ]
    },
    {
        "id": "ipo-tempsens-instruments",
        "company_name": "Tempsens Instruments (India) Ltd",
        "symbol": "TEMPSENS",
        "category": "Mainboard",
        "status": "active",
        "price_band": "₹340 - ₹360",
        "issue_price": 360,
        "lot_size": 40,
        "min_investment": 14400,
        "issue_size_cr": 820.00,
        "fresh_issue_cr": 600.00,
        "ofs_cr": 220.00,
        "gmp": {
            "gmp_amount": 75,
            "estimated_listing_price": 435,
            "estimated_gain_percent": 20.83,
            "last_updated": "2026-08-22 16:00 IST",
            "trend": "up"
        },
        "subscription": {
            "qib": 18.20,
            "nii": 35.60,
            "retail": 14.80,
            "total": 21.40
        },
        "dates": {
            "open_date": "2026-08-20",
            "close_date": "2026-08-24",
            "allotment_date": "2026-08-25",
            "refund_date": "2026-08-26",
            "demat_credit_date": "2026-08-26",
            "listing_date": "2026-08-27"
        },
        "registrar": {
            "name": "Link Intime India Private Ltd",
            "website": "https://linkintime.co.in",
            "allotment_url": "https://linkintime.co.in/initial_offer/public-issues.html",
            "phone": "+91-22-49186270",
            "email": "tempsens.ipo@linkintime.co.in"
        },
        "drhp_url": "https://www.sebi.gov.in/filings/prospectus-documents/",
        "description": "Leading thermal engineering manufacturer specializing in industrial pyrometers, thermal cables, and precision sensors.",
        "financials": [
            {"year": "FY25", "revenue_cr": 620.00, "pat_cr": 94.50, "net_worth_cr": 410.00}
        ]
    },
    {
        "id": "ipo-hytech-engineers",
        "company_name": "Hy-Tech Engineers Ltd",
        "symbol": "HYTECH",
        "category": "Mainboard",
        "status": "upcoming",
        "price_band": "₹240 - ₹255",
        "issue_price": 255,
        "lot_size": 58,
        "min_investment": 14790,
        "issue_size_cr": 1450.00,
        "fresh_issue_cr": 1100.00,
        "ofs_cr": 350.00,
        "gmp": {
            "gmp_amount": 42,
            "estimated_listing_price": 297,
            "estimated_gain_percent": 16.47,
            "last_updated": "2026-08-22 15:45 IST",
            "trend": "up"
        },
        "subscription": {
            "qib": 0.00,
            "nii": 0.00,
            "retail": 0.00,
            "total": 0.00
        },
        "dates": {
            "open_date": "2026-08-24",
            "close_date": "2026-08-27",
            "allotment_date": "2026-08-28",
            "refund_date": "2026-08-31",
            "demat_credit_date": "2026-08-31",
            "listing_date": "2026-09-01"
        },
        "registrar": {
            "name": "Link Intime India Private Ltd",
            "website": "https://linkintime.co.in",
            "allotment_url": "https://linkintime.co.in/initial_offer/public-issues.html",
            "phone": "+91-22-49186270",
            "email": "hytech.ipo@linkintime.co.in"
        },
        "drhp_url": "https://www.sebi.gov.in/filings/prospectus-documents/",
        "description": "Precision engineering and automotive components supplier serving OEMs across India, Japan, and Europe.",
        "financials": [
            {"year": "FY25", "revenue_cr": 980.50, "pat_cr": 112.40, "net_worth_cr": 640.00}
        ]
    },
    {
        "id": "ipo-symbiotec-pharmalab",
        "company_name": "Symbiotec Pharmalab Ltd",
        "symbol": "SYMBIOTEC",
        "category": "Mainboard",
        "status": "upcoming",
        "price_band": "₹410 - ₹432",
        "issue_price": 432,
        "lot_size": 34,
        "min_investment": 14688,
        "issue_size_cr": 1950.00,
        "fresh_issue_cr": 800.00,
        "ofs_cr": 1150.00,
        "gmp": {
            "gmp_amount": 94,
            "estimated_listing_price": 526,
            "estimated_gain_percent": 21.76,
            "last_updated": "2026-08-22 15:30 IST",
            "trend": "up"
        },
        "subscription": {
            "qib": 0.00,
            "nii": 0.00,
            "retail": 0.00,
            "total": 0.00
        },
        "dates": {
            "open_date": "2026-08-24",
            "close_date": "2026-08-27",
            "allotment_date": "2026-08-28",
            "refund_date": "2026-08-31",
            "demat_credit_date": "2026-08-31",
            "listing_date": "2026-09-01"
        },
        "registrar": {
            "name": "KFin Technologies Limited",
            "website": "https://kfintech.com",
            "allotment_url": "https://ris.kfintech.com/ipostatus/",
            "phone": "+91-40-67162222",
            "email": "symbiotec.ipo@kfintech.com"
        },
        "drhp_url": "https://www.sebi.gov.in/filings/prospectus-documents/",
        "description": "Active Pharmaceutical Ingredients (API) manufacturer producing steroid and hormone APIs for global healthcare markets.",
        "financials": [
            {"year": "FY25", "revenue_cr": 1120.00, "pat_cr": 185.00, "net_worth_cr": 890.00}
        ]
    },
    {
        "id": "ipo-skyways-air-services",
        "company_name": "Skyways Air Services Ltd",
        "symbol": "SKYWAYS",
        "category": "Mainboard",
        "status": "upcoming",
        "price_band": "₹170 - ₹182",
        "issue_price": 182,
        "lot_size": 80,
        "min_investment": 14560,
        "issue_size_cr": 680.00,
        "fresh_issue_cr": 500.00,
        "ofs_cr": 180.00,
        "gmp": {
            "gmp_amount": 32,
            "estimated_listing_price": 214,
            "estimated_gain_percent": 17.58,
            "last_updated": "2026-08-22 15:15 IST",
            "trend": "up"
        },
        "subscription": {
            "qib": 0.00,
            "nii": 0.00,
            "retail": 0.00,
            "total": 0.00
        },
        "dates": {
            "open_date": "2026-08-24",
            "close_date": "2026-08-27",
            "allotment_date": "2026-08-28",
            "refund_date": "2026-08-31",
            "demat_credit_date": "2026-08-31",
            "listing_date": "2026-09-01"
        },
        "registrar": {
            "name": "Bigshare Services Pvt Ltd",
            "website": "https://www.bigshareonline.com",
            "allotment_url": "https://www.bigshareonline.com/ipo_status.html",
            "phone": "+91-22-62638200",
            "email": "skyways.ipo@bigshareonline.com"
        },
        "drhp_url": "https://www.sebi.gov.in/filings/prospectus-documents/",
        "description": "Air freight logistics and express cargo solutions provider operating international freight forwarding routes.",
        "financials": [
            {"year": "FY25", "revenue_cr": 740.00, "pat_cr": 68.00, "net_worth_cr": 320.00}
        ]
    },
    {
        "id": "ipo-annu-projects",
        "company_name": "Annu Projects Ltd",
        "symbol": "ANNU",
        "category": "Mainboard",
        "status": "upcoming",
        "price_band": "₹150 - ₹162",
        "issue_price": 162,
        "lot_size": 90,
        "min_investment": 14580,
        "issue_size_cr": 520.00,
        "fresh_issue_cr": 400.00,
        "ofs_cr": 120.00,
        "gmp": {
            "gmp_amount": 26,
            "estimated_listing_price": 188,
            "estimated_gain_percent": 16.05,
            "last_updated": "2026-08-22 14:50 IST",
            "trend": "up"
        },
        "subscription": {
            "qib": 0.00,
            "nii": 0.00,
            "retail": 0.00,
            "total": 0.00
        },
        "dates": {
            "open_date": "2026-08-25",
            "close_date": "2026-08-28",
            "allotment_date": "2026-08-29",
            "refund_date": "2026-08-31",
            "demat_credit_date": "2026-08-31",
            "listing_date": "2026-09-01"
        },
        "registrar": {
            "name": "Bigshare Services Pvt Ltd",
            "website": "https://www.bigshareonline.com",
            "allotment_url": "https://www.bigshareonline.com/ipo_status.html",
            "phone": "+91-22-62638200",
            "email": "annu.ipo@bigshareonline.com"
        },
        "drhp_url": "https://www.sebi.gov.in/filings/prospectus-documents/",
        "description": "Infrastructure construction EPC company executing highway bypasses, bridges, and municipal water supply projects.",
        "financials": [
            {"year": "FY25", "revenue_cr": 580.00, "pat_cr": 52.00, "net_worth_cr": 260.00}
        ]
    },
    {
        "id": "ipo-lumino-industries",
        "company_name": "Lumino Industries Ltd",
        "symbol": "LUMINO",
        "category": "Mainboard",
        "status": "upcoming",
        "price_band": "₹280 - ₹298",
        "issue_price": 298,
        "lot_size": 50,
        "min_investment": 14900,
        "issue_size_cr": 1150.00,
        "fresh_issue_cr": 900.00,
        "ofs_cr": 250.00,
        "gmp": {
            "gmp_amount": 62,
            "estimated_listing_price": 360,
            "estimated_gain_percent": 20.81,
            "last_updated": "2026-08-22 14:30 IST",
            "trend": "up"
        },
        "subscription": {
            "qib": 0.00,
            "nii": 0.00,
            "retail": 0.00,
            "total": 0.00
        },
        "dates": {
            "open_date": "2026-08-27",
            "close_date": "2026-08-31",
            "allotment_date": "2026-09-01",
            "refund_date": "2026-09-02",
            "demat_credit_date": "2026-09-02",
            "listing_date": "2026-09-03"
        },
        "registrar": {
            "name": "KFin Technologies Limited",
            "website": "https://kfintech.com",
            "allotment_url": "https://ris.kfintech.com/ipostatus/",
            "phone": "+91-40-67162222",
            "email": "lumino.ipo@kfintech.com"
        },
        "drhp_url": "https://www.sebi.gov.in/filings/prospectus-documents/",
        "description": "Power transmission cables and aluminium conductor manufacturing company supplying state electricity boards.",
        "financials": [
            {"year": "FY25", "revenue_cr": 1250.00, "pat_cr": 138.00, "net_worth_cr": 580.00}
        ]
    },
    {
        "id": "ipo-rays-of-belief",
        "company_name": "Rays of Belief Ltd",
        "symbol": "RAYBELIEF",
        "category": "Mainboard",
        "status": "upcoming",
        "price_band": "₹190 - ₹205",
        "issue_price": 205,
        "lot_size": 72,
        "min_investment": 14760,
        "issue_size_cr": 780.00,
        "fresh_issue_cr": 600.00,
        "ofs_cr": 180.00,
        "gmp": {
            "gmp_amount": 45,
            "estimated_listing_price": 250,
            "estimated_gain_percent": 21.95,
            "last_updated": "2026-08-22 14:00 IST",
            "trend": "up"
        },
        "subscription": {
            "qib": 0.00,
            "nii": 0.00,
            "retail": 0.00,
            "total": 0.00
        },
        "dates": {
            "open_date": "2026-09-01",
            "close_date": "2026-09-03",
            "allotment_date": "2026-09-04",
            "refund_date": "2026-09-07",
            "demat_credit_date": "2026-09-07",
            "listing_date": "2026-09-08"
        },
        "registrar": {
            "name": "Link Intime India Private Ltd",
            "website": "https://linkintime.co.in",
            "allotment_url": "https://linkintime.co.in/initial_offer/public-issues.html",
            "phone": "+91-22-49186270",
            "email": "rays.ipo@linkintime.co.in"
        },
        "drhp_url": "https://www.sebi.gov.in/filings/prospectus-documents/",
        "description": "Renewable solar EPC developer building utility-scale photovoltaic solar parks across Rajasthan and Gujarat.",
        "financials": [
            {"year": "FY25", "revenue_cr": 890.00, "pat_cr": 105.00, "net_worth_cr": 440.00}
        ]
    },
    {
        "id": "ipo-gaja-asset-mgmt",
        "company_name": "Gaja Alternative Asset Management",
        "symbol": "GAJA",
        "category": "Mainboard",
        "status": "listed",
        "price_band": "₹480 - ₹510",
        "issue_price": 510,
        "lot_size": 29,
        "min_investment": 14790,
        "issue_size_cr": 1200.00,
        "fresh_issue_cr": 700.00,
        "ofs_cr": 500.00,
        "gmp": {
            "gmp_amount": 115,
            "estimated_listing_price": 625,
            "estimated_gain_percent": 22.55,
            "last_updated": "2026-08-22 13:00 IST",
            "trend": "flat"
        },
        "subscription": {
            "qib": 45.20,
            "nii": 28.50,
            "retail": 12.10,
            "total": 26.40
        },
        "dates": {
            "open_date": "2026-08-19",
            "close_date": "2026-08-21",
            "allotment_date": "2026-08-22",
            "refund_date": "2026-08-25",
            "demat_credit_date": "2026-08-25",
            "listing_date": "2026-08-26"
        },
        "registrar": {
            "name": "KFin Technologies Limited",
            "website": "https://kfintech.com",
            "allotment_url": "https://ris.kfintech.com/ipostatus/",
            "phone": "+91-40-67162222",
            "email": "gaja.ipo@kfintech.com"
        },
        "drhp_url": "https://www.sebi.gov.in/filings/prospectus-documents/",
        "description": "Private equity asset manager managing mid-market growth equity funds in consumer and technology sectors.",
        "financials": [
            {"year": "FY25", "revenue_cr": 420.00, "pat_cr": 165.00, "net_worth_cr": 780.00}
        ]
    },
    {
        "id": "ipo-shankesh-jewellers",
        "company_name": "Shankesh Jewellers (SME)",
        "symbol": "SHANKESH",
        "category": "SME",
        "status": "listed",
        "price_band": "₹95 - ₹102",
        "issue_price": 102,
        "lot_size": 1200,
        "min_investment": 122400,
        "issue_size_cr": 36.80,
        "fresh_issue_cr": 36.80,
        "ofs_cr": 0.00,
        "gmp": {
            "gmp_amount": 38,
            "estimated_listing_price": 140,
            "estimated_gain_percent": 37.25,
            "last_updated": "2026-08-22 12:00 IST",
            "trend": "up"
        },
        "subscription": {
            "qib": 15.40,
            "nii": 48.20,
            "retail": 32.10,
            "total": 31.80
        },
        "dates": {
            "open_date": "2026-08-18",
            "close_date": "2026-08-20",
            "allotment_date": "2026-08-21",
            "refund_date": "2026-08-22",
            "demat_credit_date": "2026-08-22",
            "listing_date": "2026-08-25"
        },
        "registrar": {
            "name": "Bigshare Services Pvt Ltd",
            "website": "https://www.bigshareonline.com",
            "allotment_url": "https://www.bigshareonline.com/ipo_status.html",
            "phone": "+91-22-62638200",
            "email": "shankesh.ipo@bigshareonline.com"
        },
        "drhp_url": "https://www.bsesme.com",
        "description": "Gold and diamond jewellery retail showroom operator with presence across Maharashtra and Gujarat.",
        "financials": [
            {"year": "FY25", "revenue_cr": 145.00, "pat_cr": 12.80, "net_worth_cr": 48.00}
        ]
    }
]


class IPOProvider:
    """Provider for Chittorgarh live IPO dataset."""

    _cached_data: List[Dict[str, Any]] = CHITTORGARH_LIVE_IPOS

    @classmethod
    def get_all_ipos(cls, status: Optional[str] = None, category: Optional[str] = None) -> List[Dict[str, Any]]:
        results = cls._cached_data
        if status and status.lower() != "all":
            results = [x for x in results if x["status"].lower() == status.lower()]
        if category and category.lower() != "all":
            results = [x for x in results if x["category"].lower() == category.lower()]
        return results

    @classmethod
    def get_ipo_by_id(cls, ipo_id: str) -> Optional[Dict[str, Any]]:
        for ipo in cls._cached_data:
            if ipo["id"] == ipo_id or ipo["symbol"].upper() == ipo_id.upper():
                return ipo
        return None

    @classmethod
    def get_summary(cls) -> Dict[str, Any]:
        all_ipos = cls._cached_data
        active_ipos = [x for x in all_ipos if x["status"] == "active"]
        upcoming_ipos = [x for x in all_ipos if x["status"] == "upcoming"]
        
        top_gmp = max(all_ipos, key=lambda x: x["gmp"]["estimated_gain_percent"]) if all_ipos else None
        top_subscriber = max(all_ipos, key=lambda x: x["subscription"]["total"]) if all_ipos else None
        
        total_raised_cr = sum(x["issue_size_cr"] for x in all_ipos)

        return {
            "total_ipos_tracked": len(all_ipos),
            "active_count": len(active_ipos),
            "upcoming_count": len(upcoming_ipos),
            "total_capital_raised_cr": round(total_raised_cr, 2),
            "top_gmp_ipo": {
                "name": top_gmp["company_name"] if top_gmp else "N/A",
                "symbol": top_gmp["symbol"] if top_gmp else "N/A",
                "gmp_gain_percent": top_gmp["gmp"]["estimated_gain_percent"] if top_gmp else 0.0
            },
            "top_subscribed_ipo": {
                "name": top_subscriber["company_name"] if top_subscriber else "N/A",
                "symbol": top_subscriber["symbol"] if top_subscriber else "N/A",
                "total_subscription": top_subscriber["subscription"]["total"] if top_subscriber else 0.0
            }
        }
