"use client";
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Sector } from "recharts";
import { getPortfolioAllocation, getPortfolio } from "@/lib/api";
import type { AllocationSegment, PortfolioStats } from "@/lib/types";
import { DataUnavailable } from "./DataUnavailable";

const CHART_COLORS = [
  "#7c4dff", "#00e5ff", "#ff6e40", "#69f0ae", "#ffd740",
  "#ff4081", "#40c4ff", "#b9f6ca", "#ffab40", "#ea80fc",
  "#82b1ff", "#ccff90", "#ff6d00", "#00e676", "#e040fb",
];

function fmt(v: number, dec = 2) {
  return v.toLocaleString("en-IN", { minimumFractionDigits: dec, maximumFractionDigits: dec });
}
function fmtCr(v: number) {
  if (Math.abs(v) >= 1e7) return `₹${(v / 1e7).toFixed(2)}Cr`;
  if (Math.abs(v) >= 1e5) return `₹${(v / 1e5).toFixed(2)}L`;
  return `₹${fmt(v, 0)}`;
}

const ActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload } = props;
  return (
    <g>
      <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius + 6}
        startAngle={startAngle} endAngle={endAngle} fill={fill} />
    </g>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d: AllocationSegment = payload[0].payload;
  const pnlColor = (d.overall_pnl ?? 0) >= 0 ? "var(--green)" : "var(--red)";
  return (
    <div style={{
      background: "var(--bg-elevated)", border: "1px solid var(--border-active)",
      padding: "10px 14px", fontFamily: "var(--text-mono)", fontSize: "0.65rem", minWidth: 160,
    }}>
      <div style={{ color: "var(--blue)", fontWeight: 700, fontSize: "0.8rem", marginBottom: 6 }}>{d.symbol}</div>
      <div style={{ color: "var(--text-secondary)" }}>Value: <span style={{ color: "var(--text-primary)" }}>{fmtCr(d.current_value)}</span></div>
      <div style={{ color: "var(--text-secondary)" }}>Weight: <span style={{ color: "var(--purple)" }}>{d.weight_pct.toFixed(1)}%</span></div>
      <div style={{ color: "var(--text-secondary)" }}>
        P&L: <span style={{ color: pnlColor }}>{d.overall_pnl >= 0 ? "+" : ""}{fmtCr(d.overall_pnl)}</span>
      </div>
      {d.day_pnl != null && (
        <div style={{ color: "var(--text-secondary)" }}>
          Day P&L: <span style={{ color: (d.day_pnl ?? 0) >= 0 ? "var(--green)" : "var(--red)" }}>
            {(d.day_pnl ?? 0) >= 0 ? "+" : ""}{fmtCr(d.day_pnl ?? 0)}
          </span>
        </div>
      )}
    </div>
  );
};

export function AllocationWheel() {
  const [segments, setSegments] = useState<AllocationSegment[]>([]);
  const [stats, setStats] = useState<PortfolioStats | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getPortfolioAllocation(), getPortfolio()])
      .then(([alloc, port]) => {
        setSegments(alloc.allocation || []);
        setStats(port);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const dayPnl = stats?.day_pnl ?? 0;
  const dayPnlColor = dayPnl >= 0 ? "var(--green)" : "var(--red)";

  return (
    <div>
      <div className="section-header">
        <span className="terminal-heading">PORTFOLIO ALLOCATION WHEEL</span>
        {stats?.demo_mode && <span className="badge badge-warn">DEMO</span>}
      </div>

      {loading ? (
        <div className="skeleton" style={{ height: 300, margin: 16 }} />
      ) : segments.length === 0 ? (
        <DataUnavailable message="NO HOLDINGS DATA" height={300} />
      ) : (
        <div style={{ display: "flex", gap: 0 }}>
          {/* Donut */}
          <div style={{ width: 260, height: 260, position: "relative", flexShrink: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  {...({
                    data: segments,
                    dataKey: "weight_pct",
                    nameKey: "symbol",
                    cx: "50%",
                    cy: "50%",
                    innerRadius: 75,
                    outerRadius: 110,
                    activeIndex: activeIndex ?? undefined,
                    activeShape: ActiveShape,
                    onMouseEnter: (_: any, i: number) => setActiveIndex(i),
                    onMouseLeave: () => setActiveIndex(null),
                    startAngle: 90,
                    endAngle: -270,
                  } as any)}
                >
                  {segments.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} stroke="var(--bg-panel)" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              pointerEvents: "none",
            }}>
              <div className="terminal-label">DAY P&L</div>
              <div className="value-mono" style={{ fontSize: "0.9rem", fontWeight: 700, color: dayPnlColor }}>
                {dayPnl >= 0 ? "+" : ""}{fmtCr(dayPnl)}
              </div>
            </div>
          </div>

          {/* Holdings legend */}
          <div style={{ flex: 1, overflowY: "auto", maxHeight: 260, padding: "8px 0" }}>
            {segments.map((seg, i) => {
              const color = CHART_COLORS[i % CHART_COLORS.length];
              const pnlColor = (seg.overall_pnl ?? 0) >= 0 ? "var(--green)" : "var(--red)";
              return (
                <div
                  key={seg.symbol}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "5px 12px",
                    background: activeIndex === i ? "var(--bg-hover)" : "transparent",
                    borderLeft: `3px solid ${color}`,
                    marginBottom: 1,
                    cursor: "default",
                  }}
                  onMouseEnter={() => setActiveIndex(i)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  <span className="value-mono" style={{ fontSize: "0.72rem", fontWeight: 600, color, minWidth: 80 }}>
                    {seg.symbol}
                  </span>
                  <span className="value-mono" style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>
                    {seg.weight_pct.toFixed(1)}%
                  </span>
                  <span className="value-mono" style={{ fontSize: "0.65rem", color: pnlColor, marginLeft: "auto" }}>
                    {(seg.overall_pnl ?? 0) >= 0 ? "+" : ""}{fmtCr(seg.overall_pnl ?? 0)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
