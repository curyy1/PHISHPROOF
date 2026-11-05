"use client";

import { useState } from "react";
import { moduleById, modules } from "@/content";
import { drillDone } from "@/lib/progress";
import { useProgress } from "@/components/ProgressProvider";
import { ButtonLink } from "@/components/ui/Button";
import { InboxSimulator } from "./InboxSimulator";
import { SmsSimulator } from "./SmsSimulator";
import { BrowserDrill } from "./BrowserDrill";
import { UrlGame } from "./UrlGame";
import { PasswordLab } from "./PasswordLab";
import { ScenarioRunner } from "./ScenarioRunner";

/** Runs the drill attached to a module, then points to the quiz. */
export function DrillRunner({ moduleId }: { moduleId: string }) {
  const m = moduleById.get(moduleId)!;
  const { state } = useProgress();
  const [finished, setFinished] = useState(false);
  const r = m.drill.ref;
  const done = finished || (state ? drillDone(state, m) : false);
  const onComplete = () => setFinished(true);

  return (
    <div className="space-y-8">
      {r.kind === "inbox" && <InboxSimulator itemIds={r.itemIds} onComplete={onComplete} />}
      {r.kind === "sms" && <SmsSimulator itemIds={r.itemIds} onComplete={onComplete} />}
      {r.kind === "browser" && <BrowserDrill itemIds={r.itemIds} onComplete={onComplete} />}
      {r.kind === "urls" && <UrlGame itemIds={r.itemIds} onComplete={onComplete} />}
      {r.kind === "passwords" && <PasswordLab challenge />}
      {r.kind === "scenario" && <ScenarioRunner scenarioId={r.scenarioId} onComplete={onComplete} />}
      {done && (
        <div className="card flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between" role="status">
          <div>
            <p className="text-title font-bold">Drill complete 🎯</p>
            <p className="text-muted">Lock it in with the Module {m.number} quiz.</p>
          </div>
          <ButtonLink href={`/learn/${m.id}/quiz`} size="lg">
            Take the quiz →
          </ButtonLink>
        </div>
      )}
    </div>
  );
}

export const drillModules = modules;
