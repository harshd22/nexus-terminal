"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { TrendingUp } from "lucide-react";
import { getWinnersLosers } from "@/lib/api";

const CATEGORIES = [
  { id: "ALL", label: "ALL CAPS" },
  { id: "LARGE", label: "LARGE CAP" },
  { id: "MID", label: "MID CAP" },
  { id: "SMALL", label: "SMALL CAP" },
];

export function TopGainersMovers({ defaultCategory = "ALL" }: { defaultCategory?: string }) {
  const [category, setCategory] = useState(defaultCategory);
  const [data, setData] = useState<{ top_gainers: any[]; top_losers: any[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getWinnersLosers(category)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [category]);

  const gainers = data?.top_gainers || [];
  const losers = data?.top_losers || [];

  return (
    <div style={{ background: "#05070c", border: "1px solid #1e293b", borderRadius: 8, overflow: "hidden" }}>
      {/* Category selector header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 16px",
          background: "#090d16",
          borderBottom: "1px solid #1e293b",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <TrendingUp size={14} color="#00e676" />
          <span className="terminal-heading">TOP 20 MARKET MOVERS — {category} CAP GAINERS & LOSERS</span>
        </div>

        <div style={{ display: "flex", gap: 6 }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.62rem",
                letterSpacing: "0.08em",
                padding: "4px 12px",
                borderRadius: 4,
                border: "1px solid",
                borderColor: category === cat.id ? "#00e676" : "#1e293b",
                background: category === cat.id ? "rgba(0, 230, 118, 0.15)" : "rgba(255, 255, 255, 0.02)",
                color: category === cat.id ? "#ffffff" : "#64748b",
                cursor: "pointer",
                fontWeight: category === cat.id ? 800 : 500,
                transition: "all 0.15s ease",
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ padding: 16 }}>
          <div className="skeleton" style={{ height: 320 }} />
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "#1e293b" }}>
          {/* Top 20 Gainers */}
          <div style={{ background: "#04050a" }}>
            <div
              style={{
                padding: "10px 14px",
                background: "rgba(0, 230, 118, 0.08)",
                borderBottom: "1px solid #1e293b",
                fontFamily: "var(--font-mono)",
                fontSize: "0.68rem",
                fontWeight: 800,
                color: "#00e676",
                letterSpacing: "0.12em",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span className="live-dot" style={{ backgroundColor: "#00e676" }} />
              <span>TOP 20 {category} CAP GAINERS</span>
            </div>
            <div style={{ overflowX: "auto", maxHeight: 440 }}>
              <table className="terminal-table">
                <thead>
                  <tr>
                    <th style={{ textAlign: "left" }}>TICKER</th>
                    <th style={{ textAlign: "left" }}>COMPANY NAME</th>
                    <th style={{ textAlign: "right" }}>PRICE</th>
                    <th style={{ textAlign: "right" }}>CHANGE %</th>
                  </tr>
                </thead>
                <tbody>
                  {gainers.slice(0, 20).map((st) => (
                    <tr key={st.symbol}>
                      <td>
                        <Link href={`/stock/${st.symbol}`} style={{ textDecoration: "none" }}>
                          <span style={{ fontWeight: 800, color: "#ffffff", letterSpacing: "0.05em" }}>{st.symbol}</span>
                        </Link>
                      </td>
                      <td style={{ fontSize: "0.68rem", color: "#94a3b8" }}>{st.name}</td>
                      <td style={{ textAlign: "right", fontWeight: 700, color: "#ffffff" }} className="value-mono">
                        ₹{st.last_price?.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </td>
                      <td style={{ textAlign: "right" }} className="value-mono">
                        <span style={{ color: "#00e676", fontWeight: 800, background: "rgba(0, 230, 118, 0.12)", padding: "2px 6px", borderRadius: 4 }}>
                          +{st.change_pct}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top 20 Losers */}
          <div style={{ background: "#04050a" }}>
            <div
              style={{
                padding: "10px 14px",
                background: "rgba(255, 42, 95, 0.08)",
                borderBottom: "1px solid #1e293b",
                fontFamily: "var(--font-mono)",
                fontSize: "0.68rem",
                fontWeight: 800,
                color: "#ff2a5f",
                letterSpacing: "0.12em",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span className="live-dot" style={{ backgroundColor: "#ff2a5f", boxShadow: "0 0 8px #ff2a5f" }} />
              <span>TOP 20 {category} CAP LOSERS</span>
            </div>
            <div style={{ overflowX: "auto", maxHeight: 440 }}>
              <table className="terminal-table">
                <thead>
                  <tr>
                    <th style={{ textAlign: "left" }}>TICKER</th>
                    <th style={{ textAlign: "left" }}>COMPANY NAME</th>
                    <th style={{ textAlign: "right" }}>PRICE</th>
                    <th style={{ textAlign: "right" }}>CHANGE %</th>
                  </tr>
                </thead>
                <tbody>
                  {losers.slice(0, 20).map((st) => (
                    <tr key={st.symbol}>
                      <td>
                        <Link href={`/stock/${st.symbol}`} style={{ textDecoration: "none" }}>
                          <span style={{ fontWeight: 800, color: "#ffffff", letterSpacing: "0.05em" }}>{st.symbol}</span>
                        </Link>
                      </td>
                      <td style={{ fontSize: "0.68rem", color: "#94a3b8" }}>{st.name}</td>
                      <td style={{ textAlign: "right", fontWeight: 700, color: "#ffffff" }} className="value-mono">
                        ₹{st.last_price?.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </td>
                      <td style={{ textAlign: "right" }} className="value-mono">
                        <span style={{ color: "#ff2a5f", fontWeight: 800, background: "rgba(255, 42, 95, 0.12)", padding: "2px 6px", borderRadius: 4 }}>
                          {st.change_pct}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
