"use client";
interface Props {
  message?: string;
  height?: number;
}
export function DataUnavailable({ message = "DATA UNAVAILABLE", height = 60 }: Props) {
  return (
    <div
      style={{
        height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--text-mono)",
        fontSize: "0.65rem",
        color: "var(--text-muted)",
        letterSpacing: "0.12em",
        border: "1px dashed var(--border-subtle)",
        borderRadius: 2,
      }}
    >
      ── {message} ──
    </div>
  );
}
