import { clsx } from "clsx";
import type { ReactNode } from "react";

type Tone = "neutral" | "brand" | "danger" | "success" | "warn";
const tones: Record<Tone, string> = {
  neutral: "bg-sunken text-muted",
  brand: "bg-brand-soft text-brand-ink",
  danger: "bg-danger-soft text-danger-ink",
  success: "bg-success-soft text-success-ink",
  warn: "bg-warn-soft text-warn-ink",
};

export function Pill({ tone = "neutral", children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  return (
    <span className={clsx("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold", tones[tone], className)}>
      {children}
    </span>
  );
}

/** Small, always-visible label used on every simulated phishing UI. */
export function TrainingBadge({ className }: { className?: string }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-md bg-warn-soft px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-warn-ink",
        className,
      )}
    >
      <svg viewBox="0 0 16 16" className="h-3 w-3" aria-hidden fill="currentColor">
        <path d="M8 1 1 14h14L8 1Zm-.75 5h1.5v4h-1.5V6Zm0 5h1.5v1.5h-1.5V11Z" />
      </svg>
      Training simulation
    </span>
  );
}
