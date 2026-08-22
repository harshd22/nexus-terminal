"use client";
import { useEffect, useState } from "react";
import { FileText, Download, ExternalLink, BookOpen } from "lucide-react";

interface Props {
  symbol: string;
}

export function ConcallGuidance({ symbol }: Props) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import("@/lib/api").then(({ api }) =>
      api
        .get(`/api/market/concall/${symbol}`)
        .then((r) => setData(r.data))
        .catch(() => setData(null))
        .finally(() => setLoading(false))
    );
  }, [symbol]);

  if (loading) return <div className="skeleton" style={{ height: 260 }} />;

  const transcripts  = data?.transcripts || [];
  const annualReports = data?.annual_reports || [];
  const announcements = data?.announcements || [];
  const takeaways    = data?.key_takeaways || [];

  return (
    <div style={{ background: "var(--bg-panel)", border: "1px solid var(--border-glow)" }}>
      <div className="section-header">
        <span className="terminal-heading">CONCALL TRANSCRIPTS, ANNUAL REPORTS & FILINGS (PDF DOWNLOADS)</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "var(--border-subtle)" }}>
        {/* Left Column: Concall Transcripts & Annual Reports PDF Downloads */}
        <div style={{ background: "var(--bg-panel)", padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Concall Transcripts PDFs */}
          <div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.7rem",
                fontWeight: 700,
                color: "var(--purple)",
                marginBottom: 10,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <FileText size={14} /> EARNINGS CONCALL TRANSCRIPTS & PRESENTATIONS (PDF)
            </div>
            {transcripts.length === 0 ? (
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--text-muted)" }}>
                NO CONCALL DOCUMENTS FOUND
              </div>
            ) : (
              transcripts.map((item: any, i: number) => {
                const title = typeof item === "string" ? item : item.title;
                const url = typeof item === "string" ? "#" : item.url;
                return (
                  <div
                    key={i}
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.72rem",
                      padding: "8px 10px",
                      background: "var(--bg-card)",
                      border: "1px solid var(--border-subtle)",
                      marginBottom: 6,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 12,
                      borderRadius: 2,
                    }}
                  >
                    <span style={{ flex: 1, color: "var(--text-primary)", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis" }}>
                      {title}
                    </span>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.6rem",
                        padding: "3px 8px",
                        background: "rgba(157,78,221,0.15)",
                        border: "1px solid var(--purple)",
                        color: "var(--purple)",
                        textDecoration: "none",
                        fontWeight: 700,
                        borderRadius: 2,
                        whiteSpace: "nowrap",
                      }}
                    >
                      <Download size={12} /> OPEN PDF <ExternalLink size={10} />
                    </a>
                  </div>
                );
              })
            )}
          </div>

          {/* Annual Reports PDFs */}
          <div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.7rem",
                fontWeight: 700,
                color: "var(--cyan)",
                marginBottom: 10,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <BookOpen size={14} /> ANNUAL REPORTS (PDF DOWNLOADS)
            </div>
            {annualReports.map((ar: any, i: number) => (
              <div
                key={i}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.72rem",
                  padding: "8px 10px",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-subtle)",
                  marginBottom: 6,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12,
                  borderRadius: 2,
                }}
              >
                <span style={{ flex: 1, color: "var(--text-primary)", fontWeight: 500 }}>
                  {ar.title}
                </span>
                <a
                  href={ar.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.6rem",
                    padding: "3px 8px",
                    background: "rgba(0,229,255,0.15)",
                    border: "1px solid var(--cyan)",
                    color: "var(--cyan)",
                    textDecoration: "none",
                    fontWeight: 700,
                    borderRadius: 2,
                    whiteSpace: "nowrap",
                  }}
                >
                  <Download size={12} /> ANNUAL REPORT PDF <ExternalLink size={10} />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Management Guidance & Filings */}
        <div style={{ background: "var(--bg-panel)", padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Management Guidance Takeaways */}
          <div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.7rem",
                fontWeight: 700,
                color: "var(--green)",
                marginBottom: 10,
              }}
            >
              MANAGEMENT GUIDANCE & STRATEGIC TAKEAWAYS
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
              {takeaways.map((note: string, idx: number) => (
                <li
                  key={idx}
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.75rem",
                    color: "var(--text-primary)",
                    lineHeight: 1.6,
                    marginBottom: 10,
                    paddingLeft: 12,
                    borderLeft: "2px solid var(--green)",
                  }}
                >
                  {note}
                </li>
              ))}
            </ul>
          </div>

          {/* BSE/NSE Corporate Announcement Filings */}
          {announcements.length > 0 && (
            <div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  color: "var(--yellow)",
                  marginBottom: 10,
                }}
              >
                RECENT EXCHANGE ANNOUNCEMENT FILINGS (PDF)
              </div>
              {announcements.slice(0, 4).map((ann: any, idx: number) => (
                <div
                  key={idx}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.68rem",
                    padding: "6px 8px",
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-subtle)",
                    marginBottom: 4,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, marginRight: 8 }}>
                    {ann.title}
                  </span>
                  <a
                    href={ann.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "var(--yellow)",
                      fontSize: "0.58rem",
                      fontWeight: 700,
                      textDecoration: "none",
                    }}
                  >
                    FILING PDF ↗
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
