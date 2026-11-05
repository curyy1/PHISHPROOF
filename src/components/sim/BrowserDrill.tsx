"use client";

import { useMemo, useState } from "react";
import { browserById } from "@/content";
import type { BrowserPage } from "@/content/types";
import { RichText } from "@/components/RichText";
import { TrainingBadge } from "@/components/ui/Pill";
import { DrillFeedback, DrillHeader, Flaggable, useDrillItem, VerdictBar } from "./shared";

export function BrowserDrill({ itemIds, onComplete }: { itemIds: string[]; onComplete?: () => void }) {
  const items = useMemo(() => itemIds.map((id) => browserById.get(id)!).filter(Boolean), [itemIds]);
  const [index, setIndex] = useState(0);
  const item = items[index];
  if (!item) return null;
  const next = () => (index < items.length - 1 ? setIndex(index + 1) : onComplete?.());
  return (
    <div>
      <DrillHeader index={index} total={items.length} difficulty={item.difficulty} />
      <BrowserItem key={item.id} page={item} onNext={next} isLast={index === items.length - 1} hasComplete={!!onComplete} />
    </div>
  );
}

function BrowserItem({ page, onNext, isLast, hasComplete }: { page: BrowserPage; onNext: () => void; isLast: boolean; hasComplete: boolean }) {
  const d = useDrillItem("browser", page.id);
  const flagProps = { clicked: d.clicked, grade: d.grade, onToggle: d.toggle };
  return (
    <div>
      <p className="mb-4 rounded-2xl bg-brand-soft px-4 py-3 text-brand-ink">
        <span className="font-semibold">Scenario: </span>
        <RichText text={page.scenario} />
      </p>
      <div className="overflow-hidden rounded-2xl border border-line bg-elevated shadow-lg">
        {/* Browser chrome */}
        <div className="border-b border-line bg-sunken px-3 py-2.5">
          <div className="flex items-center gap-2">
            <div className="hidden gap-1.5 sm:flex" aria-hidden>
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" />
            </div>
            <div className="flex min-w-0 flex-1 items-center gap-1.5 rounded-full bg-elevated px-3 py-1.5 font-mono text-[13px] ring-1 ring-line sm:text-sm" aria-label="Address bar (click parts to flag them)">
              <span aria-label={page.url.scheme === "https" ? "Secure connection padlock" : "Not secure"} className={page.url.scheme === "https" ? "" : "text-danger"}>
                {page.url.scheme === "https" ? "🔒" : "⚠️"}
              </span>
              <span className="min-w-0 overflow-x-auto whitespace-nowrap">
                <span className="text-subtle">{page.url.scheme}://</span>
                {page.url.parts.map((p) => (
                  <Flaggable key={p.id} id={p.id} hs={p.hs} label={`Address part: ${p.t}`} {...flagProps}>
                    {p.t}
                  </Flaggable>
                ))}
              </span>
            </div>
          </div>
        </div>
        {/* Fake page */}
        <div className="relative grid place-items-center px-4 py-10 sm:py-14" style={{ background: `linear-gradient(160deg, ${page.brand.color}14, transparent 60%)` }}>
          <TrainingBadge className="absolute right-3 top-3" />
          <div className="w-full max-w-sm rounded-2xl border border-line bg-elevated p-6 shadow-sm">
            <div className="flex items-center gap-2.5">
              <span aria-hidden className="grid h-9 w-9 place-items-center rounded-xl text-lg font-black text-white" style={{ background: page.brand.color }}>
                {page.brand.initial}
              </span>
              <span className="font-display text-lg font-bold">{page.brand.name}</span>
            </div>
            <p className="mt-4 font-semibold">{page.pageTitle}</p>
            {/* Training-only form: inputs are disabled and there is no submit target. Nothing is ever sent or stored. */}
            <form onSubmit={(e) => e.preventDefault()} aria-label="Simulated login form (disabled)" className="mt-4 space-y-3" autoComplete="off">
              <input disabled aria-label="Email (disabled in simulation)" placeholder="Email or username" className="h-11 w-full cursor-not-allowed rounded-lg border border-line bg-sunken px-3 text-sm" />
              <input disabled aria-label="Password (disabled in simulation)" placeholder="Password" type="password" className="h-11 w-full cursor-not-allowed rounded-lg border border-line bg-sunken px-3 text-sm" />
              <button type="button" disabled className="h-11 w-full cursor-not-allowed rounded-lg text-sm font-semibold text-white opacity-80" style={{ background: page.brand.color }}>
                Sign in
              </button>
            </form>
            <p className="mt-3 text-center text-[11px] text-subtle">Fields are disabled: never type real passwords into a simulation.</p>
          </div>
        </div>
      </div>
      {!d.grade ? (
        <VerdictBar onAnswer={d.answer} busy={d.busy} flagged={d.clicked.size} error={d.error} phishLabel="🚪 Get out — it’s fake" legitLabel="✓ Safe to sign in" />
      ) : (
        <DrillFeedback
          grade={d.grade}
          hotspots={page.hotspots}
          explain={page.explain}
          xp={d.xp}
          onNext={isLast && !hasComplete ? undefined : onNext}
          nextLabel={isLast ? "Finish drill →" : "Next page →"}
        />
      )}
    </div>
  );
}
