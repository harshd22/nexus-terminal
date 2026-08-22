"use client";
import { useEffect, useRef, useState } from "react";
import type { TerminalLogStep } from "@/lib/types";

interface Props {
  steps: TerminalLogStep[];
  onComplete?: () => void;
}

export function TerminalLog({ steps, onComplete }: Props) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [steps]);

  useEffect(() => {
    const done = steps.every((s) => s.status === "done" || s.status === "error");
    if (done && steps.length > 0) onComplete?.();
  }, [steps, onComplete]);

  return (
    <div className="terminal-log" style={{ minHeight: 120 }}>
      {steps.map((step, i) => (
        <div key={i} style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span className="log-prompt">
            {step.status === "done"  && "✔"}
            {step.status === "error" && "✗"}
            {step.status === "active" && "▶"}
            {step.status === "pending" && "·"}
          </span>
          <span
            className={
              step.status === "done"    ? "log-done"
              : step.status === "error" ? "log-error"
              : step.status === "active" ? "log-active"
              : "log-prompt"
            }
          >
            {step.message}
            {step.status === "active" && <span style={{ opacity: 0.7 }}> ▌</span>}
          </span>
        </div>
      ))}
      <div ref={endRef} />
    </div>
  );
}

/** Hook to drive terminal log from a list of messages with delays */
export function useTerminalLog(messages: string[], autoStart = true) {
  const [steps, setSteps] = useState<TerminalLogStep[]>(
    messages.map((m) => ({ message: m, status: "pending" as const }))
  );
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    if (!autoStart) return;
    let i = 0;
    const run = () => {
      if (i >= messages.length) { setComplete(true); return; }
      setCurrentIndex(i);
      setSteps((prev) =>
        prev.map((s, idx) => ({
          ...s,
          status: idx < i ? "done" : idx === i ? "active" : "pending",
        }))
      );
      setTimeout(() => {
        setSteps((prev) =>
          prev.map((s, idx) => ({ ...s, status: idx <= i ? "done" : "pending" }))
        );
        i++;
        setTimeout(run, 120);
      }, 400 + Math.random() * 300);
    };
    setTimeout(run, 200);
  }, [messages, autoStart]);

  return { steps, currentIndex, complete };
}
