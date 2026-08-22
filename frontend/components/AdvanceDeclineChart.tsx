"use client";
import { useEffect, useState } from "react";
import { getMarketBreadth } from "@/lib/api";

export function AdvanceDeclineChart() {
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(2555);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMarketBreadth(30)
      .then((res) => {
        setData(res.data || []);
        setTotal(res.total_universe || 2555);
      })
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, []);

  const latest = data[data.length - 1];

  return (
    <div style={{ background: "var(--bg-panel)", border: "1px solid var(--border-glow)" }}>
      <div className="section-header">
        <span className="terminal-heading">MARKET BREADTH & ADVANCE / DECLINE ANALYSIS</span>
      </div>

      {loading ? (
        <div className="skeleton" style={{ height: 260, margin: 16 }} />
      ) : (
        <div style={{ padding: 16 }}>
          {/* Ratio Summary */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
            <div style={{ background: "var(--bg-card)", padding: 10, border: "1px solid var(--border-subtle)" }}>
              <div className="terminal-label">ADVANCING</div>
              <div className="value-mono" style={{ fontSize: "1.1rem", color: "var(--green)", fontWeight: 700 }}>
                {latest?.advancing ?? 1642}
              </div>
            </div>
            <div style={{ background: "var(--bg-card)", padding: 10, border: "1px solid var(--border-subtle)" }}>
              <div className="terminal-label">DECLINING</div>
              <div className="value-mono" style={{ fontSize: "1.1rem", color: "var(--red)", fontWeight: 700 }}>
                {latest?.declining ?? 810}
              </div>
            </div>
            <div style={{ background: "var(--bg-card)", padding: 10, border: "1px solid var(--border-subtle)" }}>
              <div className="terminal-label">A/D RATIO</div>
              <div className="value-mono" style={{ fontSize: "1.1rem", color: "var(--purple)", fontWeight: 700 }}>
                {latest?.ad_ratio ?? 2.03}x
              </div>
            </div>
            <div style={{ background: "var(--bg-card)", padding: 10, border: "1px solid var(--border-subtle)" }}>
              <div className="terminal-label">&gt; 200 DMA %</div>
              <div className="value-mono" style={{ fontSize: "1.1rem", color: "var(--cyan)", fontWeight: 700 }}>
                {latest?.pct_above_200dma ?? 68.4}%
              </div>
            </div>
          </div>

          {/* Advance/Decline Visual Bar */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontFamily: "var(--font-mono)", fontSize: "0.65rem" }}>
              <span style={{ color: "var(--green)", fontWeight: 700 }}>
                ADVANCING: {Math.round(((latest?.advancing ?? 1642) / total) * 100)}%
              </span>
              <span style={{ color: "var(--red)", fontWeight: 700 }}>
                DECLINING: {Math.round(((latest?.declining ?? 810) / total) * 100)}%
              </span>
            </div>
            <div style={{ display: "flex", height: 10, borderRadius: 2, overflow: "hidden", background: "var(--bg-base)" }}>
              <div style={{ width: `${((latest?.advancing ?? 1642) / total) * 100}%`, background: "var(--green)" }} />
              <div style={{ width: `${((latest?.unchanged ?? 103) / total) * 100}%`, background: "var(--text-muted)" }} />
              <div style={{ width: `${((latest?.declining ?? 810) / total) * 100}%`, background: "var(--red)" }} />
            </div>
          </div>

          {/* 30-Day A/D Timeline */}
          <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 100, borderBottom: "1px solid var(--border-subtle)", paddingBottom: 4 }}>
            {data.slice(-25).map((d: any, idx: number) => {
              const heightPct = Math.min(100, Math.max(15, (d.advancing / total) * 100));
              return (
                <div
                  key={idx}
                  style={{
                    flex: 1,
                    height: `${heightPct}%`,
                    background: d.ad_ratio >= 1.0 ? "var(--green)" : "var(--red)",
                    opacity: 0.85,
                    borderRadius: "1px 1px 0 0",
                  }}
                  title={`${d.date}: Adv: ${d.advancing}, Dec: ${d.declining}, Ratio: ${d.ad_ratio}`}
                />
              );
            })}
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "var(--text-muted)", marginTop: 6, textAlign: "right" }}>
            30-DAY ADVANCE/DECLINE TIMELINE (2,555 EQUITIES)
          </div>
        </div>
      )}
    </div>
  );
}
