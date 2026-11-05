"use client";

import { AnimatePresence, motion } from "framer-motion";
import { clsx } from "clsx";
import { useCallback, useEffect, useRef, useState } from "react";
import { urlById, urlItems } from "@/content";
import type { Difficulty, UrlItem } from "@/content/types";
import { RichText } from "@/components/RichText";
import { useProgress } from "@/components/ProgressProvider";
import { Button } from "@/components/ui/Button";
import { ProgressRing } from "@/components/ui/ProgressRing";

const SECONDS = 12;
const ROUND = 10;

type Answer = { item: UrlItem; correct: boolean; timedOut: boolean };

/** Split a URL so the real hostname stands out in feedback. */
function UrlDisplay({ url, reveal }: { url: string; reveal: boolean }) {
  const m = url.match(/^(https?:\/\/)([^/?#]+)(.*)$/);
  if (!m) return <span className="break-all">{url}</span>;
  const [, scheme, host, rest] = m;
  const at = host.lastIndexOf("@");
  const realHost = at >= 0 ? host.slice(at + 1) : host;
  const parts = realHost.split(".");
  const domain = /^\d+$/.test(parts[parts.length - 1]) ? realHost : parts.slice(-2).join(".");
  const prefix = host.slice(0, host.length - domain.length);
  return (
    <span className="break-all">
      <span className="text-subtle">{scheme}</span>
      <span className={clsx(reveal && "text-subtle")}>{prefix}</span>
      <span className={clsx(reveal && "rounded bg-brand-soft px-0.5 font-bold text-brand-ink")}>{domain}</span>
      <span className="text-subtle">{rest}</span>
    </span>
  );
}

function pickRound(difficulty: Difficulty | "mixed") {
  const pool = difficulty === "mixed" ? urlItems : urlItems.filter((u) => u.difficulty === difficulty);
  const copy = [...pool];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, ROUND);
}

/**
 * URL inspector. In practice mode it plays timed rounds of 10 random URLs.
 * `itemIds` gives a fixed set (module drill). Timer can be turned off (accessibility).
 */
export function UrlGame({ itemIds, onComplete }: { itemIds?: string[]; onComplete?: () => void }) {
  const { submit } = useProgress();
  const [difficulty, setDifficulty] = useState<Difficulty | "mixed">("mixed");
  const [timed, setTimed] = useState(!itemIds);
  const [round, setRound] = useState<UrlItem[] | null>(null);
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [current, setCurrent] = useState<Answer | null>(null);
  const [timeLeft, setTimeLeft] = useState(SECONDS);
  const [streak, setStreak] = useState(0);
  const [points, setPoints] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = () => {
    const items = itemIds ? itemIds.map((id) => urlById.get(id)!).filter(Boolean) : pickRound(difficulty);
    setRound(items);
    setI(0);
    setAnswers([]);
    setCurrent(null);
    setStreak(0);
    setPoints(0);
    setTimeLeft(SECONDS);
  };

  const item = round?.[i];

  const decide = useCallback(
    (verdict: "phish" | "legit" | null) => {
      if (!item || current) return;
      if (timer.current) clearInterval(timer.current);
      const timedOut = verdict === null;
      const correct = !timedOut && (verdict === "legit") === item.safe;
      const a = { item, correct, timedOut };
      setCurrent(a);
      setAnswers((xs) => [...xs, a]);
      setStreak((s) => (correct ? s + 1 : 0));
      if (correct) setPoints((p) => p + 100 + (timed ? timeLeft * 10 : 0) + streak * 20);
      // Timeouts aren't recorded as answers (you didn't choose anything).
      if (!timedOut) void submit({ type: "drill_answer", drill: "urls", itemId: item.id, verdict: verdict!, clicked: [] });
    },
    [item, current, submit, timed, timeLeft, streak],
  );

  // Countdown
  useEffect(() => {
    if (!timed || !item || current) return;
    timer.current = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [timed, item, current]);

  useEffect(() => {
    if (timeLeft <= 0 && item && !current) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- the countdown reaching zero is an external event
      decide(null);
    }
  }, [timeLeft, item, current, decide]);

  // Keyboard: S = safe, X = sketchy, Enter = next
  useEffect(() => {
    if (!round) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && ["INPUT", "SELECT", "TEXTAREA"].includes(e.target.tagName)) return;
      if (!current && (e.key === "s" || e.key === "S")) decide("legit");
      if (!current && (e.key === "x" || e.key === "X")) decide("phish");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [round, current, decide]);

  const next = () => {
    setTimeLeft(SECONDS);
    setCurrent(null);
    setI((n) => n + 1);
  };

  if (!round)
    return (
      <div className="card p-6 sm:p-10">
        <p className="text-5xl" aria-hidden>⏱️</p>
        <h2 className="mt-4 text-headline font-bold">Safe or sketchy?</h2>
        <p className="mt-2 text-muted">
          {itemIds ? itemIds.length : ROUND} URLs. For each one, find the real domain and decide. Shortcuts: <kbd className="rounded bg-sunken px-1.5">S</kbd> safe,{" "}
          <kbd className="rounded bg-sunken px-1.5">X</kbd> sketchy.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          {!itemIds && (
            <label className="text-sm">
              <span className="mr-2 font-semibold">Difficulty</span>
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as Difficulty | "mixed")} className="h-10 rounded-xl border border-line bg-elevated px-3">
                <option value="mixed">Mixed</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </label>
          )}
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={timed} onChange={(e) => setTimed(e.target.checked)} className="h-4 w-4 accent-[var(--brand)]" />
            {SECONDS}-second timer
          </label>
        </div>
        <Button size="lg" className="mt-8" onClick={start} data-testid="url-start">
          Start round
        </Button>
      </div>
    );

  if (!item) {
    const right = answers.filter((a) => a.correct).length;
    return (
      <div className="card p-6 text-center sm:p-10">
        <ProgressRing value={right / answers.length} size={130} label={`${right}/${answers.length}`} sublabel={`${points} pts`} tone={right / answers.length >= 0.8 ? "success" : "brand"} />
        <h2 className="mt-5 text-headline font-bold">{right === answers.length ? "Flawless! 🔎" : right / answers.length >= 0.8 ? "Sharp eyes!" : "Keep practicing"}</h2>
        <ul className="mx-auto mt-6 max-w-xl space-y-2 text-left text-sm">
          {answers.map((a) => (
            <li key={a.item.id} className="flex gap-2">
              <span className={a.correct ? "text-success" : "text-danger"} aria-label={a.correct ? "correct" : "incorrect"}>{a.correct ? "✓" : "✗"}</span>
              <span className="min-w-0 font-mono">
                <UrlDisplay url={a.item.url} reveal />
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          {onComplete && <Button size="lg" onClick={onComplete}>Finish drill →</Button>}
          <Button size="lg" variant={onComplete ? "secondary" : "primary"} onClick={start}>
            Play again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between text-sm text-muted">
        <span>
          URL {i + 1} of {round.length}
        </span>
        <span className="font-semibold tabular-nums text-fg">
          {points} pts {streak > 1 && <span className="ml-1 text-warn">🔥×{streak}</span>}
        </span>
      </div>
      {timed && (
        <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-sunken" aria-hidden>
          <div
            className={clsx("h-full origin-left rounded-full transition-transform duration-1000 ease-linear", timeLeft <= 3 ? "bg-danger" : "bg-brand")}
            style={{ transform: `scaleX(${current ? 0 : timeLeft / SECONDS})` }}
          />
        </div>
      )}
      <AnimatePresence mode="wait">
        <motion.div key={item.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2 }} className="card p-5 sm:p-8">
          <p className="text-sm text-muted">
            You expect to be on <span className="font-semibold text-fg">{item.expect}</span>.
          </p>
          <p className="mt-4 rounded-xl bg-sunken px-4 py-4 font-mono text-base sm:text-xl" data-testid="url-under-test">
            <UrlDisplay url={item.url} reveal={!!current} />
          </p>
          {timed && !current && <p className="mt-2 text-right text-xs tabular-nums text-subtle" aria-live="off">{timeLeft}s</p>}
          {!current ? (
            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button variant="success" size="lg" onClick={() => decide("legit")} data-testid="url-safe">
                ✓ Safe
              </Button>
              <Button variant="danger" size="lg" onClick={() => decide("phish")} data-testid="url-sketchy">
                🚩 Sketchy
              </Button>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-6" role="status">
              <p className={clsx("text-lg font-bold", current.correct ? "text-success" : "text-danger")}>
                {current.timedOut ? "⏰ Time’s up!" : current.correct ? "✓ Correct!" : "✗ Not quite."} It’s {item.safe ? "safe" : "sketchy"}.
              </p>
              <p className="mt-2 text-muted">
                <RichText text={item.explain} />
              </p>
              <Button size="lg" className="mt-5" onClick={next} autoFocus data-testid="url-next">
                {i < round.length - 1 ? "Next URL →" : "See results"}
              </Button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
