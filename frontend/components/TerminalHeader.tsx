"use client";
import { useState, useEffect } from "react";
import { Activity, Zap } from "lucide-react";
import { SearchBar } from "./SearchBar";

const TICKER_DATA = [
  { symbol: "NIFTY 50", price: "24,850.40", change: "+112.30", pct: "+0.45%", isUp: true },
  { symbol: "SENSEX", price: "81,320.10", change: "+308.50", pct: "+0.38%", isUp: true },
  { symbol: "BANK NIFTY", price: "51,240.80", change: "+315.20", pct: "+0.62%", isUp: true },
  { symbol: "NIFTY IT", price: "42,150.90", change: "+680.40", pct: "+1.64%", isUp: true },
  { symbol: "GOLD MCX", price: "₹1,60,450", change: "+1,350", pct: "+0.85%", isUp: true },
  { symbol: "SILVER MCX", price: "₹1,95,800", change: "+2,300", pct: "+1.20%", isUp: true },
  { symbol: "USD / INR", price: "83.92", change: "-0.04", pct: "-0.05%", isUp: false },
  { symbol: "BRENT CRUDE", price: "$78.40", change: "-0.65", pct: "-0.82%", isUp: false },
];

export function TerminalHeader() {
  return (
    <header
      style={{
        background: "#080a0f",
        borderBottom: "1px solid #1e293b",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        position: "relative",
        zIndex: 20,
      }}
    >
      {/* Top Live Ticker Marquee Bar */}
      <div
        style={{
          height: 28,
          background: "#000000",
          borderBottom: "1px solid #1e293b",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Fixed LIVE Badge on the left */}
        <div
          style={{
            height: "100%",
            padding: "0 14px",
            background: "rgba(0, 230, 118, 0.12)",
            borderRight: "1px solid rgba(0, 230, 118, 0.3)",
            display: "flex",
            alignItems: "center",
            gap: 6,
            zIndex: 10,
            flexShrink: 0,
          }}
        >
          <span className="live-dot" style={{ backgroundColor: "#00e676", boxShadow: "0 0 8px #00e676" }} />
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.58rem",
              fontWeight: 800,
              letterSpacing: "0.15em",
              color: "#00e676",
            }}
          >
            LIVE PULSE
          </span>
        </div>

        {/* Marquee Container cleanly positioned next to badge */}
        <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
          <div className="animate-marquee" style={{ alignItems: "center" }}>
            {[...TICKER_DATA, ...TICKER_DATA].map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "0 20px",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.62rem",
                  borderRight: "1px solid #1e293b",
                  whiteSpace: "nowrap",
                }}
              >
                <span style={{ color: "#94a3b8", fontWeight: 600 }}>{item.symbol}:</span>
                <span style={{ color: "#f8fafc", fontWeight: 700 }}>{item.price}</span>
                <span
                  style={{
                    color: item.isUp ? "#00e676" : "#ff2a5f",
                    fontWeight: 700,
                  }}
                >
                  {item.pct}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div
        style={{
          height: 48,
          padding: "0 16px",
          display: "flex",
          alignItems: "center",
          gap: 16,
          background: "#090d16",
        }}
      >
        {/* Terminal Title */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: 6,
              background: "linear-gradient(135deg, #00e676 0%, #0284c7 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 12px rgba(0, 230, 118, 0.35)",
            }}
          >
            <Activity size={15} color="#000" />
          </div>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              fontWeight: 800,
              letterSpacing: "0.2em",
              color: "#ffffff",
            }}
          >
            ALPHA TERMINAL
          </span>
        </div>

        {/* Search Bar Container */}
        <div style={{ flex: 1, maxWidth: 500 }}>
          <SearchBar compact />
        </div>

        {/* Right System Info */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginLeft: "auto", flexShrink: 0 }}>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.58rem",
              color: "#00e676",
              background: "rgba(0, 230, 118, 0.08)",
              border: "1px solid rgba(0, 230, 118, 0.3)",
              padding: "3px 10px",
              borderRadius: 4,
              letterSpacing: "0.1em",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Zap size={11} color="#00e676" />
            <span>NSE · BSE · SCREENER</span>
          </div>
        </div>
      </div>
    </header>
  );
}
