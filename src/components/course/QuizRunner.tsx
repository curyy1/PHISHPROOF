"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { clsx } from "clsx";
import { useEffect, useMemo, useRef, useState } from "react";
import type { QuizQuestion } from "@/content/types";
import { questionsFor } from "@/lib/progress";
import { useProgress } from "@/components/ProgressProvider";
import { RichText } from "@/components/RichText";
import { BlockView } from "./Blocks";
import { Button, ButtonLink } from "@/components/ui/Button";
import { ProgressBar, ProgressRing } from "@/components/ui/ProgressRing";

type Phase = "intro" | "question" | "submitting" | "results";

export function QuizRunner({
  quizId,
  title,
  passPercent,
  shuffle = false,
  continueHref,
  continueLabel,
}: {
  quizId: string;
  title: string;
  passPercent: number;
  shuffle?: boolean;
  continueHref: string;
  continueLabel: string;
}) {
  const base = useMemo(() => questionsFor(quizId) ?? [], [quizId]);
  const [questions, setQuestions] = useState<QuizQuestion[]>(base);
  const [phase, setPhase] = useState<Phase>("intro");
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<{ score: number; total: number; results: Record<string, boolean>; xp: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { submit } = useProgress();
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Focus the question heading when it changes (screen readers + keyboard users).
  useEffect(() => {
    if (phase === "question" || phase === "results") headingRef.current?.focus();
  }, [phase, i]);

  function start() {
    if (shuffle) setQuestions([...base].sort(() => Math.random() - 0.5));
    setAnswers({});
    setI(0);
    setResult(null);
    setError(null);
    setPhase("question");
  }

  const q = questions[i];
  const picked = q ? answers[q.id] : undefined;
  const answered = picked !== undefined;

  function choose(idx: number) {
    if (answered || !q) return;
    setAnswers((a) => ({ ...a, [q.id]: idx }));
  }

  async function next() {
    if (i < questions.length - 1) {
      setI(i + 1);
      return;
    }
    setPhase("submitting");
    const r = await submit({ type: "quiz_submit", quizId, answers });
    if ("error" in r) {
      setError(r.error);
      setPhase("question");
      return;
    }
    if (r.graded.type === "quiz") setResult({ score: r.graded.score, total: r.graded.total, results: r.graded.results, xp: r.xpGained });
    setPhase("results");
  }

  // Keyboard shortcuts: 1–4 to answer, Enter for next.
  useEffect(() => {
    if (phase !== "question") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && ["INPUT", "TEXTAREA"].includes(e.target.tagName)) return;
      const n = Number(e.key);
      if (n >= 1 && q && n <= q.options.length) choose(n - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (phase === "intro")
    return (
      <div className="card p-8 text-center sm:p-12">
        <p className="text-5xl" aria-hidden>📝</p>
        <h1 className="mt-4 text-headline font-bold">{title}</h1>
        <p className="mt-3 text-muted">
          {base.length} questions · pass with {passPercent}% · explanations after every answer
        </p>
        <p className="mt-1 text-sm text-subtle">Tip: press 1–4 to pick an answer.</p>
        <Button size="lg" className="mt-8" onClick={start} data-testid="start-quiz">
          Start
        </Button>
      </div>
    );

  if (phase === "results" && result) {
    const pct = Math.round((result.score / result.total) * 100);
    const passed = pct >= passPercent;
    return (
      <div>
        <div className="card p-8 text-center sm:p-12">
          <ProgressRing value={result.score / result.total} size={140} tone={passed ? "success" : "danger"} label={`${result.score}/${result.total}`} sublabel={`${pct}%`} />
          <h1 ref={headingRef} tabIndex={-1} className="mt-6 text-headline font-bold outline-none">
            {passed ? (pct === 100 ? "Perfect score! 🎉" : "You passed! 🎉") : "Almost there"}
          </h1>
          <p className="mt-2 text-muted">
            {passed ? `You needed ${passPercent}% and scored ${pct}%.` : `You need ${passPercent}% to pass. Review the explanations below and try again.`}
            {result.xp > 0 && ` +${result.xp} XP.`}
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            {passed && <ButtonLink href={continueHref} size="lg">{continueLabel}</ButtonLink>}
            <Button variant={passed ? "secondary" : "primary"} size="lg" onClick={start}>
              {passed ? "Retake" : "Try again"}
            </Button>
          </div>
        </div>
        <h2 className="mt-10 text-title font-bold">Review</h2>
        <ol className="mt-4 space-y-3">
          {questions.map((qq, n) => {
            const ok = result.results[qq.id];
            const chosen = answers[qq.id];
            const correct = qq.options.find((o) => o.correct)!;
            return (
              <li key={qq.id} className="card p-5">
                <p className="font-semibold">
                  <span className={ok ? "text-success" : "text-danger"} aria-label={ok ? "Correct" : "Incorrect"}>{ok ? "✓" : "✗"}</span>{" "}
                  {n + 1}. <RichText text={qq.prompt} />
                </p>
                {!ok && chosen !== undefined && (
                  <p className="mt-2 text-sm text-muted">
                    You answered “{qq.options[chosen].text}”. <RichText text={qq.options[chosen].why} />
                  </p>
                )}
                <p className="mt-2 text-sm">
                  <span className="font-semibold text-success">Answer:</span> {correct.text} — <span className="text-muted"><RichText text={correct.why} /></span>
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    );
  }

  if (!q) return null;
  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4 text-sm text-muted">
        <span>
          Question {i + 1} of {questions.length}
        </span>
        <Link href={continueHref.split("#")[0]} className="hover:text-fg">Exit</Link>
      </div>
      <ProgressBar value={(i + (answered ? 1 : 0)) / questions.length} label="Quiz progress" />
      <AnimatePresence mode="wait">
        <motion.div
          key={q.id}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.25 }}
          className="mt-8"
        >
          <h1 ref={headingRef} tabIndex={-1} className="text-title font-bold outline-none sm:text-headline">
            <RichText text={q.prompt} />
          </h1>
          {q.exhibit && (
            <div className="mt-5">
              <BlockView block={q.exhibit} />
            </div>
          )}
          <div className="mt-6 space-y-2.5" role="group" aria-label="Answer options">
            {q.options.map((o, idx) => {
              const isPicked = picked === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => choose(idx)}
                  disabled={answered}
                  aria-pressed={isPicked}
                  data-testid={`option-${idx}`}
                  className={clsx(
                    "flex w-full items-start gap-3 rounded-2xl border-2 bg-elevated px-4 py-3.5 text-left transition-[transform,border-color,background-color] duration-200 active:scale-[0.99]",
                    !answered && "border-line hover:border-brand",
                    answered && o.correct && "border-success bg-success-soft",
                    answered && isPicked && !o.correct && "border-danger bg-danger-soft",
                    answered && !isPicked && !o.correct && "border-line opacity-55",
                  )}
                >
                  <span aria-hidden className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-sunken text-xs font-bold">
                    {answered && o.correct ? "✓" : answered && isPicked ? "✗" : idx + 1}
                  </span>
                  <span>{o.text}</span>
                </button>
              );
            })}
          </div>
          <AnimatePresence>
            {answered && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-5" role="status">
                <div className={clsx("rounded-2xl p-5", q.options[picked].correct ? "bg-success-soft" : "bg-danger-soft")}>
                  <p className={clsx("font-bold", q.options[picked].correct ? "text-success-ink" : "text-danger-ink")}>
                    {q.options[picked].correct ? "Correct!" : "Not quite."}
                  </p>
                  <p className="mt-1 text-fg">
                    <RichText text={q.options[picked].why} />
                  </p>
                  {!q.options[picked].correct && (
                    <p className="mt-2 text-sm text-muted">
                      <span className="font-semibold">Correct answer:</span> {q.options.find((o) => o.correct)!.text}.{" "}
                      <RichText text={q.options.find((o) => o.correct)!.why} />
                    </p>
                  )}
                </div>
                {error && <p role="alert" className="mt-3 text-sm text-danger">{error}</p>}
                <Button size="lg" className="mt-5 w-full sm:w-auto" onClick={next} disabled={phase === "submitting"} data-testid="next-question" autoFocus>
                  {phase === "submitting" ? "Grading…" : i < questions.length - 1 ? "Next question →" : "See my score"}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
