"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { searchStocks } from "@/lib/api";
import type { StockSearchResult } from "@/lib/types";

export default function StockScreenerPage() {
  const [query, setQuery] = useState("");
  const [stocks, setStocks] = useState<StockSearchResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    searchStocks("")
      .then((d) => setStocks(d.results || []))
      .catch(() => setStocks([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = stocks.filter((s) =>
    s.symbol.toLowerCase().includes(query.toLowerCase()) ||
    s.name.toLowerCase().includes(query.toLowerCase()) ||
    (s.sector && s.sector.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div>
      <div style={{
        padding: "12px 20px",
        background: "var(--section-grad)",
        borderBottom: "1px solid var(--border-glow)",
      }}>
        <h1 style={{
          fontFamily: "var(--text-mono)", fontSize: "0.65rem",
          letterSpacing: "0.2em", color: "var(--purple)", margin: 0,
        }}>
          NEXUS TERMINAL // STOCK SCREENER & UNIVERSE
        </h1>
      </div>

      <div style={{ padding: "12px 16px", background: "var(--bg-panel)", borderBottom: "1px solid var(--border-subtle)" }}>
        <input
          className="search-input"
          placeholder="FILTER BY SYMBOL, NAME, OR SECTOR..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div style={{ padding: 12 }}>
          {Array.from({ length: 10 }).map((_, i) => <div key={i} className="skeleton" style={{ height: 32, marginBottom: 2 }} />)}
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table className="terminal-table">
            <thead>
              <tr>
                <th>SYMBOL</th>
                <th>COMPANY NAME</th>
                <th>SECTOR</th>
                <th>CATEGORY</th>
                <th>EXCHANGE</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.symbol}>
                  <td>
                    <Link href={`/stock/${s.symbol}`} style={{ color: "var(--blue)", textDecoration: "none", fontWeight: 600 }}>
                      {s.symbol}
                    </Link>
                  </td>
                  <td>{s.name}</td>
                  <td style={{ color: "var(--text-muted)" }}>{s.sector ?? "—"}</td>
                  <td className="value-mono" style={{ color: s.market_cap_category === "LARGE" ? "var(--blue)" : "var(--amber)" }}>
                    {s.market_cap_category ?? "—"}
                  </td>
                  <td className="value-mono">[{s.exchanges}]</td>
                  <td>
                    <Link
                      href={`/stock/${s.symbol}`}
                      style={{
                        fontFamily: "var(--text-mono)", fontSize: "0.58rem", color: "var(--purple)",
                        textDecoration: "none", background: "rgba(156,39,176,0.1)",
                        padding: "2px 6px", border: "1px solid var(--border-glow)",
                      }}
                    >
                      ANALYZE →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
