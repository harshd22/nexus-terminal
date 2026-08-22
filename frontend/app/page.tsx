"use client";
import { useEffect, useState } from "react";
import { MarketOverview } from "@/components/MarketOverview";
import { MarketConstellation } from "@/components/MarketConstellation";
import { TopGainersMovers } from "@/components/TopGainersMovers";
import { TopPerformers } from "@/components/TopPerformers";
import { StockScans } from "@/components/StockScans";
import { AdvanceDeclineChart } from "@/components/AdvanceDeclineChart";
import { TerminalLog, useTerminalLog } from "@/components/TerminalLog";

const LOG_MESSAGES = [
  "> CONNECTING TO NEXUS ENGINE (2,555 NSE EQUITIES)",
  "> INGESTING LIVE NSE MARKET QUOTES",
  "> COMPUTING ADVANCE / DECLINE MARKET BREADTH",
  "> RUNNING TECHNICAL BREAKOUT SCANS (52W ATH, VOLUME SURGE)",
  "> POPULATING TOP 20 MOVERS & CATEGORY RANKINGS",
  "> READY",
];

export default function MarketPulsePage() {
  const { steps, complete } = useTerminalLog(LOG_MESSAGES, true);

  return (
    <div style={{ background: "var(--bg-base)", minHeight: "100vh", paddingBottom: 40 }}>
      {/* Stream loading log */}
      {!complete && (
        <div style={{ padding: 16, borderBottom: "1px solid var(--border-subtle)" }}>
          <div className="terminal-label" style={{ marginBottom: 8 }}>NEXUS TERMINAL ENGINE STARTUP</div>
          <TerminalLog steps={steps} />
        </div>
      )}

      {/* Main Grid Layout */}
      <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Top Indices Strip */}
        <MarketOverview />

        {/* Constellation Canvas & Advance/Decline Row */}
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 16 }}>
          <MarketConstellation />
          <AdvanceDeclineChart />
        </div>

        {/* Top 20 Gainers & Losers */}
        <TopGainersMovers />

        {/* Technical Pattern Scans (Chartink / StockScans) */}
        <StockScans />

        {/* Top 20 Category Ranker */}
        <TopPerformers />
      </div>
    </div>
  );
}
