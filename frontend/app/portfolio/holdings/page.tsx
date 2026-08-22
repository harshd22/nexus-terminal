import type { Metadata } from "next";
import { PortfolioHeader } from "../PortfolioHeader";
import { HoldingsTable } from "../HoldingsTable";

export const metadata: Metadata = {
  title: "NEXUS TERMINAL — Portfolio Holdings",
  description: "View all equity holdings, quantities, average cost, live market prices, and position P&L.",
};

export default function PortfolioHoldingsPage() {
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
          NEXUS TERMINAL // PORTFOLIO POSITIONS & HOLDINGS
        </h1>
      </div>
      <PortfolioHeader />
      <HoldingsTable />
    </div>
  );
}
