"use client";
import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { getStockFundamentals } from "@/lib/api";
import type { Fundamental } from "@/lib/types";
import { DataUnavailable } from "./DataUnavailable";

interface Props { symbol: string; }

function MetricRow({ label, value, unit = "", color = "var(--text-primary)" }: {
  label: string; value: string | null; unit?: string; color?: string;
}) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "8px 0", borderBottom: "1px solid var(--border-subtle)",
    }}>
      <span className="terminal-label">{label}</span>
      <div>
        {value == null ? (
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--text-muted)" }}>—</span>
        ) : (
          <span className="value-mono" style={{ fontSize: "0.85rem", color, fontWeight: 700 }}>
            {value}{unit}
          </span>
        )}
      </div>
    </div>
  );
}

export function ThreeFStructure({ symbol }: Props) {
  const [fundamentals, setFundamentals] = useState<Fundamental[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStockFundamentals(symbol)
      .then((d) => setFundamentals(d.data || []))
      .catch(() => setFundamentals([]))
      .finally(() => setLoading(false));
  }, [symbol]);

  const latest = fundamentals[0];

  const revData = [...fundamentals].reverse().map((f) => ({
    period: f.period ?? "",
    Revenue: f.revenue,
    Profit:  f.net_profit,
  }));

  const fmt = (v: number | null, dec = 1) =>
    v == null ? null : v.toLocaleString("en-IN", { minimumFractionDigits: dec, maximumFractionDigits: dec });
  const fmtPct = (v: number | null) => v == null ? null : `${(v * 100).toFixed(1)}`;

  const PANEL_STYLE = {
    flex: 1, borderRight: "1px solid var(--border-subtle)",
    padding: "16px",
  };

  return (
    <div style={{ background: "var(--bg-panel)", border: "1px solid var(--border-glow)" }}>
      <div className="section-header">
        <span className="terminal-heading">3F STRUCTURE — FRANCHISE · FINANCIALS · FORECAST</span>
      </div>

      {loading ? (
        <div style={{ padding: 16 }}>
          <div className="skeleton" style={{ height: 220 }} />
        </div>
      ) : (
        <div style={{ display: "flex", gap: 0 }}>

          {/* ── PANEL 1: FRANCHISE ───────────────────────────────── */}
          <div style={{ ...PANEL_STYLE }}>
            <div className="terminal-label" style={{ marginBottom: 8, color: "var(--purple)", fontWeight: 700 }}>
              F1 · FRANCHISE
            </div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.72rem", color: "var(--text-muted)", marginBottom: 14, lineHeight: 1.6 }}>
              Business moat, competitive positioning, and capital efficiency
            </div>
            <MetricRow label="ROE" value={fmt(latest?.roe)} unit="%" color={(latest?.roe ?? 0) >= 15 ? "var(--green)" : "var(--yellow)"} />
            <MetricRow label="ROCE" value={fmt(latest?.roce)} unit="%" color={(latest?.roce ?? 0) >= 15 ? "var(--green)" : "var(--yellow)"} />
            <MetricRow label="EBITDA MARGIN" value={fmtPct(latest?.ebitda_margin)} unit="%" />
            <MetricRow label="REVENUE GROWTH" value={fmtPct(latest?.revenue_growth)} unit="%" color={(latest?.revenue_growth ?? 0) > 0 ? "var(--green)" : "var(--red)"} />
          </div>

          {/* ── PANEL 2: FINANCIALS ──────────────────────────────── */}
          <div style={{ ...PANEL_STYLE }}>
            <div className="terminal-label" style={{ marginBottom: 8, color: "var(--cyan)", fontWeight: 700 }}>
              F2 · FINANCIALS
            </div>
            <div style={{ height: 120, marginBottom: 12 }}>
              {revData.length === 0 ? (
                <DataUnavailable height={120} />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revData} margin={{ top: 0, right: 0, left: -15, bottom: 0 }}>
                    <CartesianGrid stroke="rgba(99,120,180,0.06)" strokeDasharray="2 4" />
                    <XAxis dataKey="period" tick={{ fill: "var(--text-muted)", fontSize: 8, fontFamily: "var(--font-mono)" }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fill: "var(--text-muted)", fontSize: 8, fontFamily: "var(--font-mono)" }} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border-glow)", fontFamily: "var(--font-mono)", fontSize: "0.6rem" }}
                    />
                    <Bar dataKey="Revenue" fill="var(--cyan)" opacity={0.8} maxBarSize={20} />
                    <Bar dataKey="Profit"  fill="var(--green)" opacity={0.8} maxBarSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
            <MetricRow label="P/E RATIO" value={fmt(latest?.pe)} color="var(--cyan)" />
            <MetricRow label="P/B RATIO" value={fmt(latest?.pb)} />
            <MetricRow label="DEBT / EQUITY" value={fmt(latest?.debt_equity)} color={(latest?.debt_equity ?? 0) > 2 ? "var(--red)" : "var(--green)"} />
            <MetricRow label="INTEREST COVERAGE" value={fmt(latest?.interest_coverage)} color={(latest?.interest_coverage ?? 0) < 2 ? "var(--red)" : "var(--green)"} />
          </div>

          {/* ── PANEL 3: FORECAST ────────────────────────────────── */}
          <div style={{ ...PANEL_STYLE, borderRight: "none" }}>
            <div className="terminal-label" style={{ marginBottom: 8, color: "var(--yellow)", fontWeight: 700 }}>
              F3 · FORECAST & CASH FLOW
            </div>
            <div style={{
              fontFamily: "var(--font-sans)", fontSize: "0.7rem", color: "var(--text-muted)",
              marginBottom: 14, lineHeight: 1.6,
              background: "rgba(255,214,0,0.08)", border: "1px solid rgba(255,214,0,0.2)",
              padding: "8px 10px", borderRadius: 2,
            }}>
              Forward estimates computed from historic CAGR trends & operating cash flow accruals.
            </div>
            <MetricRow label="PROFIT GROWTH" value={fmtPct(latest?.profit_growth)} unit="%" color={(latest?.profit_growth ?? 0) > 0 ? "var(--green)" : "var(--red)"} />
            <MetricRow label="EPS" value={fmt(latest?.eps)} />
            <MetricRow label="FREE CASH FLOW" value={fmt(latest?.free_cash_flow)} color={(latest?.free_cash_flow ?? 0) >= 0 ? "var(--green)" : "var(--red)"} />
            <MetricRow label="OP. CASH FLOW" value={fmt(latest?.operating_cash_flow)} color={(latest?.operating_cash_flow ?? 0) >= 0 ? "var(--green)" : "var(--red)"} />
          </div>
        </div>
      )}
    </div>
  );
}
