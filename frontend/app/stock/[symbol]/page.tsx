"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getStock, getStockConsensus, getStockFundamentals, getKeyRatios } from "@/lib/api";
import { TerminalLog, useTerminalLog } from "@/components/TerminalLog";
import { PriceChart } from "@/components/PriceChart";
import { KeyRatiosGrid } from "@/components/KeyRatiosGrid";
import { ShareholdingChart } from "@/components/ShareholdingChart";
import { RedFlagsPanel } from "@/components/RedFlagsPanel";
import { ScoreCard } from "@/components/ScoreCard";
import { ThreeFStructure } from "@/components/ThreeFStructure";
import { FinancialStatements } from "@/components/FinancialStatements";
import { ConcallGuidance } from "@/components/ConcallGuidance";
import { DataUnavailable } from "@/components/DataUnavailable";
import { ConsensusView } from "@/components/ConsensusView";

const LOG_MESSAGES = [
  "> INITIALIZING NEXUS ENGINE",
  "> RESOLVING NSE SYMBOL",
  "> LOADING OHLCV TECHNICAL CHART ENGINE",
  "> FETCHING DYNAMIC STOCK KEY FINANCIAL RATIOS (27 METRICS)",
  "> FETCHING FINANCIAL STATEMENTS (P&L, BALANCE SHEET, CASH FLOW)",
  "> FETCHING ANALYST CONSENSUS TARGETS & BROKER REPORTS",
  "> FETCHING SHAREHOLDING PATTERN",
  "> INGESTING LIVE MARKET NEWS",
  "> CALCULATING TECHNICALS: 20/50/100/200 DMA",
  "> RUNNING RED FLAGS RULES ENGINE (7 RULES)",
  "> BUILDING SCORECARD",
  "> READY",
];

type Tab = "OVERVIEW" | "CONSENSUS" | "STATEMENTS" | "3F_STRUCTURE" | "RED_FLAGS" | "CONCALL" | "SHAREHOLDING" | "SCORECARD" | "NEWS";

const TABS: { id: Tab; label: string }[] = [
  { id: "OVERVIEW", label: "OVERVIEW & RATIOS" },
  { id: "CONSENSUS", label: "CONSENSUS & REPORTS" },
  { id: "STATEMENTS", label: "FINANCIAL STATEMENTS" },
  { id: "3F_STRUCTURE", label: "3F STRUCTURE" },
  { id: "RED_FLAGS", label: "RED FLAGS" },
  { id: "CONCALL", label: "CONCALL & GUIDANCE" },
  { id: "SHAREHOLDING", label: "SHAREHOLDING" },
  { id: "SCORECARD", label: "SCORECARD" },
  { id: "NEWS", label: "NEWS" },
];

export default function StockPage() {
  const params = useParams();
  const symbol = (params?.symbol as string)?.toUpperCase() ?? "RELIANCE";
  const [stock, setStock] = useState<any>(null);
  const [keyRatiosData, setKeyRatiosData] = useState<any>(null);
  const [notFound, setNotFound] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("OVERVIEW");
  const { steps, complete } = useTerminalLog(LOG_MESSAGES, true);

  useEffect(() => {
    if (!symbol) return;
    getStock(symbol)
      .then(setStock)
      .catch(() => setNotFound(true));

    getKeyRatios(symbol)
      .then(setKeyRatiosData)
      .catch(() => setKeyRatiosData(null));
  }, [symbol]);

  if (notFound) {
    return (
      <div style={{ padding: 24 }}>
        <div className="terminal-heading" style={{ marginBottom: 12 }}>SYMBOL NOT FOUND</div>
        <DataUnavailable message={`STOCK '${symbol}' NOT IN UNIVERSE — CHECK NSE SYMBOL`} height={120} />
      </div>
    );
  }

  return (
    <div style={{ background: "#000000", minHeight: "100vh" }}>
      {/* Terminal loading stream */}
      {!complete && (
        <div style={{ padding: 16, borderBottom: "1px solid #1e293b" }}>
          <div className="terminal-label" style={{ marginBottom: 8 }}>NEXUS ENGINE LOADING — {symbol}</div>
          <TerminalLog steps={steps} />
        </div>
      )}

      {/* Stock header */}
      {stock && (
        <div
          style={{
            padding: "14px 20px",
            background: "#090d16",
            borderBottom: "1px solid #1e293b",
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: 20 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <h1
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "1.3rem",
                    fontWeight: 800,
                    color: "#ffffff",
                    margin: 0,
                  }}
                >
                  {symbol}
                </h1>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.6rem",
                    background: "rgba(0, 230, 118, 0.12)",
                    border: "1px solid rgba(0, 230, 118, 0.3)",
                    color: "#00e676",
                    padding: "2px 8px",
                    borderRadius: 3,
                    fontWeight: 800,
                  }}
                >
                  NSE:{symbol}
                </span>
              </div>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.85rem", color: "#94a3b8", marginBottom: 4 }}>
                {stock.name}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                {stock.sector && (
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "#00e676", fontWeight: 700 }}>
                    {stock.sector}
                  </span>
                )}
                {stock.industry && (
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "#64748b" }}>
                    · {stock.industry}
                  </span>
                )}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.65rem",
                  color: "#00e676",
                  letterSpacing: "0.15em",
                  fontWeight: 800,
                }}
              >
                ALPHA FINANCIAL RESEARCH TERMINAL
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab navigation */}
      <div
        style={{
          display: "flex",
          gap: 0,
          borderBottom: "1px solid #1e293b",
          background: "#080a12",
          overflowX: "auto",
        }}
      >
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.65rem",
              letterSpacing: "0.12em",
              padding: "10px 16px",
              border: "none",
              cursor: "pointer",
              background: "transparent",
              color: activeTab === id ? "#ffffff" : "#64748b",
              borderBottom: `3px solid ${activeTab === id ? "#00e676" : "transparent"}`,
              fontWeight: activeTab === id ? 800 : 500,
              whiteSpace: "nowrap",
              transition: "all 0.15s ease",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ padding: 16 }}>
        {activeTab === "OVERVIEW" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Dynamic Stock-Specific Screener 27 Key Ratios Grid */}
            <KeyRatiosGrid ratios={keyRatiosData} />

            {/* OHLCV Technical Chart */}
            <PriceChart symbol={symbol} />
          </div>
        )}
        {activeTab === "CONSENSUS" && <StockConsensusTab symbol={symbol} />}
        {activeTab === "STATEMENTS" && <FinancialStatements symbol={symbol} />}
        {activeTab === "3F_STRUCTURE" && <ThreeFStructure symbol={symbol} />}
        {activeTab === "RED_FLAGS" && <RedFlagsPanel symbol={symbol} />}
        {activeTab === "CONCALL" && <ConcallGuidance symbol={symbol} />}
        {activeTab === "SHAREHOLDING" && <ShareholdingChart symbol={symbol} />}
        {activeTab === "SCORECARD" && <ScoreCard symbol={symbol} />}
        {activeTab === "NEWS" && <NewsTab symbol={symbol} />}
      </div>
    </div>
  );
}

/* ─── Consensus Tab Component ─── */
function StockConsensusTab({ symbol }: { symbol: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getStockConsensus(symbol)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [symbol]);

  if (loading) return <div className="skeleton" style={{ height: 320, borderRadius: 8 }} />;
  if (!data) return <DataUnavailable message={`CONSENSUS DATA UNAVAILABLE FOR ${symbol}`} height={160} />;

  return <ConsensusView data={data} />;
}

function NewsTab({ symbol }: { symbol: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import("@/lib/api").then(({ getStockNews }) =>
      getStockNews(symbol)
        .then(setData)
        .catch(() => setData(null))
        .finally(() => setLoading(false))
    );
  }, [symbol]);

  const stockNews = data?.stock_news || data?.articles || [];
  const sectorNews = data?.sector_news || [];

  return (
    <div style={{ background: "#05070c", border: "1px solid #1e293b", borderRadius: 8, overflow: "hidden" }}>
      <div className="section-header" style={{ background: "#090d16", borderBottom: "1px solid #1e293b" }}>
        <span className="terminal-heading">EQUITY & SECTOR NEWS INTELLIGENCE — {symbol}</span>
      </div>

      {loading ? (
        <div style={{ padding: 16 }}>
          <div className="skeleton" style={{ height: 260 }} />
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "#1e293b" }}>
          {/* Stock-Specific News */}
          <div style={{ background: "#04050a", padding: 16 }}>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.7rem",
                fontWeight: 800,
                color: "#00e676",
                marginBottom: 12,
              }}
            >
              ● {symbol} COMPANY SPECIFIC NEWS & DISCLOSURES
            </div>
            {stockNews.length === 0 ? (
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "#64748b", padding: "12px 0" }}>
                NO DIRECT HEADLINES FOUND FOR {symbol} TODAY
              </div>
            ) : (
              stockNews.map((a: any) => (
                <div key={a.id} style={{ padding: "10px 0", borderBottom: "1px solid #1e293b" }}>
                  <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.78rem", color: "#ffffff", fontWeight: 500, lineHeight: 1.5 }}>
                    {a.headline}
                  </div>
                  <div style={{ display: "flex", gap: 10, marginTop: 4, fontFamily: "var(--font-mono)", fontSize: "0.6rem" }}>
                    <span style={{ color: a.sentiment === "POSITIVE" ? "#00e676" : a.sentiment === "NEGATIVE" ? "#ff2a5f" : "#94a3b8", fontWeight: 700 }}>
                      [{a.sentiment ?? "NEUTRAL"}]
                    </span>
                    <span style={{ color: "#64748b" }}>
                      {a.published_at ? new Date(a.published_at).toLocaleDateString("en-IN") : ""}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Sector & Industry News */}
          <div style={{ background: "#04050a", padding: 16 }}>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.7rem",
                fontWeight: 800,
                color: "#00e676",
                marginBottom: 12,
              }}
            >
              ● SECTOR & MARKET INDUSTRY INTELLIGENCE
            </div>
            {sectorNews.length === 0 ? (
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "#64748b", padding: "12px 0" }}>
                NO SECTOR HEADLINES AVAILABLE
              </div>
            ) : (
              sectorNews.map((a: any) => (
                <div key={a.id} style={{ padding: "10px 0", borderBottom: "1px solid #1e293b" }}>
                  <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.78rem", color: "#ffffff", fontWeight: 500, lineHeight: 1.5 }}>
                    {a.headline}
                  </div>
                  <div style={{ display: "flex", gap: 10, marginTop: 4, fontFamily: "var(--font-mono)", fontSize: "0.6rem" }}>
                    <span style={{ color: "#00e676", fontWeight: 700 }}>
                      [{a.category ?? "INDUSTRY"}]
                    </span>
                    <span style={{ color: "#64748b" }}>
                      {a.published_at ? new Date(a.published_at).toLocaleDateString("en-IN") : ""}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
