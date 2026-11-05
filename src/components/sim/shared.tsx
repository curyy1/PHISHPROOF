"use client";

import { AnimatePresence, m } from "framer-motion";
import { clsx } from "clsx";
import { useCallback, useState, type ReactNode } from "react";
import type { Hotspot } from "@/content/types";
import { FLAG_INFO } from "@/content";
import { RichText } from "@/components/RichText";
import { useProgress } from "@/components/ProgressProvider";
import { Button } from "@/components/ui/Button";
import type { DrillKind, GradedEvent } from "@/lib/progress";

export type DrillGrade = Extract<GradedEvent, { type: "drill" }>;

/** State for one simulator item: flagged elements, verdict, grading result. */
export function useDrillItem(drill: DrillKind, itemId: string) {
  const { submit } = useProgress();
  const [clicked, setClicked] = useState<Set<string>>(new Set());
  const [grade, setGrade] = useState<DrillGrade | null>(null);
  const [xp, setXp] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggle = useCallback(
    (id: string) => {
      if (grade) return;
      setClicked((s) => {
        const n = new Set(s);
        if (n.has(id)) n.delete(id);
        else n.add(id);
        return n;
      });
    },
    [grade],
  );

  const answer = useCallback(
    async (verdict: "phish" | "legit") => {
      setBusy(true);
      setError(null);
      const r = await submit({ type: "drill_answer", drill, itemId, verdict, clicked: [...clicked] });
      setBusy(false);
      if ("error" in r) return setError(r.error);
      if (r.graded.type === "drill") {
        setGrade(r.graded);
        setXp(r.xpGained);
      }
    },
    [submit, drill, itemId, clicked],
  );

  const reset = useCallback(() => {
    setClicked(new Set());
    setGrade(null);
    setXp(0);
    setError(null);
  }, []);

  return { clicked, toggle, grade, xp, busy, error, answer, reset };
}

/**
 * A piece of a simulated message the learner can click to flag as suspicious.
 * After grading it shows whether it was a real red flag (found / missed) or a false alarm.
 */
export function Flaggable({
  id,
  hs,
  clicked,
  grade,
  onToggle,
  children,
  className,
  label,
  as = "span",
}: {
  id: string;
  hs?: string;
  clicked: Set<string>;
  grade: DrillGrade | null;
  onToggle: (id: string) => void;
  children: ReactNode;
  className?: string;
  label: string;
  as?: "span" | "div";
}) {
  const isFlagged = clicked.has(id);
  const found = !!grade && !!hs && grade.foundIds.includes(hs);
  const missed = !!grade && !!hs && grade.missedIds.includes(hs);
  const falseAlarm = !!grade && isFlagged && !hs;
  const Tag = as;
  return (
    <Tag
      role="button"
      tabIndex={grade ? -1 : 0}
      aria-pressed={isFlagged}
      aria-describedby="flag-hint"
      title={grade ? undefined : `Flag as suspicious: ${label}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle(id);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle(id);
        }
      }}
      data-flag-id={id}
      className={clsx(
        "rounded-md transition-[background-color,box-shadow] duration-150",
        !grade && "cursor-pointer hover:bg-danger/10 focus-visible:bg-danger/10",
        !grade && isFlagged && "bg-danger/15 shadow-[0_0_0_2px_var(--danger)]",
        found && "flag-hit",
        missed && "flag-miss",
        falseAlarm && "bg-sunken line-through decoration-subtle",
        className,
      )}
    >
      {children}
      {!grade && isFlagged && (
        <span aria-hidden className="ml-1 inline-block align-middle text-xs">
          🚩
        </span>
      )}
    </Tag>
  );
}

/** Shared description for every flaggable element (referenced by aria-describedby). */
export function FlagHint() {
  return (
    <span id="flag-hint" className="sr-only">
      Toggle to flag this part as suspicious.
    </span>
  );
}

export function VerdictBar({
  onAnswer,
  busy,
  flagged,
  phishLabel = "🚩 It’s phishing",
  legitLabel = "✓ Looks legit",
  error,
}: {
  onAnswer: (v: "phish" | "legit") => void;
  busy: boolean;
  flagged: number;
  phishLabel?: string;
  legitLabel?: string;
  error?: string | null;
}) {
  return (
    <div className="sticky bottom-3 z-10 mt-4 rounded-2xl border border-line bg-elevated/95 p-3 shadow-xl backdrop-blur sm:p-4">
      <FlagHint />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted" aria-live="polite">
          {flagged === 0 ? "Tap anything suspicious to flag it, then decide." : `${flagged} item${flagged === 1 ? "" : "s"} flagged.`}
        </p>
        <div className="grid grid-cols-2 gap-2 sm:flex">
          <Button variant="danger" onClick={() => onAnswer("phish")} disabled={busy} data-testid="verdict-phish">
            {phishLabel}
          </Button>
          <Button variant="success" onClick={() => onAnswer("legit")} disabled={busy} data-testid="verdict-legit">
            {legitLabel}
          </Button>
        </div>
      </div>
      {error && (
        <p role="alert" className="mt-2 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

export function DrillFeedback({
  grade,
  hotspots,
  explain,
  xp,
  onNext,
  nextLabel = "Next →",
}: {
  grade: DrillGrade;
  hotspots: Hotspot[];
  explain: string;
  xp: number;
  onNext?: () => void;
  nextLabel?: string;
}) {
  const found = hotspots.filter((h) => grade.foundIds.includes(h.id));
  const missed = hotspots.filter((h) => grade.missedIds.includes(h.id));
  return (
    <AnimatePresence>
      <m.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="mt-4 overflow-hidden rounded-2xl border border-line bg-elevated"
        aria-live="polite"
        data-testid="drill-feedback"
      >
        <div className={clsx("flex items-center justify-between gap-3 px-5 py-4", grade.correct ? "bg-success-soft" : "bg-danger-soft")}>
          <p className={clsx("text-lg font-bold", grade.correct ? "text-success-ink" : "text-danger-ink")}>
            {grade.correct ? "✓ Correct" : "✗ Not quite"} — this was {grade.isPhish ? "phishing" : "legit"}.
          </p>
          {xp > 0 && <span className="rounded-full bg-elevated px-2.5 py-1 text-sm font-bold text-brand">+{xp} XP</span>}
        </div>
        <div className="space-y-4 p-5">
          <p className="text-muted">
            <RichText text={explain} />
          </p>
          {hotspots.length > 0 && (
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <p className="text-sm font-semibold text-success">Red flags you found ({found.length}/{hotspots.length})</p>
                <ul className="mt-2 space-y-2">
                  {found.length === 0 && <li className="text-sm text-subtle">None this time.</li>}
                  {found.map((h) => (
                    <FlagNote key={h.id} h={h} tone="hit" />
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-sm font-semibold text-warn">Red flags you missed ({missed.length})</p>
                <ul className="mt-2 space-y-2">
                  {missed.length === 0 && <li className="text-sm text-subtle">You caught them all. 🦅</li>}
                  {missed.map((h) => (
                    <FlagNote key={h.id} h={h} tone="miss" />
                  ))}
                </ul>
              </div>
            </div>
          )}
          {grade.falseFlags > 0 && (
            <p className="text-sm text-muted">
              You flagged {grade.falseFlags} thing{grade.falseFlags === 1 ? "" : "s"} that {grade.falseFlags === 1 ? "was" : "were"} fine (crossed out
              above). Being careful is good — just make sure you can say <em>why</em> something is suspicious.
            </p>
          )}
          {onNext && (
            <Button onClick={onNext} size="lg" className="w-full sm:w-auto" data-testid="drill-next" autoFocus>
              {nextLabel}
            </Button>
          )}
        </div>
      </m.section>
    </AnimatePresence>
  );
}

function FlagNote({ h, tone }: { h: Hotspot; tone: "hit" | "miss" }) {
  return (
    <li className={clsx("rounded-xl p-3 text-sm", tone === "hit" ? "bg-success-soft" : "bg-warn-soft")}>
      <p className="font-semibold text-fg">{h.label}</p>
      <p className="mt-0.5 text-muted">
        <RichText text={h.explain} />
      </p>
      <p className="mt-1 text-xs text-subtle">{FLAG_INFO[h.type].label}</p>
    </li>
  );
}

/** Small header shown on drill pages: index, difficulty, and a legend. */
export function DrillHeader({ index, total, difficulty }: { index: number; total: number; difficulty: string }) {
  return (
    <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-sm text-muted">
      <span>
        {index + 1} of {total} · <span className="capitalize">{difficulty}</span>
      </span>
      <span className="hidden sm:inline">
        <span className="rounded px-1 flag-hit">found</span> <span className="ml-2 rounded px-1 flag-miss">missed</span>
      </span>
    </div>
  );
}
