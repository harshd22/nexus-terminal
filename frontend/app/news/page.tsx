"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getNews } from "@/lib/api";
import type { NewsArticle } from "@/lib/types";
import { DataUnavailable } from "@/components/DataUnavailable";
import { ExternalLink } from "lucide-react";

const CATEGORIES = ["ALL", "MARKET", "CORPORATE", "ECONOMY", "GEOPOLITICS"];

const SENTIMENT_COLORS: Record<string, string> = {
  POSITIVE: "var(--green)",
  NEGATIVE: "var(--red)",
  NEUTRAL:  "var(--text-muted)",
};

export default function NewsPage() {
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cat = searchParams?.get("category")?.toUpperCase();
    if (cat && CATEGORIES.includes(cat)) setActiveCategory(cat);
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    getNews(activeCategory === "ALL" ? undefined : activeCategory, 60)
      .then((d) => setArticles(d.articles || []))
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  }, [activeCategory]);

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
          NEXUS TERMINAL // NEWS ENGINE
        </h1>
      </div>

      {/* Category filter */}
      <div style={{
        display: "flex", gap: 0,
        borderBottom: "1px solid var(--border-subtle)",
        background: "var(--bg-surface)",
      }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              fontFamily: "var(--text-mono)", fontSize: "0.62rem", letterSpacing: "0.1em",
              padding: "9px 16px", border: "none", cursor: "pointer",
              background: "transparent",
              color: activeCategory === cat ? "var(--purple)" : "var(--text-muted)",
              borderBottom: `2px solid ${activeCategory === cat ? "var(--purple)" : "transparent"}`,
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="section-header">
        <span className="terminal-heading">
          {activeCategory === "ALL" ? "LATEST NEWS" : `${activeCategory} NEWS`}
        </span>
        <span className="live-dot" style={{ marginLeft: 4 }} />
        <span style={{ marginLeft: "auto", fontFamily: "var(--text-mono)", fontSize: "0.58rem", color: "var(--text-muted)" }}>
          {articles.length} ARTICLES
        </span>
      </div>

      {loading ? (
        <div style={{ padding: 12 }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 56, marginBottom: 4 }} />
          ))}
        </div>
      ) : articles.length === 0 ? (
        <DataUnavailable message="NO NEWS — RSS FEEDS NOT YET INGESTED — RUN NEWS PROVIDER" height={200} />
      ) : (
        <div>
          {articles.map((a) => (
            <div
              key={a.id}
              style={{
                padding: "10px 16px",
                borderBottom: "1px solid var(--border-subtle)",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-hover)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <a
                    href={a.source_url ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: "none" }}
                  >
                    <div style={{
                      fontFamily: "var(--text-sans)", fontSize: "0.78rem",
                      color: "var(--text-primary)", lineHeight: 1.5, marginBottom: 4,
                    }}>
                      {a.headline}
                    </div>
                  </a>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <span style={{ fontFamily: "var(--text-mono)", fontSize: "0.58rem", color: "var(--blue)" }}>
                      {a.source}
                    </span>
                    {a.ticker && (
                      <span style={{
                        fontFamily: "var(--text-mono)", fontSize: "0.55rem",
                        color: "var(--text-muted)", background: "var(--bg-elevated)",
                        padding: "1px 5px", borderRadius: 1,
                      }}>
                        {a.ticker}
                      </span>
                    )}
                    {a.category && (
                      <span style={{ fontFamily: "var(--text-mono)", fontSize: "0.55rem", color: "var(--text-muted)" }}>
                        {a.category}
                      </span>
                    )}
                    {a.published_at && (
                      <span style={{ fontFamily: "var(--text-mono)", fontSize: "0.55rem", color: "var(--text-muted)", marginLeft: "auto" }}>
                        {new Date(a.published_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
                      </span>
                    )}
                    {a.sentiment && (
                      <span style={{
                        fontFamily: "var(--text-mono)", fontSize: "0.55rem",
                        color: SENTIMENT_COLORS[a.sentiment] ?? "var(--text-muted)",
                      }}>
                        ● {a.sentiment}
                      </span>
                    )}
                  </div>
                </div>
                {a.source_url && (
                  <a href={a.source_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink size={12} color="var(--text-muted)" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
