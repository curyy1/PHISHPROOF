"use client";

import { clsx } from "clsx";
import { useEffect, useMemo, useRef, useState } from "react";
import { emailById } from "@/content";
import type { Email, Segment } from "@/content/types";
import { useProgress } from "@/components/ProgressProvider";
import { TrainingBadge } from "@/components/ui/Pill";
import { DrillFeedback, DrillHeader, Flaggable, useDrillItem, VerdictBar, type DrillGrade } from "./shared";

/** Spot the Phish: a fake mail client. `itemIds` sets the queue; `onComplete` fires after the last one. */
export function InboxSimulator({ itemIds, onComplete }: { itemIds: string[]; onComplete?: () => void }) {
  const items = useMemo(() => itemIds.map((id) => emailById.get(id)!).filter(Boolean), [itemIds]);
  const { state } = useProgress();
  const [index, setIndex] = useState(0);
  const [showList, setShowList] = useState(false);
  const email = items[index];
  const answeredIds = useMemo(() => {
    const m = new Map<string, boolean>();
    for (const d of state?.drills ?? []) if (d.drill === "inbox") m.set(d.itemId, (m.get(d.itemId) ?? false) || d.correct);
    return m;
  }, [state]);

  if (!email) return null;
  const go = (i: number) => {
    setIndex(i);
    setShowList(false);
  };
  const next = () => {
    if (index < items.length - 1) go(index + 1);
    else onComplete?.();
  };

  return (
    <div className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-elevated shadow-sm">
      {/* Window chrome */}
      <div className="flex items-center justify-between gap-3 border-b border-line bg-sunken px-4 py-2.5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="rounded-lg px-2 py-1 text-sm font-semibold md:hidden"
            onClick={() => setShowList((v) => !v)}
            aria-expanded={showList}
            aria-controls="inbox-list"
          >
            ☰ Inbox
          </button>
          <span className="hidden text-sm font-semibold md:inline">Inbox</span>
          <span className="text-xs text-subtle">PhishMail · fake email client</span>
        </div>
        <TrainingBadge />
      </div>
      <div className="grid md:grid-cols-[17rem_1fr]">
        <nav
          id="inbox-list"
          aria-label="Emails"
          className={clsx("max-h-[70vh] overflow-y-auto border-r border-line md:block", showList ? "block" : "hidden")}
        >
          <ul>
            {items.map((e, i) => {
              const status = answeredIds.get(e.id);
              return (
                <li key={e.id}>
                  <button
                    type="button"
                    onClick={() => go(i)}
                    aria-current={i === index ? "true" : undefined}
                    className={clsx(
                      "flex w-full items-start gap-2.5 border-b border-line px-3.5 py-3 text-left transition-colors",
                      i === index ? "bg-brand-soft" : "hover:bg-sunken",
                    )}
                  >
                    <span aria-hidden className="mt-0.5 w-4 shrink-0 text-xs">
                      {status === undefined ? "●" : status ? "✓" : "✗"}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold">{e.from.name}</span>
                      <span className="block truncate text-xs text-muted">{e.subject.text}</span>
                    </span>
                    <span className="sr-only">{status === undefined ? "unanswered" : status ? "answered correctly" : "answered incorrectly"}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="min-w-0 p-4 sm:p-6">
          <DrillHeader index={index} total={items.length} difficulty={email.difficulty} />
          <EmailView key={email.id} email={email} onNext={next} isLast={index === items.length - 1} hasComplete={!!onComplete} />
        </div>
      </div>
    </div>
  );
}

function EmailView({ email, onNext, isLast, hasComplete }: { email: Email; onNext: () => void; isLast: boolean; hasComplete: boolean }) {
  const d = useDrillItem("inbox", email.id);
  const [hoverHref, setHoverHref] = useState<string | null>(null);
  const top = useRef<HTMLDivElement>(null);
  useEffect(() => {
    top.current?.focus({ preventScroll: true });
  }, []);

  const flagProps = { clicked: d.clicked, grade: d.grade, onToggle: d.toggle };

  return (
    <div>
      <div ref={top} tabIndex={-1} className="outline-none" aria-label={`Email: ${email.subject.text}`}>
        <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
          <Flaggable id="subject" hs={email.subject.hs} label={`Subject: ${email.subject.text}`} {...flagProps}>
            {email.subject.text}
          </Flaggable>
        </h2>
        <div className="mt-4 flex items-start gap-3">
          <span aria-hidden className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-soft font-bold text-brand-ink">
            {email.from.name[0]}
          </span>
          <div className="min-w-0 flex-1 text-sm">
            <Flaggable id="from" hs={email.from.hs} label={`Sender: ${email.from.name} ${email.from.address}`} {...flagProps} className="inline-block px-0.5">
              <span className="font-semibold">{email.from.name}</span>{" "}
              <span className="break-all text-muted">&lt;{email.from.address}&gt;</span>
            </Flaggable>
            {email.replyTo && (
              <p className="mt-0.5 text-muted">
                Reply-To:{" "}
                <Flaggable id="replyTo" hs={email.replyTo.hs} label={`Reply-To: ${email.replyTo.address}`} {...flagProps} className="break-all px-0.5">
                  {email.replyTo.address}
                </Flaggable>
              </p>
            )}
            <p className="mt-0.5 text-subtle">
              to {email.to} · {email.date}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-4 leading-relaxed">
        {email.body.map((para, i) => (
          <p key={i}>
            {para.map((seg, j) => (
              <SegmentView key={j} seg={seg} {...flagProps} onHover={setHoverHref} />
            ))}
          </p>
        ))}
      </div>

      {email.attachments && email.attachments.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {email.attachments.map((a) => (
            <Flaggable key={a.id} id={a.id} hs={a.hs} label={`Attachment: ${a.name}`} {...flagProps} className="inline-flex items-center gap-2 rounded-xl border border-line px-3 py-2 text-sm">
              <span aria-hidden>📎</span>
              <span className="font-medium">{a.name}</span>
              <span className="text-subtle">{a.size}</span>
            </Flaggable>
          ))}
        </div>
      )}

      {/* Fake status bar: teaches hovering to reveal a link's real destination */}
      <div className="mt-6 min-h-9 rounded-lg bg-sunken px-3 py-2 font-mono text-xs text-muted" aria-live="polite">
        {hoverHref ? (
          <>
            <span className="text-subtle">Link goes to: </span>
            <span className="break-all text-fg">{hoverHref}</span>
          </>
        ) : (
          <span className="text-subtle">Hover over (or focus) a link to preview where it really goes.</span>
        )}
      </div>

      {!d.grade ? (
        <VerdictBar onAnswer={d.answer} busy={d.busy} flagged={d.clicked.size} error={d.error} />
      ) : (
        <DrillFeedback
          grade={d.grade as DrillGrade}
          hotspots={email.hotspots}
          explain={email.explain}
          xp={d.xp}
          onNext={isLast && !hasComplete ? undefined : onNext}
          nextLabel={isLast ? "Finish drill →" : "Next email →"}
        />
      )}
    </div>
  );
}

function SegmentView({
  seg,
  clicked,
  grade,
  onToggle,
  onHover,
}: {
  seg: Segment;
  clicked: Set<string>;
  grade: DrillGrade | null;
  onToggle: (id: string) => void;
  onHover: (href: string | null) => void;
}) {
  if (typeof seg === "string") return <>{seg}</>;
  if (seg.href) {
    const isButton = seg.t.length < 30 && !seg.t.includes(".");
    return (
      <Flaggable
        id={seg.id}
        hs={seg.hs}
        clicked={clicked}
        grade={grade}
        onToggle={onToggle}
        label={`Link: ${seg.t}. Goes to ${seg.href}`}
        className={clsx("inline-block", isButton && "my-1")}
      >
        <span
          onMouseEnter={() => onHover(seg.href!)}
          onMouseLeave={() => onHover(null)}
          onFocus={() => onHover(seg.href!)}
          className={clsx(
            isButton ? "inline-block rounded-full bg-brand px-4 py-1.5 font-semibold text-brand-fg" : "text-brand underline underline-offset-2",
          )}
        >
          {seg.t}
        </span>
      </Flaggable>
    );
  }
  return (
    <Flaggable id={seg.id} hs={seg.hs} clicked={clicked} grade={grade} onToggle={onToggle} label={seg.t}>
      {seg.t}
    </Flaggable>
  );
}
