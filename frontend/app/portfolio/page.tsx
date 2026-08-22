import type { Metadata } from "next";
import { AllocationWheelWrapper } from "./AllocationWheelWrapper";
import { PortfolioHeader } from "./PortfolioHeader";
import { HoldingsTable } from "./HoldingsTable";

export const metadata: Metadata = {
  title: "NEXUS TERMINAL — Portfolio",
  description: "Portfolio overview, allocation wheel, holdings, positions, and P&L analysis.",
};

export default function PortfolioPage() {
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
          NEXUS TERMINAL // PORTFOLIO
        </h1>
      </div>
      <PortfolioHeader />
      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 1, borderTop: "1px solid var(--border-subtle)", background: "var(--border-subtle)" }}>
        <AllocationWheelWrapper />
        <HoldingsTable />
      </div>
    </div>
  );
}
