"use client";

import Link from "next/link";
import { useProgress } from "@/components/ProgressProvider";
import { nextStep, overallProgress } from "@/lib/progress";
import { ProgressRing } from "@/components/ui/ProgressRing";

export function ContinueCard() {
  const { state, loading } = useProgress();
  if (loading || !state) return <div className="card h-[132px] animate-pulse" aria-hidden />;
  const step = nextStep(state);
  const pct = overallProgress(state);
  return (
    <div className="card flex flex-col items-start gap-5 p-6 sm:flex-row sm:items-center">
      <ProgressRing value={pct} size={84} stroke={8} />
      <div className="min-w-0 flex-1">
        <p className="text-sm text-subtle">{pct === 0 ? "Start here" : "Continue where you left off"}</p>
        <p className="mt-0.5 truncate text-title font-bold">{step.label}</p>
        <p className="text-sm text-muted">{step.detail}</p>
      </div>
      <Link href={step.href} className="inline-flex h-11 items-center rounded-full bg-brand px-5 font-semibold text-brand-fg transition-transform active:scale-95">
        {pct === 0 ? "Start" : "Continue"} →
      </Link>
    </div>
  );
}
