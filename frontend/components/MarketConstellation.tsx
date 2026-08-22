"use client";
import { useEffect, useRef, useState } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  advancing: boolean;
}

export function MarketConstellation() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ambient, setAmbient] = useState(true);
  const [pulse, setPulse] = useState<{ x: number; y: number; radius: number } | null>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const width = (canvas.width = canvas.parentElement?.clientWidth || 500);
    const height = (canvas.height = 320);

    const nodeCount = 55;
    const nodes: Node[] = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * (width - 40) + 20,
      y: Math.random() * (height - 40) + 20,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      size: Math.random() * 3 + 2,
      advancing: Math.random() > 0.75, // 11% to 25% advancing
    }));

    const render = () => {
      ctx.fillStyle = "#040610";
      ctx.fillRect(0, 0, width, height);

      // Draw subtle grid lines
      ctx.strokeStyle = "rgba(99,120,180,0.05)";
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
      }

      // Update and draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 85) {
            const alpha = (1 - dist / 85) * 0.4;
            const isAdv = nodes[i].advancing || nodes[j].advancing;
            ctx.strokeStyle = isAdv ? `rgba(255, 171, 64, ${alpha})` : `rgba(79, 195, 247, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Move & draw nodes
      nodes.forEach((node) => {
        if (ambient) {
          node.x += node.vx;
          node.y += node.vy;
          if (node.x < 15 || node.x > width - 15) node.vx *= -1;
          if (node.y < 15 || node.y > height - 15) node.vy *= -1;
        }

        // Mouse attraction
        const mdx = mouseRef.current.x - node.x;
        const mdy = mouseRef.current.y - node.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 100) {
          node.x += (mdx / mdist) * 0.5;
          node.y += (mdy / mdist) * 0.5;
        }

        // Draw node square/dot
        const glowColor = node.advancing ? "#ffab40" : "#4fc3f7";
        ctx.fillStyle = glowColor;
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = node.advancing ? 8 : 4;
        ctx.fillRect(node.x - node.size / 2, node.y - node.size / 2, node.size, node.size);
        ctx.shadowBlur = 0;
      });

      // Render click pulse
      if (pulse) {
        ctx.strokeStyle = "rgba(255, 171, 64, " + (1 - pulse.radius / 120) + ")";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(pulse.x, pulse.y, pulse.radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [ambient, pulse]);

  useEffect(() => {
    if (!pulse) return;
    const interval = setInterval(() => {
      setPulse((p) => {
        if (!p || p.radius >= 120) return null;
        return { ...p, radius: p.radius + 4 };
      });
    }, 16);
    return () => clearInterval(interval);
  }, [pulse]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      setPulse({ x: e.clientX - rect.left, y: e.clientY - rect.top, radius: 10 });
    }
  };

  return (
    <div style={{ position: "relative", background: "#040610", border: "1px solid var(--border-subtle)" }}>
      {/* Top status bar */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "8px 12px", borderBottom: "1px solid var(--border-subtle)",
        fontFamily: "var(--text-mono)", fontSize: "0.6rem", letterSpacing: "0.12em",
      }}>
        <span style={{ color: "var(--amber)" }}>● 55/500 ADVANCING</span>
        <button
          onClick={() => setAmbient(!ambient)}
          style={{
            fontFamily: "var(--text-mono)", fontSize: "0.58rem",
            padding: "2px 8px", background: ambient ? "rgba(255,171,64,0.15)" : "transparent",
            border: "1px solid var(--amber)", color: "var(--amber)",
            cursor: "pointer", borderRadius: 1,
          }}
        >
          AMBIENT {ambient ? "ON" : "OFF"}
        </button>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        style={{ width: "100%", height: 320, display: "block", cursor: "crosshair" }}
      />

      {/* Bottom overlay text */}
      <div style={{
        position: "absolute", bottom: 12, left: 16, right: 16,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        pointerEvents: "none",
      }}>
        <div className="terminal-label" style={{ color: "var(--amber)", fontSize: "0.65rem", fontWeight: 700 }}>
          MARKET CORE — 11% OF UNIVERSE ADVANCING
        </div>
        <div style={{ fontFamily: "var(--text-mono)", fontSize: "0.55rem", color: "var(--text-muted)" }}>
          daily closes · click graph to fire pulse · move mouse through it
        </div>
      </div>
    </div>
  );
}
