"use client";
import { useState } from "react";
import { postStockDebate } from "@/lib/api";

export default function AnalysisDebatePage() {
  const [debate, setDebate] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);

  const start = async () => {
    setLoading(true);
    setStarted(true);
    try {
      const d = await postStockDebate("RELIANCE");
      setDebate(d.debate);
    } finally {
      setLoading(false);
    }
  };

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
          NEXUS TERMINAL // BULL vs BEAR AI DEBATE ARENA — RELIANCE
        </h1>
      </div>

      {!started && (
        <div style={{ padding: 32, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div style={{ fontFamily: "var(--text-mono)", fontSize: "0.75rem", color: "var(--text-muted)", textAlign: "center", maxWidth: 500, lineHeight: 1.8 }}>
            Two AI agents debate RELIANCE using identical evidence.<br />
            Bull builds the optimistic evidence-backed thesis.<br />
            Bear builds the skeptical evidence-backed thesis.<br />
            3 Rounds. Zero hallucinated figures.
          </div>
          <button
            onClick={start}
            style={{
              fontFamily: "var(--text-mono)", fontSize: "0.75rem", letterSpacing: "0.15em",
              padding: "10px 24px", cursor: "pointer",
              background: "rgba(156,39,176,0.15)", border: "1px solid var(--purple)",
              color: "var(--purple)", borderRadius: 1,
            }}
          >
            START AI DEBATE
          </button>
        </div>
      )}

      {loading && (
        <div style={{ padding: 24 }}>
          <div className="terminal-log">▶ GENERATING AI DEBATE — RUNNING 3 DEBATE ROUNDS... ▌</div>
        </div>
      )}

      {debate && debate.rounds && (
        <div>
          {debate.rounds.map((round: any) => (
            <div key={round.round} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "var(--border-subtle)" }}>
                <div style={{ background: "var(--bg-panel)", padding: 16 }}>
                  <div className="terminal-label" style={{ color: "var(--green)", marginBottom: 8 }}>BULL CASE — ROUND {round.round}</div>
                  <p style={{ fontFamily: "var(--text-sans)", fontSize: "0.75rem", color: "var(--text-secondary)", lineHeight: 1.7, margin: 0, whiteSpace: "pre-wrap" }}>
                    {round.bull}
                  </p>
                </div>
                <div style={{ background: "var(--bg-panel)", padding: 16 }}>
                  <div className="terminal-label" style={{ color: "var(--red)", marginBottom: 8 }}>BEAR CASE — ROUND {round.round}</div>
                  <p style={{ fontFamily: "var(--text-sans)", fontSize: "0.75rem", color: "var(--text-secondary)", lineHeight: 1.7, margin: 0, whiteSpace: "pre-wrap" }}>
                    {round.bear}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
