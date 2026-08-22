"use client";
import { useEffect, useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { getStockShareholding } from "@/lib/api";
import type { ShareholdingRecord } from "@/lib/types";
import { SourceChip } from "./SourceChip";
import { DataUnavailable } from "./DataUnavailable";

const COLORS = {
  promoter_pct: "var(--purple)",
  fii_pct:      "var(--blue)",
  dii_pct:      "var(--amber)",
  public_pct:   "var(--green)",
};

const LABELS = {
  promoter_pct: "PROMOTERS",
  fii_pct:      "FII",
  dii_pct:      "DII",
  public_pct:   "PUBLIC",
};

interface Props { symbol: string; }

export function ShareholdingChart({ symbol }: Props) {
  const [records, setRecords] = useState<ShareholdingRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStockShareholding(symbol)
      .then((d) => setRecords(d.data || []))
      .catch(() => setRecords([]))
      .finally(() => setLoading(false));
  }, [symbol]);

  const latest = records[records.length - 1];
  const prev   = records[records.length - 2];

  const chartData = records.map((r) => ({
    quarter:      r.quarter,
    promoter_pct: r.promoter_pct,
    fii_pct:      r.fii_pct,
    dii_pct:      r.dii_pct,
    public_pct:   r.public_pct,
  }));

  function delta(key: keyof typeof COLORS) {
    if (!latest || !prev) return null;
    const curr = latest[key as keyof ShareholdingRecord] as number | null;
    const prv  = prev[key as keyof ShareholdingRecord] as number | null;
    if (curr == null || prv == null) return null;
    return curr - prv;
  }

  return (
    <div>
      <div className="section-header">
        <span className="terminal-heading">SHAREHOLDING PATTERN — QUARTERLY</span>
      </div>

      {/* Current snapshot */}
      {latest && (
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
          padding: "10px 16px", gap: 1,
          background: "var(--bg-card)", borderBottom: "1px solid var(--border-subtle)",
        }}>
          {(Object.keys(COLORS) as Array<keyof typeof COLORS>).map((key) => {
            const val = latest[key as keyof ShareholdingRecord] as number | null;
            const d   = delta(key);
            return (
              <div key={key} style={{ padding: "4px 0" }}>
                <div className="terminal-label" style={{ color: COLORS[key] }}>{LABELS[key]}</div>
                <div className="value-mono" style={{ fontSize: "1.1rem", color: COLORS[key], fontWeight: 700, lineHeight: 1.2 }}>
                  {val == null ? "—" : `${val.toFixed(1)}%`}
                </div>
                {d != null && (
                  <div className="value-mono" style={{ fontSize: "0.65rem", color: d >= 0 ? "var(--green)" : "var(--red)" }}>
                    {d >= 0 ? "▲" : "▼"} {Math.abs(d).toFixed(2)}% vs prev Q
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Pledge warning */}
      {latest?.promoter_pledge_pct != null && latest.promoter_pledge_pct > 0 && (
        <div style={{
          padding: "6px 16px",
          background: latest.promoter_pledge_pct > 20 ? "var(--red-glow)" : "var(--amber-glow)",
          borderBottom: "1px solid var(--border-subtle)",
          fontFamily: "var(--text-mono)", fontSize: "0.65rem",
          color: latest.promoter_pledge_pct > 20 ? "var(--red)" : "var(--amber)",
        }}>
          PROMOTER PLEDGE: {latest.promoter_pledge_pct.toFixed(1)}%
          {latest.promoter_pledge_pct > 20 ? " — ⚠ ABOVE 20% THRESHOLD" : ""}
        </div>
      )}

      {/* Chart */}
      <div style={{ height: 200, padding: "12px 0 0" }}>
        {loading ? (
          <div className="skeleton" style={{ height: 180, margin: "0 16px" }} />
        ) : records.length === 0 ? (
          <DataUnavailable message="SHAREHOLDING DATA UNAVAILABLE" height={180} />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <defs>
                {(Object.keys(COLORS) as Array<keyof typeof COLORS>).map((key) => (
                  <linearGradient key={key} id={`grad_${key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={COLORS[key]} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={COLORS[key]} stopOpacity={0.05} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid stroke="rgba(99,120,180,0.08)" strokeDasharray="2 4" />
              <XAxis
                dataKey="quarter"
                tick={{ fill: "var(--text-muted)", fontSize: 9, fontFamily: "var(--text-mono)" }}
                tickLine={false}
                axisLine={{ stroke: "var(--border-subtle)" }}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: "var(--text-muted)", fontSize: 9, fontFamily: "var(--text-mono)" }}
                tickLine={false}
                axisLine={false}
                width={30}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                contentStyle={{ background: "var(--bg-elevated)", border: "1px solid var(--border-active)", fontFamily: "var(--text-mono)", fontSize: "0.65rem" }}
                formatter={((val: any, name: any) => [`${Number(val ?? 0).toFixed(1)}%`, LABELS[name as keyof typeof LABELS] ?? String(name)]) as any}
              />
              <Legend
                wrapperStyle={{ fontFamily: "var(--text-mono)", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase" }}
                formatter={(val) => LABELS[val as keyof typeof LABELS] ?? val}
              />
              {(Object.keys(COLORS) as Array<keyof typeof COLORS>).map((key) => (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={COLORS[key]}
                  strokeWidth={1.5}
                  fill={`url(#grad_${key})`}
                  stackId="1"
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
      <div style={{ padding: "6px 16px" }}>
        <SourceChip source={latest?.source ?? null} date={latest?.data_date} />
      </div>
    </div>
  );
}
