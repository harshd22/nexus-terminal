"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
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

export function MTFAnalytics() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import("@/lib/api").then(({ api }) =>
      api
        .get("/api/mtf")
        .then((r) => setData(r.data))
        .catch(() => setData(null))
        .finally(() => setLoading(false))
    );
  }, []);

  if (loading) return <div className="skeleton" style={{ height: 420 }} />;

  const summary = data?.summary || {};
  const history = data?.history || [];
  const aumClass = data?.aum_class || [];
  const brokers = data?.brokers || [];
  const globalDebt = data?.global_debt || [];
  const topStocks = data?.top_stocks || [];

  const display = summary?.display || {};
  const bookCrore = summary?.bookCrore || {};

  return (
    <div style={{ background: "var(--bg-panel)", border: "1px solid var(--border-glow)" }}>
      {/* Header */}
      <div className="section-header">
        <span className="terminal-heading">MARGIN TRADING FACILITY (MTF) ANALYTICS & MARKET LEVERAGE</span>
      </div>

      {/* Summary KPI Bar */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 12,
          padding: "14px 16px",
          background: "var(--bg-card)",
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        <div style={{ background: "rgba(157,78,221,0.1)", border: "1px solid var(--border-glow)", padding: "12px 14px" }}>
          <div className="terminal-label">TOTAL COMBINED MTF BOOK</div>
          <div className="value-mono" style={{ fontSize: "1.3rem", color: "var(--purple)", fontWeight: 700, marginTop: 4 }}>
            {display.combined ?? "₹1.49 lakh crore"}
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "var(--text-muted)", marginTop: 2 }}>
            NSE + BSE TOTAL OUTSTANDING
          </div>
        </div>

        <div style={{ background: "rgba(0,229,255,0.1)", border: "1px solid var(--border-cyan)", padding: "12px 14px" }}>
          <div className="terminal-label">NSE MTF OUTSTANDING</div>
          <div className="value-mono" style={{ fontSize: "1.3rem", color: "var(--cyan)", fontWeight: 700, marginTop: 4 }}>
            ₹{fmt(bookCrore.nse ?? 142290.82)} Cr
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "var(--text-muted)", marginTop: 2 }}>
            95.7% OF TOTAL MARKET LEVERAGE
          </div>
        </div>

        <div style={{ background: "rgba(0,230,118,0.1)", border: "1px solid rgba(0,230,118,0.3)", padding: "12px 14px" }}>
          <div className="terminal-label">BSE MTF OUTSTANDING</div>
          <div className="value-mono" style={{ fontSize: "1.3rem", color: "var(--green)", fontWeight: 700, marginTop: 4 }}>
            ₹{fmt(bookCrore.bse ?? 6363.18)} Cr
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "var(--text-muted)", marginTop: 2 }}>
            4.3% OF TOTAL MARKET LEVERAGE
          </div>
        </div>

        <div style={{ background: "rgba(255,214,0,0.1)", border: "1px solid rgba(255,214,0,0.3)", padding: "12px 14px" }}>
          <div className="terminal-label">REPORTING BROKERS BOOK</div>
          <div className="value-mono" style={{ fontSize: "1.3rem", color: "var(--yellow)", fontWeight: 700, marginTop: 4 }}>
            ₹1.12 lakh crore
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "var(--text-muted)", marginTop: 2 }}>
            43 DISCLOSED REPORTING BROKERS
          </div>
        </div>
      </div>

      {/* Grid Charts Section */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "var(--border-subtle)", borderBottom: "1px solid var(--border-subtle)" }}>
        {/* Chart 1: Total MTF Book Growth */}
        <div style={{ background: "var(--bg-panel)", padding: 16 }}>
          <div className="terminal-label" style={{ color: "var(--purple)", marginBottom: 12 }}>
            TOTAL MTF MARKET OUTSTANDING BOOK SIZE OVER TIME (₹ CRORES)
          </div>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="mtfGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--purple)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="var(--purple)" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(99,120,180,0.06)" strokeDasharray="2 4" />
                <XAxis dataKey="date" tick={{ fill: "var(--text-muted)", fontSize: 8, fontFamily: "var(--font-mono)" }} />
                <YAxis tick={{ fill: "var(--text-muted)", fontSize: 8, fontFamily: "var(--font-mono)" }} unit=" Cr" />
                <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border-glow)", fontFamily: "var(--font-mono)", fontSize: "0.65rem" }} />
                <Area type="monotone" dataKey="outstanding_cr" name="MTF Outstanding (₹ Cr)" stroke="var(--purple)" strokeWidth={2} fill="url(#mtfGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: FnO vs Non-FnO vs ETF MTF Distribution */}
        <div style={{ background: "var(--bg-panel)", padding: 16 }}>
          <div className="terminal-label" style={{ color: "var(--cyan)", marginBottom: 12 }}>
            MTF FUNDED ASSETS BY CLASS (FnO vs NON-FnO STOCKS vs ETFs)
          </div>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={aumClass} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="rgba(99,120,180,0.06)" strokeDasharray="2 4" />
                <XAxis dataKey="date" tick={{ fill: "var(--text-muted)", fontSize: 8, fontFamily: "var(--font-mono)" }} />
                <YAxis tick={{ fill: "var(--text-muted)", fontSize: 8, fontFamily: "var(--font-mono)" }} unit=" Cr" />
                <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border-glow)", fontFamily: "var(--font-mono)", fontSize: "0.65rem" }} />
                <Legend wrapperStyle={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem" }} />
                <Line type="monotone" dataKey="fno_cr"     name="FnO Stocks MTF (₹ Cr)" stroke="var(--cyan)"   strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="non_fno_cr" name="Non-FnO MTF (₹ Cr)"    stroke="var(--yellow)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="etf_cr"     name="ETF MTF (₹ Cr)"        stroke="var(--green)"  strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tables Section: Top Funded Stocks & Broker Books */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "var(--border-subtle)" }}>
        {/* Table 1: Top MTF Funded Stocks */}
        <div style={{ background: "var(--bg-panel)", padding: 16 }}>
          <div className="terminal-label" style={{ color: "var(--green)", marginBottom: 12 }}>
            MOST LEVERAGED STOCKS BY MTF OUTSTANDING POSITIONS
          </div>
          <table className="terminal-table">
            <thead>
              <tr>
                <th>SYMBOL</th>
                <th>MTF OUTSTANDING</th>
                <th>24H MTF CHANGE</th>
                <th>FREE FLOAT LEVERAGED %</th>
              </tr>
            </thead>
            <tbody>
              {topStocks.map((s: any) => (
                <tr key={s.symbol}>
                  <td>
                    <Link href={`/stock/${s.symbol}`} className="symbol-link">
                      {s.symbol}
                    </Link>
                  </td>
                  <td className="value-mono">₹{fmt(s.mtf_outstanding_cr)} Cr</td>
                  <td className="value-mono" style={{ color: s.mtf_change_pct >= 0 ? "var(--green)" : "var(--red)" }}>
                    +{s.mtf_change_pct}%
                  </td>
                  <td className="value-mono" style={{ color: s.free_float_leveraged_pct > 8 ? "var(--yellow)" : "var(--cyan)", fontWeight: 700 }}>
                    {s.free_float_leveraged_pct}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table 2: Disclosed Broker MTF Funded Books */}
        <div style={{ background: "var(--bg-panel)", padding: 16 }}>
          <div className="terminal-label" style={{ color: "var(--yellow)", marginBottom: 12 }}>
            DISCLOSED BROKER MTF FUNDED BOOK RANKINGS
          </div>
          <table className="terminal-table">
            <thead>
              <tr>
                <th>BROKER NAME</th>
                <th>DISCLOSED MTF BOOK</th>
                <th>ESTIMATED MARKET SHARE %</th>
              </tr>
            </thead>
            <tbody>
              {brokers.map((b: any, idx: number) => (
                <tr key={idx}>
                  <td style={{ color: "var(--text-primary)", fontWeight: 500 }}>{b.name}</td>
                  <td className="value-mono">₹{fmt(b.book_cr)} Cr</td>
                  <td className="value-mono" style={{ color: "var(--purple)", fontWeight: 700 }}>
                    {b.share_pct ? `${b.share_pct}%` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Global Margin Debt Comparison Table */}
      {globalDebt.length > 0 && (
        <div style={{ padding: 16, borderTop: "1px solid var(--border-subtle)" }}>
          <div className="terminal-label" style={{ color: "var(--purple)", marginBottom: 12 }}>
            GLOBAL MARGIN DEBT COMPARISON (INDIA MTF vs US FINRA vs ASIA)
          </div>
          <table className="terminal-table">
            <thead>
              <tr>
                <th>COUNTRY / MARKET</th>
                <th>METRIC NAME</th>
                <th>NATIVE VALUE</th>
                <th>INR EQUIVALENT (LAKH CRORES)</th>
              </tr>
            </thead>
            <tbody>
              {globalDebt.map((m: any, idx: number) => (
                <tr key={idx}>
                  <td style={{ color: "var(--text-primary)", fontWeight: 700 }}>{m.country}</td>
                  <td style={{ color: "var(--text-secondary)" }}>{m.metric}</td>
                  <td className="value-mono">{m.native_val ? `${m.native_val.toLocaleString()} ${m.currency}` : "—"}</td>
                  <td className="value-mono" style={{ color: "var(--cyan)", fontWeight: 700 }}>
                    ₹{fmt(m.inr_lakh_cr)} Lakh Cr
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
