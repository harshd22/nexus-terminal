"use client";
import { useEffect, useState } from "react";
import { getStockScore } from "@/lib/api";
import type { ScoreData } from "@/lib/types";
import { SourceChip } from "./SourceChip";
import { DataUnavailable } from "./DataUnavailable";

interface Props { symbol: string; }

const COMPONENT_COLORS: Record<string, string> = {
  valuation:       "var(--blue)",
  growth:          "var(--green)",
  financial_health:"var(--purple)",
  momentum:        "var(--amber)",
  sector_tailwind: "var(--chart-3)",
};

const COMPONENT_LABELS: Record<string, string> = {
  valuation:        "VALUATION",
  growth:           "GROWTH",
  financial_health: "FINANCIAL HEALTH",
  momentum:         "MOMENTUM",
  sector_tailwind:  "SECTOR TAILWIND",
};

function ScoreGauge({ score }: { score: number }) {
  const size = 120;
  const strokeW = 10;
  const radius = (size - strokeW) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference * (1 - score / 10);
  const scoreColor = score >= 7 ? "var(--green)" : score >= 5 ? "var(--amber)" : "var(--red)";

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="var(--bg-elevated)" strokeWidth={strokeW}
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={scoreColor} strokeWidth={strokeW}
          strokeDasharray={circumference}
          strokeDashoffset={progress}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
      </svg>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      }}>
        <div className="value-mono" style={{ fontSize: "1.6rem", fontWeight: 700, color: scoreColor, lineHeight: 1 }}>
          {score.toFixed(1)}
        </div>
        <div className="terminal-label" style={{ marginTop: 2 }}>/ 10</div>
      </div>
    </div>
  );
}

export function ScoreCard({ symbol }: Props) {
  const [scoreData, setScoreData] = useState<ScoreData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStockScore(symbol)
      .then((d) => setScoreData(d.score || null))
      .catch(() => setScoreData(null))
      .finally(() => setLoading(false));
  }, [symbol]);

  if (loading) return (
    <div>
      <div className="section-header"><span className="terminal-heading">SCORECARD</span></div>
      <div style={{ padding: 16 }}>
        <div className="skeleton" style={{ height: 120, marginBottom: 12 }} />
        <div className="skeleton" style={{ height: 80 }} />
      </div>
    </div>
  );

  if (!scoreData) return (
    <div>
      <div className="section-header"><span className="terminal-heading">SCORECARD</span></div>
      <DataUnavailable message="SCORE DATA UNAVAILABLE" />
    </div>
  );

  return (
    <div>
      <div className="section-header">
        <span className="terminal-heading">SCORECARD — NEXUS ANALYSIS / 10</span>
      </div>

      <div style={{ padding: "16px", display: "flex", gap: 24, alignItems: "flex-start" }}>
        {/* Circular gauge */}
        <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <ScoreGauge score={scoreData.total_score} />
          <div style={{ fontFamily: "var(--text-mono)", fontSize: "0.6rem", color: "var(--text-muted)", textAlign: "center" }}>
            BASE {scoreData.base_score.toFixed(1)} | PENALTY {scoreData.penalty.toFixed(1)}
          </div>
        </div>

        {/* Component breakdown */}
        <div style={{ flex: 1 }}>
          <div className="terminal-label" style={{ marginBottom: 8 }}>COMPONENT BREAKDOWN</div>
          {Object.entries(scoreData.components).map(([key, comp]) => {
            const color = COMPONENT_COLORS[key] || "var(--text-muted)";
            const barWidth = `${(comp.score / 10) * 100}%`;
            return (
              <div key={key} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                  <span style={{ fontFamily: "var(--text-mono)", fontSize: "0.62rem", color: "var(--text-secondary)" }}>
                    {COMPONENT_LABELS[key]} × {(comp.weight * 100).toFixed(0)}%
                  </span>
                  <div style={{ display: "flex", gap: 8 }}>
                    <span className="value-mono" style={{ fontSize: "0.7rem", color }}>
                      {comp.score.toFixed(1)}/10
                    </span>
                    <span className="value-mono" style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>
                      = {comp.contribution.toFixed(3)}
                    </span>
                  </div>
                </div>
                <div style={{ height: 3, background: "var(--bg-elevated)", borderRadius: 1 }}>
                  <div style={{ width: barWidth, height: "100%", background: color, borderRadius: 1, transition: "width 0.6s ease" }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Formula */}
      <div style={{ padding: "8px 16px 12px", borderTop: "1px solid var(--border-subtle)" }}>
        <div className="terminal-label" style={{ marginBottom: 4 }}>FORMULA</div>
        <pre style={{
          fontFamily: "var(--text-mono)", fontSize: "0.58rem", color: "var(--text-muted)",
          background: "var(--bg-card)", padding: "8px 10px", borderRadius: 1,
          whiteSpace: "pre-wrap", lineHeight: 1.8,
        }}>
          {scoreData.formula}
        </pre>

        {/* Penalties */}
        {scoreData.flag_penalties.length > 0 && (
          <div style={{ marginTop: 8 }}>
            <div className="terminal-label" style={{ marginBottom: 4 }}>PENALTIES APPLIED</div>
            {scoreData.flag_penalties.map((p) => (
              <div key={p.rule} style={{
                display: "flex", justifyContent: "space-between",
                fontFamily: "var(--text-mono)", fontSize: "0.62rem",
                color: p.status === "FAIL" ? "var(--red)" : "var(--amber)",
                padding: "2px 0",
              }}>
                <span>{p.rule}</span>
                <span>{p.penalty < 0 ? p.penalty : `+${p.penalty}`}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
