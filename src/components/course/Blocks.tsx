"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { clsx } from "clsx";
import type { Block } from "@/content/types";
import { RichText } from "@/components/RichText";
import { TrainingBadge } from "@/components/ui/Pill";

const calloutStyles = {
  tip: { box: "bg-brand-soft", title: "text-brand-ink", icon: "💡", label: "Tip" },
  warning: { box: "bg-warn-soft", title: "text-warn-ink", icon: "⚠️", label: "Watch out" },
  fact: { box: "bg-sunken", title: "text-fg", icon: "📌", label: "Fact" },
  myth: { box: "bg-danger-soft", title: "text-danger-ink", icon: "🚫", label: "Myth" },
};

const toneClass = {
  neutral: "bg-sunken text-fg",
  good: "bg-success-soft text-success-ink ring-2 ring-success",
  bad: "bg-danger-soft text-danger-ink ring-2 ring-danger",
  warn: "bg-warn-soft text-warn-ink ring-2 ring-warn",
};

export function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "p":
      return (
        <p className="text-lead text-muted">
          <RichText text={block.text} />
        </p>
      );
    case "h":
      return <h2 className="pt-4 text-title font-bold">{block.text}</h2>;
    case "list": {
      const L = block.ordered ? "ol" : "ul";
      return (
        <L className={clsx("space-y-2.5 text-lead text-muted", block.ordered ? "list-decimal pl-6" : "")}>
          {block.items.map((it, i) => (
            <li key={i} className={block.ordered ? "pl-1" : "flex gap-3"}>
              {!block.ordered && <span aria-hidden className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />}
              <span>
                <RichText text={it} />
              </span>
            </li>
          ))}
        </L>
      );
    }
    case "callout": {
      const s = calloutStyles[block.tone];
      return (
        <aside className={clsx("rounded-2xl p-5", s.box)} aria-label={s.label}>
          <p className={clsx("flex items-center gap-2 font-semibold", s.title)}>
            <span aria-hidden>{s.icon}</span>
            {block.title ?? s.label}
          </p>
          <p className="mt-2 text-muted">
            <RichText text={block.text} />
          </p>
        </aside>
      );
    }
    case "stat":
      return (
        <figure className="card flex flex-col gap-2 p-6 sm:flex-row sm:items-center sm:gap-6">
          <p className="font-display text-display font-extrabold tracking-tight text-brand">{block.value}</p>
          <figcaption>
            <p className="text-lead text-muted">
              <RichText text={block.label} />
            </p>
            {block.source && <p className="mt-1 text-xs text-subtle">Source: {block.source}</p>}
          </figcaption>
        </figure>
      );
    case "steps":
      return (
        <ol className="space-y-3">
          {block.items.map((s, i) => (
            <li key={i} className="card flex gap-4 p-5">
              <span aria-hidden className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-soft text-sm font-bold text-brand-ink">
                {i + 1}
              </span>
              <div>
                <p className="font-semibold">{s.title}</p>
                <p className="mt-1 text-muted">
                  <RichText text={s.text} />
                </p>
              </div>
            </li>
          ))}
        </ol>
      );
    case "compare":
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { side: block.left, tone: "danger" as const },
            { side: block.right, tone: "success" as const },
          ].map(({ side, tone }) => (
            <div key={side.title} className={clsx("rounded-2xl p-5", tone === "danger" ? "bg-danger-soft" : "bg-success-soft")}>
              <p className={clsx("font-semibold", tone === "danger" ? "text-danger-ink" : "text-success-ink")}>
                {tone === "danger" ? "✗ " : "✓ "}
                {side.title}
              </p>
              <ul className="mt-3 space-y-1.5 text-sm text-fg">
                {side.items.map((it, i) => (
                  <li key={i}>
                    <RichText text={it} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      );
    case "url":
      return (
        <figure className="card p-5">
          <div className="flex flex-wrap items-end gap-y-6 overflow-x-auto pb-1 font-mono text-[0.95rem] sm:text-base">
            {block.parts.map((p, i) => (
              <span key={i} className="flex flex-col items-center">
                <span className={clsx("whitespace-nowrap rounded-md px-1 py-1", toneClass[p.tone ?? "neutral"], !p.tone && "bg-transparent")}>{p.text}</span>
                {p.label && <span className="mt-1.5 max-w-[10rem] text-center font-sans text-[11px] leading-tight text-subtle">{p.label}</span>}
              </span>
            ))}
          </div>
          {block.caption && (
            <figcaption className="mt-4 text-sm text-muted">
              <RichText text={block.caption} />
            </figcaption>
          )}
        </figure>
      );
    case "message":
      return <MessageExhibit block={block} />;
    case "check":
      return <KnowledgeCheck block={block} />;
  }
}

export function MessageExhibit({ block }: { block: Extract<Block, { type: "message" }> }) {
  const kinds = { email: "Email", sms: "Text message", dm: "Direct message", call: "Phone call" };
  return (
    <figure className="overflow-hidden rounded-2xl border border-line bg-elevated">
      <div className="flex items-center justify-between gap-3 border-b border-line bg-sunken px-4 py-2.5">
        <span className="text-xs font-semibold uppercase tracking-wide text-subtle">{kinds[block.kind]} · example</span>
        <TrainingBadge />
      </div>
      <div className="p-5">
        <p className="break-words text-sm">
          <span className="text-subtle">From: </span>
          <span className="font-medium">{block.from}</span>
        </p>
        {block.subject && <p className="mt-1 font-semibold">{block.subject}</p>}
        <div className={clsx("mt-3 space-y-2", block.kind === "sms" || block.kind === "dm" ? "max-w-sm rounded-2xl rounded-bl-md bg-sunken px-4 py-3" : "")}>
          {block.body.map((b, i) => (
            <p key={i} className="break-words">
              <RichText text={b} />
            </p>
          ))}
        </div>
      </div>
      {(block.note || block.verdict) && (
        <figcaption className={clsx("border-t border-line px-5 py-3.5 text-sm", block.verdict === "phish" ? "bg-danger-soft" : "bg-success-soft")}>
          {block.verdict && (
            <span className={clsx("mr-2 font-bold", block.verdict === "phish" ? "text-danger-ink" : "text-success-ink")}>
              {block.verdict === "phish" ? "Phish." : "Legit."}
            </span>
          )}
          {block.note && <RichText text={block.note} />}
        </figcaption>
      )}
    </figure>
  );
}

function KnowledgeCheck({ block }: { block: Extract<Block, { type: "check" }> }) {
  const [picked, setPicked] = useState<number | null>(null);
  const answered = picked !== null;
  return (
    <fieldset className="card p-5 sm:p-6">
      <legend className="sr-only">Quick check</legend>
      <p className="eyebrow">Quick check</p>
      <p className="mt-2 font-semibold">{block.question}</p>
      <div className="mt-4 space-y-2">
        {block.options.map((o, i) => {
          const isPicked = picked === i;
          return (
            <button
              key={i}
              type="button"
              disabled={answered}
              onClick={() => setPicked(i)}
              aria-pressed={isPicked}
              className={clsx(
                "w-full rounded-xl border px-4 py-3 text-left transition-[transform,background-color,border-color] active:scale-[0.99]",
                !answered && "border-line hover:border-brand",
                answered && o.correct && "border-success bg-success-soft",
                answered && isPicked && !o.correct && "border-danger bg-danger-soft",
                answered && !isPicked && !o.correct && "border-line opacity-60",
              )}
            >
              {o.text}
            </button>
          );
        })}
      </div>
      <AnimatePresence>
        {answered && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-sm text-muted"
            role="status"
          >
            <span className={clsx("font-bold", block.options[picked].correct ? "text-success" : "text-danger")}>
              {block.options[picked].correct ? "Correct! " : "Not quite. "}
            </span>
            <RichText text={block.options[picked].why} />
          </motion.p>
        )}
      </AnimatePresence>
    </fieldset>
  );
}
