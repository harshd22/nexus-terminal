"use client";
import { useEffect, useState } from "react";
import { getPortfolio } from "@/lib/api";
import { PortfolioHeader } from "../PortfolioHeader";

export default function PortfolioPnLPage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    getPortfolio().then(setStats).catch(() => {});
  }, []);

  const fmtCr = (v: number) => `₹${(v / 1e5).toFixed(2)}L`;

  return (
    <div>
      <div style={{
        padding: "12px 20px",
        background: "var(--section-grad)",
        borderBottom: "1px solid var(--border-glow)",
      }}>
        <h1 style={{
          fontFamily: "var(--text-mono)", fontSize: "0.65rem",
          letterSpacing: "0.2em", color: "var(--purple)", margin: 0,
        }}>
          NEXUS TERMINAL // PROFIT & LOSS BREAKDOWN
        </h1>
      </div>
      <PortfolioHeader />
      <div style={{ padding: 16 }}>
        <div className="section-header"><span className="terminal-heading">P&L SUMMARY STATEMENT</span></div>
        <div style={{ background: "var(--bg-panel)", padding: 16, border: "1px solid var(--border-subtle)", fontFamily: "var(--text-mono)", fontSize: "0.75rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border-subtle)" }}>
            <span>Total Invested Capital:</span>
            <span className="value-mono">{fmtCr(stats?.total_invested ?? 131150)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border-subtle)" }}>
            <span>Current Portfolio Value:</span>
            <span className="value-mono" style={{ color: "var(--blue)" }}>{fmtCr(stats?.current_value ?? 135850)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border-subtle)" }}>
            <span>Unrealized Gain / Loss:</span>
            <span className="value-mono" style={{ color: "var(--green)" }}>+₹4,700 (+3.58%)</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0" }}>
            <span>Day P&L:</span>
            <span className="value-mono" style={{ color: "var(--green)" }}>₹0.00</span>
          </div>
        </div>
      </div>
    </div>
  );
}
