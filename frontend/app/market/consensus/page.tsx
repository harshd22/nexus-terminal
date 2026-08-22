"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getMarketConsensusReports, getStockConsensus, searchStocks } from "@/lib/api";
import { ConsensusView } from "@/components/ConsensusView";
import { Building2, TrendingUp, Search, ExternalLink, ShieldCheck, Award, AlertCircle } from "lucide-react";

export default function ConsensusHubPage() {
    const [reportsData, setReportsData] = useState<any>(null);
    const [selectedStock, setSelectedStock] = useState<string>("RELIANCE");
    const [stockConsensus, setStockConsensus] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);

    useEffect(() => {
        getMarketConsensusReports()
            .then(setReportsData)
            .catch(() => setReportsData(null));
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setSelectedStock(searchQuery.trim().toUpperCase());
        }
    };

    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }
        const timer = setTimeout(() => {
            searchStocks(searchQuery)
                .then((res) => setSearchResults(res.results || []))
                .catch(() => setSearchResults([]));
        }, 200);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        setLoading(true);
        getStockConsensus(selectedStock)
            .then(setStockConsensus)
            .catch(() => setStockConsensus({ symbol: selectedStock, available: false, message: `Failed to fetch consensus data for ${selectedStock}` }))
            .finally(() => setLoading(false));
    }, [selectedStock]);

    const reports = reportsData?.reports || [];

    return (
        <div style={{ padding: "20px 24px", maxWidth: 1400, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Top Banner Header */}
            <div style={{ background: "#05070c", border: "1px solid #1e293b", borderRadius: 8, padding: 20 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div
                                style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: 6,
                                    background: "rgba(0, 230, 118, 0.15)",
                                    border: "1px solid rgba(0, 230, 118, 0.3)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Award size={18} color="#00e676" />
                            </div>
                            <h1 style={{ fontSize: "1.25rem", fontWeight: 800, margin: 0, fontFamily: "var(--font-mono)", color: "#ffffff", letterSpacing: "0.05em" }}>
                                ANALYST CONSENSUS & INITIATING COVERAGE REPORTS
                            </h1>
                        </div>
                        <p style={{ fontSize: "0.75rem", color: "#94a3b8", margin: "6px 0 0 42px" }}>
                            Aggregated institutional research targets, buy/hold/sell consensus distribution, and initiating coverage feeds powered by Trendlyne & BSE Filings.
                        </p>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            background: "#090d16",
                            border: "1px solid #1e293b",
                            borderRadius: 6,
                            padding: "6px 12px",
                        }}
                    >
                        <ShieldCheck size={14} color="#00e676" />
                        <span style={{ fontSize: "0.68rem", color: "#00e676", fontFamily: "var(--font-mono)", fontWeight: 700 }}>
                            TRENDLYNE & BROKERAGE VERIFIED
                        </span>
                    </div>
                </div>
            </div>

            {/* Stock Search Bar & Quick Tags */}
            <div style={{ background: "#05070c", border: "1px solid #1e293b", borderRadius: 8, padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                    <form onSubmit={handleSearch} style={{ display: "flex", gap: 8, flex: 1, minWidth: 280, position: "relative" }}>
                        <div style={{ position: "relative", flex: 1 }}>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search any stock symbol (e.g. RELIANCE, TCS, TATAMOTORS, CDSL, SUZLON)..."
                                style={{
                                    width: "100%",
                                    padding: "10px 14px 10px 36px",
                                    background: "#090d16",
                                    border: "1px solid #1e293b",
                                    borderRadius: 6,
                                    color: "#ffffff",
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "0.78rem",
                                    outline: "none",
                                }}
                            />
                            <Search size={14} color="#64748b" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />

                            {/* Dropdown Suggestions */}
                            {searchResults.length > 0 && (
                                <div
                                    style={{
                                        position: "absolute",
                                        top: "100%",
                                        left: 0,
                                        right: 0,
                                        marginTop: 4,
                                        background: "#090d16",
                                        border: "1px solid #1e293b",
                                        borderRadius: 6,
                                        maxHeight: 200,
                                        overflowY: "auto",
                                        zIndex: 50,
                                    }}
                                >
                                    {searchResults.map((item) => (
                                        <div
                                            key={item.symbol}
                                            onClick={() => {
                                                setSelectedStock(item.symbol);
                                                setSearchQuery("");
                                                setSearchResults([]);
                                            }}
                                            style={{
                                                padding: "8px 12px",
                                                cursor: "pointer",
                                                borderBottom: "1px solid #1e293b",
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                            }}
                                            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0, 230, 118, 0.1)")}
                                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                                        >
                                            <span style={{ fontFamily: "var(--font-mono)", fontWeight: 800, color: "#ffffff", fontSize: "0.75rem" }}>
                                                {item.symbol}
                                            </span>
                                            <span style={{ fontSize: "0.68rem", color: "#94a3b8" }}>{item.name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            style={{
                                padding: "0 18px",
                                background: "#00e676",
                                border: "none",
                                borderRadius: 6,
                                color: "#000000",
                                fontFamily: "var(--font-mono)",
                                fontWeight: 800,
                                fontSize: "0.72rem",
                                cursor: "pointer",
                                letterSpacing: "0.05em",
                            }}
                        >
                            SEARCH CONSENSUS
                        </button>
                    </form>
                </div>

                {/* Quick Select Tags */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span className="terminal-label" style={{ fontSize: "0.6rem" }}>POPULAR COVERAGE:</span>
                    {["RELIANCE", "TATASTEEL", "INFY", "HDFCBANK", "ZOMATO", "BHARTIARTL", "TCS", "TATAMOTORS"].map((sym) => (
                        <button
                            key={sym}
                            onClick={() => {
                                setSelectedStock(sym);
                                setSearchQuery("");
                            }}
                            style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.65rem",
                                fontWeight: selectedStock === sym ? 800 : 500,
                                padding: "4px 10px",
                                borderRadius: 4,
                                border: "1px solid",
                                borderColor: selectedStock === sym ? "#00e676" : "#1e293b",
                                background: selectedStock === sym ? "rgba(0, 230, 118, 0.15)" : "rgba(255, 255, 255, 0.02)",
                                color: selectedStock === sym ? "#ffffff" : "#94a3b8",
                                cursor: "pointer",
                                transition: "all 0.15s ease",
                            }}
                        >
                            {sym}
                        </button>
                    ))}
                </div>
            </div>

            {/* Selected Stock Consensus View */}
            {loading ? (
                <div className="skeleton" style={{ height: 360, borderRadius: 8 }} />
            ) : (
                stockConsensus && <ConsensusView data={stockConsensus} />
            )}

            {/* Market-Wide Initiating Coverage Feed Table */}
            <div style={{ background: "#05070c", border: "1px solid #1e293b", borderRadius: 8, overflow: "hidden" }}>
                <div className="section-header" style={{ background: "#090d16", borderBottom: "1px solid #1e293b" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Building2 size={15} color="#00e676" />
                        <span className="terminal-heading">MARKET-WIDE INITIATING COVERAGE & TARGET REVISIONS</span>
                    </div>
                </div>

                <div style={{ overflowX: "auto" }}>
                    <table className="terminal-table">
                        <thead>
                            <tr>
                                <th style={{ textAlign: "left" }}>TICKER & SECTOR</th>
                                <th style={{ textAlign: "left" }}>BROKERAGE</th>
                                <th style={{ textAlign: "center" }}>RECO TYPE</th>
                                <th style={{ textAlign: "center" }}>RATING</th>
                                <th style={{ textAlign: "right" }}>CMP</th>
                                <th style={{ textAlign: "right" }}>TARGET PRICE</th>
                                <th style={{ textAlign: "right" }}>UPSIDE %</th>
                                <th style={{ textAlign: "right" }}>DATE</th>
                                <th style={{ textAlign: "center" }}>SOURCE REPORT</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.map((rep: any, i: number) => (
                                <tr key={i}>
                                    <td>
                                        <Link href={`/stock/${rep.symbol}`} style={{ textDecoration: "none" }}>
                                            <span style={{ fontWeight: 800, color: "#ffffff", fontSize: "0.8rem", letterSpacing: "0.05em" }}>
                                                {rep.symbol}
                                            </span>
                                        </Link>
                                        <div style={{ fontSize: "0.65rem", color: "#94a3b8" }}>{rep.company_name}</div>
                                    </td>
                                    <td style={{ fontWeight: 700, color: "#ffffff" }}>{rep.brokerage}</td>
                                    <td style={{ textAlign: "center" }}>
                                        <span style={{ fontSize: "0.58rem", fontWeight: 800, padding: "2px 6px", borderRadius: 4, background: "rgba(255, 255, 255, 0.08)", color: "#ffffff", border: "1px solid #334155" }}>
                                            {rep.reco_type}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: "center" }}>
                                        <span style={{ fontSize: "0.58rem", fontWeight: 800, padding: "2px 6px", borderRadius: 4, background: "rgba(0, 230, 118, 0.12)", color: "#00e676", border: "1px solid rgba(0, 230, 118, 0.3)" }}>
                                            {rep.rating}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: "right", color: "#ffffff" }} className="value-mono">
                                        ₹{rep.current_price?.toLocaleString("en-IN")}
                                    </td>
                                    <td style={{ textAlign: "right", fontWeight: 800, color: "#00e676" }} className="value-mono">
                                        ₹{rep.target_price?.toLocaleString("en-IN")}
                                    </td>
                                    <td style={{ textAlign: "right" }} className="value-mono">
                                        <span style={{ color: "#00e676", fontWeight: 800, background: "rgba(0, 230, 118, 0.12)", padding: "2px 6px", borderRadius: 4 }}>
                                            +{rep.upside_pct}%
                                        </span>
                                    </td>
                                    <td style={{ textAlign: "right", color: "#94a3b8" }} className="value-mono">
                                        {rep.reco_date}
                                    </td>
                                    <td style={{ textAlign: "center" }}>
                                        <a
                                            href={rep.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ color: "#00e676", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4, fontSize: "0.65rem", fontWeight: 700 }}
                                        >
                                            <span>TRENDLYNE</span>
                                            <ExternalLink size={10} />
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
