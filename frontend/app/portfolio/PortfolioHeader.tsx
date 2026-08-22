"use client";
import { useEffect, useState } from "react";
import { getPortfolio } from "@/lib/api";
import type { PortfolioStats } from "@/lib/types";

function StatBox({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div style={{ padding: "12px 20px", borderRight: "1px solid var(--border-subtle)" }}>
      <div className="terminal-label">{label}</div>
      <div
        className="value-mono"
        style={{
          fontSize: "1.1rem",
          fontWeight: 700,
          color: color ?? "var(--text-primary)",
          lineHeight: 1.2,
          marginTop: 4,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function fmtCr(v: number | null | undefined) {
  if (v == null) return "₹0";
  if (Math.abs(v) >= 1e7) return `₹${(v / 1e7).toFixed(2)} Cr`;
  if (Math.abs(v) >= 1e5) return `₹${(v / 1e5).toFixed(2)} L`;
  return `₹${v.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

export function PortfolioHeader() {
  const [stats, setStats] = useState<PortfolioStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPortfolio().then(setStats).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div style={{ display: "flex", padding: "12px 20px", gap: 1 }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton" style={{ height: 56, flex: 1, marginRight: 1 }} />
        ))}
      </div>
    );

  if (!stats) return null;

  const dayPnl = stats.day_pnl ?? 0;
  const overPnl = stats.overall_pnl ?? 0;
  const overPnlPct = stats.overall_pnl_pct ?? 0;
  const dayPnlColor = dayPnl >= 0 ? "var(--green)" : "var(--red)";
  const overPnlColor = overPnl >= 0 ? "var(--green)" : "var(--red)";

  return (
    <div style={{ display: "flex", borderBottom: "1px solid var(--border-subtle)", background: "var(--bg-card)" }}>
      <StatBox label="TOTAL INVESTED" value={fmtCr(stats.total_invested)} />
      <StatBox label="CURRENT VALUE" value={fmtCr(stats.current_value)} color="var(--blue)" />
      <StatBox label="DAY P&L" value={`${dayPnl >= 0 ? "+" : ""}${fmtCr(dayPnl)}`} color={dayPnlColor} />
      <StatBox
        label="OVERALL P&L"
        value={`${overPnl >= 0 ? "+" : ""}${fmtCr(overPnl)} (${overPnlPct >= 0 ? "+" : ""}${overPnlPct.toFixed(1)}%)`}
        color={overPnlColor}
      />
      {stats.demo_mode && (
        <div style={{ display: "flex", alignItems: "center", padding: "0 16px" }}>
          <span className="badge badge-warn">DEMO MODE</span>
        </div>
      )}
    </div>
  );
}
