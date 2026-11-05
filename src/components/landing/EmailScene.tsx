"use client";

import { useRef, type ReactNode } from "react";
import { TrainingBadge } from "@/components/ui/Pill";
import { useScrollScene } from "./useScrollScene";

const FLAGS = [
  { n: 1, title: "Sender doesn’t match", body: "Lumen Bank lives at lumenbank.example — not lumen-bank-alerts.test." },
  { n: 2, title: "Manufactured urgency", body: "“24 hours” is designed to rush you past thinking." },
  { n: 3, title: "Generic greeting", body: "Your real bank knows your name." },
  { n: 4, title: "Threat of loss", body: "Fear is the oldest lever in the phishing playbook." },
  { n: 5, title: "Link goes somewhere else", body: "The button says Lumen Bank. The real address says otherwise." },
  { n: 6, title: "Asks for your password", body: "Legit companies never ask you to confirm it by email." },
];

function Mark({ n, children }: { n: number; children: ReactNode }) {
  return (
    <span className="relative inline">
      <span
        data-flag-mark={n}
        aria-hidden
        className="pointer-events-none absolute -inset-x-1 -inset-y-0.5 rounded-md bg-danger/15 ring-2 ring-danger"
      />
      <span
        data-flag-mark={n}
        aria-hidden
        className="absolute -right-2 -top-3 z-10 grid h-5 w-5 place-items-center rounded-full bg-danger text-[11px] font-bold text-white"
      >
        {n}
      </span>
      <span className="relative">{children}</span>
    </span>
  );
}

export function EmailScene() {
  const ref = useRef<HTMLElement>(null);

  useScrollScene(ref, (tl, q) => {
    tl.from(q("[data-email]"), { opacity: 0, y: 60, scale: 0.96, duration: 0.6 });
    FLAGS.forEach(({ n }) => {
      tl.from(q(`[data-flag-mark='${n}']`), { opacity: 0, scale: 0.6, duration: 0.35 }).from(
        q(`[data-flag-item='${n}']`),
        { opacity: 0, x: 24, duration: 0.35 },
        "<",
      );
      tl.to({}, { duration: 0.25 });
    });
    tl.from(q("[data-verdict]"), { opacity: 0, y: 20, scale: 0.9, duration: 0.4 }).to({}, { duration: 0.6 });
  });

  return (
    <section ref={ref} className="relative motion-safe:h-[420vh]" aria-labelledby="email-title">
      <div className="flex min-h-dvh items-center motion-safe:sticky motion-safe:top-0 motion-safe:h-dvh">
        <div className="container-page py-16">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Read it like a pro</p>
            <h2 id="email-title" className="mt-3 text-headline font-bold">
              One email. Six red flags.
            </h2>
          </div>

          <div className="mt-6 grid items-start gap-4 sm:gap-6 lg:mt-12 lg:grid-cols-[1.25fr_1fr] lg:gap-10">
            <article data-email className="card p-4 text-[0.9rem] sm:p-7 sm:text-[0.95rem]" aria-label="Example phishing email">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold">Lumen Bank Security</p>
                  <p className="truncate text-sm text-muted">
                    <Mark n={1}>&lt;alerts@lumen-bank-alerts.test&gt;</Mark>
                  </p>
                </div>
                <TrainingBadge className="shrink-0" />
              </div>
              <h3 className="mt-4 font-sans text-lg font-semibold tracking-normal">
                <Mark n={2}>Action required: account suspended in 24 hours</Mark>
              </h3>
              <div className="mt-3 space-y-2.5 text-muted sm:mt-4 sm:space-y-3">
                <p>
                  <Mark n={3}>Dear Valued Customer,</Mark>
                </p>
                <p>
                  We detected unusual sign-in activity on your account.{" "}
                  <Mark n={4}>If you do not verify your identity, your account will be permanently closed</Mark> and
                  your funds frozen.
                </p>
                <p>
                  <Mark n={6}>Please confirm your username and password</Mark> using our secure portal:
                </p>
                <p>
                  <Mark n={5}>
                    <span className="inline-block rounded-full bg-brand px-4 py-1.5 font-semibold text-brand-fg">
                      Verify my account
                    </span>
                  </Mark>
                </p>
                <p className="font-mono text-xs text-subtle">↳ lumenbank.example.verify-id.test/login</p>
              </div>
            </article>

            <div>
              <ol className="grid grid-cols-2 gap-2 sm:gap-2.5 lg:grid-cols-1" aria-label="Red flags in this email">
                {FLAGS.map((f) => (
                  <li key={f.n} data-flag-item={f.n} className="flex items-center gap-2.5 rounded-2xl bg-elevated p-2.5 ring-1 ring-line sm:items-start sm:p-3">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-danger text-xs font-bold text-white">
                      {f.n}
                    </span>
                    <div>
                      <p className="text-sm font-semibold">{f.title}</p>
                      <p className="hidden text-sm text-muted sm:block">{f.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <p data-verdict className="mt-4 inline-flex items-center gap-2 rounded-full bg-danger px-4 py-2 text-sm font-bold text-white">
                Verdict: Phish. Delete it and report it.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
