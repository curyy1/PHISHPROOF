"use client";

import Link from "next/link";
import { clsx } from "clsx";
import { moduleById } from "@/content";
import { bestQuiz, drillProgress, moduleProgress } from "@/lib/progress";
import { useProgress } from "@/components/ProgressProvider";

function Check({ done }: { done: boolean }) {
  return (
    <span
      aria-hidden
      className={clsx(
        "grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 text-sm font-bold transition-colors",
        done ? "border-success bg-success text-on-success" : "border-line-strong text-transparent",
      )}
    >
      ✓
    </span>
  );
}

export function ModuleChecklist({ moduleId }: { moduleId: string }) {
  const m = moduleById.get(moduleId)!;
  const { state } = useProgress();
  const p = state ? moduleProgress(state, m) : null;
  const best = state ? bestQuiz(state, m.id) : null;
  const dp = state ? drillProgress(state, m) : 0;
  const row = "card flex items-center gap-4 p-4 transition-transform duration-200 hover:-translate-y-0.5 sm:p-5";
  return (
    <div className="space-y-6">
      <section aria-labelledby="lessons-h">
        <h2 id="lessons-h" className="mb-3 text-sm font-semibold uppercase tracking-wide text-subtle">
          Lessons {p && `· ${p.lessonsDone}/${p.lessonsTotal}`}
        </h2>
        <ol className="space-y-2.5">
          {m.lessons.map((l, i) => {
            const done = !!state?.lessons[l.id];
            return (
              <li key={l.id}>
                <Link href={`/learn/${m.id}/${l.id}`} className={row}>
                  <Check done={done} />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">
                      {i + 1}. {l.title}
                      <span className="sr-only">{done ? " (completed)" : ""}</span>
                    </p>
                    <p className="truncate text-sm text-muted">{l.summary}</p>
                  </div>
                  <span className="shrink-0 text-xs text-subtle">{l.minutes} min</span>
                </Link>
              </li>
            );
          })}
        </ol>
      </section>
      <section aria-labelledby="practice-h">
        <h2 id="practice-h" className="mb-3 text-sm font-semibold uppercase tracking-wide text-subtle">Practice</h2>
        <div className="space-y-2.5">
          <Link href={`/learn/${m.id}/drill`} className={row}>
            <Check done={!!p?.drill} />
            <div className="min-w-0 flex-1">
              <p className="font-semibold">🎯 {m.drill.title}</p>
              <p className="text-sm text-muted">{m.drill.description}</p>
            </div>
            {dp > 0 && dp < 1 && <span className="shrink-0 text-xs text-subtle">{Math.round(dp * 100)}%</span>}
          </Link>
          <Link href={`/learn/${m.id}/quiz`} className={row}>
            <Check done={!!p?.quiz} />
            <div className="min-w-0 flex-1">
              <p className="font-semibold">📝 Module quiz</p>
              <p className="text-sm text-muted">
                {m.quiz.length} questions · pass with 70%
                {best && ` · best ${best.score}/${best.total}`}
              </p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
