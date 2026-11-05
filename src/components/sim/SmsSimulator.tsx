"use client";

import { clsx } from "clsx";
import { useMemo, useState } from "react";
import { smsById } from "@/content";
import type { Sms } from "@/content/types";
import { TrainingBadge } from "@/components/ui/Pill";
import { DrillFeedback, DrillHeader, Flaggable, useBringIntoView, useDrillItem, VerdictBar } from "./shared";

export function SmsSimulator({ itemIds, onComplete }: { itemIds: string[]; onComplete?: () => void }) {
  const items = useMemo(() => itemIds.map((id) => smsById.get(id)!).filter(Boolean), [itemIds]);
  const [index, setIndex] = useState(0);
  const item = items[index];
  if (!item) return null;
  const next = () => (index < items.length - 1 ? setIndex(index + 1) : onComplete?.());
  return (
    <div>
      <DrillHeader index={index} total={items.length} difficulty={item.difficulty} />
      <PhoneItem key={item.id} item={item} onNext={next} isLast={index === items.length - 1} hasComplete={!!onComplete} />
    </div>
  );
}

function PhoneItem({ item, onNext, isLast, hasComplete }: { item: Sms; onNext: () => void; isLast: boolean; hasComplete: boolean }) {
  const d = useDrillItem("sms", item.id);
  const [scanned, setScanned] = useState<Record<string, boolean>>({});
  const flagProps = { clicked: d.clicked, grade: d.grade, onToggle: d.toggle };
  const topRef = useBringIntoView<HTMLDivElement>();
  const channelLabel = { sms: "Messages", dm: "Direct messages", voicemail: "Voicemail" }[item.channel];

  return (
    <div ref={topRef} className="grid items-start gap-6 lg:grid-cols-[22rem_1fr]">
      {/* Phone frame */}
      <div className="mx-auto w-full max-w-[22rem] rounded-[2.6rem] border-[10px] border-[#111318] bg-[#111318] shadow-2xl dark:border-[#2a2d36]">
        <div className="overflow-hidden rounded-[2rem] bg-elevated">
          <div className="flex items-center justify-between px-5 pb-1 pt-3 text-[11px] font-semibold">
            <span>9:41</span>
            <span aria-hidden className="h-5 w-20 rounded-full bg-[#111318]" />
            <span aria-hidden>▮▮▮ 5G</span>
          </div>
          <div className="border-b border-line px-4 pb-3 pt-2 text-center">
            <p className="text-[11px] text-subtle">{channelLabel}</p>
            <Flaggable id="contact" hs={item.contact.hs} label={`Sender: ${item.contact.name}, ${item.contact.detail}`} {...flagProps} className="mt-1 inline-block px-2 py-0.5" as="span">
              <span aria-hidden className="mx-auto mb-1 grid h-10 w-10 place-items-center rounded-full bg-sunken text-sm font-bold">
                {item.contact.name.replace(/[^A-Za-z0-9]/g, "")[0] ?? "#"}
              </span>
              <span className="block text-sm font-semibold">{item.contact.name}</span>
              <span className="block text-[11px] text-subtle">{item.contact.detail}</span>
            </Flaggable>
          </div>
          <div className="min-h-[18rem] space-y-3 px-3 py-4">
            {item.messages.map((m, i) => (
              <div key={i} className={clsx("flex flex-col", m.me ? "items-end" : "items-start")}>
                <p className="mb-1 px-2 text-[10px] text-subtle">{m.time}</p>
                <div
                  className={clsx(
                    "max-w-[85%] rounded-3xl px-3.5 py-2.5 text-[0.95rem] leading-snug",
                    m.me ? "rounded-br-md bg-brand text-brand-fg" : "rounded-bl-md bg-sunken",
                    item.channel === "voicemail" && "italic",
                  )}
                >
                  {item.channel === "voicemail" && <span className="mb-1 block text-xs not-italic text-subtle">▶︎ Transcript</span>}
                  {m.body.map((seg, j) =>
                    typeof seg === "string" ? (
                      <span key={j}>{seg}</span>
                    ) : seg.href ? (
                      <Flaggable key={j} id={seg.id} hs={seg.hs} label={`Link ${seg.t}`} {...flagProps}>
                        <span className="break-all text-brand underline">{seg.t}</span>
                      </Flaggable>
                    ) : (
                      <Flaggable key={j} id={seg.id} hs={seg.hs} label={seg.t} {...flagProps}>
                        {seg.t}
                      </Flaggable>
                    ),
                  )}
                  {m.image && (
                    <div className="mt-2">
                      <Flaggable id={m.image.id} hs={m.image.hs} label={`Image: ${m.image.alt}`} {...flagProps} as="div" className="inline-block p-1">
                        <FakeQr />
                      </Flaggable>
                      <button
                        type="button"
                        className="mt-1 block text-xs font-semibold text-brand"
                        onClick={() => setScanned((s) => ({ ...s, [m.image!.id]: true }))}
                      >
                        Preview what this QR code opens
                      </button>
                      {scanned[m.image.id] && (
                        <p className="mt-1 rounded-lg bg-elevated px-2 py-1 font-mono text-[11px] break-all" role="status">
                          Opens: {m.image.decoded}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between border-t border-line px-4 py-3">
            <span className="text-xs text-subtle">iMessage-style · not real</span>
            <TrainingBadge />
          </div>
        </div>
      </div>

      <div>
        {!d.grade ? (
          <>
            <div className="card p-5">
              <p className="font-semibold">What would you do?</p>
              <p className="mt-1 text-sm text-muted">
                Tap the sender, any part of a message, a link or an image that looks suspicious. Links don’t open — this is a simulation.
              </p>
            </div>
            <VerdictBar onAnswer={d.answer} busy={d.busy} flagged={d.clicked.size} error={d.error} phishLabel="🚩 Scam — report it" legitLabel="✓ It’s fine" />
          </>
        ) : (
          <DrillFeedback
            grade={d.grade}
            hotspots={item.hotspots}
            explain={item.explain}
            xp={d.xp}
            onNext={isLast && !hasComplete ? undefined : onNext}
            nextLabel={isLast ? "Finish drill →" : "Next message →"}
          />
        )}
      </div>
    </div>
  );
}

/** Decorative, non-scannable QR-like pattern (deliberately not a real QR code). */
function FakeQr() {
  const cells = Array.from({ length: 121 }, (_, i) => ((i * 7919) % 13) % 3 === 0 || [0, 1, 2, 10, 11, 12, 22, 24, 108, 110, 118, 119, 120].includes(i));
  return (
    <svg viewBox="0 0 11 11" className="h-24 w-24 rounded bg-white p-1" role="img" aria-label="QR code (simulated, not scannable)">
      {cells.map((on, i) => (on ? <rect key={i} x={i % 11} y={Math.floor(i / 11)} width="1" height="1" fill="#111" /> : null))}
    </svg>
  );
}
