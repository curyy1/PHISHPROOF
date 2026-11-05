"use client";

import Link from "next/link";
import { m as mo } from "framer-motion";
import { modules } from "@/content";
import { examPassed, examUnlocked, moduleProgress } from "@/lib/progress";
import { useProgress } from "@/components/ProgressProvider";
import { ProgressBar } from "@/components/ui/ProgressRing";
import { Pill } from "@/components/ui/Pill";

export function ModuleGrid({ locked }: { locked: boolean }) {
  const { state } = useProgress();
  return (
    <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {modules.map((m, i) => {
        const p = state ? moduleProgress(state, m) : null;
        const isLocked = locked && !m.guestAccessible;
        return (
          <mo.li
            key={m.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: (i % 3) * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              href={`/learn/${m.id}`}
              className="card group flex h-full flex-col p-6 transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start justify-between gap-3">
                <span aria-hidden className="text-4xl transition-transform duration-300 group-hover:scale-110">
                  {m.icon}
                </span>
                {p?.complete ? (
                  <Pill tone="success">✓ Complete</Pill>
                ) : isLocked ? (
                  <Pill>🔒 Free account</Pill>
                ) : m.guestAccessible && locked ? (
                  <Pill tone="brand">Try free</Pill>
                ) : null}
              </div>
              <p className="mt-5 text-sm font-semibold text-subtle">Module {m.number}</p>
              <h2 className="mt-1 text-title font-bold">{m.title}</h2>
              <p className="mt-2 flex-1 text-muted">{m.tagline}</p>
              <div className="mt-5">
                <div className="mb-2 flex justify-between text-xs text-subtle">
                  <span>{m.lessons.length} lessons · drill · quiz</span>
                  <span>{Math.round((p?.ratio ?? 0) * 100)}%</span>
                </div>
                <ProgressBar value={p?.ratio ?? 0} label={`${m.title} progress`} />
              </div>
            </Link>
          </mo.li>
        );
      })}
      <li>
        <Link
          href="/exam"
          className="card flex h-full flex-col bg-gradient-to-br from-brand to-[#7c4dff] p-6 text-white transition-transform duration-300 hover:-translate-y-1"
        >
          <span aria-hidden className="text-4xl">🏅</span>
          <p className="mt-5 text-sm font-semibold text-white/80">Module 8</p>
          <h2 className="mt-1 text-title font-bold">Final exam & certificate</h2>
          <p className="mt-2 flex-1 text-white/85">20 questions. Score 80% to earn a verifiable certificate.</p>
          <p className="mt-5 text-sm font-semibold">
            {state && examPassed(state) ? "✓ Passed — view certificate" : state && examUnlocked(state) ? "Unlocked — take the exam →" : "Pass all 7 module quizzes to unlock"}
          </p>
        </Link>
      </li>
    </ol>
  );
}
