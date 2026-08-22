"use client";
import { useEffect, useState } from "react";
import { getStockStatements } from "@/lib/api";
import { SourceChip } from "./SourceChip";
import { DataUnavailable } from "./DataUnavailable";

interface Props {
  symbol: string;
}

type StatementType = "PNL" | "BALANCE_SHEET" | "CASH_FLOW" | "QUARTERLY";

const STATEMENT_TABS: { id: StatementType; label: string }[] = [
  { id: "PNL",           label: "PROFIT & LOSS" },
  { id: "BALANCE_SHEET", label: "BALANCE SHEET" },
  { id: "CASH_FLOW",     label: "CASH FLOW" },
  { id: "QUARTERLY",     label: "QUARTERLY RESULTS" },
];

export function FinancialStatements({ symbol }: Props) {
  const [activeTab, setActiveTab] = useState<StatementType>("PNL");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getStockStatements(symbol)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [symbol]);

  const currentSec =
    activeTab === "PNL"
      ? data?.pnl
      : activeTab === "BALANCE_SHEET"
      ? data?.balance_sheet
      : activeTab === "CASH_FLOW"
      ? data?.cash_flow
      : data?.quarterly;

  return (
    <div style={{ background: "var(--bg-panel)", border: "1px solid var(--border-glow)" }}>
      <div className="section-header">
        <span className="terminal-heading">FINANCIAL STATEMENTS — {symbol}</span>
      </div>

      {/* Statement type tabs */}
      <div
        style={{
          display: "flex",
          gap: 0,
          borderBottom: "1px solid var(--border-subtle)",
          background: "var(--bg-surface)",
        }}
      >
        {STATEMENT_TABS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            style={{
              fontFamily: "var(--text-mono)",
              fontSize: "0.62rem",
              letterSpacing: "0.12em",
              padding: "9px 16px",
              border: "none",
              cursor: "pointer",
              background: "transparent",
              color: activeTab === id ? "var(--purple)" : "var(--text-muted)",
              borderBottom: `2px solid ${activeTab === id ? "var(--purple)" : "transparent"}`,
              transition: "color 0.15s, border-color 0.15s",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ padding: 16 }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 32, marginBottom: 4 }} />
          ))}
        </div>
      ) : !currentSec || !currentSec.rows || currentSec.rows.length === 0 ? (
        <DataUnavailable message="FINANCIAL STATEMENT DATA UNAVAILABLE" />
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table className="terminal-table">
            <thead>
              <tr>
                <th style={{ textAlign: "left", minWidth: 200 }}>METRIC (₹ CR)</th>
                {(currentSec.periods || []).map((p: string) => (
                  <th key={p} style={{ textAlign: "right", minWidth: 100 }}>
                    {p}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentSec.rows.map((row: any, idx: number) => {
                const isHighlight =
                  row.metric.includes("Operating Profit") ||
                  row.metric.includes("Net Profit") ||
                  row.metric.includes("Total Assets") ||
                  row.metric.includes("Net Cash Flow");
                return (
                  <tr
                    key={idx}
                    style={{
                      background: isHighlight ? "rgba(124,77,255,0.06)" : "transparent",
                      borderBottom: "1px solid var(--border-subtle)",
                    }}
                  >
                    <td
                      style={{
                        textAlign: "left",
                        fontFamily: "var(--text-mono)",
                        fontSize: "0.72rem",
                        fontWeight: isHighlight ? 700 : 500,
                        color: isHighlight ? "var(--purple)" : "var(--text-primary)",
                      }}
                    >
                      {row.metric}
                    </td>
                    {(row.values || []).map((val: string, i: number) => (
                      <td
                        key={i}
                        className="value-mono"
                        style={{
                          textAlign: "right",
                          fontSize: "0.75rem",
                          fontWeight: isHighlight ? 700 : 400,
                          color: val.startsWith("-")
                            ? "var(--red)"
                            : isHighlight
                            ? "var(--text-primary)"
                            : "var(--text-secondary)",
                        }}
                      >
                        {val}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ padding: "6px 16px" }}>
        <SourceChip source={data?.source ?? "Screener.in (Scraped Financial Statements)"} />
      </div>
    </div>
  );
}
