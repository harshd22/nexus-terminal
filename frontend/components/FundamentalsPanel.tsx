"use client";
import { useEffect, useState } from "react";
import { getStockFundamentals } from "@/lib/api";
import type { Fundamental } from "@/lib/types";
import { SourceChip } from "./SourceChip";
import { DataUnavailable } from "./DataUnavailable";

interface Props { symbol: string; }

interface MetricDef {
  key: keyof Fundamental;
  label: string;
  format: (v: number) => string;
  colorFn?: (v: number) => string;
}

const pct = (v: number) => `${(v * 100).toFixed(1)}%`;
const num = (v: number, d = 1) => v.toLocaleString("en-IN", { maximumFractionDigits: d });
const cr  = (v: number) => `₹${(v / 100).toFixed(0)} Cr`; // assuming values in Cr

const METRICS: MetricDef[] = [
  { key: "revenue",          label: "REVENUE",               format: cr },
  { key: "revenue_growth",   label: "REVENUE GROWTH",        format: pct, colorFn: (v) => v >= 0 ? "var(--green)" : "var(--red)" },
  { key: "ebitda",           label: "EBITDA",                format: cr },
  { key: "ebitda_margin",    label: "EBITDA MARGIN",         format: pct, colorFn: (v) => v >= 0.15 ? "var(--green)" : v >= 0.08 ? "var(--amber)" : "var(--red)" },
  { key: "net_profit",       label: "NET PROFIT",            format: cr, colorFn: (v) => v >= 0 ? "var(--green)" : "var(--red)" },
  { key: "profit_growth",    label: "PROFIT GROWTH",         format: pct, colorFn: (v) => v >= 0 ? "var(--green)" : "var(--red)" },
  { key: "eps",              label: "EPS",                   format: (v) => `₹${num(v)}` },
  { key: "pe",               label: "P/E",                   format: (v) => num(v), colorFn: (v) => v < 15 ? "var(--green)" : v < 30 ? "var(--blue)" : "var(--amber)" },
  { key: "pb",               label: "P/B",                   format: (v) => num(v) },
  { key: "roe",              label: "ROE",                   format: (v) => `${num(v)}%`, colorFn: (v) => v >= 15 ? "var(--green)" : v >= 8 ? "var(--amber)" : "var(--red)" },
  { key: "roce",             label: "ROCE",                  format: (v) => `${num(v)}%`, colorFn: (v) => v >= 15 ? "var(--green)" : v >= 8 ? "var(--amber)" : "var(--red)" },
  { key: "debt_equity",      label: "DEBT/EQUITY",          format: (v) => num(v, 2), colorFn: (v) => v < 0.5 ? "var(--green)" : v < 2 ? "var(--amber)" : "var(--red)" },
  { key: "interest_coverage",label: "INTEREST COVERAGE",    format: (v) => `${num(v)}×`, colorFn: (v) => v >= 3 ? "var(--green)" : v >= 2 ? "var(--amber)" : "var(--red)" },
  { key: "operating_cash_flow",label:"OP. CASH FLOW",       format: cr, colorFn: (v) => v >= 0 ? "var(--green)" : "var(--red)" },
  { key: "free_cash_flow",   label: "FREE CASH FLOW",       format: cr, colorFn: (v) => v >= 0 ? "var(--green)" : "var(--red)" },
];

export function FundamentalsPanel({ symbol }: Props) {
  const [data, setData] = useState<Fundamental[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState(0);

  useEffect(() => {
    getStockFundamentals(symbol)
      .then((d) => setData(d.data || []))
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, [symbol]);

  const current = data[selectedPeriod];

  return (
    <div>
      <div className="section-header">
        <span className="terminal-heading">FUNDAMENTALS</span>
      </div>

      {/* Period selector */}
      {data.length > 0 && (
        <div style={{ display: "flex", gap: 4, padding: "6px 12px", borderBottom: "1px solid var(--border-subtle)" }}>
          {data.slice(0, 8).map((f, i) => (
            <button
              key={i}
              onClick={() => setSelectedPeriod(i)}
              style={{
                fontFamily: "var(--text-mono)", fontSize: "0.6rem",
                padding: "2px 8px", border: "1px solid",
                borderColor: selectedPeriod === i ? "var(--purple)" : "var(--border-subtle)",
                background: selectedPeriod === i ? "rgba(156,39,176,0.15)" : "transparent",
                color: selectedPeriod === i ? "var(--purple)" : "var(--text-muted)",
                cursor: "pointer", borderRadius: 1,
              }}
            >
              {f.period ?? `Period ${i + 1}`}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div style={{ padding: 12 }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 28, marginBottom: 2 }} />
          ))}
        </div>
      ) : !current ? (
        <DataUnavailable message="FUNDAMENTALS DATA UNAVAILABLE — SCREENER PROVIDER NOT RUN" />
      ) : (
        <div style={{ padding: "4px 0" }}>
          {METRICS.map((m) => {
            const rawVal = current[m.key] as number | null;
            const color = rawVal != null && m.colorFn ? m.colorFn(rawVal) : "var(--text-primary)";
            return (
              <div
                key={m.key}
                style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "5px 12px", borderBottom: "1px solid var(--border-subtle)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-hover)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <span className="terminal-label">{m.label}</span>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  {rawVal == null ? (
                    <span style={{ fontFamily: "var(--text-mono)", fontSize: "0.65rem", color: "var(--text-muted)" }}>
                      DATA UNAVAILABLE
                    </span>
                  ) : (
                    <span className="value-mono" style={{ fontSize: "0.8rem", color }}>{m.format(rawVal)}</span>
                  )}
                  <SourceChip source={current.source} date={current.data_date} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
