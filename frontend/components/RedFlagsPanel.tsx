"use client";
import { useEffect, useState } from "react";
import { getStockRedFlags } from "@/lib/api";
import type { RedFlagResult } from "@/lib/types";
import { DataUnavailable } from "./DataUnavailable";

interface Props { symbol: string; }

export function RedFlagsPanel({ symbol }: Props) {
  const [flags, setFlags] = useState<RedFlagResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStockRedFlags(symbol)
      .then((d) => setFlags(d.flags || []))
      .catch(() => setFlags([]))
      .finally(() => setLoading(false));
  }, [symbol]);

  const statusColor: Record<string, string> = {
    PASS: "var(--green)",
    FAIL: "var(--red)",
    WARN: "var(--amber)",
    NA: "var(--text-muted)",
  };

  return (
    <div style={{ background: "var(--bg-panel)", border: "1px solid var(--border-glow)" }}>
      {/* Header matching Video 1 Frame 016 */}
      <div className="section-header">
        <span className="terminal-heading">RED FLAGS = RULES ENGINE</span>
      </div>

      {loading ? (
        <div style={{ padding: 16 }}>
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 48, marginBottom: 4 }} />
          ))}
        </div>
      ) : flags.length === 0 ? (
        <DataUnavailable message="RED FLAG DATA UNAVAILABLE" />
      ) : (
        <div style={{ padding: "8px 0" }}>
          {flags.map((flag) => {
            const color = statusColor[flag.status] || "var(--text-muted)";
            return (
              <div
                key={flag.rule_id}
                style={{
                  display: "flex",
                  gap: 16,
                  alignItems: "flex-start",
                  padding: "10px 16px",
                  borderBottom: "1px solid var(--border-subtle)",
                }}
              >
                {/* Status Column */}
                <div style={{ minWidth: 48, textAlign: "left" }}>
                  <div
                    style={{
                      fontFamily: "var(--text-mono)",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color,
                      letterSpacing: "0.1em",
                      textShadow: flag.status === "PASS" ? "0 0 6px rgba(0,230,118,0.4)" : flag.status === "FAIL" ? "0 0 6px rgba(255,61,87,0.4)" : "none",
                    }}
                  >
                    {flag.status}
                  </div>
                </div>

                {/* Rule Content Column */}
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontFamily: "var(--text-mono)",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      letterSpacing: "0.05em",
                      marginBottom: 2,
                    }}
                  >
                    {flag.rule_name}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--text-mono)",
                      fontSize: "0.68rem",
                      color: "var(--text-secondary)",
                      lineHeight: 1.5,
                    }}
                  >
                    {flag.explanation}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer matching Video 1 Frame 016 */}
      <div
        style={{
          padding: "6px 16px",
          background: "rgba(4,6,16,0.8)",
          borderTop: "1px solid var(--border-subtle)",
          fontFamily: "var(--text-mono)",
          fontSize: "0.58rem",
          color: "var(--text-muted)",
          letterSpacing: "0.08em",
        }}
      >
        DETERMINISTIC RULES ENGINE ACTIVE
      </div>
    </div>
  );
}
