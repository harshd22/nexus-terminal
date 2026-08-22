"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getTopPerformers } from "@/lib/api";
import { DataUnavailable } from "@/components/DataUnavailable";

const CATEGORIES = ["LARGE", "MID", "SMALL"];

export default function TopPerformersPage() {
  const [category, setCategory] = useState("LARGE");
  const [performers, setPerformers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getTopPerformers(category, 20)
      .then((d) => setPerformers(d.performers || []))
      .catch(() => setPerformers([]))
      .finally(() => setLoading(false));
  }, [category]);

  const fmt = (v?: number | null) =>
    v == null
      ? "—"
      : v.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div>
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
          NEXUS TERMINAL // TOP PERFORMERS — 1Y CAGR RANKER
        </h1>
      </div>

      {/* Category selector */}
      <div
        style={{
          display: "flex",
          gap: 0,
          borderBottom: "1px solid var(--border-subtle)",
          background: "var(--bg-surface)",
        }}
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.65rem",
              letterSpacing: "0.1em",
              padding: "9px 16px",
              border: "none",
              cursor: "pointer",
              background: "transparent",
              color: category === cat ? "var(--purple)" : "var(--text-muted)",
              borderBottom: `2px solid ${category === cat ? "var(--purple)" : "transparent"}`,
              fontWeight: category === cat ? 700 : 500,
            }}
          >
            {cat} CAPS
          </button>
        ))}
      </div>

      <div className="section-header">
        <span className="terminal-heading">TOP 20 {category} CAP STOCKS BY 1Y RETURN</span>
      </div>

      {loading ? (
        <div style={{ padding: 12 }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 32, marginBottom: 2 }} />
          ))}
        </div>
      ) : performers.length === 0 ? (
        <DataUnavailable message="NO RANKINGS AVAILABLE FOR THIS CATEGORY" />
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table className="terminal-table">
            <thead>
              <tr>
                <th style={{ width: 50, textAlign: "center" }}>RANK</th>
                <th style={{ textAlign: "left" }}>SYMBOL</th>
                <th style={{ textAlign: "left" }}>COMPANY NAME</th>
                <th style={{ textAlign: "right" }}>CURRENT PRICE</th>
                <th style={{ textAlign: "right" }}>1Y CAGR</th>
                <th style={{ textAlign: "right" }}>P/E RATIO</th>
                <th style={{ textAlign: "right" }}>SCORE</th>
              </tr>
            </thead>
            <tbody>
              {performers.map((p) => {
                const px = p.current_price ?? p.last_price ?? 0;
                const ret1y = p.cagr ?? p.return_1y_cagr ?? p.return_1y_pct ?? p.change_pct ?? 0;
                return (
                  <tr key={p.symbol}>
                    <td style={{ textAlign: "center" }} className="value-mono">
                      #{p.rank}
                    </td>
                    <td>
                      <Link
                        href={`/stock/${p.symbol}`}
                        style={{ color: "var(--purple)", textDecoration: "none", fontWeight: 700 }}
                      >
                        {p.symbol}
                      </Link>
                    </td>
                    <td>{p.name}</td>
                    <td style={{ textAlign: "right" }} className="value-mono">
                      ₹{fmt(px)}
                    </td>
                    <td style={{ textAlign: "right" }} className="value-mono">
                      <span style={{ color: ret1y >= 0 ? "var(--green)" : "var(--red)", fontWeight: 700 }}>
                        {ret1y >= 0 ? "+" : ""}
                        {typeof ret1y === "number" ? ret1y.toFixed(2) : ret1y}%
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }} className="value-mono">
                      {p.pe ? `${p.pe}x` : "—"}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontWeight: 700,
                          color: "var(--cyan)",
                          background: "rgba(0,229,255,0.1)",
                          padding: "2px 6px",
                          borderRadius: 2,
                        }}
                      >
                        {p.score}/10
                      </span>
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
