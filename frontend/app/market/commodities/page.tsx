"use client";

import React, { useState, useEffect } from "react";
import {
    Coins,
    TrendingUp,
    TrendingDown,
    DollarSign,
    Globe,
    Flame,
    Wheat,
    ArrowUpRight,
    ArrowDownRight
} from "lucide-react";

interface Commodity {
    id: string;
    name: string;
    symbol: string;
    category: string;
    price: number;
    unit: string;
    currency: string;
    change: number;
    change_pct: number;
    high: number;
    low: number;
    volume: number;
    trend: "up" | "down";
}

interface ForexPair {
    pair: string;
    base: string;
    target: string;
    rate: number;
    change: number;
    change_pct: number;
    rbi_reference_rate: number | null;
    high: number;
    low: number;
    status: string;
}

export default function CommoditiesPage() {
    const [commodities, setCommodities] = useState<Commodity[]>([]);
    const [forex, setForex] = useState<ForexPair[]>([]);
    const [summary, setSummary] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCommoditiesData();
    }, []);

    const fetchCommoditiesData = async () => {
        setLoading(true);
        try {
            const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
            const [resCmd, resFx, resSum] = await Promise.all([
                fetch(`${apiBase}/api/commodities/all`),
                fetch(`${apiBase}/api/commodities/forex`),
                fetch(`${apiBase}/api/commodities/summary`)
            ]);

            if (resCmd.ok) setCommodities(await resCmd.json());
            if (resFx.ok) setForex(await resFx.json());
            if (resSum.ok) setSummary(await resSum.json());
        } catch (err) {
            console.error("Failed to fetch commodities data:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: 16, background: "var(--bg-base)", minHeight: "100%" }}>
            {/* Header Banner */}
            <div className="section-header" style={{ marginBottom: 14 }}>
                <span className="terminal-heading flex items-center gap-2">
                    <Coins size={15} color="var(--purple)" />
                    COMMODITIES & FOREX DASHBOARD
                </span>
                <span className="live-dot" />
                <span style={{ marginLeft: "auto", fontFamily: "var(--text-mono)", fontSize: "0.58rem", color: "var(--purple)", fontWeight: 700 }}>
                    MCX INDIA · NYMEX · RBI REFERENCE RATES
                </span>
            </div>

            {/* Top Summary Cards */}
            {summary && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10, marginBottom: 16 }}>
                    <div
                        style={{
                            background: "var(--bg-card)",
                            border: "1px solid var(--border-active)",
                            boxShadow: "0 0 12px rgba(255, 215, 0, 0.08)",
                            padding: "12px 14px",
                            borderRadius: 2,
                        }}
                    >
                        <div style={{ fontFamily: "var(--text-mono)", fontSize: "0.58rem", color: "var(--text-muted)", letterSpacing: "0.1em" }}>
                            GOLD MCX (PER 10G)
                        </div>
                        <div style={{ fontFamily: "var(--text-mono)", fontSize: "1.5rem", fontWeight: 700, color: "var(--amber)", marginTop: 4 }}>
                            ₹{summary.gold_mcx_price.toLocaleString()}
                        </div>
                        <div style={{ fontFamily: "var(--text-mono)", fontSize: "0.55rem", color: summary.gold_mcx_change_pct >= 0 ? "var(--green)" : "var(--red)", marginTop: 2 }}>
                            {summary.gold_mcx_change_pct >= 0 ? "+" : ""}{summary.gold_mcx_change_pct}% TODAY
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
                            BRENT CRUDE OIL
                        </div>
                        <div style={{ fontFamily: "var(--text-mono)", fontSize: "1.5rem", fontWeight: 700, color: "var(--text-primary)", marginTop: 4 }}>
                            ${summary.brent_crude_price} / bbl
                        </div>
                        <div style={{ fontFamily: "var(--text-mono)", fontSize: "0.55rem", color: summary.brent_crude_change_pct >= 0 ? "var(--green)" : "var(--red)", marginTop: 2 }}>
                            {summary.brent_crude_change_pct >= 0 ? "+" : ""}{summary.brent_crude_change_pct}% TODAY
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
                            USD / INR CROSS RATE
                        </div>
                        <div style={{ fontFamily: "var(--text-mono)", fontSize: "1.5rem", fontWeight: 700, color: "var(--purple)", marginTop: 4 }}>
                            ₹{summary.usdinr_rate}
                        </div>
                        <div style={{ fontFamily: "var(--text-mono)", fontSize: "0.55rem", color: "var(--green)", marginTop: 2 }}>
                            RBI REFERENCE RATE
                        </div>
                    </div>
                </div>
            )}

            {/* Commodities Grid */}
            <div style={{ marginBottom: 20 }}>
                <div className="section-header" style={{ marginBottom: 8, background: "var(--bg-panel)", padding: "6px 12px" }}>
                    <span className="terminal-heading flex items-center gap-2" style={{ fontSize: "0.72rem" }}>
                        <Flame size={13} color="var(--purple)" />
                        COMMODITIES MARKET PRICING (MCX & GLOBAL)
                    </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
                    {commodities.map((cmd) => (
                        <div
                            key={cmd.id}
                            style={{
                                background: "var(--bg-card)",
                                border: "1px solid var(--border-subtle)",
                                padding: 14,
                                borderRadius: 2,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                            }}
                        >
                            <div>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                    <span style={{ fontFamily: "var(--text-mono)", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-primary)" }}>
                                        {cmd.name}
                                    </span>
                                    <span
                                        style={{
                                            fontFamily: "var(--text-mono)",
                                            fontSize: "0.5rem",
                                            fontWeight: 700,
                                            padding: "2px 5px",
                                            background: "var(--bg-panel)",
                                            color: "var(--purple)",
                                        }}
                                    >
                                        {cmd.category}
                                    </span>
                                </div>

                                <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 8 }}>
                                    <span style={{ fontFamily: "var(--text-mono)", fontSize: "1.3rem", fontWeight: 700, color: "var(--text-primary)" }}>
                                        {cmd.currency === "INR" ? "₹" : "$"}{cmd.price.toLocaleString()}{" "}
                                        <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{cmd.unit}</span>
                                    </span>

                                    <span
                                        style={{
                                            fontFamily: "var(--text-mono)",
                                            fontSize: "0.65rem",
                                            fontWeight: 700,
                                            color: cmd.change_pct >= 0 ? "var(--green)" : "var(--red)",
                                        }}
                                    >
                                        {cmd.change_pct >= 0 ? "+" : ""}{cmd.change_pct}%
                                    </span>
                                </div>
                            </div>

                            <div
                                style={{
                                    borderTop: "1px solid var(--border-subtle)",
                                    marginTop: 10,
                                    paddingTop: 8,
                                    display: "flex",
                                    justifyContent: "space-between",
                                    fontFamily: "var(--text-mono)",
                                    fontSize: "0.58rem",
                                    color: "var(--text-muted)",
                                }}
                            >
                                <span>HIGH: {cmd.currency === "INR" ? "₹" : "$"}{cmd.high}</span>
                                <span>LOW: {cmd.currency === "INR" ? "₹" : "$"}{cmd.low}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Forex Cross Rates Matrix */}
            <div>
                <div className="section-header" style={{ marginBottom: 8, background: "var(--bg-panel)", padding: "6px 12px" }}>
                    <span className="terminal-heading flex items-center gap-2" style={{ fontSize: "0.72rem" }}>
                        <Globe size={13} color="var(--purple)" />
                        FOREX CROSS RATES & RBI REFERENCE MATRIX
                    </span>
                </div>

                <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--text-mono)", fontSize: "0.68rem" }}>
                        <thead>
                            <tr style={{ background: "var(--bg-panel)", color: "var(--text-muted)", textAlign: "left" }}>
                                <th style={{ padding: "8px 12px", borderBottom: "1px solid var(--border-subtle)" }}>CURRENCY PAIR</th>
                                <th style={{ padding: "8px 12px", borderBottom: "1px solid var(--border-subtle)" }}>SPOT RATE</th>
                                <th style={{ padding: "8px 12px", borderBottom: "1px solid var(--border-subtle)" }}>DAILY CHANGE</th>
                                <th style={{ padding: "8px 12px", borderBottom: "1px solid var(--border-subtle)" }}>RBI REF RATE</th>
                                <th style={{ padding: "8px 12px", borderBottom: "1px solid var(--border-subtle)" }}>24H HIGH</th>
                                <th style={{ padding: "8px 12px", borderBottom: "1px solid var(--border-subtle)" }}>24H LOW</th>
                                <th style={{ padding: "8px 12px", borderBottom: "1px solid var(--border-subtle)" }}>STATUS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {forex.map((fx) => (
                                <tr key={fx.pair} style={{ borderBottom: "1px solid var(--border-subtle)", color: "var(--text-primary)" }}>
                                    <td style={{ padding: "8px 12px", fontWeight: 700, color: "var(--purple)" }}>{fx.pair}</td>
                                    <td style={{ padding: "8px 12px", fontWeight: 700 }}>
                                        {fx.pair.includes("USD") && !fx.pair.includes("INR") ? "" : "₹"}{fx.rate}
                                    </td>
                                    <td style={{ padding: "8px 12px", color: fx.change_pct >= 0 ? "var(--green)" : "var(--red)", fontWeight: 700 }}>
                                        {fx.change_pct >= 0 ? "+" : ""}{fx.change_pct}%
                                    </td>
                                    <td style={{ padding: "8px 12px", color: "var(--text-secondary)" }}>
                                        {fx.rbi_reference_rate ? `₹${fx.rbi_reference_rate}` : "N/A"}
                                    </td>
                                    <td style={{ padding: "8px 12px", color: "var(--text-muted)" }}>{fx.high}</td>
                                    <td style={{ padding: "8px 12px", color: "var(--text-muted)" }}>{fx.low}</td>
                                    <td style={{ padding: "8px 12px", color: "var(--green)", fontWeight: 600 }}>{fx.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
