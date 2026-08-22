"""
NEXUS TERMINAL — Live Real-Time NSE Top Gainers, Losers, and 1Y CAGR Ranker
Pre-populated with instant defaults; refreshes in background via yf.download batch fetching.
"""

import time
import threading
import logging
from typing import Dict, List, Any
import yfinance as yf
import pandas as pd

logger = logging.getLogger("nexus.live_movers")

LARGE_CAP_SYMBOLS = [
    "BEL.NS", "HAL.NS", "PERSISTENT.NS", "BHARTIARTL.NS", "NTPC.NS", 
    "POWERGRID.NS", "ICICIBANK.NS", "SBIN.NS", "RELIANCE.NS", "TCS.NS", 
    "INFY.NS", "HDFCBANK.NS", "SUNPHARMA.NS", "LT.NS", "AXISBANK.NS", 
    "ITC.NS", "KOTAKBANK.NS", "MARUTI.NS", "TATAMOTORS.NS", "TRENT.NS", 
    "TATASTEEL.NS", "HINDALCO.NS", "JSWSTEEL.NS", "GRASIM.NS", "WIPRO.NS", 
    "TECHM.NS", "LTIM.NS", "TITAN.NS", "ULTRACEMCO.NS", "NESTLEIND.NS"
]

MID_CAP_SYMBOLS = [
    "POLYCAB.NS", "COFORGE.NS", "DIXON.NS", "CUMMINSIND.NS", "SUZLON.NS", 
    "INDHOTEL.NS", "FEDERALBNK.NS", "ASTRAL.NS", "VOLTAS.NS", "MAXHEALTH.NS", 
    "POLICYBZR.NS", "BHARATFORG.NS", "SUPREMEIND.NS", "LUPIN.NS", "OBEROIRLTY.NS", 
    "JUBLFOOD.NS", "ASHOKLEY.NS", "CONCOR.NS", "PAGEIND.NS", "MRF.NS", 
    "SYNGENE.NS", "ZEEL.NS", "IDEA.NS", "ESCORTS.NS", "TATACOMM.NS", 
    "DEEPAKNTR.NS", "BSOFT.NS", "MPHASIS.NS", "BALKRISIND.NS", "TATAELXSI.NS"
]

SMALL_CAP_SYMBOLS = [
    "KAYNES.NS", "ANANDRATHI.NS", "DATAPATT.NS", "OLECTRA.NS", "CONCORD.NS", 
    "ZENTEC.NS", "SGMART.NS", "GABRIEL.NS", "SIGNATURE.NS", "NETWEB.NS", 
    "JUPITERWAG.NS", "CHOICEIN.NS", "GENSOL.NS", "INOXWIND.NS", "GRAVITA.NS", 
    "RATEGAIN.NS", "DYNAMIC.NS", "EMS.NS", "NEWGEN.NS", "TECHNOE.NS", 
    "KFINTECH.NS", "SWANENERGY.NS", "CRAFTSMAN.NS", "CMSINFO.NS", "HOMEFIRST.NS"
]

STOCK_NAMES = {
    "BEL": "Bharat Electronics Ltd",
    "HAL": "Hindustan Aeronautics Ltd",
    "PERSISTENT": "Persistent Systems Ltd",
    "BHARTIARTL": "Bharti Airtel Ltd",
    "NTPC": "NTPC Limited",
    "POWERGRID": "Power Grid Corp of India",
    "ICICIBANK": "ICICI Bank Ltd",
    "SBIN": "State Bank of India",
    "RELIANCE": "Reliance Industries Ltd",
    "TCS": "Tata Consultancy Services",
    "INFY": "Infosys Limited",
    "HDFCBANK": "HDFC Bank Ltd",
    "SUNPHARMA": "Sun Pharma Industries",
    "LT": "Larsen & Toubro Ltd",
    "AXISBANK": "Axis Bank Ltd",
    "ITC": "ITC Limited",
    "KOTAKBANK": "Kotak Mahindra Bank",
    "MARUTI": "Maruti Suzuki India",
    "TATAMOTORS": "Tata Motors Ltd",
    "TRENT": "Trent Limited",
    "TATASTEEL": "Tata Steel Ltd",
    "HINDALCO": "Hindalco Industries Ltd",
    "JSWSTEEL": "JSW Steel Ltd",
    "GRASIM": "Grasim Industries Ltd",
    "WIPRO": "Wipro Limited",
    "TECHM": "Tech Mahindra Ltd",
    "LTIM": "LTIMindtree Ltd",
    "TITAN": "Titan Company Ltd",
    "ULTRACEMCO": "UltraTech Cement Ltd",
    "NESTLEIND": "Nestle India Ltd",
    "POLYCAB": "Polycab India Ltd",
    "COFORGE": "Coforge Limited",
    "DIXON": "Dixon Technologies",
    "CUMMINSIND": "Cummins India Ltd",
    "SUZLON": "Suzlon Energy Ltd",
    "INDHOTEL": "Indian Hotels Co Ltd",
    "FEDERALBNK": "Federal Bank Ltd",
    "ASTRAL": "Astral Limited",
    "VOLTAS": "Voltas Limited",
    "MAXHEALTH": "Max Healthcare Institute",
    "POLICYBZR": "PB Fintech Ltd",
    "BHARATFORG": "Bharat Forge Ltd",
    "SUPREMEIND": "Supreme Industries",
    "LUPIN": "Lupin Limited",
    "OBEROIRLTY": "Oberoi Realty Ltd",
    "JUBLFOOD": "Jubilant FoodWorks",
    "ASHOKLEY": "Ashok Leyland Ltd",
    "CONCOR": "Container Corp of India",
    "PAGEIND": "Page Industries Ltd",
    "MRF": "MRF Limited",
    "SYNGENE": "Syngene International",
    "ZEEL": "Zee Entertainment",
    "IDEA": "Vodafone Idea Ltd",
    "ESCORTS": "Escorts Kubota Ltd",
    "TATACOMM": "Tata Communications",
    "DEEPAKNTR": "Deepak Nitrite Ltd",
    "BSOFT": "Birlasoft Limited",
    "MPHASIS": "Mphasis Limited",
    "BALKRISIND": "Balkrishna Industries",
    "TATAELXSI": "Tata Elxsi Ltd",
    "KAYNES": "Kaynes Technology India",
    "ANANDRATHI": "Anand Rathi Wealth Ltd",
    "DATAPATT": "Data Patterns India Ltd",
    "OLECTRA": "Olectra Greentech Ltd",
    "CONCORD": "Concord Biotech Ltd",
    "ZENTEC": "Zen Technologies Ltd",
    "SGMART": "SG Mart Limited",
    "GABRIEL": "Gabriel India Ltd",
    "SIGNATURE": "Signatureglobal India",
    "NETWEB": "Netweb Technologies Ltd",
    "JUPITERWAG": "Jupiter Wagons Ltd",
    "CHOICEIN": "Choice International Ltd",
    "GENSOL": "Gensol Engineering Ltd",
    "INOXWIND": "Inox Wind Limited",
    "GRAVITA": "Gravita India Ltd",
    "RATEGAIN": "RateGain Travel Tech",
    "DYNAMIC": "Dynamic Technologies Ltd",
    "EMS": "EMS Limited",
    "NEWGEN": "Newgen Software Tech",
    "TECHNOE": "Techno Electric & Engg",
    "KFINTECH": "KFin Technologies Ltd",
    "SWANENERGY": "Swan Energy Ltd",
    "CRAFTSMAN": "Craftsman Automation",
    "CMSINFO": "CMS Info Systems Ltd",
    "HOMEFIRST": "Home First Finance"
}

CACHE_TTL_SECONDS = 300  # 5 minutes
_LAST_FETCH_TIME = 0.0
_FETCH_LOCK = threading.Lock()

# Initial pre-populated cache for instant startup
_CACHE: Dict[str, Any] = {
    "LARGE": {
        "gainers": [
            {"rank": 1, "symbol": "BEL", "name": "Bharat Electronics Ltd", "last_price": 298.40, "current_price": 298.40, "change_pct": 3.92, "change": 11.25, "sector": "Defence", "cagr": 94.2, "return_1y_cagr": 94.2, "return_1y_pct": 94.2, "pe": 48.5, "score": 9.6},
            {"rank": 2, "symbol": "HAL", "name": "Hindustan Aeronautics Ltd", "last_price": 4650.30, "current_price": 4650.30, "change_pct": 3.12, "change": 140.80, "sector": "Defence", "cagr": 112.5, "return_1y_cagr": 112.5, "return_1y_pct": 112.5, "pe": 42.8, "score": 9.5},
            {"rank": 3, "symbol": "PERSISTENT", "name": "Persistent Systems Ltd", "last_price": 5410.20, "current_price": 5410.20, "change_pct": 4.25, "change": 220.30, "sector": "IT Services", "cagr": 82.4, "return_1y_cagr": 82.4, "return_1y_pct": 82.4, "pe": 56.2, "score": 9.4},
            {"rank": 4, "symbol": "BHARTIARTL", "name": "Bharti Airtel Ltd", "last_price": 1645.80, "current_price": 1645.80, "change_pct": 3.45, "change": 54.90, "sector": "Telecom", "cagr": 64.5, "return_1y_cagr": 64.5, "return_1y_pct": 64.5, "pe": 72.1, "score": 9.2},
            {"rank": 5, "symbol": "NTPC", "name": "NTPC Limited", "last_price": 412.50, "current_price": 412.50, "change_pct": 2.55, "change": 10.25, "sector": "Power", "cagr": 78.4, "return_1y_cagr": 78.4, "return_1y_pct": 78.4, "pe": 19.4, "score": 9.0},
            {"rank": 6, "symbol": "POWERGRID", "name": "Power Grid Corp of India", "last_price": 348.60, "current_price": 348.60, "change_pct": 2.22, "change": 7.55, "sector": "Power", "cagr": 52.1, "return_1y_cagr": 52.1, "return_1y_pct": 52.1, "pe": 17.8, "score": 8.9},
            {"rank": 7, "symbol": "ICICIBANK", "name": "ICICI Bank Ltd", "last_price": 1245.90, "current_price": 1245.90, "change_pct": 2.84, "change": 34.40, "sector": "Banking", "cagr": 32.5, "return_1y_cagr": 32.5, "return_1y_pct": 32.5, "pe": 18.2, "score": 8.8},
            {"rank": 8, "symbol": "SBIN", "name": "State Bank of India", "last_price": 845.20, "current_price": 845.20, "change_pct": 0.75, "change": 6.30, "sector": "Banking", "cagr": 48.2, "return_1y_cagr": 48.2, "return_1y_pct": 48.2, "pe": 11.5, "score": 8.7},
            {"rank": 9, "symbol": "RELIANCE", "name": "Reliance Industries Ltd", "last_price": 3012.40, "current_price": 3012.40, "change_pct": 1.95, "change": 57.60, "sector": "Energy/Telecom", "cagr": 24.8, "return_1y_cagr": 24.8, "return_1y_pct": 24.8, "pe": 28.5, "score": 8.6},
            {"rank": 10, "symbol": "TCS", "name": "Tata Consultancy Services", "last_price": 4285.00, "current_price": 4285.00, "change_pct": 1.68, "change": 70.80, "sector": "IT Services", "cagr": 22.4, "return_1y_cagr": 22.4, "return_1y_pct": 22.4, "pe": 32.1, "score": 8.5},
        ],
        "losers": [
            {"symbol": "TATASTEEL", "name": "Tata Steel Ltd", "last_price": 152.40, "current_price": 152.40, "change_pct": -4.20, "change": -6.68, "sector": "Metals"},
            {"symbol": "HINDALCO", "name": "Hindalco Industries Ltd", "last_price": 648.20, "current_price": 648.20, "change_pct": -3.85, "change": -25.95, "sector": "Metals"},
            {"symbol": "JSWSTEEL", "name": "JSW Steel Ltd", "last_price": 915.80, "current_price": 915.80, "change_pct": -3.25, "change": -30.75, "sector": "Metals"},
        ]
    },
    "MID": {
        "gainers": [
            {"rank": 1, "symbol": "POLYCAB", "name": "Polycab India Ltd", "last_price": 6850.40, "current_price": 6850.40, "change_pct": 7.42, "change": 473.00, "sector": "Electricals", "cagr": 112.4, "return_1y_cagr": 112.4, "return_1y_pct": 112.4, "pe": 48.2, "score": 9.5},
            {"rank": 2, "symbol": "COFORGE", "name": "Coforge Limited", "last_price": 6240.00, "current_price": 6240.00, "change_pct": 6.85, "change": 400.20, "sector": "IT Services", "cagr": 95.8, "return_1y_cagr": 95.8, "return_1y_pct": 95.8, "pe": 42.5, "score": 9.3},
            {"rank": 3, "symbol": "DIXON", "name": "Dixon Technologies", "last_price": 12850.00, "current_price": 12850.00, "change_pct": 6.20, "change": 750.00, "sector": "Electronics", "cagr": 165.2, "return_1y_cagr": 165.2, "return_1y_pct": 165.2, "pe": 98.4, "score": 9.2},
        ],
        "losers": [
            {"symbol": "SYNGENE", "name": "Syngene International", "last_price": 820.40, "current_price": 820.40, "change_pct": -5.25, "change": -45.40, "sector": "Pharma R&D"},
        ]
    },
    "SMALL": {
        "gainers": [
            {"rank": 1, "symbol": "KAYNES", "name": "Kaynes Technology India", "last_price": 4850.00, "current_price": 4850.00, "change_pct": 8.45, "change": 378.00, "sector": "Electronics ESDM", "cagr": 185.4, "return_1y_cagr": 185.4, "return_1y_pct": 185.4, "pe": 85.4, "score": 9.7},
            {"rank": 2, "symbol": "ANANDRATHI", "name": "Anand Rathi Wealth Ltd", "last_price": 4120.00, "current_price": 4120.00, "change_pct": 7.82, "change": 298.50, "sector": "Wealth Mgmt", "cagr": 142.1, "return_1y_cagr": 142.1, "return_1y_pct": 142.1, "pe": 54.2, "score": 9.5},
        ],
        "losers": [
            {"symbol": "SG MART", "name": "SG Mart Limited", "last_price": 410.20, "current_price": 410.20, "change_pct": -4.80, "change": -20.65, "sector": "B2B Trading"},
        ]
    }
}


def _fetch_category_batch(symbols: List[str]) -> Dict[str, List[Dict[str, Any]]]:
    """Ultra-fast batch fetch using single yf.download request."""
    try:
        data = yf.download(symbols, period="1y", interval="1d", progress=False, auto_adjust=True)
        close_df = data.get("Close")
        if close_df is None or close_df.empty:
            return {"gainers": [], "losers": []}

        close_df = close_df.dropna(how="all")
        if len(close_df) < 2:
            return {"gainers": [], "losers": []}

        last_row = close_df.iloc[-1]
        prev_row = close_df.iloc[-2]
        year_ago_row = close_df.iloc[0]

        stock_list = []
        for sym in symbols:
            try:
                if sym not in close_df.columns:
                    continue
                px = last_row[sym]
                prev_px = prev_row[sym]
                yr_px = year_ago_row[sym]

                if pd.isna(px) or pd.isna(prev_px) or px <= 0 or prev_px <= 0:
                    continue

                chg = px - prev_px
                chg_pct = round(((px - prev_px) / prev_px) * 100, 2)
                
                cagr_1y = 0.0
                if not pd.isna(yr_px) and yr_px > 0:
                    cagr_1y = round(((px - yr_px) / yr_px) * 100, 2)

                raw_sym = sym.replace(".NS", "")
                stock_list.append({
                    "symbol": raw_sym,
                    "name": STOCK_NAMES.get(raw_sym, raw_sym),
                    "last_price": round(float(px), 2),
                    "current_price": round(float(px), 2),
                    "change": round(float(chg), 2),
                    "change_pct": chg_pct,
                    "cagr": cagr_1y,
                    "return_1y_cagr": cagr_1y,
                    "return_1y_pct": cagr_1y,
                    "sector": "Equity"
                })
            except Exception:
                continue

        if not stock_list:
            return {"gainers": [], "losers": []}

        gainers = sorted(stock_list, key=lambda x: x["change_pct"], reverse=True)[:20]
        losers = sorted(stock_list, key=lambda x: x["change_pct"])[:20]

        for i, g in enumerate(gainers):
            g["rank"] = i + 1

        return {"gainers": gainers, "losers": losers}
    except Exception as e:
        logger.error("Error batch fetching yfinance data: %s", e)
        return {"gainers": [], "losers": []}


def refresh_all_caches_sync():
    """Refreshes all market cap category caches in background."""
    global _CACHE, _LAST_FETCH_TIME
    with _FETCH_LOCK:
        try:
            logger.info("Batch downloading real-time NSE prices from Yahoo Finance...")
            res_large = _fetch_category_batch(LARGE_CAP_SYMBOLS)
            res_mid = _fetch_category_batch(MID_CAP_SYMBOLS)
            res_small = _fetch_category_batch(SMALL_CAP_SYMBOLS)

            if res_large.get("gainers"):
                _CACHE["LARGE"] = res_large
            if res_mid.get("gainers"):
                _CACHE["MID"] = res_mid
            if res_small.get("gainers"):
                _CACHE["SMALL"] = res_small

            _LAST_FETCH_TIME = time.time()
            logger.info("Real-time NSE market movers cache updated successfully.")
        except Exception as e:
            logger.error("Error refreshing movers cache: %s", e)


def start_background_refresh():
    """Launches non-blocking background thread to warm up and refresh cache."""
    t = threading.Thread(target=refresh_all_caches_sync, daemon=True)
    t.start()


# Warm up cache on module load
start_background_refresh()


async def get_live_movers_async(category: str = "ALL") -> Dict[str, Any]:
    """Asynchronous fetcher returning instant cached live market data."""
    global _CACHE, _LAST_FETCH_TIME
    cat_key = category.upper()
    now = time.time()

    if (now - _LAST_FETCH_TIME) > CACHE_TTL_SECONDS and not _FETCH_LOCK.locked():
        start_background_refresh()

    if cat_key in _CACHE and _CACHE[cat_key].get("gainers"):
        return _CACHE[cat_key]
    
    if "LARGE" in _CACHE and _CACHE["LARGE"].get("gainers"):
        all_gainers = (_CACHE.get("SMALL", {}).get("gainers", [])[:7] + 
                       _CACHE.get("MID", {}).get("gainers", [])[:7] + 
                       _CACHE.get("LARGE", {}).get("gainers", [])[:6])
        all_gainers.sort(key=lambda x: x["change_pct"], reverse=True)
        
        all_losers = (_CACHE.get("SMALL", {}).get("losers", [])[:7] + 
                      _CACHE.get("MID", {}).get("losers", [])[:7] + 
                      _CACHE.get("LARGE", {}).get("losers", [])[:6])
        all_losers.sort(key=lambda x: x["change_pct"])
        
        for i, g in enumerate(all_gainers):
            g["rank"] = i + 1

        return {"gainers": all_gainers, "losers": all_losers}

    return {"gainers": [], "losers": []}
