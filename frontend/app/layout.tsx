import type { Metadata } from "next";
import "./globals.css";
import { SideNav } from "@/components/SideNav";
import { TerminalHeader } from "@/components/TerminalHeader";

export const metadata: Metadata = {
  title: "NEXUS TERMINAL — Indian Equity Research",
  description:
    "Institutional-grade Indian equity research terminal. Real-time NSE/BSE data, deep-dive analysis, portfolio analytics, red flags engine, SWOT, Bull vs Bear debate. For research and education only.",
  keywords: "NSE, BSE, Indian stocks, equity research, portfolio analysis, stock screener",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased" style={{ background: "var(--bg-base)" }}>
        <div className="flex h-screen overflow-hidden">
          {/* Left sidebar navigation */}
          <SideNav />

          {/* Main content area */}
          <div className="flex flex-col flex-1 overflow-hidden">
            <TerminalHeader />
            <main
              className="flex-1 overflow-y-auto"
              style={{ background: "var(--bg-base)" }}
            >
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
