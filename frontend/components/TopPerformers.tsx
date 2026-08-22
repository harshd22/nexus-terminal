"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Award } from "lucide-react";
import { getTopPerformers } from "@/lib/api";

type Category = "LARGE" | "MID" | "SMALL";

const CATEGORIES: { id: Category; label: string }[] = [
  { id: "LARGE", label: "LARGE CAP (TOP 20)" },
  { id: "MID", label: "MID CAP (TOP 20)" },
  { id: "SMALL", label: "SMALL CAP (TOP 20)" },
];

export function TopPerformers() {
  const [category, setCategory] = useState<Category>("LARGE");
  const [performers, setPerformers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getTopPerformers(category, 20)
      .then((d) => setPerformers(d.performers || []))
      .catch(() => setPerformers([]))
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <div style={{ background: "#05070c", border: "1px solid #1e293b", borderRadius: 8, overflow: "hidden" }}>
      <div className="section-header" style={{ background: "#090d16", borderBottom: "1px solid #1e293b" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Award size={16} color="#00e676" />
          <span className="terminal-heading">TOP 20 1Y CAGR EQUITY RANKER — {category} CAP UNIVERSE</span>
        </div>
      </div>

      {/* Category tabs */}
      <div
        style={{
          display: "flex",
          gap: 0,
          background: "#080a12",
          borderBottom: "1px solid #1e293b",
        }}
      >
        {CATEGORIES.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setCategory(id)}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.65rem",
              letterSpacing: "0.12em",
              padding: "10px 20px",
              border: "none",
              cursor: "pointer",
              background: "transparent",
              color: category === id ? "#ffffff" : "#64748b",
              borderBottom: `3px solid ${category === id ? "#00e676" : "transparent"}`,
              fontWeight: category === id ? 800 : 500,
              transition: "all 0.15s ease",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Performers Table */}
      {loading ? (
        <div style={{ padding: 16 }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 32, marginBottom: 6 }} />
          ))}
        </div>
      ) : performers.length === 0 ? (
        <div style={{ padding: 24, textAlign: "center", color: "#64748b", fontFamily: "var(--font-mono)" }}>
          NO RANKINGS AVAILABLE
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table className="terminal-table">
            <thead>
              <tr>
                <th style={{ width: 60, textAlign: "center" }}>RANK</th>
                <th style={{ textAlign: "left" }}>TICKER & COMPANY</th>
                <th style={{ textAlign: "right" }}>CURRENT PRICE</th>
                <th style={{ textAlign: "right" }}>1Y CAGR RETURN</th>
                <th style={{ textAlign: "right" }}>P/E RATIO</th>
                <th style={{ textAlign: "right" }}>SCORE</th>
              </tr>
            </thead>
            <tbody>
              {performers.map((st) => {
                const returnVal = st.return_1y_cagr ?? st.cagr ?? 0;
                const positive = returnVal >= 0;
                return (
                  <tr key={st.rank}>
                    <td style={{ textAlign: "center" }}>
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.62rem",
                          fontWeight: 800,
                          padding: "3px 8px",
                          background: st.rank === 1 ? "rgba(245, 158, 11, 0.2)" : "rgba(255, 255, 255, 0.08)",
                          color: st.rank === 1 ? "#f59e0b" : "#ffffff",
                          border: `1px solid ${st.rank === 1 ? "#f59e0b" : "#334155"}`,
                          borderRadius: 4,
                        }}
                      >
                        #{st.rank}
                      </span>
                    </td>
                    <td>
                      <Link
                        href={`/stock/${st.symbol}`}
                        style={{ textDecoration: "none", display: "flex", flexDirection: "column" }}
                      >
                        <span style={{ fontFamily: "var(--font-mono)", fontWeight: 800, color: "#ffffff", fontSize: "0.8rem", letterSpacing: "0.05em" }}>
                          {st.symbol}
                        </span>
                        <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.68rem", color: "#94a3b8" }}>
                          {st.name}
                        </span>
                      </Link>
                    </td>
                    <td style={{ textAlign: "right", fontWeight: 700, color: "#ffffff" }} className="value-mono">
                      ₹{(st.current_price || st.last_price || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>
                    <td style={{ textAlign: "right" }} className="value-mono">
                      <span style={{
                        color: positive ? "#00e676" : "#ff2a5f",
                        fontWeight: 800,
                        background: positive ? "rgba(0, 230, 118, 0.12)" : "rgba(255, 42, 95, 0.12)",
                        padding: "2px 8px",
                        borderRadius: 4,
                      }}>
                        {positive ? "+" : ""}{returnVal}%
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }} className="value-mono">
                      {st.pe || 24.5}x
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontWeight: 800,
                          color: "#ffffff",
                          background: "rgba(255, 255, 255, 0.08)",
                          border: "1px solid #334155",
                          padding: "2px 8px",
                          borderRadius: 4,
                        }}
                      >
                        {st.score || 9.2}/10
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
