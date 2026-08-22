"use client";
import { useEffect, useRef } from "react";
import {
  createChart,
  CandlestickSeries,
  LineSeries,
  HistogramSeries,
  ColorType,
  CrosshairMode,
  IChartApi,
} from "lightweight-charts";
import type { Candle } from "@/lib/types";

interface Props {
  candles: Candle[];
  sma20?: (number | null)[];
  sma50?: (number | null)[];
  sma200?: (number | null)[];
  chartType?: "CANDLE" | "LINE";
  height?: number;
}

export function TradingViewChart({
  candles,
  sma20,
  sma50,
  sma200,
  chartType = "CANDLE",
  height = 340,
}: Props) {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current || candles.length === 0) return;

    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
    }

    const container = chartContainerRef.current;

    const chart = createChart(container, {
      width: container.clientWidth,
      height: height,
      layout: {
        background: { type: ColorType.Solid, color: "#040610" },
        textColor: "#8fa3c8",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 11,
      },
      grid: {
        vertLines: { color: "rgba(99, 120, 180, 0.08)", style: 1 },
        horzLines: { color: "rgba(99, 120, 180, 0.08)", style: 1 },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: { color: "rgba(120, 80, 255, 0.4)", width: 1, style: 2 },
        horzLine: { color: "rgba(120, 80, 255, 0.4)", width: 1, style: 2 },
      },
      rightPriceScale: {
        borderColor: "rgba(99, 120, 180, 0.2)",
        scaleMargins: { top: 0.1, bottom: 0.25 },
      },
      timeScale: {
        borderColor: "rgba(99, 120, 180, 0.2)",
        timeVisible: true,
        secondsVisible: false,
      },
    });

    chartRef.current = chart;

    const formattedCandles = candles
      .filter((c) => c.date && c.close != null)
      .map((c) => ({
        time: c.date,
        open: c.open ?? c.close!,
        high: c.high ?? c.close!,
        low: c.low ?? c.close!,
        close: c.close!,
      }));

    if (chartType === "CANDLE") {
      const candlestickSeries = chart.addSeries(CandlestickSeries, {
        upColor: "#00e676",
        downColor: "#ff3d57",
        borderVisible: false,
        wickUpColor: "#00e676",
        wickDownColor: "#ff3d57",
      });
      candlestickSeries.setData(formattedCandles as any);
    } else {
      const lineSeries = chart.addSeries(LineSeries, {
        color: "#4fc3f7",
        lineWidth: 2,
      });
      const lineData = formattedCandles.map((c) => ({ time: c.time, value: c.close }));
      lineSeries.setData(lineData as any);
    }

    // Volume histogram - tucked at bottom 18% of chart
    const volumeSeries = chart.addSeries(HistogramSeries, {
      color: "rgba(99, 120, 180, 0.25)",
      priceFormat: { type: "volume" },
      priceScaleId: "volume",
    });

    volumeSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.82,
        bottom: 0,
      },
    });

    const volumeData = candles
      .filter((c) => c.date && c.close != null)
      .map((c) => ({
        time: c.date,
        value: c.volume ?? 0,
        color: (c.close ?? 0) >= (c.open ?? 0) ? "rgba(0, 230, 118, 0.25)" : "rgba(255, 61, 87, 0.25)",
      }));

    volumeSeries.setData(volumeData as any);

    // Moving Averages
    if (sma20 && sma20.length === candles.length) {
      const ma20Series = chart.addSeries(LineSeries, { color: "#ffd740", lineWidth: 1 });
      const ma20Data = candles
        .map((c, i) => (sma20[i] != null ? { time: c.date, value: sma20[i]! } : null))
        .filter((d): d is { time: string; value: number } => d !== null);
      ma20Series.setData(ma20Data as any);
    }

    if (sma50 && sma50.length === candles.length) {
      const ma50Series = chart.addSeries(LineSeries, { color: "#4fc3f7", lineWidth: 1 });
      const ma50Data = candles
        .map((c, i) => (sma50[i] != null ? { time: c.date, value: sma50[i]! } : null))
        .filter((d): d is { time: string; value: number } => d !== null);
      ma50Series.setData(ma50Data as any);
    }

    if (sma200 && sma200.length === candles.length) {
      const ma200Series = chart.addSeries(LineSeries, { color: "#ce93d8", lineWidth: 1 });
      const ma200Data = candles
        .map((c, i) => (sma200[i] != null ? { time: c.date, value: sma200[i]! } : null))
        .filter((d): d is { time: string; value: number } => d !== null);
      ma200Series.setData(ma200Data as any);
    }

    chart.timeScale().fitContent();

    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [candles, chartType, height, sma20, sma50, sma200]);

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <div ref={chartContainerRef} style={{ width: "100%", height }} />
      <div
        style={{
          position: "absolute",
          top: 8,
          right: 12,
          fontFamily: "var(--text-mono)",
          fontSize: "0.55rem",
          color: "var(--text-muted)",
          background: "rgba(4,6,16,0.8)",
          padding: "2px 6px",
          borderRadius: 1,
          pointerEvents: "none",
        }}
      >
        TRADINGVIEW LIGHTWEIGHT CHARTS
      </div>
    </div>
  );
}
