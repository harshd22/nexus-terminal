"use client";

import React, { useState, useEffect } from "react";
import {
    Globe,
    TrendingUp,
    TrendingDown,
    DollarSign,
    Percent,
    BarChart3,
    Building2,
    Briefcase,
    ShieldAlert,
    ArrowUpRight,
    ArrowDownRight,
    Info
} from "lucide-react";

interface MacroMetric {
    id: string;
    metric: string;
    value: number;
    unit: string;
    frequency: string;
    previous: number;
    change: number;
    trend: "up" | "down" | "flat";
    status: string;
    source: string;
    description: string;
}

interface IndianMacroData {
    last_updated: string;
    gdp_and_output: MacroMetric[];
    inflation_and_prices: MacroMetric[];
    monetary_and_rates: MacroMetric[];
    fiscal_and_debt: MacroMetric[];
    labor_and_housing: MacroMetric[];
}

interface GlobalEconomyItem {
    country: string;
    code: string;
    flag: string;
    gdp_growth_pct: number;
    cpi_inflation_pct: number;
    interest_rate_pct: number;
    debt_to_gdp_pct: number;
    unemployment_pct: number;
    central_bank: string;
    outlook: string;
}

export default function MacroEconomicsPage() {
    const [indiaData, setIndiaData] = useState<IndianMacroData | null>(null);
    const [globalData, setGlobalData] = useState<GlobalEconomyItem[]>([]);
    const [summary, setSummary] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"all" | "gdp" | "inflation" | "monetary" | "fiscal" | "labor">("all");
    const [globalSortKey, setGlobalSortKey] = useState<keyof GlobalEconomyItem>("gdp_growth_pct");

    useEffect(() => {
        fetchMacroData();
    }, []);

    const fetchMacroData = async () => {
        setLoading(true);
        try {
            const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
            const [resInd, resGlob, resSum] = await Promise.all([
                fetch(`${apiBase}/api/macro/india`),
                fetch(`${apiBase}/api/macro/global`),
                fetch(`${apiBase}/api/macro/summary`)
            ]);

            if (resInd.ok) setIndiaData(await resInd.json());
            if (resGlob.ok) setGlobalData(await resGlob.json());
            if (resSum.ok) setSummary(await resSum.json());
        } catch (err) {
            console.error("Failed to fetch macro data:", err);
        } finally {
            setLoading(false);
        }
    };

    const sortedGlobalData = [...globalData].sort((a, b) => {
        const valA = a[globalSortKey];
        const valB = b[globalSortKey];
        if (typeof valA === "number" && typeof valB === "number") {
            return valB - valA;
        }
        return 0;
    });

    return (
        <div style={{ padding: 16, background: "var(--bg-base)", minHeight: "100%" }}>
            {/* Header Banner */}
            <div className="section-header" style={{ marginBottom: 14 }}>
                <span className="terminal-heading flex items-center gap-2">
                    <Globe size={15} color="var(--purple)" />
                    MACROECONOMICS & GLOBAL ECONOMY INTELLIGENCE
                </span>
                <span className="live-dot" />
                <span style={{ marginLeft: "auto", fontFamily: "var(--text-mono)", fontSize: "0.58rem", color: "var(--purple)", fontWeight: 700 }}>
                    REAL-TIME MACROECONOMIC METRICS
                </span>
            </div>

            {/* Top KPI Cards */}
            {summary && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10, marginBottom: 16 }}>
                    <div
                        style={{
                            background: "var(--bg-card)",
                            border: "1px solid var(--border-active)",
                            boxShadow: "0 0 12px rgba(0, 230, 118, 0.08)",
                            padding: "12px 14px",
                            borderRadius: 2,
                        }}
                    >
                        <div style={{ fontFamily: "var(--text-mono)", fontSize: "0.58rem", color: "var(--text-muted)", letterSpacing: "0.1em" }}>
                            INDIA REAL GDP GROWTH
                        </div>
                        <div style={{ fontFamily: "var(--text-mono)", fontSize: "1.5rem", fontWeight: 700, color: "var(--green)", marginTop: 4 }}>
                            +{summary.india_gdp_growth_pct}%
                        </div>
                        <div style={{ fontFamily: "var(--text-mono)", fontSize: "0.55rem", color: "var(--text-secondary)", marginTop: 2 }}>
                            FASTEST GROWING MAJOR ECONOMY
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
                            CPI CONSUMER INFLATION
                        </div>
                        <div style={{ fontFamily: "var(--text-mono)", fontSize: "1.5rem", fontWeight: 700, color: "var(--text-primary)", marginTop: 4 }}>
                            {summary.india_cpi_inflation_pct}%
                        </div>
                        <div style={{ fontFamily: "var(--text-mono)", fontSize: "0.55rem", color: "var(--green)", marginTop: 2 }}>
                            WITHIN RBI TARGET BAND (4% ± 2%)
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
                            RBI REPO INTEREST RATE
                        </div>
                        <div style={{ fontFamily: "var(--text-mono)", fontSize: "1.5rem", fontWeight: 700, color: "var(--purple)", marginTop: 4 }}>
                            {summary.india_rbi_repo_rate_pct}%
                        </div>
                        <div style={{ fontFamily: "var(--text-mono)", fontSize: "0.55rem", color: "var(--text-muted)", marginTop: 2 }}>
                            POLICY STANCE: NEUTRAL
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
                            FOREX RESERVES (RECORD)
                        </div>
                        <div style={{ fontFamily: "var(--text-mono)", fontSize: "1.5rem", fontWeight: 700, color: "var(--green)", marginTop: 4 }}>
                            ${summary.india_forex_reserves_bn} B
                        </div>
                        <div style={{ fontFamily: "var(--text-mono)", fontSize: "0.55rem", color: "var(--text-muted)", marginTop: 2 }}>
                            ALL-TIME HIGH COVER
                        </div>
                    </div>
                </div>
            )}

            {/* Global Economy Comparison Matrix Section */}
            <div style={{ marginBottom: 20 }}>
                <div className="section-header" style={{ marginBottom: 8, background: "var(--bg-panel)", padding: "6px 12px" }}>
                    <span className="terminal-heading flex items-center gap-2" style={{ fontSize: "0.72rem" }}>
                        <Globe size={13} color="var(--purple)" />
                        GLOBAL ECONOMY COMPARISON MATRIX (MAJOR ECONOMIES)
                    </span>
                    <span style={{ marginLeft: "auto", fontFamily: "var(--text-mono)", fontSize: "0.55rem", color: "var(--text-muted)" }}>
                        CLICK COLUMNS TO SORT
                    </span>
                </div>

                <div style={{ overflowX: "auto", background: "var(--bg-card)", border: "1px solid var(--border-subtle)" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--text-mono)", fontSize: "0.65rem" }}>
                        <thead>
                            <tr style={{ background: "var(--bg-panel)", color: "var(--text-muted)", textAlign: "left" }}>
                                <th style={{ padding: "8px 12px", borderBottom: "1px solid var(--border-subtle)" }}>COUNTRY</th>
                                <th
                                    onClick={() => setGlobalSortKey("gdp_growth_pct")}
                                    style={{ padding: "8px 12px", borderBottom: "1px solid var(--border-subtle)", cursor: "pointer", color: globalSortKey === "gdp_growth_pct" ? "var(--purple)" : "inherit" }}
                                >
                                    GDP GROWTH % ↕
                                </th>
                                <th
                                    onClick={() => setGlobalSortKey("cpi_inflation_pct")}
                                    style={{ padding: "8px 12px", borderBottom: "1px solid var(--border-subtle)", cursor: "pointer", color: globalSortKey === "cpi_inflation_pct" ? "var(--purple)" : "inherit" }}
                                >
                                    CPI INFLATION % ↕
                                </th>
                                <th
                                    onClick={() => setGlobalSortKey("interest_rate_pct")}
                                    style={{ padding: "8px 12px", borderBottom: "1px solid var(--border-subtle)", cursor: "pointer", color: globalSortKey === "interest_rate_pct" ? "var(--purple)" : "inherit" }}
                                >
                                    POLICY RATE % ↕
                                </th>
                                <th
                                    onClick={() => setGlobalSortKey("debt_to_gdp_pct")}
                                    style={{ padding: "8px 12px", borderBottom: "1px solid var(--border-subtle)", cursor: "pointer", color: globalSortKey === "debt_to_gdp_pct" ? "var(--purple)" : "inherit" }}
                                >
                                    DEBT TO GDP % ↕
                                </th>
                                <th
                                    onClick={() => setGlobalSortKey("unemployment_pct")}
                                    style={{ padding: "8px 12px", borderBottom: "1px solid var(--border-subtle)", cursor: "pointer", color: globalSortKey === "unemployment_pct" ? "var(--purple)" : "inherit" }}
                                >
                                    UNEMPLOYMENT % ↕
                                </th>
                                <th style={{ padding: "8px 12px", borderBottom: "1px solid var(--border-subtle)" }}>CENTRAL BANK</th>
                                <th style={{ padding: "8px 12px", borderBottom: "1px solid var(--border-subtle)" }}>MACRO OUTLOOK</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedGlobalData.map((item) => {
                                const isIndia = item.code === "IN";
                                return (
                                    <tr
                                        key={item.code}
                                        style={{
                                            borderBottom: "1px solid var(--border-subtle)",
                                            background: isIndia ? "rgba(124, 77, 255, 0.08)" : "transparent",
                                            color: "var(--text-primary)"
                                        }}
                                    >
                                        <td style={{ padding: "8px 12px", fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
                                            <span>{item.flag}</span>
                                            <span style={{ color: isIndia ? "var(--purple)" : "var(--text-primary)" }}>{item.country}</span>
                                        </td>
                                        <td style={{ padding: "8px 12px", color: item.gdp_growth_pct >= 4 ? "var(--green)" : item.gdp_growth_pct < 0 ? "var(--red)" : "var(--text-primary)", fontWeight: 700 }}>
                                            {item.gdp_growth_pct > 0 ? "+" : ""}{item.gdp_growth_pct}%
                                        </td>
                                        <td style={{ padding: "8px 12px", color: item.cpi_inflation_pct > 4 ? "var(--amber)" : "var(--text-primary)" }}>
                                            {item.cpi_inflation_pct}%
                                        </td>
                                        <td style={{ padding: "8px 12px", fontWeight: 600 }}>
                                            {item.interest_rate_pct}%
                                        </td>
                                        <td style={{ padding: "8px 12px", color: item.debt_to_gdp_pct > 100 ? "var(--red)" : "var(--text-secondary)" }}>
                                            {item.debt_to_gdp_pct}%
                                        </td>
                                        <td style={{ padding: "8px 12px" }}>
                                            {item.unemployment_pct}%
                                        </td>
                                        <td style={{ padding: "8px 12px", color: "var(--text-muted)" }}>
                                            {item.central_bank}
                                        </td>
                                        <td style={{ padding: "8px 12px", color: isIndia ? "var(--green)" : "var(--text-secondary)", fontWeight: 600 }}>
                                            {item.outlook}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Indian Economic Indicators Deep Dive */}
            <div>
                {/* Section Header & Tabs */}
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 10,
                        padding: "8px 12px",
                        background: "var(--bg-panel)",
                        border: "1px solid var(--border-subtle)",
                        marginBottom: 14,
                    }}
                >
                    <span className="terminal-heading flex items-center gap-2" style={{ fontSize: "0.72rem" }}>
                        <BarChart3 size={13} color="var(--purple)" />
                        INDIA MACROECONOMIC DEEP DIVE
                    </span>

                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                        {[
                            { id: "all", label: "ALL METRICS" },
                            { id: "gdp", label: "GDP & OUTPUT" },
                            { id: "inflation", label: "INFLATION & PRICES" },
                            { id: "monetary", label: "MONETARY & RATES" },
                            { id: "fiscal", label: "FISCAL & DEBT" },
                            { id: "labor", label: "LABOR & HOUSING" },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                style={{
                                    fontFamily: "var(--text-mono)",
                                    fontSize: "0.58rem",
                                    fontWeight: 700,
                                    padding: "4px 8px",
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
                </div>

                {/* Metric Cards Grid */}
                {indiaData && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 12 }}>
                        {Object.entries({
                            gdp: indiaData.gdp_and_output,
                            inflation: indiaData.inflation_and_prices,
                            monetary: indiaData.monetary_and_rates,
                            fiscal: indiaData.fiscal_and_debt,
                            labor: indiaData.labor_and_housing,
                        })
                            .filter(([cat]) => activeTab === "all" || activeTab === cat)
                            .flatMap(([, items]) => items)
                            .map((m) => {
                                const positiveTrend = m.trend === "up" && m.id !== "ind-cpi-inflation";
                                return (
                                    <div
                                        key={m.id}
                                        style={{
                                            background: "var(--bg-card)",
                                            border: "1px solid var(--border-subtle)",
                                            padding: 14,
                                            borderRadius: 2,
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "space-between",
                                            gap: 10,
                                        }}
                                    >
                                        <div>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                                                <span style={{ fontFamily: "var(--text-mono)", fontSize: "0.75rem", fontWeight: 700, color: "var(--text-primary)" }}>
                                                    {m.metric}
                                                </span>
                                                <span
                                                    style={{
                                                        fontFamily: "var(--text-mono)",
                                                        fontSize: "0.5rem",
                                                        fontWeight: 700,
                                                        padding: "2px 5px",
                                                        background: "var(--bg-panel)",
                                                        color: "var(--purple)",
                                                        border: "1px solid var(--border-subtle)",
                                                    }}
                                                >
                                                    {m.frequency}
                                                </span>
                                            </div>

                                            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 8 }}>
                                                <span style={{ fontFamily: "var(--text-mono)", fontSize: "1.4rem", fontWeight: 700, color: "var(--text-primary)" }}>
                                                    {m.value} <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{m.unit}</span>
                                                </span>

                                                <span
                                                    style={{
                                                        fontFamily: "var(--text-mono)",
                                                        fontSize: "0.6rem",
                                                        fontWeight: 700,
                                                        color: positiveTrend ? "var(--green)" : "var(--amber)",
                                                        display: "flex",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    {m.change > 0 ? "+" : ""}{m.change} prev ({m.previous})
                                                </span>
                                            </div>

                                            <p style={{ fontFamily: "var(--text-mono)", fontSize: "0.6rem", color: "var(--text-muted)", marginTop: 6, lineHeight: 1.35 }}>
                                                {m.description}
                                            </p>
                                        </div>

                                        <div
                                            style={{
                                                borderTop: "1px solid var(--border-subtle)",
                                                paddingTop: 8,
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                fontFamily: "var(--text-mono)",
                                                fontSize: "0.55rem",
                                                color: "var(--text-muted)",
                                            }}
                                        >
                                            <span style={{ color: "var(--purple)", fontWeight: 700 }}>STATUS: {m.status.toUpperCase()}</span>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                )}
            </div>
        </div>
    );
}
