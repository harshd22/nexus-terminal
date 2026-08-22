"use client";
import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import { getMarket } from "@/lib/api";
import type { IndexQuote } from "@/lib/types";

function fmt(v: number | null, decimals = 2) {
  if (v == null) return "—";
  return v.toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function IndexCard({ quote }: { quote: IndexQuote }) {
  const positive = (quote.change ?? 0) >= 0;
  const val = quote.value ?? quote.last_price;

  return (
    <div
      style={{
        background: "#090d16",
        border: "1px solid #1e293b",
        borderColor: positive ? "rgba(0, 230, 118, 0.2)" : "rgba(255, 42, 95, 0.2)",
        padding: "12px 14px",
        borderRadius: 6,
        position: "relative",
        transition: "transform 0.15s ease, border-color 0.15s ease",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <span
          className="terminal-label"
          style={{ fontSize: "0.68rem", fontWeight: 800, color: "#f8fafc", letterSpacing: "0.1em" }}
        >
          {quote.name || quote.symbol}
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.6rem",
            color: positive ? "#00e676" : "#ff2a5f",
            background: positive ? "rgba(0, 230, 118, 0.1)" : "rgba(255, 42, 95, 0.1)",
            border: `1px solid ${positive ? "rgba(0, 230, 118, 0.3)" : "rgba(255, 42, 95, 0.3)"}`,
            padding: "2px 6px",
            borderRadius: 4,
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            gap: 3,
          }}
        >
          {positive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          {positive ? "+" : ""}{fmt(quote.change_pct)}%
        </span>
      </div>

      {val != null ? (
        <div
          className="value-mono"
          style={{
            fontSize: "1.35rem",
            fontWeight: 800,
            color: "#ffffff",
            lineHeight: 1.1,
            letterSpacing: "0.02em",
          }}
        >
          {fmt(val, val > 10000 ? 2 : 2)}
        </div>
      ) : (
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--text-muted)", margin: "4px 0" }}>
          SOURCE UNAVAILABLE
        </div>
      )}

      {quote.high != null && quote.low != null && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 6,
            paddingTop: 6,
            borderTop: "1px solid #1e293b",
            fontFamily: "var(--font-mono)",
            fontSize: "0.6rem",
            color: "var(--text-muted)",
          }}
        >
          <span>H: <span style={{ color: "#00e676", fontWeight: 700 }}>{fmt(quote.high, 0)}</span></span>
          <span>L: <span style={{ color: "#ff2a5f", fontWeight: 700 }}>{fmt(quote.low, 0)}</span></span>
        </div>
      )}
    </div>
  );
}

export function MarketOverview() {
  const [quotes, setQuotes] = useState<IndexQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const data = await getMarket();
      setQuotes(data.indices || []);
      setLastUpdate(data.timestamp);
    } catch {
      // Keep existing quotes
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ background: "#05070c", border: "1px solid #1e293b", borderRadius: 8, overflow: "hidden" }}>
      <div className="section-header" style={{ background: "#090d16", borderBottom: "1px solid #1e293b" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Activity size={15} color="#00e676" />
          <span className="terminal-heading">MARKET PULSE — BENCHMARK & SECTORAL INDICES ({quotes.length || 10})</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className="live-dot" />
          {lastUpdate && (
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--text-muted)" }}>
              {new Date(lastUpdate).toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata" })} IST
            </span>
          )}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 10,
          padding: 12,
          background: "#000000",
        }}
      >
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="glass-card" style={{ padding: 12 }}>
              <div className="skeleton" style={{ height: 14, width: "60%", marginBottom: 8 }} />
              <div className="skeleton" style={{ height: 26, width: "80%", marginBottom: 6 }} />
              <div className="skeleton" style={{ height: 10, width: "40%" }} />
            </div>
          ))
          : quotes.map((q) => <IndexCard key={q.symbol} quote={q} />)}
      </div>
    </div>
  );
}
