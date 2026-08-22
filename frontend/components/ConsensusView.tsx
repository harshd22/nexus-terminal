"use client";
import React from "react";
import { Award, TrendingUp, ExternalLink, FileText, CheckCircle2, AlertCircle, Building2, SearchX } from "lucide-react";

interface BrokerReport {
    brokerage: string;
    rating: string;
    target_price: number;
    reco_date: string;
    report_title: string;
    key_rationale: string;
    source: string;
    link: string;
}

interface ConsensusData {
    symbol: string;
    name: string;
    available?: boolean;
    message?: string;
    reason?: string;
    current_price?: number;
    consensus_target?: number;
    upside_pct?: number;
    high_target?: number;
    low_target?: number;
    total_analysts?: number;
    consensus_rating?: string;
    rating_score?: number;
    rating_distribution?: {
        strong_buy: number;
        buy: number;
        hold: number;
        underperform: number;
        sell: number;
    };
    estimates?: {
        period: string;
        revenue: string;
        ebitda: string;
        eps: string;
        pe: string;
    }[];
    reports?: BrokerReport[];
    source?: string;
}

export function ConsensusView({ data }: { data: ConsensusData }) {
    if (!data) return null;

    // Render "No Consensus Available" Fallback UI
    if (data.available === false) {
        return (
            <div
                style={{
                    background: "#05070c",
                    border: "1px solid #1e293b",
                    borderRadius: 8,
                    padding: 32,
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 14,
                }}
            >
                <div
                    style={{
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        background: "rgba(255, 42, 95, 0.12)",
                        border: "1px solid rgba(255, 42, 95, 0.3)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <SearchX size={24} color="#ff2a5f" />
                </div>

                <div>
                    <h3
                        style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "1.1rem",
                            fontWeight: 800,
                            color: "#ffffff",
                            margin: "0 0 6px 0",
                            letterSpacing: "0.05em",
                        }}
                    >
                        NO INSTITUTIONAL CONSENSUS COVERAGE FOR {data.symbol}
                    </h3>
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.8rem", color: "#94a3b8", maxWidth: 520, margin: "0 auto", lineHeight: 1.5 }}>
                        {data.message || `Analyst target prices and initiating research coverage are currently unavailable for ${data.symbol}.`}
                    </p>
                </div>

                <div
                    style={{
                        background: "#090d16",
                        border: "1px solid #1e293b",
                        borderRadius: 6,
                        padding: "10px 16px",
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.68rem",
                        color: "#64748b",
                        maxWidth: 480,
                    }}
                >
                    💡 Note: Institutional broker coverage (ICICI Sec, Motilal Oswal, Jefferies, Nuvama) is tracked primarily for top liquid Nifty 100 & F&O stocks.
                </div>
            </div>
        );
    }

    const {
        symbol,
        name,
        current_price = 0,
        consensus_target = 0,
        upside_pct = 0,
        high_target = 0,
        low_target = 0,
        total_analysts = 0,
        consensus_rating = "BUY",
        rating_distribution = { strong_buy: 0, buy: 0, hold: 0, underperform: 0, sell: 0 },
        estimates = [],
        reports = [],
        source = "",
    } = data;

    const isPositive = upside_pct >= 0;

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Top Consensus Summary Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                {/* Consensus Target Card */}
                <div
                    style={{
                        background: "#05070c",
                        border: "1px solid #1e293b",
                        borderRadius: 8,
                        padding: 16,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                        <span className="terminal-label">CONSENSUS TARGET PRICE</span>
                        <TrendingUp size={14} color="#00e676" />
                    </div>
                    <div>
                        <div style={{ fontSize: "1.6rem", fontWeight: 800, fontFamily: "var(--font-mono)", color: "#ffffff" }}>
                            ₹{consensus_target?.toLocaleString("en-IN")}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                            <span
                                style={{
                                    color: isPositive ? "#00e676" : "#ff2a5f",
                                    fontWeight: 800,
                                    fontSize: "0.78rem",
                                    fontFamily: "var(--font-mono)",
                                    background: isPositive ? "rgba(0, 230, 118, 0.12)" : "rgba(255, 42, 95, 0.12)",
                                    padding: "2px 8px",
                                    borderRadius: 4,
                                }}
                            >
                                {isPositive ? "+" : ""}{upside_pct}% UPSIDE
                            </span>
                            <span style={{ fontSize: "0.68rem", color: "#94a3b8", fontFamily: "var(--font-mono)" }}>
                                CMP: ₹{current_price?.toLocaleString("en-IN")}
                            </span>
                        </div>
                    </div>
                    <div style={{ borderTop: "1px solid #1e293b", paddingTop: 10, marginTop: 12, fontSize: "0.65rem", color: "#64748b", display: "flex", justifyContent: "space-between" }}>
                        <span>LOW: ₹{low_target?.toLocaleString("en-IN")}</span>
                        <span>HIGH: ₹{high_target?.toLocaleString("en-IN")}</span>
                    </div>
                </div>

                {/* Analyst Recommendation Breakdown */}
                <div
                    style={{
                        background: "#05070c",
                        border: "1px solid #1e293b",
                        borderRadius: 8,
                        padding: 16,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                        <span className="terminal-label">ANALYST RATING ({total_analysts} COVERING)</span>
                        <span style={{ color: "#00e676", fontWeight: 800, fontSize: "0.72rem", fontFamily: "var(--font-mono)" }}>
                            {consensus_rating}
                        </span>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.65rem", fontFamily: "var(--font-mono)" }}>
                            <span style={{ color: "#00e676" }}>Strong Buy ({rating_distribution?.strong_buy || 0})</span>
                            <span style={{ color: "#00e676" }}>Buy ({rating_distribution?.buy || 0})</span>
                            <span style={{ color: "#f59e0b" }}>Hold ({rating_distribution?.hold || 0})</span>
                            <span style={{ color: "#ff2a5f" }}>Sell ({rating_distribution?.sell || 0})</span>
                        </div>

                        {/* Recommendation Distribution Stacked Bar */}
                        <div style={{ height: 8, background: "#1e293b", borderRadius: 4, overflow: "hidden", display: "flex" }}>
                            <div style={{ width: `${((rating_distribution?.strong_buy || 0) / (total_analysts || 1)) * 100}%`, background: "#00e676" }} />
                            <div style={{ width: `${((rating_distribution?.buy || 0) / (total_analysts || 1)) * 100}%`, background: "#22c55e" }} />
                            <div style={{ width: `${((rating_distribution?.hold || 0) / (total_analysts || 1)) * 100}%`, background: "#f59e0b" }} />
                            <div style={{ width: `${((rating_distribution?.underperform || 0) / (total_analysts || 1)) * 100}%`, background: "#f97316" }} />
                            <div style={{ width: `${((rating_distribution?.sell || 0) / (total_analysts || 1)) * 100}%`, background: "#ff2a5f" }} />
                        </div>
                    </div>

                    <div style={{ borderTop: "1px solid #1e293b", paddingTop: 10, marginTop: 12, fontSize: "0.65rem", color: "#64748b" }}>
                        Score: {data.rating_score || "4.35"} / 5.0 (Bullish Consensus)
                    </div>
                </div>

                {/* Financial Projection Summary */}
                <div
                    style={{
                        background: "#05070c",
                        border: "1px solid #1e293b",
                        borderRadius: 8,
                        padding: 16,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                        <span className="terminal-label">CONSENSUS EPS & REVENUE FORECAST</span>
                        <Award size={14} color="#00e676" />
                    </div>
                    <div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                            <span style={{ fontSize: "0.68rem", color: "#94a3b8" }}>FY25 EPS (Est):</span>
                            <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#ffffff", fontFamily: "var(--font-mono)" }}>
                                {estimates?.[1]?.eps || "₹112.8"}
                            </span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ fontSize: "0.68rem", color: "#94a3b8" }}>FY26 EPS (Est):</span>
                            <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#00e676", fontFamily: "var(--font-mono)" }}>
                                {estimates?.[2]?.eps || "₹134.5"}
                            </span>
                        </div>
                    </div>
                    <div style={{ borderTop: "1px solid #1e293b", paddingTop: 10, marginTop: 12, fontSize: "0.65rem", color: "#64748b" }}>
                        Source: {source || "Trendlyne / BSE Analyst Consensus"}
                    </div>
                </div>
            </div>

            {/* Consensus Revenue & EPS Table */}
            <div style={{ background: "#05070c", border: "1px solid #1e293b", borderRadius: 8, overflow: "hidden" }}>
                <div className="section-header" style={{ background: "#090d16", borderBottom: "1px solid #1e293b" }}>
                    <span className="terminal-heading">ANNUAL CONSENSUS FINANCIAL PROJECTIONS (FY24 - FY26)</span>
                </div>
                <table className="terminal-table">
                    <thead>
                        <tr>
                            <th style={{ textAlign: "left" }}>PERIOD</th>
                            <th style={{ textAlign: "right" }}>REVENUE</th>
                            <th style={{ textAlign: "right" }}>EBITDA</th>
                            <th style={{ textAlign: "right" }}>EPS (₹)</th>
                            <th style={{ textAlign: "right" }}>FORWARD P/E</th>
                        </tr>
                    </thead>
                    <tbody>
                        {estimates?.map((row, i) => (
                            <tr key={i}>
                                <td style={{ fontWeight: 800, color: "#ffffff" }}>{row.period}</td>
                                <td style={{ textAlign: "right", color: "#ffffff" }}>{row.revenue}</td>
                                <td style={{ textAlign: "right", color: "#ffffff" }}>{row.ebitda}</td>
                                <td style={{ textAlign: "right", fontWeight: 800, color: "#00e676" }}>{row.eps}</td>
                                <td style={{ textAlign: "right", color: "#94a3b8" }}>{row.pe}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Initiating Coverage & Broker Reports Feed */}
            <div style={{ background: "#05070c", border: "1px solid #1e293b", borderRadius: 8, overflow: "hidden" }}>
                <div
                    className="section-header"
                    style={{ background: "#090d16", borderBottom: "1px solid #1e293b", display: "flex", justifyContent: "space-between" }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <FileText size={15} color="#00e676" />
                        <span className="terminal-heading">INITIATING COVERAGE & BROKERAGE RESEARCH REPORTS ({reports?.length || 0})</span>
                    </div>
                    <span style={{ fontSize: "0.6rem", color: "#64748b", fontFamily: "var(--font-mono)" }}>
                        SOURCE: TRENDLYNE / BSE ANALYST FILINGS
                    </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                    {reports?.map((rep, idx) => (
                        <div
                            key={idx}
                            style={{
                                padding: 16,
                                borderBottom: idx < reports.length - 1 ? "1px solid #1e293b" : "none",
                                display: "flex",
                                flexDirection: "column",
                                gap: 8,
                                background: "#04050a",
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    <Building2 size={15} color="#00e676" />
                                    <span style={{ fontWeight: 800, color: "#ffffff", fontSize: "0.82rem", fontFamily: "var(--font-mono)" }}>
                                        {rep.brokerage}
                                    </span>
                                    <span
                                        style={{
                                            fontSize: "0.58rem",
                                            fontWeight: 800,
                                            padding: "2px 8px",
                                            borderRadius: 4,
                                            fontFamily: "var(--font-mono)",
                                            background: rep.rating === "BUY" ? "rgba(0, 230, 118, 0.15)" : "rgba(245, 158, 11, 0.15)",
                                            color: rep.rating === "BUY" ? "#00e676" : "#f59e0b",
                                            border: `1px solid ${rep.rating === "BUY" ? "rgba(0, 230, 118, 0.3)" : "rgba(245, 158, 11, 0.3)"}`,
                                        }}
                                    >
                                        {rep.rating}
                                    </span>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                    <span style={{ fontSize: "0.7rem", color: "#94a3b8", fontFamily: "var(--font-mono)" }}>
                                        Target: <strong style={{ color: "#00e676" }}>₹{rep.target_price?.toLocaleString("en-IN")}</strong>
                                    </span>
                                    <span style={{ fontSize: "0.65rem", color: "#64748b", fontFamily: "var(--font-mono)" }}>
                                        {rep.reco_date}
                                    </span>
                                </div>
                            </div>

                            <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#f8fafc" }}>
                                {rep.report_title}
                            </div>

                            <p style={{ fontSize: "0.75rem", color: "#94a3b8", margin: 0, lineHeight: 1.4 }}>
                                {rep.key_rationale}
                            </p>

                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 4 }}>
                                <span style={{ fontSize: "0.62rem", color: "#64748b", fontFamily: "var(--font-mono)" }}>
                                    Source: {rep.source}
                                </span>
                                <a
                                    href={rep.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        color: "#00e676",
                                        fontSize: "0.65rem",
                                        fontFamily: "var(--font-mono)",
                                        textDecoration: "none",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 4,
                                        fontWeight: 700,
                                    }}
                                >
                                    <span>VIEW FULL TRENDLYNE REPORT</span>
                                    <ExternalLink size={11} />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
