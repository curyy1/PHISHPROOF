"use client";

import { AnimatePresence, motion } from "framer-motion";
import { clsx } from "clsx";
import { useState } from "react";
import { scenarioById } from "@/content";
import { RichText } from "@/components/RichText";
import { useProgress } from "@/components/ProgressProvider";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressRing";

export function ScenarioRunner({ scenarioId, onComplete }: { scenarioId: string; onComplete?: () => void }) {
  const sc = scenarioById.get(scenarioId)!;
  const { submit } = useProgress();
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [best, setBest] = useState(0);
  const [done, setDone] = useState(false);
  const st = sc.steps[step];

  async function next() {
    if (step < sc.steps.length - 1) {
      setStep(step + 1);
      setPicked(null);
      return;
    }
    await submit({ type: "activity_complete", key: `scenario:${sc.id}` });
    setDone(true);
  }

  if (done)
    return (
      <div className="card p-8 text-center">
        <p className="text-5xl" aria-hidden>🛡️</p>
        <h2 className="mt-4 text-headline font-bold">Incident handled</h2>
        <p className="mt-2 text-muted">
          You chose the best response {best} of {sc.steps.length} times. Resist → Report → Delete, and act fast if someone clicks.
        </p>
        {onComplete && (
          <Button size="lg" className="mt-6" onClick={onComplete}>
            Finish drill →
          </Button>
        )}
      </div>
    );

  return (
    <div>
      <div className="card p-6 sm:p-8">
        <p className="eyebrow">{sc.title}</p>
        {step === 0 && (
          <p className="mt-3 text-lead text-muted">
            <RichText text={sc.intro} />
          </p>
        )}
        <ProgressBar value={(step + (picked !== null ? 1 : 0)) / sc.steps.length} label="Scenario progress" className="mt-5" />
        <AnimatePresence mode="wait">
          <motion.div key={st.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
            <p className="mt-6 text-lg font-semibold">
              <RichText text={st.situation} />
            </p>
            <div className="mt-5 space-y-2.5" role="group" aria-label="Choices">
              {st.choices.map((c, i) => (
                <button
                  key={i}
                  type="button"
                  disabled={picked !== null}
                  aria-pressed={picked === i}
                  onClick={() => {
                    setPicked(i);
                    if (c.best) setBest((b) => b + 1);
                  }}
                  className={clsx(
                    "w-full rounded-2xl border-2 px-4 py-3.5 text-left transition-[transform,border-color,background-color] active:scale-[0.99]",
                    picked === null && "border-line hover:border-brand",
                    picked !== null && c.best && "border-success bg-success-soft",
                    picked === i && !c.best && "border-danger bg-danger-soft",
                    picked !== null && picked !== i && !c.best && "border-line opacity-55",
                  )}
                >
                  {c.text}
                </button>
              ))}
            </div>
            {picked !== null && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} role="status" className="mt-5">
                <p className="text-muted">
                  <span className={clsx("font-bold", st.choices[picked].best ? "text-success" : "text-danger")}>
                    {st.choices[picked].best ? "Best move. " : "Not the best move. "}
                  </span>
                  <RichText text={st.choices[picked].feedback} />
                </p>
                {!st.choices[picked].best && (
                  <p className="mt-2 text-sm text-muted">
                    <span className="font-semibold">Best: </span>
                    {st.choices.find((c) => c.best)!.text}
                  </p>
                )}
                <Button size="lg" className="mt-5" onClick={next} autoFocus>
                  {step < sc.steps.length - 1 ? "Continue →" : "Finish"}
                </Button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
