import type { Metadata } from "next";
import { SearchBar } from "@/components/SearchBar";

export const metadata: Metadata = {
  title: "NEXUS TERMINAL — Stock Search",
  description: "Search all listed companies on NSE and BSE.",
};

export default function StockSearchPage() {
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
          NEXUS TERMINAL // STOCK SEARCH & UNIVERSE
        </h1>
      </div>
      <div style={{ padding: 24, maxWidth: 640, margin: "0 auto" }}>
        <div className="terminal-label" style={{ marginBottom: 12 }}>SEARCH NSE + BSE UNIVERSE</div>
        <SearchBar autoFocus={true} />
        <div style={{ marginTop: 16, fontFamily: "var(--text-mono)", fontSize: "0.6rem", color: "var(--text-muted)", lineHeight: 1.8 }}>
          TRY POPULAR SYMBOLS:<br />
          RELIANCE · TCS · INFY · HDFCBANK · ICICIBANK · SBIN · BAJFINANCE · TATAMOTORS · WIPRO · ZOMATO
        </div>
      </div>
    </div>
  );
}
