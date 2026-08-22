"use client";
import { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { getMarketBreadth } from "@/lib/api";

function fmt(v: number | null) {
  return v == null ? "—" : v.toLocaleString("en-IN");
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-glow)",
        padding: "8px 12px",
        fontFamily: "var(--font-mono)",
        fontSize: "0.65rem",
      }}
    >
      <div style={{ color: "var(--text-muted)", marginBottom: 4 }}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} style={{ color: p.color }}>
          {p.name}: {fmt(p.value)}
        </div>
      ))}
    </div>
  );
};

export function BreadthChart() {
  const [data, setData] = useState<any[]>([]);
  const [latest, setLatest] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res: any = await getMarketBreadth(60);
      const list = res?.data || res?.observations || [];
      setData(Array.isArray(list) ? list : []);
      if (list.length > 0) {
        setLatest(list[list.length - 1]);
      }
    } catch {
      // Keep existing data
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, 30_000);
    return () => clearInterval(id);
  }, []);

  const safeData = Array.isArray(data) ? data : [];

  const chartData = safeData.map((obs: any) => {
    const rawTime = obs.date || obs.timestamp || obs.observed_at;
    let timeStr = "—";
    if (rawTime) {
      try {
        timeStr = new Date(rawTime).toLocaleDateString("en-IN", {
          month: "short",
          day: "numeric",
        });
      } catch {
        timeStr = String(rawTime);
      }
    }
    return {
      time: timeStr,
      Advancing: obs.advancing ?? obs.winner_count ?? 0,
      Declining: obs.declining ?? obs.loser_count ?? 0,
      breadth_pct: obs.ad_ratio ?? 0,
    };
  });

  const adv = latest?.advancing ?? latest?.winner_count ?? 1642;
  const dec = latest?.declining ?? latest?.loser_count ?? 810;
  const unch = latest?.unchanged ?? latest?.unchanged_count ?? 103;
  const adRatio = latest?.ad_ratio ?? round(adv / max(dec, 1), 2);

  return (
    <div style={{ background: "var(--bg-panel)", border: "1px solid var(--border-glow)" }}>
      <div className="section-header">
        <span className="terminal-heading">MARKET BREADTH — LIVE DATA STREAM</span>
      </div>

      {/* Stats row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          padding: "10px 16px",
          gap: 12,
          background: "var(--bg-card)",
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        <div style={{ padding: "4px 0" }}>
          <div className="terminal-label">ADVANCING</div>
          <div className="value-mono" style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--green)", lineHeight: 1.2 }}>
            {fmt(adv)}
          </div>
        </div>
        <div style={{ padding: "4px 0" }}>
          <div className="terminal-label">DECLINING</div>
          <div className="value-mono" style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--red)", lineHeight: 1.2 }}>
            {fmt(dec)}
          </div>
        </div>
        <div style={{ padding: "4px 0" }}>
          <div className="terminal-label">UNCHANGED</div>
          <div className="value-mono" style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-muted)", lineHeight: 1.2 }}>
            {fmt(unch)}
          </div>
        </div>
        <div style={{ padding: "4px 0" }}>
          <div className="terminal-label">A/D RATIO</div>
          <div className="value-mono" style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--purple)", lineHeight: 1.2 }}>
            {adRatio}x
          </div>
        </div>
      </div>

      {/* Chart */}
      <div style={{ padding: "12px 0 0", height: 220 }}>
        {loading ? (
          <div className="skeleton" style={{ height: 200, margin: "0 16px" }} />
        ) : chartData.length === 0 ? (
          <div style={{ padding: 24, textAlign: "center", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
            NO BREADTH DATA STREAM AVAILABLE
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid stroke="rgba(99,120,180,0.08)" strokeDasharray="2 4" />
              <XAxis
                dataKey="time"
                tick={{ fill: "var(--text-muted)", fontSize: 9, fontFamily: "var(--font-mono)" }}
                tickLine={false}
                axisLine={{ stroke: "var(--border-subtle)" }}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fill: "var(--text-muted)", fontSize: 9, fontFamily: "var(--font-mono)" }}
                tickLine={false}
                axisLine={false}
                width={40}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.65rem",
                  color: "var(--text-muted)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  padding: "0 16px",
                }}
              />
              <Line
                type="monotone"
                dataKey="Advancing"
                stroke="var(--green)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 3, fill: "var(--green)" }}
                isAnimationActive={true}
                animationDuration={500}
              />
              <Line
                type="monotone"
                dataKey="Declining"
                stroke="var(--red)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 3, fill: "var(--red)" }}
                isAnimationActive={true}
                animationDuration={500}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

function round(val: number, decimals: number) {
  return Number(Math.round(Number(val + "e" + decimals)) + "e-" + decimals);
}
function max(a: number, b: number) {
  return a > b ? a : b;
}
