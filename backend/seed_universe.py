"""
NEXUS TERMINAL — Master NSE Stock Seeder
Downloads and seeds ALL 2,550+ equities listed on NSE India directly from NSE Master CSV (EQUITY_L.csv).
"""
import asyncio
import httpx
import csv
import logging
from sqlalchemy import select
from database.db import init_db, AsyncSessionLocal
from database.models import Stock

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("nexus.seed")

NSE_EQUITY_CSV_URL = "https://archives.nseindia.com/content/equities/EQUITY_L.csv"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
}


async def seed_full_nse_universe():
    await init_db()

    logger.info("Downloading complete NSE Equity Master CSV...")
    try:
        async with httpx.AsyncClient(timeout=20, follow_redirects=True) as client:
            resp = await client.get(NSE_EQUITY_CSV_URL, headers=HEADERS)
            resp.raise_for_status()
            text = resp.text.strip()
    except Exception as e:
        logger.error("Failed to download NSE Master CSV: %s", e)
        return

    reader = csv.DictReader(text.splitlines())
    rows = list(reader)
    logger.info("Parsed %d listed stocks from NSE Master CSV", len(rows))

    async with AsyncSessionLocal() as session:
        # Get existing symbols
        res = await session.execute(select(Stock.symbol))
        existing_symbols = set(res.scalars().all())

        new_count = 0
        for row in rows:
            symbol = row.get("SYMBOL", "").strip().upper()
            company_name = row.get("NAME OF COMPANY", "").strip()
            isin = row.get(" ISIN NUMBER", "").strip() or row.get("ISIN NUMBER", "").strip()

            if not symbol or symbol in existing_symbols:
                continue

            # Determine market cap category heuristic
            cap_cat = "SMALL"
            if symbol in ["RELIANCE", "TCS", "INFY", "HDFCBANK", "ICICIBANK", "SBIN", "BHARTIARTL", "ITC", "LTIM", "LT", "BAJFINANCE", "HINDUNILVR", "SUNPHARMA", "MARUTI", "TATAMOTORS", "AXISBANK", "KOTAKBANK", "ADANIENT", "NTPC", "POWERGRID", "TITAN", "ULTRACEMCO", "ASIANPAINT", "WIPRO", "ONGC", "COALINDIA", "IOC", "BAJAJFINSV"]:
                cap_cat = "LARGE"
            elif symbol in ["TATAPOWER", "PIDILITIND", "MUTHOOTFIN", "PAGEIND", "VOLTAS", "IRCTC", "POLICYBZR", "NYKAA", "ZOMATO", "PAYTM", "PERSISTENT", "COFORGE", "MPHASIS", "DIXON", "TRENT"]:
                cap_cat = "MID"

            stock = Stock(
                symbol=symbol,
                name=company_name,
                nse_symbol=symbol,
                sector="Equity",
                market_cap_category=cap_cat,
                isin=isin if isin else None,
                is_active=True,
            )
            session.add(stock)
            existing_symbols.add(symbol)
            new_count += 1

        await session.commit()
        logger.info("Successfully seeded %d new stocks into database (Total Universe: %d)", new_count, len(existing_symbols))


if __name__ == "__main__":
    asyncio.run(seed_full_nse_universe())
