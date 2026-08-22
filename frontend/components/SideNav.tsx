"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  TrendingUp,
  Search,
  Sliders,
  ShieldAlert,
  Award,
  Zap,
  Newspaper,
  ChevronLeft,
  ChevronRight,
  Clock,
  BarChart2,
  LineChart,
  Globe,
  Coins,
  Landmark,
  FileText,
} from "lucide-react";

interface NavSection {
  title: string;
  items: {
    label: string;
    href: string;
    icon: any;
    badge?: string;
  }[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: "MARKET RESEARCH",
    items: [
      { label: "Market Overview", href: "/", icon: TrendingUp },
      { label: "Bonds & Fixed Income", href: "/market/bonds", icon: Landmark, badge: "YIELD" },
      { label: "Commodities & Forex", href: "/market/commodities", icon: Coins, badge: "MCX" },
      { label: "Macro Economics", href: "/market/macro", icon: Globe, badge: "MACRO" },
      { label: "IPO Intelligence", href: "/market/ipo", icon: Award, badge: "GMP" },
      { label: "Market Breadth", href: "/market/breadth", icon: BarChart2 },
      { label: "Advance / Decline", href: "/market/winners-losers", icon: LineChart },
      { label: "Stock Scans", href: "/market/scans", icon: Sliders, badge: "EMA" },
      { label: "MTF Analytics", href: "/market/mtf", icon: Zap, badge: "LEVERAGE" },
      { label: "Top 20 Ranker", href: "/market/top-performers", icon: Award },
      { label: "Stock Search", href: "/market/search", icon: Search },
      { label: "Stock Screener", href: "/market/screener", icon: Sliders },
    ],
  },
  {
    title: "EQUITY RESEARCH",
    items: [
      { label: "Stock Deep-Dive", href: "/stock/RELIANCE", icon: Zap, badge: "NSE" },
      { label: "Consensus & Targets", href: "/market/consensus", icon: FileText, badge: "TRENDLYNE" },
      { label: "Red Flags Engine", href: "/analysis/red-flags", icon: ShieldAlert },
      { label: "10-Point Scorecard", href: "/analysis/scorecard", icon: Award },
    ],
  },
  {
    title: "INTELLIGENCE",
    items: [
      { label: "Market News", href: "/news", icon: Newspaper, badge: "LIVE" },
      { label: "Corporate News", href: "/news?category=CORPORATE", icon: Newspaper },
      { label: "Economy News", href: "/news?category=ECONOMY", icon: Newspaper },
    ],
  },
];

export function SideNav() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [istTime, setIstTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setIstTime(
        now.toLocaleTimeString("en-IN", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <aside
      style={{
        width: collapsed ? 56 : 240,
        minWidth: collapsed ? 56 : 240,
        background: "#090d16",
        borderRight: "1px solid #1e293b",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.2s ease, min-width 0.2s ease",
        overflow: "hidden",
        zIndex: 30,
      }}
    >
      {/* Collapse Toggle Bar */}
      <div
        style={{
          height: 40,
          borderBottom: "1px solid #1e293b",
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          padding: "0 14px",
          background: "#04060a",
        }}
      >
        {!collapsed && (
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.58rem",
              letterSpacing: "0.25em",
              color: "#00e676",
              fontWeight: 800,
            }}
          >
            NAVIGATION
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid #1e293b",
            borderRadius: 4,
            color: "#94a3b8",
            cursor: "pointer",
            padding: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Nav Items */}
      <div style={{ flex: 1, overflowY: "auto", padding: "10px 0" }}>
        {NAV_SECTIONS.map((section) => (
          <div key={section.title} style={{ marginBottom: 18 }}>
            {!collapsed && (
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.52rem",
                  letterSpacing: "0.22em",
                  color: "#64748b",
                  padding: "4px 16px",
                  fontWeight: 700,
                }}
              >
                {section.title}
              </div>
            )}
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: collapsed ? "10px 0" : "8px 16px",
                    justifyContent: collapsed ? "center" : "flex-start",
                    color: isActive ? "#ffffff" : "#94a3b8",
                    background: isActive ? "linear-gradient(90deg, rgba(0, 230, 118, 0.15) 0%, rgba(0, 230, 118, 0.02) 100%)" : "transparent",
                    borderLeft: `3px solid ${isActive ? "#00e676" : "transparent"}`,
                    textDecoration: "none",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.68rem",
                    letterSpacing: "0.05em",
                    fontWeight: isActive ? 700 : 500,
                    transition: "all 0.15s ease",
                  }}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon size={14} color={isActive ? "#00e676" : "#64748b"} />
                  {!collapsed && (
                    <>
                      <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {item.label}
                      </span>
                      {item.badge && (
                        <span
                          style={{
                            fontSize: "0.5rem",
                            padding: "1px 5px",
                            borderRadius: 3,
                            background: "rgba(0, 230, 118, 0.12)",
                            color: "#00e676",
                            border: "1px solid rgba(0, 230, 118, 0.3)",
                            fontWeight: 800,
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Live IST Clock */}
      <div
        style={{
          borderTop: "1px solid #1e293b",
          padding: "10px 14px",
          fontFamily: "var(--font-mono)",
          fontSize: "0.62rem",
          color: "#94a3b8",
          display: "flex",
          alignItems: "center",
          gap: 8,
          justifyContent: collapsed ? "center" : "flex-start",
          background: "#000000",
        }}
      >
        <Clock size={14} color="#00e676" />
        {!collapsed && (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "0.68rem", color: "#ffffff", fontWeight: 800, letterSpacing: "0.05em" }}>
              {istTime || "--:--:--"} IST
            </span>
            <span style={{ fontSize: "0.52rem", color: "#00e676", fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
              <span className="live-dot" style={{ width: 5, height: 5 }} /> NSE / BSE OPEN
            </span>
          </div>
        )}
      </div>
    </aside>
  );
}
