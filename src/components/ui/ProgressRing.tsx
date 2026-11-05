"use client";

import { motion, useReducedMotion } from "framer-motion";

/** Circular progress ring. Animates the stroke via pathLength (rendered as a transform-free SVG dash animation). */
export function ProgressRing({
  value,
  size = 120,
  stroke = 10,
  label,
  sublabel,
  tone = "brand",
}: {
  value: number; // 0..1
  size?: number;
  stroke?: number;
  label?: string;
  sublabel?: string;
  tone?: "brand" | "success" | "danger";
}) {
  const reduce = useReducedMotion();
  const v = Math.max(0, Math.min(1, value));
  const r = (size - stroke) / 2;
  const color = tone === "success" ? "var(--success)" : tone === "danger" ? "var(--danger)" : "var(--brand)";
  return (
    <div
      className="relative inline-grid place-items-center"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${Math.round(v * 100)} percent${label ? ` — ${label}` : ""}`}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--bg-sunken)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          initial={{ pathLength: reduce ? v : 0 }}
          animate={{ pathLength: v }}
          transition={{ duration: reduce ? 0 : 1.1, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center" aria-hidden>
        <div>
          <div className="font-display text-[1.6em] font-bold leading-none tabular-nums" style={{ fontSize: size / 4.2 }}>
            {label ?? `${Math.round(v * 100)}%`}
          </div>
          {sublabel && <div className="mt-1 text-xs text-muted">{sublabel}</div>}
        </div>
      </div>
    </div>
  );
}

export function ProgressBar({ value, label, className = "" }: { value: number; label: string; className?: string }) {
  const v = Math.max(0, Math.min(1, value));
  return (
    <div
      className={`h-2 w-full overflow-hidden rounded-full bg-sunken ${className}`}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(v * 100)}
    >
      <div
        className="h-full origin-left rounded-full bg-brand transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)]"
        style={{ transform: `scaleX(${v})` }}
      />
    </div>
  );
}
