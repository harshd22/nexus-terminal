"use client";
import { useEffect, useState, useCallback } from "react";
import { getStockPrices } from "@/lib/api";
import type { PriceData } from "@/lib/types";
import { TradingViewChart } from "./TradingViewChart";
import { DataUnavailable } from "./DataUnavailable";

const RANGES = ["1M", "6M", "1Y", "3Y", "5Y", "MAX"] as const;
type Range = (typeof RANGES)[number];
type ChartType = "CANDLE" | "LINE";

interface MAToggle {
  dma20: boolean;
  dma50: boolean;
  dma200: boolean;
}

function fmt(v: number | null, dec = 2) {
  return v == null ? "—" : v.toLocaleString("en-IN", { minimumFractionDigits: dec, maximumFractionDigits: dec });
}

interface Props {
  symbol: string;
}

export function PriceChart({ symbol }: Props) {
  const [range, setRange] = useState<Range>("1Y");
  const [chartType, setChartType] = useState<ChartType>("CANDLE");
  const [ma, setMa] = useState<MAToggle>({ dma20: true, dma50: true, dma200: true });
  const [priceData, setPriceData] = useState<PriceData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getStockPrices(symbol, range);
      setPriceData(data);
    } catch {
      setPriceData(null);
    } finally {
      setLoading(false);
    }
  }, [symbol, range]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const t = priceData?.technicals;
  const current = t?.current_price;
  const high52w = t?.high_52w;
  const low52w  = t?.low_52w;
  const ath     = t?.ath;
  const distAth = t?.distance_from_ath_pct;

  const toggleMa = (key: keyof MAToggle) => setMa((prev) => ({ ...prev, [key]: !prev[key] }));

  const MA_CONFIG = [
    { key: "dma20",  label: "20 DMA",  color: "#ffd740" },
    { key: "dma50",  label: "50 DMA",  color: "#4fc3f7" },
    { key: "dma200", label: "200 DMA", color: "#ce93d8" },
  ] as const;

  return (
    <div style={{ background: "var(--bg-panel)", border: "1px solid var(--border-glow)" }}>
      <div className="section-header">
        <span className="terminal-heading">NEXUS OHLCV TECHNICAL CHART — NSE:{symbol}</span>
      </div>

      {/* Key Stats Strip */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          padding: "10px 16px",
          gap: 12,
          background: "var(--bg-card)",
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        {[
          { label: "CURRENT PRICE", value: fmt(current ?? null), color: "var(--text-primary)" },
          { label: "52W HIGH",      value: fmt(high52w ?? null), color: "var(--green)" },
          { label: "52W LOW",       value: fmt(low52w ?? null),  color: "var(--red)" },
          { label: "ALL TIME HIGH", value: fmt(ath ?? null),     color: "var(--blue)" },
          { label: "FROM ATH %",    value: distAth != null ? `${distAth > 0 ? "+" : ""}${distAth}%` : "—", color: (distAth ?? 0) >= 0 ? "var(--green)" : "var(--red)" },
          { label: "1Y CAGR",       value: t?.return_1y_cagr != null ? `${t.return_1y_cagr > 0 ? "+" : ""}${t.return_1y_cagr}%` : "—", color: (t?.return_1y_cagr ?? 0) >= 0 ? "var(--green)" : "var(--red)" },
        ].map(({ label, value, color }) => (
          <div key={label}>
            <div className="terminal-label">{label}</div>
            <div className="value-mono" style={{ fontSize: "0.9rem", color, fontWeight: 700, lineHeight: 1.2, marginTop: 2 }}>
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* Controls Bar */}
      <div
        style={{
          display: "flex",
          gap: 12,
          padding: "8px 16px",
          alignItems: "center",
          background: "var(--bg-surface)",
          borderBottom: "1px solid var(--border-subtle)",
          flexWrap: "wrap",
        }}
      >
        {/* Time range selectors */}
        <div style={{ display: "flex", gap: 2 }}>
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.62rem",
                padding: "4px 8px",
                border: "1px solid",
                borderColor: range === r ? "var(--purple)" : "var(--border-subtle)",
                background: range === r ? "rgba(157,78,221,0.18)" : "transparent",
                color: range === r ? "var(--purple)" : "var(--text-muted)",
                cursor: "pointer",
                borderRadius: 1,
                fontWeight: range === r ? 700 : 500,
              }}
            >
              {r}
            </button>
          ))}
        </div>

        <div style={{ width: 1, height: 16, background: "var(--border-subtle)" }} />

        {/* Chart type selectors */}
        {(["CANDLE", "LINE"] as ChartType[]).map((ct) => (
          <button
            key={ct}
            onClick={() => setChartType(ct)}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.62rem",
              padding: "4px 8px",
              border: "1px solid",
              borderColor: chartType === ct ? "var(--cyan)" : "var(--border-subtle)",
              background: chartType === ct ? "rgba(0,229,255,0.15)" : "transparent",
              color: chartType === ct ? "var(--cyan)" : "var(--text-muted)",
              cursor: "pointer",
              borderRadius: 1,
              fontWeight: chartType === ct ? 700 : 500,
            }}
          >
            {ct === "CANDLE" ? "CANDLESTICK" : "LINE"}
          </button>
        ))}

        <div style={{ width: 1, height: 16, background: "var(--border-subtle)" }} />

        {/* Moving Average Toggles */}
        {MA_CONFIG.map(({ key, label, color }) => (
          <button
            key={key}
            onClick={() => toggleMa(key)}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.6rem",
              padding: "4px 8px",
              border: "1px solid",
              borderColor: ma[key] ? color : "var(--border-subtle)",
              background: ma[key] ? `${color}20` : "transparent",
              color: ma[key] ? color : "var(--text-muted)",
              cursor: "pointer",
              borderRadius: 1,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Canvas Chart Engine */}
      <div style={{ padding: "4px 0" }}>
        {loading ? (
          <div className="skeleton" style={{ height: 400, margin: "0 16px" }} />
        ) : !priceData || (priceData.candles ?? []).length === 0 ? (
          <DataUnavailable message="PRICE DATA LOADING..." height={400} />
        ) : (
          <TradingViewChart
            candles={priceData.candles}
            sma20={ma.dma20 ? priceData.technicals?.sma_20_series : undefined}
            sma50={ma.dma50 ? priceData.technicals?.sma_50_series : undefined}
            sma200={ma.dma200 ? priceData.technicals?.sma_200_series : undefined}
            chartType={chartType}
            height={400}
          />
        )}
      </div>
    </div>
  );
}
