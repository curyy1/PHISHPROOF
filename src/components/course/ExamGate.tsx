"use client";

import Link from "next/link";
import { modules } from "@/content";
import { EXAM_PASS_PERCENT } from "@/content/exam";
import { examUnlocked, quizPassed } from "@/lib/progress";
import { useProgress } from "@/components/ProgressProvider";
import { QuizRunner } from "./QuizRunner";

export function ExamGate() {
  const { state, loading } = useProgress();
  if (loading || !state) return <div className="card h-64 animate-pulse" aria-hidden />;
  if (!examUnlocked(state))
    return (
      <div className="card p-8 sm:p-10">
        <p className="text-5xl" aria-hidden>🔒</p>
        <h1 className="mt-4 text-headline font-bold">The final exam unlocks after every module quiz</h1>
        <p className="mt-3 text-muted">Pass each module quiz (70%+) to unlock the exam and your certificate.</p>
        <ul className="mt-6 space-y-2">
          {modules.map((m) => {
            const ok = quizPassed(state, m.id);
            return (
              <li key={m.id}>
                <Link href={`/learn/${m.id}/quiz`} className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-sunken">
                  <span className={ok ? "text-success" : "text-subtle"} aria-hidden>{ok ? "✓" : "○"}</span>
                  <span>Module {m.number}: {m.title}</span>
                  <span className="sr-only">{ok ? "passed" : "not passed yet"}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    );
  return (
    <QuizRunner
      quizId="final"
      title="Final exam"
      passPercent={EXAM_PASS_PERCENT}
      shuffle
      exitHref="/learn"
      continueHref="/certificate"
      continueLabel="Claim your certificate →"
    />
  );
}
