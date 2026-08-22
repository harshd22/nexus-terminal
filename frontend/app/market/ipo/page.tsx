"use client";

import React, { useState, useEffect } from "react";
import {
    TrendingUp,
    Search,
    ExternalLink,
    Calendar,
    Award,
    FileText,
    ChevronRight,
    X
} from "lucide-react";

interface IPOItem {
    id: string;
    company_name: string;
    symbol: string;
    category: "Mainboard" | "SME";
    status: "active" | "upcoming" | "listed";
    price_band: string;
    issue_price: number;
    lot_size: number;
    min_investment: number;
    issue_size_cr: number;
    fresh_issue_cr: number;
    ofs_cr: number;
    gmp: {
        gmp_amount: number;
        estimated_listing_price: number;
        estimated_gain_percent: number;
        last_updated: string;
        trend: "up" | "down" | "flat";
    };
    subscription: {
        qib: number;
        nii: number;
        retail: number;
        total: number;
    };
    dates: {
        open_date: string;
        close_date: string;
        allotment_date: string;
        refund_date: string;
        demat_credit_date: string;
        listing_date: string;
    };
    registrar: {
        name: string;
        website: string;
        allotment_url: string;
        phone: string;
        email: string;
    };
    drhp_url: string;
    description: string;
    financials: Array<{
        year: string;
        revenue_cr: number;
        pat_cr: number;
        net_worth_cr: number;
    }>;
}

export default function IPOTrackerPage() {
    const [ipos, setIpos] = useState<IPOItem[]>([]);
    const [summary, setSummary] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"all" | "active" | "upcoming" | "listed" | "sme">("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedIpo, setSelectedIpo] = useState<IPOItem | null>(null);

    useEffect(() => {
        fetchIPOData();
    }, []);

    const fetchIPOData = async () => {
        setLoading(true);
        try {
            const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
            const [resData, resSummary] = await Promise.all([
                fetch(`${apiBase}/api/ipo`),
                fetch(`${apiBase}/api/ipo/summary`)
            ]);

            if (resData.ok) {
                const data = await resData.json();
                setIpos(data);
            }
            if (resSummary.ok) {
                const sum = await resSummary.json();
                setSummary(sum);
            }
        } catch (err) {
            console.error("Failed to fetch IPO data:", err);
        } finally {
            setLoading(false);
        }
    };

    const filteredIpos = ipos.filter((ipo) => {
        if (activeTab === "active" && ipo.status !== "active") return false;
        if (activeTab === "upcoming" && ipo.status !== "upcoming") return false;
        if (activeTab === "listed" && ipo.status !== "listed") return false;
        if (activeTab === "sme" && ipo.category !== "SME") return false;

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            return (
                ipo.company_name.toLowerCase().includes(q) ||
                ipo.symbol.toLowerCase().includes(q) ||
                ipo.registrar.name.toLowerCase().includes(q)
            );
        }

        return true;
    });

    return (
        <div style={{ padding: 16, background: "var(--bg-base)", minHeight: "100%" }}>
            {/* Top Section Header */}
            <div className="section-header" style={{ marginBottom: 12 }}>
                <span className="terminal-heading flex items-center gap-2">
                    <Award size={14} color="var(--purple)" />
                    IPO INTELLIGENCE CENTER — MAINBOARD & SME TRACKER
                </span>
                <span className="live-dot" />
                <span style={{ marginLeft: "auto", fontFamily: "var(--text-mono)", fontSize: "0.58rem", color: "var(--purple)", fontWeight: 700 }}>
                    GMP & REGISTRAR STREAM
                </span>
            </div>

            {/* KPI Cards */}
            {summary && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10, marginBottom: 16 }}>
                    <div
                        style={{
                            background: "var(--bg-card)",
                            border: "1px solid var(--border-subtle)",
                            padding: "12px 14px",
                            borderRadius: 2,
                        }}
                    >
                        <div style={{ fontFamily: "var(--text-mono)", fontSize: "0.58rem", color: "var(--text-muted)", letterSpacing: "0.1em" }}>
                            ACTIVE BIDDING IPOS
                        </div>
                        <div style={{ fontFamily: "var(--text-mono)", fontSize: "1.5rem", fontWeight: 700, color: "var(--green)", marginTop: 4 }}>
                            {summary.active_count}
                        </div>
                        <div style={{ fontFamily: "var(--text-mono)", fontSize: "0.55rem", color: "var(--text-muted)", marginTop: 2 }}>
                            OPEN FOR BIDDING NOW
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
                            HIGHEST GMP GAIN
                        </div>
                        <div style={{ fontFamily: "var(--text-mono)", fontSize: "1.5rem", fontWeight: 700, color: "var(--green)", marginTop: 4 }}>
                            +{summary.top_gmp_ipo?.gmp_gain_percent}%
                        </div>
                        <div style={{ fontFamily: "var(--text-mono)", fontSize: "0.55rem", color: "var(--text-secondary)", marginTop: 2 }} className="truncate">
                            {summary.top_gmp_ipo?.name}
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
                            MOST SUBSCRIBED
                        </div>
                        <div style={{ fontFamily: "var(--text-mono)", fontSize: "1.5rem", fontWeight: 700, color: "var(--purple)", marginTop: 4 }}>
                            {summary.top_subscribed_ipo?.total_subscription}x
                        </div>
                        <div style={{ fontFamily: "var(--text-mono)", fontSize: "0.55rem", color: "var(--text-secondary)", marginTop: 2 }} className="truncate">
                            {summary.top_subscribed_ipo?.name}
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
                            TOTAL ISSUE CAPITAL
                        </div>
                        <div style={{ fontFamily: "var(--text-mono)", fontSize: "1.5rem", fontWeight: 700, color: "var(--text-primary)", marginTop: 4 }}>
                            ₹{summary.total_capital_raised_cr?.toLocaleString()} Cr
                        </div>
                        <div style={{ fontFamily: "var(--text-mono)", fontSize: "0.55rem", color: "var(--text-muted)", marginTop: 2 }}>
                            MAINBOARD & SME ISSUES
                        </div>
                    </div>
                </div>
            )}

            {/* Tabs & Search Header */}
            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 12,
                    padding: "8px 12px",
                    background: "var(--bg-panel)",
                    border: "1px solid var(--border-subtle)",
                    marginBottom: 16,
                }}
            >
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {[
                        { id: "all", label: "ALL ISSUES" },
                        { id: "active", label: "ACTIVE BIDDING", count: summary?.active_count },
                        { id: "upcoming", label: "UPCOMING", count: summary?.upcoming_count },
                        { id: "listed", label: "RECENTLY LISTED" },
                        { id: "sme", label: "SME BOARD" },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            style={{
                                fontFamily: "var(--text-mono)",
                                fontSize: "0.62rem",
                                fontWeight: 700,
                                letterSpacing: "0.08em",
                                padding: "5px 10px",
                                borderRadius: 1,
                                border: activeTab === tab.id ? "1px solid var(--purple)" : "1px solid var(--border-subtle)",
                                background: activeTab === tab.id ? "rgba(124, 77, 255, 0.15)" : "var(--bg-card)",
                                color: activeTab === tab.id ? "var(--purple)" : "var(--text-secondary)",
                                cursor: "pointer",
                            }}
                        >
                            {tab.label} {tab.count !== undefined ? `(${tab.count})` : ""}
                        </button>
                    ))}
                </div>

                <div style={{ position: "relative", minWidth: 220 }}>
                    <Search size={12} color="var(--text-muted)" style={{ position: "absolute", left: 10, top: 8 }} />
                    <input
                        type="text"
                        placeholder="SEARCH IPO, REGISTRAR..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: "100%",
                            background: "var(--bg-base)",
                            border: "1px solid var(--border-subtle)",
                            padding: "4px 8px 4px 28px",
                            fontFamily: "var(--text-mono)",
                            fontSize: "0.62rem",
                            color: "var(--text-primary)",
                            outline: "none",
                        }}
                    />
                </div>
            </div>

            {/* Main IPO Cards List */}
            {loading ? (
                <div style={{ padding: 40, textAlign: "center", fontFamily: "var(--text-mono)", fontSize: "0.7rem", color: "var(--text-muted)" }}>
                    LOADING IPO DATA...
                </div>
            ) : filteredIpos.length === 0 ? (
                <div style={{ padding: 40, textAlign: "center", fontFamily: "var(--text-mono)", fontSize: "0.7rem", color: "var(--text-muted)", background: "var(--bg-card)", border: "1px solid var(--border-subtle)" }}>
                    NO IPOS FOUND MATCHING SELECTED FILTER
                </div>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 12 }}>
                    {filteredIpos.map((ipo) => {
                        const positiveGmp = ipo.gmp.estimated_gain_percent >= 0;
                        return (
                            <div
                                key={ipo.id}
                                style={{
                                    background: "var(--bg-card)",
                                    border: "1px solid var(--border-subtle)",
                                    padding: 14,
                                    borderRadius: 2,
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    gap: 12,
                                }}
                            >
                                {/* Header info */}
                                <div>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                                        <div>
                                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                                <span style={{ fontFamily: "var(--text-mono)", fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)" }}>
                                                    {ipo.company_name}
                                                </span>
                                                <span
                                                    style={{
                                                        fontFamily: "var(--text-mono)",
                                                        fontSize: "0.52rem",
                                                        fontWeight: 700,
                                                        padding: "1px 4px",
                                                        background: ipo.category === "SME" ? "rgba(156,39,176,0.15)" : "rgba(33,150,243,0.15)",
                                                        color: ipo.category === "SME" ? "var(--purple)" : "var(--blue, #2196f3)",
                                                        border: `1px solid ${ipo.category === "SME" ? "var(--border-glow)" : "rgba(33,150,243,0.3)"}`,
                                                    }}
                                                >
                                                    {ipo.category}
                                                </span>
                                            </div>
                                            <div style={{ fontFamily: "var(--text-mono)", fontSize: "0.6rem", color: "var(--text-muted)", marginTop: 2 }}>
                                                SYMBOL: <span style={{ color: "var(--text-secondary)" }}>{ipo.symbol}</span> | ISSUE: ₹{ipo.issue_size_cr} Cr
                                            </div>
                                        </div>

                                        <span
                                            style={{
                                                fontFamily: "var(--text-mono)",
                                                fontSize: "0.55rem",
                                                fontWeight: 700,
                                                padding: "2px 6px",
                                                background: ipo.status === "active" ? "rgba(0, 230, 118, 0.15)" : ipo.status === "upcoming" ? "rgba(255, 179, 0, 0.15)" : "var(--bg-panel)",
                                                color: ipo.status === "active" ? "var(--green)" : ipo.status === "upcoming" ? "var(--amber)" : "var(--text-muted)",
                                                border: `1px solid ${ipo.status === "active" ? "rgba(0, 230, 118, 0.3)" : ipo.status === "upcoming" ? "rgba(255, 179, 0, 0.3)" : "var(--border-subtle)"}`,
                                            }}
                                        >
                                            {ipo.status.toUpperCase()}
                                        </span>
                                    </div>

                                    <p style={{ fontFamily: "var(--text-mono)", fontSize: "0.62rem", color: "var(--text-muted)", marginTop: 6, lineHeight: 1.3 }}>
                                        {ipo.description}
                                    </p>
                                </div>

                                {/* GMP Details Box */}
                                <div
                                    style={{
                                        background: "var(--bg-panel)",
                                        border: "1px solid var(--border-subtle)",
                                        padding: 10,
                                        display: "grid",
                                        gridTemplateColumns: "1fr 1fr",
                                        gap: 8,
                                    }}
                                >
                                    <div>
                                        <div style={{ fontFamily: "var(--text-mono)", fontSize: "0.55rem", color: "var(--text-muted)" }}>
                                            GREY MARKET PREMIUM (GMP)
                                        </div>
                                        <div style={{ fontFamily: "var(--text-mono)", fontSize: "0.9rem", fontWeight: 700, color: positiveGmp ? "var(--green)" : "var(--red)", marginTop: 2 }}>
                                            ₹{ipo.gmp.gmp_amount} ({positiveGmp ? "+" : ""}{ipo.gmp.estimated_gain_percent}%)
                                        </div>
                                        <div style={{ fontFamily: "var(--text-mono)", fontSize: "0.55rem", color: "var(--text-secondary)", marginTop: 2 }}>
                                            EST LISTING: ₹{ipo.gmp.estimated_listing_price}
                                        </div>
                                    </div>

                                    <div>
                                        <div style={{ fontFamily: "var(--text-mono)", fontSize: "0.55rem", color: "var(--text-muted)" }}>
                                            PRICE BAND & LOT
                                        </div>
                                        <div style={{ fontFamily: "var(--text-mono)", fontSize: "0.75rem", fontWeight: 700, color: "var(--text-primary)", marginTop: 2 }}>
                                            {ipo.price_band}
                                        </div>
                                        <div style={{ fontFamily: "var(--text-mono)", fontSize: "0.55rem", color: "var(--text-secondary)", marginTop: 2 }}>
                                            LOT: {ipo.lot_size} SHARES (MIN ₹{ipo.min_investment.toLocaleString()})
                                        </div>
                                    </div>
                                </div>

                                {/* Subscription breakdown */}
                                <div>
                                    <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--text-mono)", fontSize: "0.6rem", color: "var(--text-muted)" }}>
                                        <span>TOTAL SUBSCRIPTION</span>
                                        <span style={{ color: "var(--purple)", fontWeight: 700 }}>{ipo.subscription.total}x</span>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--text-mono)", fontSize: "0.55rem", color: "var(--text-secondary)", marginTop: 4 }}>
                                        <span>QIB: {ipo.subscription.qib}x</span>
                                        <span>NII: {ipo.subscription.nii}x</span>
                                        <span>RETAIL: {ipo.subscription.retail}x</span>
                                    </div>
                                </div>

                                {/* Footer Buttons & Registrar */}
                                <div
                                    style={{
                                        borderTop: "1px solid var(--border-subtle)",
                                        paddingTop: 8,
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        gap: 8,
                                    }}
                                >
                                    <div style={{ fontFamily: "var(--text-mono)", fontSize: "0.55rem", color: "var(--text-muted)" }}>
                                        REGISTRAR: <span style={{ color: "var(--purple)" }}>{ipo.registrar.name}</span>
                                    </div>

                                    <div style={{ display: "flex", gap: 6 }}>
                                        <a
                                            href={ipo.registrar.allotment_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            style={{
                                                fontFamily: "var(--text-mono)",
                                                fontSize: "0.58rem",
                                                fontWeight: 700,
                                                padding: "3px 8px",
                                                background: "rgba(124, 77, 255, 0.12)",
                                                color: "var(--purple)",
                                                border: "1px solid var(--purple)",
                                                textDecoration: "none",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 4,
                                            }}
                                        >
                                            ALLOTMENT <ExternalLink size={10} />
                                        </a>

                                        <button
                                            onClick={() => setSelectedIpo(ipo)}
                                            style={{
                                                fontFamily: "var(--text-mono)",
                                                fontSize: "0.58rem",
                                                fontWeight: 700,
                                                padding: "3px 8px",
                                                background: "var(--bg-panel)",
                                                color: "var(--text-primary)",
                                                border: "1px solid var(--border-subtle)",
                                                cursor: "pointer",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 2,
                                            }}
                                        >
                                            DETAILS <ChevronRight size={10} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Detail Modal */}
            {selectedIpo && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0, 0, 0, 0.8)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 16,
                        zIndex: 99,
                    }}
                >
                    <div
                        style={{
                            background: "var(--bg-surface)",
                            border: "1px solid var(--border-glow)",
                            maxWidth: 680,
                            width: "100%",
                            maxHeight: "90vh",
                            overflowY: "auto",
                            padding: 20,
                            display: "flex",
                            flexDirection: "column",
                            gap: 16,
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid var(--border-subtle)", paddingBottom: 10 }}>
                            <div>
                                <div style={{ fontFamily: "var(--text-mono)", fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)" }}>
                                    {selectedIpo.company_name} ({selectedIpo.symbol})
                                </div>
                                <div style={{ fontFamily: "var(--text-mono)", fontSize: "0.6rem", color: "var(--text-muted)", marginTop: 2 }}>
                                    CATEGORY: {selectedIpo.category} | TOTAL ISSUE: ₹{selectedIpo.issue_size_cr} Cr
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedIpo(null)}
                                style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Timetable Grid */}
                        <div>
                            <div style={{ fontFamily: "var(--text-mono)", fontSize: "0.65rem", fontWeight: 700, color: "var(--purple)", marginBottom: 8 }}>
                                KEY TIMETABLE DATES
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 6 }}>
                                {[
                                    { label: "OPEN DATE", val: selectedIpo.dates.open_date },
                                    { label: "CLOSE DATE", val: selectedIpo.dates.close_date },
                                    { label: "ALLOTMENT", val: selectedIpo.dates.allotment_date },
                                    { label: "REFUND", val: selectedIpo.dates.refund_date },
                                    { label: "DEMAT CREDIT", val: selectedIpo.dates.demat_credit_date },
                                    { label: "LISTING DATE", val: selectedIpo.dates.listing_date },
                                ].map((d) => (
                                    <div key={d.label} style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", padding: 6 }}>
                                        <div style={{ fontFamily: "var(--text-mono)", fontSize: "0.52rem", color: "var(--text-muted)" }}>{d.label}</div>
                                        <div style={{ fontFamily: "var(--text-mono)", fontSize: "0.65rem", fontWeight: 700, color: "var(--text-primary)", marginTop: 2 }}>{d.val}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Financial Highlights */}
                        {selectedIpo.financials && selectedIpo.financials.length > 0 && (
                            <div>
                                <div style={{ fontFamily: "var(--text-mono)", fontSize: "0.65rem", fontWeight: 700, color: "var(--purple)", marginBottom: 8 }}>
                                    FINANCIAL PERFORMANCE (₹ CR)
                                </div>
                                <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--text-mono)", fontSize: "0.62rem" }}>
                                    <thead>
                                        <tr style={{ background: "var(--bg-panel)", color: "var(--text-muted)", textAlign: "left" }}>
                                            <th style={{ padding: 6, border: "1px solid var(--border-subtle)" }}>PERIOD</th>
                                            <th style={{ padding: 6, border: "1px solid var(--border-subtle)" }}>REVENUE</th>
                                            <th style={{ padding: 6, border: "1px solid var(--border-subtle)" }}>PAT (PROFIT)</th>
                                            <th style={{ padding: 6, border: "1px solid var(--border-subtle)" }}>NET WORTH</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedIpo.financials.map((f, i) => (
                                            <tr key={i} style={{ borderBottom: "1px solid var(--border-subtle)", color: "var(--text-primary)" }}>
                                                <td style={{ padding: 6, border: "1px solid var(--border-subtle)", fontWeight: 700 }}>{f.year}</td>
                                                <td style={{ padding: 6, border: "1px solid var(--border-subtle)" }}>₹{f.revenue_cr.toLocaleString()}</td>
                                                <td style={{ padding: 6, border: "1px solid var(--border-subtle)", color: f.pat_cr >= 0 ? "var(--green)" : "var(--red)" }}>
                                                    ₹{f.pat_cr.toLocaleString()}
                                                </td>
                                                <td style={{ padding: 6, border: "1px solid var(--border-subtle)" }}>₹{f.net_worth_cr.toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Registrar Info & DRHP link */}
                        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", padding: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                                <div style={{ fontFamily: "var(--text-mono)", fontSize: "0.6rem", fontWeight: 700, color: "var(--text-primary)" }}>
                                    REGISTRAR: {selectedIpo.registrar.name}
                                </div>
                                <div style={{ fontFamily: "var(--text-mono)", fontSize: "0.55rem", color: "var(--text-muted)", marginTop: 2 }}>
                                    EMAIL: {selectedIpo.registrar.email}
                                </div>
                            </div>

                            <div style={{ display: "flex", gap: 8 }}>
                                <a
                                    href={selectedIpo.drhp_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{
                                        fontFamily: "var(--text-mono)",
                                        fontSize: "0.6rem",
                                        fontWeight: 700,
                                        padding: "6px 12px",
                                        background: "var(--bg-panel)",
                                        color: "var(--text-primary)",
                                        border: "1px solid var(--border-subtle)",
                                        textDecoration: "none",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 4,
                                    }}
                                >
                                    DRHP <FileText size={12} />
                                </a>

                                <a
                                    href={selectedIpo.registrar.allotment_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{
                                        fontFamily: "var(--text-mono)",
                                        fontSize: "0.6rem",
                                        fontWeight: 700,
                                        padding: "6px 12px",
                                        background: "var(--purple)",
                                        color: "#fff",
                                        border: "none",
                                        textDecoration: "none",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 4,
                                    }}
                                >
                                    CHECK ALLOTMENT <ExternalLink size={12} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
