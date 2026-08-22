import type { Metadata } from "next";
import { PortfolioHeader } from "../PortfolioHeader";
import { AllocationWheelWrapper } from "../AllocationWheelWrapper";

export const metadata: Metadata = {
  title: "NEXUS TERMINAL — Portfolio Allocation",
  description: "Interactive portfolio allocation wheel and sector concentration breakdown.",
};

export default function PortfolioAllocationPage() {
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
          NEXUS TERMINAL // PORTFOLIO ALLOCATION
        </h1>
      </div>
      <PortfolioHeader />
      <div style={{ padding: 16 }}>
        <AllocationWheelWrapper />
      </div>
    </div>
  );
}
