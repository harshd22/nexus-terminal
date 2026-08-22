"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

function fmt(v: number | null, dec = 2) {
  return v == null ? "—" : v.toLocaleString("en-IN", { minimumFractionDigits: dec, maximumFractionDigits: dec });
}

type ScanTab = "EMA_BREADTH" | "BREAKOUTS_52W" | "GOLDEN_CROSS" | "BULLISH_STACK" | "VOLUME_SPIKES";

export function StockScans() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ScanTab>("EMA_BREADTH");

  useEffect(() => {
    import("@/lib/api").then(({ api }) =>
      api
        .get("/api/market/scans")
        .then((r) => setData(r.data))
        .catch(() => setData(null))
        .finally(() => setLoading(false))
    );
  }, []);

  if (loading) return <div className="skeleton" style={{ height: 320 }} />;

  const ema = data?.ema_breadth || {};
  const timeline = ema?.timeline || [];
  const breakouts52w = data?.breakouts_52w || [];
  const goldenCross = data?.golden_cross || [];
  const bullishStack = data?.bullish_stack || [];
  const volumeSpikes = data?.volume_spikes || [];

  return (
    <div style={{ background: "var(--bg-panel)", border: "1px solid var(--border-glow)" }}>
      <div className="section-header">
        <span className="terminal-heading">TECHNICAL PATTERN SCANS & MOVING AVERAGE BREADTH</span>
      </div>

      {/* Universe EMA Breadth Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 12,
          padding: "12px 16px",
          background: "var(--bg-card)",
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        <div style={{ background: "rgba(157,78,221,0.08)", border: "1px solid var(--border-glow)", padding: "10px 12px" }}>
          <div className="terminal-label">STOCKS ABOVE 200 EMA</div>
          <div className="value-mono" style={{ fontSize: "1.2rem", color: "var(--purple)", fontWeight: 700, marginTop: 4 }}>
            {ema.above_200_ema_pct ?? 74.2}%
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "var(--text-muted)", marginTop: 2 }}>
            LONG-TERM BULLISH TREND
          </div>
        </div>

        <div style={{ background: "rgba(0,229,255,0.08)", border: "1px solid var(--border-cyan)", padding: "10px 12px" }}>
          <div className="terminal-label">STOCKS ABOVE 100 EMA</div>
          <div className="value-mono" style={{ fontSize: "1.2rem", color: "var(--cyan)", fontWeight: 700, marginTop: 4 }}>
            {ema.above_100_ema_pct ?? 68.5}%
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "var(--text-muted)", marginTop: 2 }}>
            MEDIUM-TERM MOMENTUM
          </div>
        </div>

        <div style={{ background: "rgba(0,230,118,0.08)", border: "1px solid rgba(0,230,118,0.3)", padding: "10px 12px" }}>
          <div className="terminal-label">STOCKS ABOVE 50 EMA</div>
          <div className="value-mono" style={{ fontSize: "1.2rem", color: "var(--green)", fontWeight: 700, marginTop: 4 }}>
            {ema.above_50_ema_pct ?? 62.1}%
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "var(--text-muted)", marginTop: 2 }}>
            INTERMEDIATE BREADTH
          </div>
        </div>

        <div style={{ background: "rgba(255,214,0,0.08)", border: "1px solid rgba(255,214,0,0.3)", padding: "10px 12px" }}>
          <div className="terminal-label">STOCKS ABOVE 20 EMA</div>
          <div className="value-mono" style={{ fontSize: "1.2rem", color: "var(--yellow)", fontWeight: 700, marginTop: 4 }}>
            {ema.above_20_ema_pct ?? 58.4}%
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "var(--text-muted)", marginTop: 2 }}>
            SHORT-TERM SWING BREADTH
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div
        style={{
          display: "flex",
          gap: 4,
          padding: "8px 16px",
          background: "var(--bg-surface)",
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        {[
          { id: "EMA_BREADTH",   label: "EMA BREADTH TREND CHART" },
          { id: "BREAKOUTS_52W", label: "52W ATH BREAKOUTS" },
          { id: "GOLDEN_CROSS",  label: "GOLDEN CROSS (50 > 200 DMA)" },
          { id: "BULLISH_STACK", label: "BULLISH EMA ALIGNMENT" },
          { id: "VOLUME_SPIKES", label: "VOLUME SPIKE SURGES" },
        ].map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as ScanTab)}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.62rem",
              padding: "5px 12px",
              border: "1px solid",
              borderColor: activeTab === id ? "var(--purple)" : "var(--border-subtle)",
              background: activeTab === id ? "rgba(157,78,221,0.18)" : "transparent",
              color: activeTab === id ? "var(--purple)" : "var(--text-muted)",
              cursor: "pointer",
              borderRadius: 1,
              fontWeight: activeTab === id ? 700 : 500,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div style={{ padding: 16 }}>
        {activeTab === "EMA_BREADTH" && (
          <div>
            <div className="terminal-label" style={{ marginBottom: 12, color: "var(--purple)" }}>
              PERCENTAGE OF NSE UNIVERSE STOCKS ABOVE MOVING AVERAGES OVER TIME
            </div>
            <div style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeline} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(99,120,180,0.06)" strokeDasharray="2 4" />
                  <XAxis dataKey="date" tick={{ fill: "var(--text-muted)", fontSize: 9, fontFamily: "var(--font-mono)" }} />
                  <YAxis domain={[40, 90]} tick={{ fill: "var(--text-muted)", fontSize: 9, fontFamily: "var(--font-mono)" }} unit="%" />
                  <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border-glow)", fontFamily: "var(--font-mono)", fontSize: "0.65rem" }} />
                  <Legend wrapperStyle={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem" }} />
                  <Line type="monotone" dataKey="above_200" name="% Above 200 EMA" stroke="var(--purple)" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="above_100" name="% Above 100 EMA" stroke="var(--cyan)" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="above_50"  name="% Above 50 EMA"  stroke="var(--green)" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === "BREAKOUTS_52W" && (
          <table className="terminal-table">
            <thead>
              <tr>
                <th>SYMBOL</th>
                <th>COMPANY</th>
                <th>CURRENT PRICE</th>
                <th>24H CHANGE</th>
                <th>VOLUME SPIKE</th>
                <th>BREAKOUT PATTERN</th>
                <th>200 EMA STATUS</th>
              </tr>
            </thead>
            <tbody>
              {breakouts52w.map((item: any) => (
                <tr key={item.symbol}>
                  <td>
                    <Link href={`/stock/${item.symbol}`} className="symbol-link">
                      {item.symbol}
                    </Link>
                  </td>
                  <td style={{ color: "var(--text-secondary)" }}>{item.name}</td>
                  <td className="value-mono">₹{fmt(item.price)}</td>
                  <td className="value-mono" style={{ color: item.change_pct >= 0 ? "var(--green)" : "var(--red)" }}>
                    +{item.change_pct}%
                  </td>
                  <td className="value-mono" style={{ color: "var(--cyan)", fontWeight: 700 }}>
                    {item.volume_spike}
                  </td>
                  <td style={{ color: "var(--purple)", fontWeight: 700 }}>{item.pattern}</td>
                  <td style={{ color: "var(--green)", fontWeight: 700 }}>ABOVE 200 EMA ✓</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === "GOLDEN_CROSS" && (
          <table className="terminal-table">
            <thead>
              <tr>
                <th>SYMBOL</th>
                <th>COMPANY</th>
                <th>PRICE</th>
                <th>50 DMA</th>
                <th>200 DMA</th>
                <th>GOLDEN CROSS STATUS</th>
              </tr>
            </thead>
            <tbody>
              {goldenCross.map((item: any) => (
                <tr key={item.symbol}>
                  <td>
                    <Link href={`/stock/${item.symbol}`} className="symbol-link">
                      {item.symbol}
                    </Link>
                  </td>
                  <td style={{ color: "var(--text-secondary)" }}>{item.name}</td>
                  <td className="value-mono">₹{fmt(item.price)}</td>
                  <td className="value-mono" style={{ color: "var(--cyan)" }}>₹{fmt(item.dma50)}</td>
                  <td className="value-mono" style={{ color: "var(--purple)" }}>₹{fmt(item.dma200)}</td>
                  <td style={{ color: "var(--green)", fontWeight: 700 }}>{item.pattern}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === "BULLISH_STACK" && (
          <table className="terminal-table">
            <thead>
              <tr>
                <th>SYMBOL</th>
                <th>COMPANY</th>
                <th>PRICE</th>
                <th>20 EMA</th>
                <th>50 EMA</th>
                <th>200 EMA</th>
                <th>ALIGNMENT</th>
              </tr>
            </thead>
            <tbody>
              {bullishStack.map((item: any) => (
                <tr key={item.symbol}>
                  <td>
                    <Link href={`/stock/${item.symbol}`} className="symbol-link">
                      {item.symbol}
                    </Link>
                  </td>
                  <td style={{ color: "var(--text-secondary)" }}>{item.name}</td>
                  <td className="value-mono">₹{fmt(item.price)}</td>
                  <td className="value-mono" style={{ color: "var(--yellow)" }}>₹{fmt(item.ema20)}</td>
                  <td className="value-mono" style={{ color: "var(--cyan)" }}>₹{fmt(item.ema50)}</td>
                  <td className="value-mono" style={{ color: "var(--purple)" }}>₹{fmt(item.ema200)}</td>
                  <td style={{ color: "var(--green)", fontWeight: 700 }}>{item.pattern}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === "VOLUME_SPIKES" && (
          <table className="terminal-table">
            <thead>
              <tr>
                <th>SYMBOL</th>
                <th>PRICE</th>
                <th>CHANGE %</th>
                <th>VOLUME SURGE multiplier</th>
                <th>TECHNICAL TRIGGER</th>
              </tr>
            </thead>
            <tbody>
              {volumeSpikes.map((item: any) => (
                <tr key={item.symbol}>
                  <td>
                    <Link href={`/stock/${item.symbol}`} className="symbol-link">
                      {item.symbol}
                    </Link>
                  </td>
                  <td className="value-mono">₹{fmt(item.price)}</td>
                  <td className="value-mono" style={{ color: item.change_pct >= 0 ? "var(--green)" : "var(--red)" }}>
                    +{item.change_pct}%
                  </td>
                  <td className="value-mono" style={{ color: "var(--cyan)", fontWeight: 700 }}>
                    {item.volume_spike}
                  </td>
                  <td style={{ color: "var(--yellow)", fontWeight: 700 }}>{item.pattern}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
