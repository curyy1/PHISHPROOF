"use client";

import { m } from "framer-motion";
import { ButtonLink } from "@/components/ui/Button";
import { TrainingBadge } from "@/components/ui/Pill";

const rise = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: 0.08 * i, duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } }),
};

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-20 pt-16 sm:pt-24" aria-labelledby="hero-title">
      {/* Decorative glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-12rem] h-[36rem] w-[60rem] -translate-x-1/2 rounded-full opacity-40 blur-3xl dark:opacity-25"
        style={{ background: "radial-gradient(closest-side, var(--brand), transparent)" }}
      />
      <div className="container-page relative text-center">
        <m.p className="eyebrow" variants={rise} initial="hidden" animate="show" custom={0}>
          A free phishing-awareness course
        </m.p>
        <m.h1
          id="hero-title"
          className="mx-auto mt-5 max-w-5xl text-hero font-extrabold"
          variants={rise}
          initial="hidden"
          animate="show"
          custom={1}
        >
          Don’t take <span className="text-gradient">the bait.</span>
        </m.h1>
        <m.p
          className="mx-auto mt-6 max-w-2xl text-lead text-muted"
          variants={rise}
          initial="hidden"
          animate="show"
          custom={2}
        >
          Scammers got smarter. So can you. Learn the tricks behind phishing emails, texts, calls and fake login pages —
          then practice on realistic simulations until spotting them is second nature.
        </m.p>
        <m.div
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          variants={rise}
          initial="hidden"
          animate="show"
          custom={3}
        >
          <ButtonLink href="/learn/what-is-phishing" size="lg">
            Start Module 1 — no account needed
          </ButtonLink>
          <ButtonLink href="/practice/inbox" variant="secondary" size="lg">
            Try Spot the Phish
          </ButtonLink>
        </m.div>

        <m.div
          className="relative mx-auto mt-16 max-w-3xl"
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.35, duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <HeroInbox />
        </m.div>
      </div>
    </section>
  );
}

const rows = [
  { from: "Parcelo Delivery", subject: "Your package is on hold — pay $1.99 redelivery fee", phish: true },
  { from: "Ms. Alvarez (Northvale High)", subject: "Field trip forms due Friday", phish: false },
  { from: "StreamBox Billing", subject: "URGENT: Payment declined, account closing today", phish: true },
  { from: "Questify", subject: "Your weekly quest summary", phish: false },
];

function HeroInbox() {
  return (
    <div className="card overflow-hidden text-left" aria-label="Example inbox preview" role="img">
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <div className="flex gap-1.5" aria-hidden>
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>
        <TrainingBadge />
      </div>
      <ul>
        {rows.map((r, i) => (
          <m.li
            key={r.subject}
            className="flex items-center gap-3 border-b border-line px-4 py-3.5 last:border-0"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 + i * 0.12, duration: 0.5 }}
          >
            <span
              className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-bold ${
                r.phish ? "bg-danger-soft text-danger-ink" : "bg-success-soft text-success-ink"
              }`}
            >
              {r.from[0]}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{r.from}</p>
              <p className="truncate text-sm text-muted">{r.subject}</p>
            </div>
            <m.span
              className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${
                r.phish ? "bg-danger text-on-danger" : "bg-success-soft text-success-ink"
              }`}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.4 + i * 0.25, type: "spring", stiffness: 500, damping: 22 }}
            >
              {r.phish ? "Phish" : "Legit"}
            </m.span>
          </m.li>
        ))}
      </ul>
    </div>
  );
}
