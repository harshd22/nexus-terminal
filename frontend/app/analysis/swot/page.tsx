"use client";
import { useEffect, useState } from "react";
import { getStockSWOT } from "@/lib/api";
import { DataUnavailable } from "@/components/DataUnavailable";

export default function AnalysisSWOTPage() {
  const [swot, setSwot] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStockSWOT("RELIANCE")
      .then((d) => setSwot(d.swot))
      .catch(() => setSwot(null))
      .finally(() => setLoading(false));
  }, []);

  const QUADRANTS = [
    { key: "strengths",    label: "STRENGTHS",    color: "var(--green)" },
    { key: "weaknesses",   label: "WEAKNESSES",   color: "var(--red)" },
    { key: "opportunities",label: "OPPORTUNITIES",color: "var(--blue)" },
    { key: "threats",      label: "THREATS",      color: "var(--amber)" },
  ];

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
          NEXUS TERMINAL // SWOT ANALYSIS ENGINE — RELIANCE
        </h1>
      </div>

      {loading ? (
        <div style={{ padding: 16 }}><div className="skeleton" style={{ height: 300 }} /></div>
      ) : !swot ? (
        <DataUnavailable message="AI SWOT ANALYSIS UNAVAILABLE — CHECK OLLAMA LOCAL AI CONFIGURATION" height={200} />
      ) : (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, padding: 1, background: "var(--border-subtle)" }}>
            {QUADRANTS.map(({ key, label, color }) => (
              <div key={key} style={{ background: "var(--bg-panel)", padding: 16 }}>
                <div className="terminal-label" style={{ color, marginBottom: 12 }}>{label}</div>
                <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                  {(swot[key] || []).map((point: string, i: number) => (
                    <li key={i} style={{
                      fontFamily: "var(--text-sans)", fontSize: "0.75rem",
                      color: "var(--text-secondary)", lineHeight: 1.6,
                      padding: "6px 0", borderBottom: "1px solid var(--border-subtle)",
                      paddingLeft: 10, borderLeft: `2px solid ${color}`, marginBottom: 6,
                    }}>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
