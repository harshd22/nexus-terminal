"use client";
import { useEffect, useState } from "react";
import { getDemoScenario } from "@/lib/api";
import { TerminalLog } from "@/components/TerminalLog";
import { RedFlagsPanel } from "@/components/RedFlagsPanel";
import type { TerminalLogStep } from "@/lib/types";

const SCENARIOS = [
  { id: "full_analysis",  label: "FULL ANALYSIS REPLAY" },
  { id: "red_flag_alarm", label: "RED FLAG ALARM" },
  { id: "bull_vs_bear",   label: "BULL vs BEAR" },
  { id: "source_conflict","label": "SOURCE CONFLICT" },
  { id: "market_crash",   label: "MARKET CRASH" },
];

export default function DemoPage() {
  const [active, setActive] = useState<string | null>(null);
  const [scenario, setScenario] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [logSteps, setLogSteps] = useState<TerminalLogStep[]>([]);
  const [stepIndex, setStepIndex] = useState(0);

  const loadScenario = async (id: string) => {
    setActive(id);
    setScenario(null);
    setLogSteps([]);
    setStepIndex(0);
    setLoading(true);
    try {
      const data = await getDemoScenario(id);
      setScenario(data);
      if (data.steps) {
        replaySteps(data.steps);
      }
    } catch {
      setScenario({ error: "Scenario not available" });
    } finally {
      setLoading(false);
    }
  };

  const replaySteps = (steps: any[]) => {
    const logMessages = steps.filter((s) => s.type === "log").map((s) => s.message);
    const builtSteps: TerminalLogStep[] = logMessages.map((m) => ({ message: m, status: "pending" as const }));
    setLogSteps(builtSteps);

    let i = 0;
    const advance = () => {
      if (i >= builtSteps.length) return;
      setLogSteps((prev) =>
        prev.map((s, idx) => ({
          ...s,
          status: idx < i ? "done" : idx === i ? "active" : "pending",
        }))
      );
      setTimeout(() => {
        setLogSteps((prev) =>
          prev.map((s, idx) => ({ ...s, status: idx <= i ? "done" : "pending" }))
        );
        i++;
        if (i < builtSteps.length) setTimeout(advance, 400);
      }, 500);
    };
    setTimeout(advance, 300);
  };

  return (
    <div>
      <div style={{
        padding: "12px 20px",
        background: "var(--section-grad)",
        borderBottom: "1px solid var(--border-glow)",
      }}>
        <h1 style={{ fontFamily: "var(--text-mono)", fontSize: "0.65rem", letterSpacing: "0.2em", color: "var(--purple)", margin: 0 }}>
          NEXUS TERMINAL // DEMO MODE
        </h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 1, background: "var(--border-subtle)", minHeight: "calc(100vh - 100px)" }}>
        {/* Scenario selector */}
        <div style={{ background: "var(--bg-surface)", padding: "12px 0" }}>
          <div className="terminal-label" style={{ padding: "0 12px 8px" }}>SCENARIOS</div>
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => loadScenario(s.id)}
              style={{
                width: "100%", textAlign: "left",
                fontFamily: "var(--text-mono)", fontSize: "0.62rem", letterSpacing: "0.08em",
                padding: "8px 12px", border: "none", cursor: "pointer",
                background: active === s.id ? "rgba(156,39,176,0.1)" : "transparent",
                color: active === s.id ? "var(--purple)" : "var(--text-muted)",
                borderLeft: `2px solid ${active === s.id ? "var(--purple)" : "transparent"}`,
              }}
            >
              {s.label}
            </button>
          ))}
          <div style={{
            margin: "12px 12px 0",
            fontFamily: "var(--text-mono)", fontSize: "0.55rem",
            color: "var(--text-muted)", lineHeight: 1.6, opacity: 0.7,
          }}>
            Demo mode works offline using pre-built scenario files.
            All components are real — only data is pre-recorded.
          </div>
        </div>

        {/* Content */}
        <div style={{ background: "var(--bg-panel)" }}>
          {!active && (
            <div style={{
              padding: 32, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", height: "100%", gap: 12,
            }}>
              <div style={{ fontFamily: "var(--text-mono)", fontSize: "0.8rem", color: "var(--purple)", letterSpacing: "0.2em" }}>
                SELECT A SCENARIO
              </div>
              <div style={{ fontFamily: "var(--text-mono)", fontSize: "0.65rem", color: "var(--text-muted)", textAlign: "center", maxWidth: 300, lineHeight: 1.8 }}>
                Choose a demo scenario from the left panel to see the terminal in action.
                All demos work completely offline.
              </div>
            </div>
          )}

          {loading && (
            <div style={{ padding: 16 }}>
              <div className="skeleton" style={{ height: 200 }} />
            </div>
          )}

          {scenario && !loading && (
            <div>
              <div className="section-header">
                <span className="terminal-heading">{scenario.title ?? active?.toUpperCase()}</span>
                <span className="badge badge-warn" style={{ marginLeft: 8 }}>DEMO</span>
              </div>

              {scenario.description && (
                <div style={{ padding: "8px 16px", fontFamily: "var(--text-sans)", fontSize: "0.72rem", color: "var(--text-secondary)" }}>
                  {scenario.description}
                </div>
              )}

              {logSteps.length > 0 && (
                <div style={{ padding: 16 }}>
                  <TerminalLog steps={logSteps} />
                </div>
              )}

              {/* Red flags demo */}
              {scenario.flags && (
                <div>
                  <div className="section-header">
                    <span className="terminal-heading">RED FLAGS — RULES ENGINE</span>
                  </div>
                  {scenario.flags.map((flag: any) => {
                    const statusColors: Record<string, string> = {
                      PASS: "var(--green)", FAIL: "var(--red)", WARN: "var(--amber)", NA: "var(--text-muted)"
                    };
                    return (
                      <div key={flag.rule_id} style={{ padding: "8px 16px", borderBottom: "1px solid var(--border-subtle)", display: "flex", gap: 12, alignItems: "center" }}>
                        <span className={`badge badge-${flag.status.toLowerCase()}`}>{flag.status}</span>
                        <span style={{ fontFamily: "var(--text-mono)", fontSize: "0.7rem", color: "var(--text-primary)", flex: 1 }}>
                          RULE {flag.rule_id} — {flag.rule_name}
                        </span>
                        <span style={{ fontFamily: "var(--text-mono)", fontSize: "0.65rem", color: statusColors[flag.status] }}>
                          {flag.value != null ? flag.value : "—"}
                          {flag.threshold != null ? ` / ${flag.threshold}` : ""}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Bull vs Bear demo */}
              {scenario.rounds && scenario.rounds.map((round: any) => (
                <div key={round.round} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "var(--border-subtle)" }}>
                    <div style={{ background: "var(--bg-panel)", padding: 12 }}>
                      <div className="terminal-label" style={{ color: "var(--green)", marginBottom: 8 }}>BULL — ROUND {round.round}</div>
                      <p style={{ fontFamily: "var(--text-sans)", fontSize: "0.72rem", color: "var(--text-secondary)", lineHeight: 1.7, margin: 0, whiteSpace: "pre-wrap" }}>{round.bull}</p>
                    </div>
                    <div style={{ background: "var(--bg-panel)", padding: 12 }}>
                      <div className="terminal-label" style={{ color: "var(--red)", marginBottom: 8 }}>BEAR — ROUND {round.round}</div>
                      <p style={{ fontFamily: "var(--text-sans)", fontSize: "0.72rem", color: "var(--text-secondary)", lineHeight: 1.7, margin: 0, whiteSpace: "pre-wrap" }}>{round.bear}</p>
                    </div>
                  </div>
                </div>
              ))}

              {scenario.disclaimer && (
                <div style={{ padding: "8px 16px", fontFamily: "var(--text-mono)", fontSize: "0.55rem", color: "var(--text-muted)", opacity: 0.7 }}>
                  {scenario.disclaimer}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
