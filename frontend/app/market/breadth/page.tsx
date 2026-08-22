import type { Metadata } from "next";
import { BreadthChart } from "@/components/BreadthChart";

export const metadata: Metadata = {
  title: "NEXUS TERMINAL — Market Breadth Analysis",
  description: "Real-time market breadth monitoring, advance/decline ratio, and historical stream.",
};

export default function MarketBreadthPage() {
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
          NEXUS TERMINAL // MARKET BREADTH STREAM
        </h1>
      </div>
      <BreadthChart />
    </div>
  );
}
