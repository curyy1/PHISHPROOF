"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useProgress } from "@/components/ProgressProvider";
import { Button } from "@/components/ui/Button";

export function LessonComplete({ lessonId, nextHref, nextLabel }: { lessonId: string; nextHref: string; nextLabel: string }) {
  const { state, submit } = useProgress();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const done = !!state?.lessons[lessonId];

  async function onClick() {
    setBusy(true);
    setError(null);
    if (!done) {
      const r = await submit({ type: "lesson_complete", lessonId });
      if ("error" in r) {
        setError(r.error);
        setBusy(false);
        return;
      }
    }
    router.push(nextHref);
  }

  return (
    <div className="card flex flex-col items-center gap-3 p-6 text-center sm:flex-row sm:justify-between sm:text-left">
      <div>
        <p className="font-semibold">{done ? "✓ Lesson complete" : "Got it?"}</p>
        <p className="text-sm text-muted">{nextLabel}</p>
      </div>
      <Button size="lg" onClick={onClick} disabled={busy} aria-busy={busy} data-testid="complete-lesson">
        {busy ? "Saving…" : done ? "Continue →" : "Mark complete & continue →"}
      </Button>
      {error && <p role="alert" className="text-sm text-danger sm:basis-full">{error}</p>}
    </div>
  );
}
