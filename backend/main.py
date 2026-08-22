"""
NEXUS TERMINAL — FastAPI Backend Entry Point
"""
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.config import settings
from database.db import init_db
from api import health, market, stocks, portfolio, news, demo, kite, mtf, ipo, macro, bonds, commodities

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s — %(message)s",
)
logger = logging.getLogger("nexus")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup / shutdown lifecycle."""
    logger.info("▶ NEXUS ENGINE STARTING")
    await init_db()
    logger.info("✔ DATABASE READY")
    yield
    logger.info("■ NEXUS ENGINE STOPPED")


app = FastAPI(
    title="NEXUS TERMINAL API",
    description="Institutional-grade Indian equity research terminal",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount all routers
app.include_router(health.router, tags=["Health"])
app.include_router(market.router, prefix="/api/market", tags=["Market"])
app.include_router(stocks.router, prefix="/api/stocks", tags=["Stocks"])
app.include_router(portfolio.router, prefix="/api/portfolio", tags=["Portfolio"])
app.include_router(news.router, prefix="/api/news", tags=["News"])
app.include_router(demo.router, prefix="/api/demo", tags=["Demo"])
app.include_router(kite.router, prefix="/api/kite", tags=["Kite"])
app.include_router(mtf.router, tags=["MTF Analytics"])
app.include_router(ipo.router, prefix="/api/ipo", tags=["IPO Tracker"])
app.include_router(macro.router, prefix="/api/macro", tags=["Macroeconomics"])
app.include_router(bonds.router, prefix="/api/bonds", tags=["Fixed Income"])
app.include_router(commodities.router, prefix="/api/commodities", tags=["Commodities & Forex"])


@app.get("/")
async def root():
    return {
        "app": "NEXUS TERMINAL",
        "version": "1.0.0",
        "status": "operational",
        "docs": "/docs",
    }
