"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, TrendingUp } from "lucide-react";
import { searchStocks } from "@/lib/api";
import type { StockSearchResult } from "@/lib/types";

interface Props {
  compact?: boolean;
  autoFocus?: boolean;
}

export function SearchBar({ compact = false, autoFocus = false }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<StockSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const doSearch = useCallback(async (q: string) => {
    if (q.length < 1) { setResults([]); setOpen(false); return; }
    setLoading(true);
    try {
      const data = await searchStocks(q);
      setResults(data.results || []);
      setOpen(true);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setQuery(v);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(v), 280);
  };

  const handleSelect = (stock: StockSearchResult) => {
    setQuery("");
    setOpen(false);
    setResults([]);
    router.push(`/stock/${stock.symbol}`);
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const capCatColor: Record<string, string> = {
    LARGE: "var(--blue)",
    MID:   "var(--amber)",
    SMALL: "var(--text-muted)",
  };

  return (
    <div ref={wrapperRef} style={{ position: "relative", width: "100%" }}>
      <div style={{ position: "relative" }}>
        <Search
          size={14}
          style={{
            position: "absolute",
            left: 14,
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--text-muted)",
            pointerEvents: "none",
          }}
        />
        <input
          className="search-input"
          style={compact ? { fontSize: "0.75rem", padding: "8px 12px 8px 36px" } : {}}
          placeholder={compact ? "SEARCH NSE + BSE" : "SEARCH NSE + BSE LISTINGS — RELIANCE, TCS, INFY, HDFCBANK..."}
          value={query}
          onChange={handleChange}
          autoFocus={autoFocus}
          onFocus={() => query.length > 0 && setOpen(true)}
          aria-label="Search stocks"
          aria-autocomplete="list"
          role="combobox"
          aria-expanded={open}
        />
        {loading && (
          <div
            style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              width: 10,
              height: 10,
              border: "2px solid var(--purple)",
              borderTopColor: "transparent",
              borderRadius: "50%",
              animation: "spin 0.6s linear infinite",
            }}
          />
        )}
      </div>

      {/* Dropdown */}
      {open && results.length > 0 && (
        <div
          role="listbox"
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            background: "var(--bg-panel)",
            border: "1px solid var(--border-glow)",
            borderRadius: 2,
            zIndex: 1000,
            maxHeight: 320,
            overflowY: "auto",
            boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
          }}
        >
          {results.map((stock) => (
            <button
              key={stock.symbol}
              role="option"
              className="search-result-item"
              style={{ width: "100%", border: "none", background: "transparent", textAlign: "left" }}
              onClick={() => handleSelect(stock)}
            >
              <span
                style={{
                  fontFamily: "var(--text-mono)",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "var(--blue)",
                  minWidth: 80,
                }}
              >
                {stock.symbol}
              </span>
              <span style={{ flex: 1, color: "var(--text-primary)", fontSize: "0.72rem" }}>
                {stock.name}
              </span>
              <span
                style={{
                  fontFamily: "var(--text-mono)",
                  fontSize: "0.58rem",
                  color: "var(--text-muted)",
                  background: "var(--bg-elevated)",
                  padding: "1px 5px",
                  borderRadius: 1,
                }}
              >
                [{stock.exchanges}]
              </span>
              {stock.market_cap_category && (
                <span
                  style={{
                    fontFamily: "var(--text-mono)",
                    fontSize: "0.55rem",
                    color: capCatColor[stock.market_cap_category] || "var(--text-muted)",
                  }}
                >
                  {stock.market_cap_category}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {open && results.length === 0 && !loading && query.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            background: "var(--bg-panel)",
            border: "1px solid var(--border-subtle)",
            borderRadius: 2,
            padding: "12px",
            fontFamily: "var(--text-mono)",
            fontSize: "0.7rem",
            color: "var(--text-muted)",
            zIndex: 1000,
          }}
        >
          No results for &quot;{query}&quot; — try NSE symbol (e.g. RELIANCE, INFY)
        </div>
      )}

      <style>{`@keyframes spin { to { transform: translateY(-50%) rotate(360deg); } }`}</style>
    </div>
  );
}
