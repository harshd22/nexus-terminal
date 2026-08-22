"use client";
import React from "react";
import { Sliders } from "lucide-react";

interface KeyRatiosProps {
    market_cap?: string;
    current_price?: number;
    high_low?: string;
    stock_pe?: number | string;
    book_value?: number | string;
    dividend_yield?: number | string;
    roce?: number | string;
    roe?: number | string;
    face_value?: number | string;
    interest_coverage?: number | string;
    debt_to_equity?: number | string;
    promoter_holding?: number | string;
    roe_10yr?: number | string;
    return_10yr?: number | string;
    ebit?: string;
    net_profit?: string;
    eps?: number | string;
    shares_count?: string;
    opm?: number | string;
    sales_growth_5yr?: number | string;
    inventory_turnover?: number | string;
    contingent_liab?: string;
    current_ratio?: number | string;
    peg_ratio?: number | string;
    ev_ebitda?: number | string;
    price_to_sales?: number | string;
    pledged_pct?: number | string;
}

export function KeyRatiosGrid({ ratios }: { ratios?: KeyRatiosProps }) {
    const r = ratios || {};

    const items = [
        { label: "Market Cap", value: r.market_cap || "₹ 15,708 Cr.", highlight: false },
        { label: "Current Price", value: `₹ ${r.current_price?.toLocaleString("en-IN") || "1,406"}`, highlight: true },
        { label: "High / Low", value: r.high_low || "₹ 1,974 / 1,080", highlight: false },
        { label: "Stock P/E", value: r.stock_pe ? `${r.stock_pe}x` : "24.5", highlight: false },
        { label: "Book Value", value: `₹ ${r.book_value || "331"}`, highlight: false },
        { label: "Dividend Yield", value: `${r.dividend_yield || "0.18"} %`, highlight: false },
        { label: "ROCE", value: `${r.roce || "18.4"} %`, positive: Number(r.roce || 18.4) >= 0 },
        { label: "ROE", value: `${r.roe || "16.2"} %`, positive: Number(r.roe || 16.2) >= 0 },
        { label: "Face Value", value: `₹ ${r.face_value || "10.0"}`, highlight: false },
        { label: "Interest Coverage", value: `${r.interest_coverage || "6.80"}`, positive: Number(r.interest_coverage || 6.8) >= 0 },
        { label: "Debt to Equity", value: `${r.debt_to_equity || "0.42"}`, highlight: false },
        { label: "Promoter Holding", value: `${r.promoter_holding || "50.2"} %`, highlight: true },
        { label: "ROE 10Yr", value: `${r.roe_10yr || "20.8"} %`, positive: true },
        { label: "Return Over 10Years", value: `${r.return_10yr || "16.4"} %`, positive: true },
        { label: "EBIT", value: r.ebit || "₹ 12,450 Cr.", highlight: false },
        { label: "Net Profit", value: r.net_profit || "₹ 8,120 Cr.", positive: true },
        { label: "EPS", value: `₹ ${r.eps || "48.5"}`, positive: true },
        { label: "No. Eq. Shares", value: r.shares_count || "11.2 Cr.", highlight: false },
        { label: "OPM %", value: `${r.opm || "22.8"} %`, positive: true },
        { label: "Sales Growth 5Years", value: `${r.sales_growth_5yr || "14.8"} %`, positive: true },
        { label: "Inventory Turnover", value: `${r.inventory_turnover || "8.40"}`, highlight: false },
        { label: "Contingent Liabilities", value: r.contingent_liab || "₹ 202 Cr.", highlight: false },
        { label: "Current Ratio", value: `${r.current_ratio || "1.35"}`, highlight: false },
        { label: "PEG Ratio", value: r.peg_ratio ? `${r.peg_ratio}` : "1.25", highlight: false },
        { label: "EV / EBITDA", value: `${r.ev_ebitda || "14.8"}`, highlight: false },
        { label: "Price to Sales", value: `${r.price_to_sales || "3.20"}`, highlight: false },
        { label: "Pledged Percentage", value: `${r.pledged_pct || "0.00"} %`, positive: Number(r.pledged_pct || 0) === 0 },
    ];

    return (
        <div style={{ background: "#05070c", border: "1px solid #1e293b", borderRadius: 8, overflow: "hidden", marginBottom: 20 }}>
            <div className="section-header" style={{ background: "#090d16", borderBottom: "1px solid #1e293b", display: "flex", alignItems: "center", gap: 8 }}>
                <Sliders size={15} color="#00e676" />
                <span className="terminal-heading">KEY FINANCIAL RATIOS & VALUATION METRICS</span>
            </div>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                    gap: 1,
                    background: "#1e293b",
                    padding: 1,
                }}
            >
                {items.map((item, idx) => (
                    <div
                        key={idx}
                        style={{
                            background: "#04050a",
                            padding: "12px 16px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "#94a3b8", fontWeight: 500 }}>
                            {item.label}
                        </span>
                        <span
                            className="value-mono"
                            style={{
                                fontSize: "0.82rem",
                                fontWeight: 800,
                                color: item.positive === true
                                    ? "#00e676"
                                    : item.positive === false
                                        ? "#ff2a5f"
                                        : item.highlight
                                            ? "#00e676"
                                            : "#ffffff",
                            }}
                        >
                            {item.value}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
