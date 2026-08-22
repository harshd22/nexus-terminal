"""
NEXUS TERMINAL — SQLAlchemy ORM Models
All tables match the database schema in the implementation plan.
Every externally sourced record carries: source, source_url, fetched_at, data_date
"""
from datetime import datetime, date
from typing import Optional
from sqlalchemy import (
    Integer, String, Float, Boolean, Text, Date, DateTime,
    ForeignKey, UniqueConstraint, Index,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from database.db import Base


class Stock(Base):
    __tablename__ = "stocks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    symbol: Mapped[str] = mapped_column(String(50), unique=True, nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    nse_symbol: Mapped[Optional[str]] = mapped_column(String(50))
    bse_code: Mapped[Optional[str]] = mapped_column(String(20))
    sector: Mapped[Optional[str]] = mapped_column(String(100))
    industry: Mapped[Optional[str]] = mapped_column(String(100))
    market_cap_category: Mapped[Optional[str]] = mapped_column(String(10))  # LARGE/MID/SMALL
    isin: Mapped[Optional[str]] = mapped_column(String(20))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    prices: Mapped[list["Price"]] = relationship(back_populates="stock")
    fundamentals: Mapped[list["Fundamental"]] = relationship(back_populates="stock")
    shareholdings: Mapped[list["Shareholding"]] = relationship(back_populates="stock")
    news: Mapped[list["NewsArticle"]] = relationship(back_populates="stock")
    red_flags: Mapped[list["RedFlag"]] = relationship(back_populates="stock")
    scores: Mapped[list["Score"]] = relationship(back_populates="stock")
    analyses: Mapped[list["Analysis"]] = relationship(back_populates="stock")


class Price(Base):
    __tablename__ = "prices"
    __table_args__ = (UniqueConstraint("stock_id", "date"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    stock_id: Mapped[int] = mapped_column(ForeignKey("stocks.id"), nullable=False, index=True)
    date: Mapped[date] = mapped_column(Date, nullable=False)
    open: Mapped[Optional[float]] = mapped_column(Float)
    high: Mapped[Optional[float]] = mapped_column(Float)
    low: Mapped[Optional[float]] = mapped_column(Float)
    close: Mapped[Optional[float]] = mapped_column(Float)
    volume: Mapped[Optional[int]] = mapped_column(Integer)
    source: Mapped[Optional[str]] = mapped_column(String(100))
    source_url: Mapped[Optional[str]] = mapped_column(Text)
    fetched_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    stock: Mapped["Stock"] = relationship(back_populates="prices")


class Fundamental(Base):
    __tablename__ = "fundamentals"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    stock_id: Mapped[int] = mapped_column(ForeignKey("stocks.id"), nullable=False, index=True)
    period: Mapped[Optional[str]] = mapped_column(String(20))   # Q1FY27 / FY26
    period_type: Mapped[Optional[str]] = mapped_column(String(20))  # QUARTERLY / ANNUAL
    revenue: Mapped[Optional[float]] = mapped_column(Float)
    ebitda: Mapped[Optional[float]] = mapped_column(Float)
    net_profit: Mapped[Optional[float]] = mapped_column(Float)
    eps: Mapped[Optional[float]] = mapped_column(Float)
    pe: Mapped[Optional[float]] = mapped_column(Float)
    pb: Mapped[Optional[float]] = mapped_column(Float)
    roe: Mapped[Optional[float]] = mapped_column(Float)
    roce: Mapped[Optional[float]] = mapped_column(Float)
    debt: Mapped[Optional[float]] = mapped_column(Float)
    debt_equity: Mapped[Optional[float]] = mapped_column(Float)
    interest_coverage: Mapped[Optional[float]] = mapped_column(Float)
    operating_cash_flow: Mapped[Optional[float]] = mapped_column(Float)
    free_cash_flow: Mapped[Optional[float]] = mapped_column(Float)
    revenue_growth: Mapped[Optional[float]] = mapped_column(Float)
    profit_growth: Mapped[Optional[float]] = mapped_column(Float)
    ebitda_margin: Mapped[Optional[float]] = mapped_column(Float)
    source: Mapped[Optional[str]] = mapped_column(String(100))
    source_url: Mapped[Optional[str]] = mapped_column(Text)
    data_date: Mapped[Optional[date]] = mapped_column(Date)
    fetched_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    stock: Mapped["Stock"] = relationship(back_populates="fundamentals")


class Shareholding(Base):
    __tablename__ = "shareholding"
    __table_args__ = (UniqueConstraint("stock_id", "quarter"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    stock_id: Mapped[int] = mapped_column(ForeignKey("stocks.id"), nullable=False, index=True)
    quarter: Mapped[str] = mapped_column(String(20), nullable=False)
    promoter_pct: Mapped[Optional[float]] = mapped_column(Float)
    fii_pct: Mapped[Optional[float]] = mapped_column(Float)
    dii_pct: Mapped[Optional[float]] = mapped_column(Float)
    public_pct: Mapped[Optional[float]] = mapped_column(Float)
    promoter_pledge_pct: Mapped[Optional[float]] = mapped_column(Float)
    source: Mapped[Optional[str]] = mapped_column(String(100))
    source_url: Mapped[Optional[str]] = mapped_column(Text)
    data_date: Mapped[Optional[date]] = mapped_column(Date)
    fetched_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    stock: Mapped["Stock"] = relationship(back_populates="shareholdings")


class NewsArticle(Base):
    __tablename__ = "news"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    headline: Mapped[str] = mapped_column(Text, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text)
    stock_id: Mapped[Optional[int]] = mapped_column(ForeignKey("stocks.id"), index=True)
    ticker: Mapped[Optional[str]] = mapped_column(String(50))
    source: Mapped[Optional[str]] = mapped_column(String(100))
    source_url: Mapped[Optional[str]] = mapped_column(Text)
    category: Mapped[Optional[str]] = mapped_column(String(50))
    published_at: Mapped[Optional[datetime]] = mapped_column(DateTime)
    fetched_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    sentiment: Mapped[Optional[str]] = mapped_column(String(20))  # POSITIVE/NEUTRAL/NEGATIVE

    stock: Mapped[Optional["Stock"]] = relationship(back_populates="news")


class Holding(Base):
    __tablename__ = "holdings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    stock_id: Mapped[Optional[int]] = mapped_column(ForeignKey("stocks.id"))
    symbol: Mapped[str] = mapped_column(String(50))
    quantity: Mapped[Optional[int]] = mapped_column(Integer)
    avg_price: Mapped[Optional[float]] = mapped_column(Float)
    current_price: Mapped[Optional[float]] = mapped_column(Float)
    pnl: Mapped[Optional[float]] = mapped_column(Float)
    day_pnl: Mapped[Optional[float]] = mapped_column(Float)
    fetched_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class Position(Base):
    __tablename__ = "positions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    stock_id: Mapped[Optional[int]] = mapped_column(ForeignKey("stocks.id"))
    symbol: Mapped[str] = mapped_column(String(50))
    quantity: Mapped[Optional[int]] = mapped_column(Integer)
    avg_price: Mapped[Optional[float]] = mapped_column(Float)
    current_price: Mapped[Optional[float]] = mapped_column(Float)
    pnl: Mapped[Optional[float]] = mapped_column(Float)
    fetched_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class PortfolioSnapshot(Base):
    __tablename__ = "portfolio_snapshots"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    snapshot_date: Mapped[Optional[date]] = mapped_column(Date)
    total_invested: Mapped[Optional[float]] = mapped_column(Float)
    current_value: Mapped[Optional[float]] = mapped_column(Float)
    day_pnl: Mapped[Optional[float]] = mapped_column(Float)
    overall_pnl: Mapped[Optional[float]] = mapped_column(Float)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class RedFlag(Base):
    __tablename__ = "red_flags"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    stock_id: Mapped[int] = mapped_column(ForeignKey("stocks.id"), nullable=False, index=True)
    rule_id: Mapped[Optional[int]] = mapped_column(Integer)
    rule_name: Mapped[Optional[str]] = mapped_column(String(100))
    status: Mapped[Optional[str]] = mapped_column(String(10))  # PASS/WARN/FAIL/NA
    value: Mapped[Optional[float]] = mapped_column(Float)
    threshold: Mapped[Optional[float]] = mapped_column(Float)
    formula: Mapped[Optional[str]] = mapped_column(Text)
    explanation: Mapped[Optional[str]] = mapped_column(Text)
    source: Mapped[Optional[str]] = mapped_column(String(100))
    data_date: Mapped[Optional[date]] = mapped_column(Date)
    calculated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    stock: Mapped["Stock"] = relationship(back_populates="red_flags")


class Score(Base):
    __tablename__ = "scores"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    stock_id: Mapped[int] = mapped_column(ForeignKey("stocks.id"), nullable=False, index=True)
    total_score: Mapped[Optional[float]] = mapped_column(Float)
    valuation: Mapped[Optional[float]] = mapped_column(Float)
    growth: Mapped[Optional[float]] = mapped_column(Float)
    financial_health: Mapped[Optional[float]] = mapped_column(Float)
    momentum: Mapped[Optional[float]] = mapped_column(Float)
    sector_tailwind: Mapped[Optional[float]] = mapped_column(Float)
    penalty: Mapped[Optional[float]] = mapped_column(Float)
    calculated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    stock: Mapped["Stock"] = relationship(back_populates="scores")


class Analysis(Base):
    __tablename__ = "analysis"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    stock_id: Mapped[int] = mapped_column(ForeignKey("stocks.id"), nullable=False, index=True)
    analysis_type: Mapped[Optional[str]] = mapped_column(String(50))  # SWOT/DEBATE/DEEP_DIVE
    content: Mapped[Optional[str]] = mapped_column(Text)  # JSON
    model: Mapped[Optional[str]] = mapped_column(String(100))
    evidence_hash: Mapped[Optional[str]] = mapped_column(String(64))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    stock: Mapped["Stock"] = relationship(back_populates="analyses")


class MarketBreadth(Base):
    __tablename__ = "market_breadth"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    observed_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    winner_count: Mapped[Optional[int]] = mapped_column(Integer)
    loser_count: Mapped[Optional[int]] = mapped_column(Integer)
    unchanged_count: Mapped[Optional[int]] = mapped_column(Integer)
    total_count: Mapped[Optional[int]] = mapped_column(Integer)
    breadth_pct: Mapped[Optional[float]] = mapped_column(Float)
    source: Mapped[Optional[str]] = mapped_column(String(100))

    __table_args__ = (Index("ix_market_breadth_observed_at", "observed_at"),)


class SectorData(Base):
    __tablename__ = "sector_data"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    sector: Mapped[Optional[str]] = mapped_column(String(100))
    index_name: Mapped[Optional[str]] = mapped_column(String(100))
    date: Mapped[Optional[date]] = mapped_column(Date)
    value: Mapped[Optional[float]] = mapped_column(Float)
    change_pct: Mapped[Optional[float]] = mapped_column(Float)
    source: Mapped[Optional[str]] = mapped_column(String(100))
    fetched_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class DemoSnapshot(Base):
    __tablename__ = "demo_snapshots"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    scenario: Mapped[Optional[str]] = mapped_column(String(100))
    step_index: Mapped[Optional[int]] = mapped_column(Integer)
    event_type: Mapped[Optional[str]] = mapped_column(String(50))
    payload: Mapped[Optional[str]] = mapped_column(Text)  # JSON
    delay_ms: Mapped[Optional[int]] = mapped_column(Integer)
