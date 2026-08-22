"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getPortfolioHoldings } from "@/lib/api";
import type { Holding } from "@/lib/types";
import { DataUnavailable } from "@/components/DataUnavailable";

export function HoldingsTable() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPortfolioHoldings()
      .then((d) => setHoldings(d.holdings || []))
      .catch(() => setHoldings([]))
      .finally(() => setLoading(false));
  }, []);

  const fmt = (v: number | null | undefined, dec = 2) =>
    (v ?? 0).toLocaleString("en-IN", { minimumFractionDigits: dec, maximumFractionDigits: dec });
  const fmtCr = (v: number | null | undefined) => {
    const val = v ?? 0;
    return Math.abs(val) >= 1e5 ? `₹${(val / 1e5).toFixed(2)}L` : `₹${fmt(val, 0)}`;
  };

  return (
    <div style={{ background: "var(--bg-panel)" }}>
      <div className="section-header">
        <span className="terminal-heading">HOLDINGS</span>
        <span style={{ marginLeft: "auto", fontFamily: "var(--text-mono)", fontSize: "0.6rem", color: "var(--text-muted)" }}>
          {holdings.length} POSITIONS
        </span>
      </div>
      {loading ? (
        <div style={{ padding: 12 }}>
          {Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton" style={{ height: 32, marginBottom: 2 }} />)}
        </div>
      ) : holdings.length === 0 ? (
        <DataUnavailable message="NO HOLDINGS — CONNECT KITE OR CHECK DEMO DATA" />
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table className="terminal-table">
            <thead>
              <tr>
                <th>SYMBOL</th>
                <th>QTY</th>
                <th>AVG PRICE</th>
                <th>CURRENT</th>
                <th>INVESTED</th>
                <th>VALUE</th>
                <th>DAY P&L</th>
                <th>OVERALL P&L</th>
                <th>P&L %</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((h) => {
                const invested = h.avg_price * h.quantity;
                const value    = h.current_price * h.quantity;
                const pnl      = value - invested;
                const pnlPct   = invested > 0 ? (pnl / invested * 100) : 0;
                const pnlColor = pnl >= 0 ? "var(--green)" : "var(--red)";
                const dayColor = (h.day_pnl ?? 0) >= 0 ? "var(--green)" : "var(--red)";
                return (
                  <tr key={h.symbol}>
                    <td>
                      <Link href={`/stock/${h.symbol}`} style={{ color: "var(--blue)", textDecoration: "none", fontWeight: 600 }}>
                        {h.symbol}
                      </Link>
                    </td>
                    <td className="value-mono">{h.quantity}</td>
                    <td className="value-mono">{fmt(h.avg_price)}</td>
                    <td className="value-mono">{fmt(h.current_price)}</td>
                    <td className="value-mono" style={{ color: "var(--text-secondary)" }}>{fmtCr(invested)}</td>
                    <td className="value-mono">{fmtCr(value)}</td>
                    <td className="value-mono" style={{ color: dayColor }}>
                      {(h.day_pnl ?? 0) >= 0 ? "+" : ""}{fmtCr(h.day_pnl ?? 0)}
                    </td>
                    <td className="value-mono" style={{ color: pnlColor }}>
                      {pnl >= 0 ? "+" : ""}{fmtCr(pnl)}
                    </td>
                    <td className="value-mono" style={{ color: pnlColor }}>
                      {pnlPct >= 0 ? "+" : ""}{pnlPct.toFixed(1)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
