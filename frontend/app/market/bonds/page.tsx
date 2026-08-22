"use client";

import React, { useState, useEffect } from "react";
import {
    Landmark,
    TrendingUp,
    TrendingDown,
    Percent,
    Award,
    ShieldCheck,
    Coins,
    BarChart2,
    ArrowUpRight,
    ArrowDownRight
} from "lucide-react";

interface GSec {
    id: string;
    tenor: string;
    tenor_years: number;
    type: string;
    yield_pct: number;
    previous_yield_pct: number;
    change_bp: number;
    coupon_pct: number;
    price: number;
    volume_cr: number;
}

interface CorporateBond {
    id: string;
    issuer: string;
    symbol: string;
    rating: string;
    category: string;
    coupon_pct: number;
    ytm_pct: number;
    spread_over_gsec_bp: number;
    price: number;
    maturity_date: string;
    face_value: number;
    min_qty: number;
}

interface SGB {
    id: string;
    symbol: string;
    series: string;
    coupon_pct: number;
    market_price_per_gram: number;
    gold_spot_parity_price: number;
    discount_premium_pct: number;
    status: string;
    issue_price: number;
    maturity_date: string;
    volume_units: number;
}

export default function BondsPage() {
    const [yieldCurve, setYieldCurve] = useState<GSec[]>([]);
    const [corporateBonds, setCorporateBonds] = useState<CorporateBond[]>([]);
    const [sgbMarket, setSgbMarket] = useState<SGB[]>([]);
    const [summary, setSummary] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"yield" | "corporate" | "sgb">("yield");

    useEffect(() => {
        fetchBondsData();
    }, []);

    const fetchBondsData = async () => {
        setLoading(true);
        try {
            const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
            const [resCurve, resCorp, resSgb, resSum] = await Promise.all([
                fetch(`${apiBase}/api/bonds/yield-curve`),
                fetch(`${apiBase}/api/bonds/corporate`),
                fetch(`${apiBase}/api/bonds/sgb`),
                fetch(`${apiBase}/api/bonds/summary`)
            ]);

            if (resCurve.ok) setYieldCurve(await resCurve.json());
            if (resCorp.ok) setCorporateBonds(await resCorp.json());
            if (resSgb.ok) setSgbMarket(await resSgb.json());
            if (resSum.ok) setSummary(await resSum.json());
        } catch (err) {
            console.error("Failed to fetch bonds data:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: 16, background: "var(--bg-base)", minHeight: "100%" }}>
            {/* Header Banner */}
            <div className="section-header" style={{ marginBottom: 14 }}>
                <span className="terminal-heading flex items-center gap-2">
                    <Landmark size={15} color="var(--purple)" />
                    FIXED INCOME & BOND MARKET INTELLIGENCE
                </span>
                <span className="live-dot" />
                <span style={{ marginLeft: "auto", fontFamily: "var(--text-mono)", fontSize: "0.58rem", color: "var(--purple)", fontWeight: 700 }}>
                    CCIL · RBI G-SEC · BSE DEBT STREAM
                </span>
            </div>

            {/* KPI Cards */}
            {summary && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10, marginBottom: 16 }}>
                    <div
                        style={{
                            background: "var(--bg-card)",
                            border: "1px solid var(--border-active)",
                            boxShadow: "0 0 12px rgba(124, 77, 255, 0.08)",
                            padding: "12px 14px",
                            borderRadius: 2,
                        }}
                    >
                        <div style={{ fontFamily: "var(--text-mono)", fontSize: "0.58rem", color: "var(--text-muted)", letterSpacing: "0.1em" }}>
                            10Y BENCHMARK G-SEC YIELD
                        </div>
                        <div style={{ fontFamily: "var(--text-mono)", fontSize: "1.5rem", fontWeight: 700, color: "var(--purple)", marginTop: 4 }}>
                            {summary.benchmark_10y_gsec_yield}%
                        </div>
                        <div style={{ fontFamily: "var(--text-mono)", fontSize: "0.55rem", color: summary.benchmark_10y_gsec_change_bp < 0 ? "var(--green)" : "var(--red)", marginTop: 2 }}>
                            {summary.benchmark_10y_gsec_change_bp} bps TODAY
                        </div>
                    </div>

                    <div
                        style={{
                            background: "var(--bg-card)",
                            border: "1px solid var(--border-subtle)",
                            padding: "12px 14px",
                            borderRadius: 2,
                        }}
                    >
                        <div style={{ fontFamily: "var(--text-mono)", fontSize: "0.58rem", color: "var(--text-muted)", letterSpacing: "0.1em" }}>
                            5Y G-SEC YIELD
                        </div>
                        <div style={{ fontFamily: "var(--text-mono)", fontSize: "1.5rem", fontWeight: 700, color: "var(--text-primary)", marginTop: 4 }}>
                            {summary.gsec_5y_yield}%
                        </div>
                        <div style={{ fontFamily: "var(--text-mono)", fontSize: "0.55rem", color: "var(--text-muted)", marginTop: 2 }}>
                            SOVEREIGN CURVE
                        </div>
                    </div>

                    <div
                        style={{
                            background: "var(--bg-card)",
                            border: "1px solid var(--border-subtle)",
                            padding: "12px 14px",
                            borderRadius: 2,
                        }}
                    >
                        <div style={{ fontFamily: "var(--text-mono)", fontSize: "0.58rem", color: "var(--text-muted)", letterSpacing: "0.1em" }}>
                            AVG AAA CORP SPREAD
                        </div>
                        <div style={{ fontFamily: "var(--text-mono)", fontSize: "1.5rem", fontWeight: 700, color: "var(--amber)", marginTop: 4 }}>
                            +{summary.avg_aaa_corporate_spread_bp} bps
                        </div>
                        <div style={{ fontFamily: "var(--text-mono)", fontSize: "0.55rem", color: "var(--text-muted)", marginTop: 2 }}>
                            OVER 10Y G-SEC
                        </div>
                    </div>

                    <div
                        style={{
                            background: "var(--bg-card)",
                            border: "1px solid var(--border-subtle)",
                            padding: "12px 14px",
                            borderRadius: 2,
                        }}
                    >
                        <div style={{ fontFamily: "var(--text-mono)", fontSize: "0.58rem", color: "var(--text-muted)", letterSpacing: "0.1em" }}>
                            SGB SPOT GOLD PARITY
                        </div>
                        <div style={{ fontFamily: "var(--text-mono)", fontSize: "1.5rem", fontWeight: 700, color: "var(--green)", marginTop: 4 }}>
                            ₹{summary.spot_gold_reference_per_gram} /g
                        </div>
                        <div style={{ fontFamily: "var(--text-mono)", fontSize: "0.55rem", color: "var(--green)", marginTop: 2 }}>
                            SECONDARY MARKET TRADING
                        </div>
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div
                style={{
                    display: "flex",
                    gap: 6,
                    padding: "8px 12px",
                    background: "var(--bg-panel)",
                    border: "1px solid var(--border-subtle)",
                    marginBottom: 14,
                }}
            >
                {[
                    { id: "yield", label: "SOVEREIGN G-SEC YIELD CURVE" },
                    { id: "corporate", label: "AAA / AA+ CORPORATE & PSU BONDS" },
                    { id: "sgb", label: "SOVEREIGN GOLD BONDS (SGB) SECONDARY" },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        style={{
                            fontFamily: "var(--text-mono)",
                            fontSize: "0.62rem",
                            fontWeight: 700,
                            padding: "6px 12px",
                            borderRadius: 1,
                            border: activeTab === tab.id ? "1px solid var(--purple)" : "1px solid var(--border-subtle)",
                            background: activeTab === tab.id ? "rgba(124, 77, 255, 0.15)" : "var(--bg-card)",
                            color: activeTab === tab.id ? "var(--purple)" : "var(--text-secondary)",
                            cursor: "pointer",
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab 1: Yield Curve */}
            {activeTab === "yield" && (
                <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--text-mono)", fontSize: "0.68rem" }}>
                        <thead>
                            <tr style={{ background: "var(--bg-panel)", color: "var(--text-muted)", textAlign: "left" }}>
                                <th style={{ padding: "8px 12px", borderBottom: "1px solid var(--border-subtle)" }}>TENOR</th>
                                <th style={{ padding: "8px 12px", borderBottom: "1px solid var(--border-subtle)" }}>TYPE</th>
                                <th style={{ padding: "8px 12px", borderBottom: "1px solid var(--border-subtle)" }}>YIELD %</th>
                                <th style={{ padding: "8px 12px", borderBottom: "1px solid var(--border-subtle)" }}>PREV YIELD</th>
                                <th style={{ padding: "8px 12px", borderBottom: "1px solid var(--border-subtle)" }}>CHANGE (BPS)</th>
                                <th style={{ padding: "8px 12px", borderBottom: "1px solid var(--border-subtle)" }}>COUPON</th>
                                <th style={{ padding: "8px 12px", borderBottom: "1px solid var(--border-subtle)" }}>CLEAN PRICE</th>
                                <th style={{ padding: "8px 12px", borderBottom: "1px solid var(--border-subtle)" }}>DAILY VOL (₹ CR)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {yieldCurve.map((item) => (
                                <tr key={item.id} style={{ borderBottom: "1px solid var(--border-subtle)", color: "var(--text-primary)" }}>
                                    <td style={{ padding: "8px 12px", fontWeight: 700, color: item.id === "gsec-10y" ? "var(--purple)" : "inherit" }}>
                                        {item.tenor}
                                    </td>
                                    <td style={{ padding: "8px 12px", color: "var(--text-muted)" }}>{item.type}</td>
                                    <td style={{ padding: "8px 12px", fontWeight: 700, color: "var(--purple)" }}>{item.yield_pct}%</td>
                                    <td style={{ padding: "8px 12px", color: "var(--text-muted)" }}>{item.previous_yield_pct}%</td>
                                    <td style={{ padding: "8px 12px", color: item.change_bp < 0 ? "var(--green)" : "var(--red)", fontWeight: 700 }}>
                                        {item.change_bp > 0 ? "+" : ""}{item.change_bp} bps
                                    </td>
                                    <td style={{ padding: "8px 12px" }}>{item.coupon_pct ? `${item.coupon_pct}%` : "Zero Coupon"}</td>
                                    <td style={{ padding: "8px 12px" }}>₹{item.price}</td>
                                    <td style={{ padding: "8px 12px", color: "var(--text-secondary)" }}>₹{item.volume_cr.toLocaleString()} Cr</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Tab 2: Corporate Bonds */}
            {activeTab === "corporate" && (
                <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--text-mono)", fontSize: "0.68rem" }}>
                        <thead>
                            <tr style={{ background: "var(--bg-panel)", color: "var(--text-muted)", textAlign: "left" }}>
                                <th style={{ padding: "8px 12px", borderBottom: "1px solid var(--border-subtle)" }}>ISSUER</th>
                                <th style={{ padding: "8px 12px", borderBottom: "1px solid var(--border-subtle)" }}>SYMBOL</th>
                                <th style={{ padding: "8px 12px", borderBottom: "1px solid var(--border-subtle)" }}>CREDIT RATING</th>
                                <th style={{ padding: "8px 12px", borderBottom: "1px solid var(--border-subtle)" }}>COUPON</th>
                                <th style={{ padding: "8px 12px", borderBottom: "1px solid var(--border-subtle)" }}>YTM %</th>
                                <th style={{ padding: "8px 12px", borderBottom: "1px solid var(--border-subtle)" }}>SPREAD OVER 10Y</th>
                                <th style={{ padding: "8px 12px", borderBottom: "1px solid var(--border-subtle)" }}>PRICE</th>
                                <th style={{ padding: "8px 12px", borderBottom: "1px solid var(--border-subtle)" }}>MATURITY</th>
                            </tr>
                        </thead>
                        <tbody>
                            {corporateBonds.map((bond) => (
                                <tr key={bond.id} style={{ borderBottom: "1px solid var(--border-subtle)", color: "var(--text-primary)" }}>
                                    <td style={{ padding: "8px 12px", fontWeight: 700 }}>{bond.issuer}</td>
                                    <td style={{ padding: "8px 12px", color: "var(--purple)" }}>{bond.symbol}</td>
                                    <td style={{ padding: "8px 12px", color: "var(--green)", fontWeight: 700 }}>{bond.rating}</td>
                                    <td style={{ padding: "8px 12px" }}>{bond.coupon_pct}%</td>
                                    <td style={{ padding: "8px 12px", fontWeight: 700, color: "var(--purple)" }}>{bond.ytm_pct}%</td>
                                    <td style={{ padding: "8px 12px", color: "var(--amber)", fontWeight: 600 }}>+{bond.spread_over_gsec_bp} bps</td>
                                    <td style={{ padding: "8px 12px" }}>₹{bond.price}</td>
                                    <td style={{ padding: "8px 12px", color: "var(--text-muted)" }}>{bond.maturity_date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Tab 3: Sovereign Gold Bonds */}
            {activeTab === "sgb" && (
                <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--text-mono)", fontSize: "0.68rem" }}>
                        <thead>
                            <tr style={{ background: "var(--bg-panel)", color: "var(--text-muted)", textAlign: "left" }}>
                                <th style={{ padding: "8px 12px", borderBottom: "1px solid var(--border-subtle)" }}>SGB SERIES</th>
                                <th style={{ padding: "8px 12px", borderBottom: "1px solid var(--border-subtle)" }}>NSE SYMBOL</th>
                                <th style={{ padding: "8px 12px", borderBottom: "1px solid var(--border-subtle)" }}>COUPON</th>
                                <th style={{ padding: "8px 12px", borderBottom: "1px solid var(--border-subtle)" }}>MARKET PRICE / GRAM</th>
                                <th style={{ padding: "8px 12px", borderBottom: "1px solid var(--border-subtle)" }}>GOLD SPOT PARITY</th>
                                <th style={{ padding: "8px 12px", borderBottom: "1px solid var(--border-subtle)" }}>DISCOUNT / PREMIUM</th>
                                <th style={{ padding: "8px 12px", borderBottom: "1px solid var(--border-subtle)" }}>MATURITY DATE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sgbMarket.map((sgb) => (
                                <tr key={sgb.id} style={{ borderBottom: "1px solid var(--border-subtle)", color: "var(--text-primary)" }}>
                                    <td style={{ padding: "8px 12px", fontWeight: 700 }}>{sgb.series}</td>
                                    <td style={{ padding: "8px 12px", color: "var(--purple)" }}>{sgb.symbol}</td>
                                    <td style={{ padding: "8px 12px" }}>{sgb.coupon_pct}% p.a.</td>
                                    <td style={{ padding: "8px 12px", fontWeight: 700 }}>₹{sgb.market_price_per_gram}</td>
                                    <td style={{ padding: "8px 12px", color: "var(--text-muted)" }}>₹{sgb.gold_spot_parity_price}</td>
                                    <td style={{ padding: "8px 12px", color: sgb.discount_premium_pct < 0 ? "var(--green)" : "var(--amber)", fontWeight: 700 }}>
                                        {sgb.discount_premium_pct}% ({sgb.status})
                                    </td>
                                    <td style={{ padding: "8px 12px", color: "var(--text-secondary)" }}>{sgb.maturity_date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
