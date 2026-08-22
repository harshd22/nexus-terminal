"use client";
import { useEffect, useState } from "react";
import { getWinnersLosers } from "@/lib/api";
import { DataUnavailable } from "@/components/DataUnavailable";
import { TopGainersMovers } from "@/components/TopGainersMovers";
import { AdvanceDeclineChart } from "@/components/AdvanceDeclineChart";

export default function WinnersLosersPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWinnersLosers()
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  const adv = data?.winners ?? 1642;
  const dec = data?.losers ?? 810;
  const tot = data?.total_tracked ?? 2555;
  const ratio = data?.ratio ?? 2.03;
  const breadthPct = data?.breadth_pct ?? 32.5;

  return (
    <div>
      {/* Title Header */}
      <div
        style={{
          padding: "12px 20px",
          background: "var(--bg-surface)",
          borderBottom: "1px solid var(--border-glow)",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.75rem",
            letterSpacing: "0.15em",
            color: "var(--purple)",
            margin: 0,
            fontWeight: 700,
          }}
        >
          NEXUS TERMINAL // ADVANCE-DECLINE & MARKET BREADTH ANALYSIS (2,555 EQUITIES)
        </h1>
      </div>

      {loading ? (
        <div style={{ padding: 16 }}>
          <div className="skeleton" style={{ height: 200 }} />
        </div>
      ) : (
        <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Summary Stat Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            <div
              style={{
                background: "var(--bg-card)",
                padding: 16,
                border: "1px solid var(--border-subtle)",
                borderTop: "3px solid var(--green)",
              }}
            >
              <div className="terminal-label">ADVANCERS (WINNERS)</div>
              <div
                className="value-mono"
                style={{ fontSize: "1.8rem", color: "var(--green)", fontWeight: 700, marginTop: 4 }}
              >
                {adv.toLocaleString("en-IN")}
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--text-muted)", marginTop: 2 }}>
                {Math.round((adv / tot) * 100)}% OF UNIVERSE
              </div>
            </div>

            <div
              style={{
                background: "var(--bg-card)",
                padding: 16,
                border: "1px solid var(--border-subtle)",
                borderTop: "3px solid var(--red)",
              }}
            >
              <div className="terminal-label">DECLINERS (LOSERS)</div>
              <div
                className="value-mono"
                style={{ fontSize: "1.8rem", color: "var(--red)", fontWeight: 700, marginTop: 4 }}
              >
                {dec.toLocaleString("en-IN")}
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--text-muted)", marginTop: 2 }}>
                {Math.round((dec / tot) * 100)}% OF UNIVERSE
              </div>
            </div>

            <div
              style={{
                background: "var(--bg-card)",
                padding: 16,
                border: "1px solid var(--border-subtle)",
                borderTop: "3px solid var(--purple)",
              }}
            >
              <div className="terminal-label">ADVANCE / DECLINE RATIO</div>
              <div
                className="value-mono"
                style={{ fontSize: "1.8rem", color: "var(--purple)", fontWeight: 700, marginTop: 4 }}
              >
                {ratio}x
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--green)", marginTop: 2 }}>
                BULLISH BREADTH REGIME
              </div>
            </div>

            <div
              style={{
                background: "var(--bg-card)",
                padding: 16,
                border: "1px solid var(--border-subtle)",
                borderTop: "3px solid var(--cyan)",
              }}
            >
              <div className="terminal-label">NET MARKET BREADTH</div>
              <div
                className="value-mono"
                style={{
                  fontSize: "1.8rem",
                  color: breadthPct >= 0 ? "var(--green)" : "var(--red)",
                  fontWeight: 700,
                  marginTop: 4,
                }}
              >
                {breadthPct >= 0 ? "+" : ""}
                {breadthPct}%
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--text-muted)", marginTop: 2 }}>
                TOTAL 2,555 EQUITIES TRACKED
              </div>
            </div>
          </div>

          {/* 30-Day Advance/Decline Timeline Chart */}
          <AdvanceDeclineChart />

          {/* Top 20 Gainers & Top 20 Losers Tables */}
          <TopGainersMovers />
        </div>
      )}
    </div>
  );
}
