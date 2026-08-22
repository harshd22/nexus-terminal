"use client";
import { RedFlagsPanel } from "@/components/RedFlagsPanel";

export default function AnalysisRedFlagsPage() {
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
          NEXUS TERMINAL // RED FLAGS RULES ENGINE — RELIANCE
        </h1>
      </div>
      <RedFlagsPanel symbol="RELIANCE" />
    </div>
  );
}
