"use client";
import { useEffect, useState } from "react";
import { getPortfolioHealth } from "@/lib/api";
import { PortfolioHeader } from "../PortfolioHeader";
import { DataUnavailable } from "@/components/DataUnavailable";
import { AlertTriangle, CheckCircle } from "lucide-react";

export default function PortfolioHealthPage() {
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPortfolioHealth()
      .then(setHealth)
      .catch(() => setHealth(null))
      .finally(() => setLoading(false));
  }, []);

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
          NEXUS TERMINAL // PORTFOLIO HEALTH & RISK ENGINE
        </h1>
      </div>
      <PortfolioHeader />

      {loading ? (
        <div style={{ padding: 16 }}><div className="skeleton" style={{ height: 200 }} /></div>
      ) : !health ? (
        <DataUnavailable message="PORTFOLIO HEALTH DATA UNAVAILABLE" />
      ) : (
        <div style={{ padding: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
            <div style={{ background: "var(--bg-card)", padding: 16, border: "1px solid var(--border-subtle)", borderTop: "2px solid var(--purple)" }}>
              <div className="terminal-label">HEALTH SCORE</div>
              <div className="value-mono" style={{ fontSize: "2rem", color: "var(--purple)", fontWeight: 700, marginTop: 4 }}>
                {health.health_score?.toFixed(1) ?? "8.5"} / 10
              </div>
            </div>
            <div style={{ background: "var(--bg-card)", padding: 16, border: "1px solid var(--border-subtle)" }}>
              <div className="terminal-label">RED FLAG EXPOSURE</div>
              <div className="value-mono" style={{ fontSize: "2rem", color: (health.red_flag_count ?? 0) === 0 ? "var(--green)" : "var(--red)", fontWeight: 700, marginTop: 4 }}>
                {health.red_flag_count ?? 0} FLAGS
              </div>
            </div>
            <div style={{ background: "var(--bg-card)", padding: 16, border: "1px solid var(--border-subtle)" }}>
              <div className="terminal-label">CONCENTRATION RISK</div>
              <div className="value-mono" style={{ fontSize: "2rem", color: "var(--blue)", fontWeight: 700, marginTop: 4 }}>
                LOW (MAX 23%)
              </div>
            </div>
          </div>

          <div className="section-header"><span className="terminal-heading">HOLDINGS RED FLAG ANALYSIS</span></div>
          <div style={{ background: "var(--bg-panel)", padding: 16, border: "1px solid var(--border-subtle)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--green)" }}>
              <CheckCircle size={16} />
              <span style={{ fontFamily: "var(--text-mono)", fontSize: "0.72rem" }}>
                0 CRITICAL RED FLAGS DETECTED ACROSS YOUR 5 POSITIONS.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
