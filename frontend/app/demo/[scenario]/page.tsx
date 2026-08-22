"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getDemoScenario } from "@/lib/api";
import { TerminalLog } from "@/components/TerminalLog";
import type { TerminalLogStep } from "@/lib/types";

export default function DemoScenarioPage() {
  const params = useParams();
  const scenarioId = (params?.scenario as string) ?? "full_analysis";
  const [scenario, setScenario] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [logSteps, setLogSteps] = useState<TerminalLogStep[]>([]);

  useEffect(() => {
    getDemoScenario(scenarioId)
      .then((d) => {
        setScenario(d);
        if (d.steps) {
          const logMessages = d.steps.filter((s: any) => s.type === "log").map((s: any) => s.message);
          setLogSteps(logMessages.map((m: string) => ({ message: m, status: "done" })));
        }
      })
      .catch(() => setScenario(null))
      .finally(() => setLoading(false));
  }, [scenarioId]);

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
          NEXUS TERMINAL // DEMO MODE — {scenarioId.toUpperCase()}
        </h1>
      </div>

      {loading ? (
        <div style={{ padding: 16 }}><div className="skeleton" style={{ height: 200 }} /></div>
      ) : !scenario ? (
        <div style={{ padding: 24, fontFamily: "var(--text-mono)", fontSize: "0.7rem", color: "var(--text-muted)" }}>
          DEMO SCENARIO &apos;{scenarioId}&apos; NOT FOUND
        </div>
      ) : (
        <div>
          <div className="section-header">
            <span className="terminal-heading">{scenario.title ?? scenarioId.toUpperCase()}</span>
            <span className="badge badge-warn" style={{ marginLeft: 8 }}>DEMO</span>
          </div>

          {scenario.description && (
            <div style={{ padding: "10px 16px", fontFamily: "var(--text-sans)", fontSize: "0.75rem", color: "var(--text-secondary)" }}>
              {scenario.description}
            </div>
          )}

          {logSteps.length > 0 && (
            <div style={{ padding: 16 }}>
              <TerminalLog steps={logSteps} />
            </div>
          )}

          {scenario.flags && (
            <div>
              <div className="section-header"><span className="terminal-heading">RED FLAGS — RULES ENGINE</span></div>
              {scenario.flags.map((flag: any) => (
                <div key={flag.rule_id} style={{ padding: "8px 16px", borderBottom: "1px solid var(--border-subtle)", display: "flex", gap: 12, alignItems: "center" }}>
                  <span className={`badge badge-${flag.status.toLowerCase()}`}>{flag.status}</span>
                  <span style={{ fontFamily: "var(--text-mono)", fontSize: "0.7rem", color: "var(--text-primary)", flex: 1 }}>
                    RULE {flag.rule_id} — {flag.rule_name}
                  </span>
                  <span className="value-mono" style={{ fontSize: "0.65rem" }}>
                    {flag.value != null ? flag.value : "—"}
                  </span>
                </div>
              ))}
            </div>
          )}

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
        </div>
      )}
    </div>
  );
}
