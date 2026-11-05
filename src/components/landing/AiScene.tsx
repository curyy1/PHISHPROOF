"use client";

import { useRef } from "react";
import { useScrollScene } from "./useScrollScene";

export function AiScene() {
  const ref = useRef<HTMLElement>(null);
  useScrollScene(ref, (tl, q) => {
    tl.from(q("[data-old]"), { opacity: 0, y: 30, duration: 0.4 })
      .from(q("[data-typo]"), { opacity: 0, scale: 0.8, stagger: 0.08, duration: 0.25 })
      .to({}, { duration: 0.4 })
      .to(q("[data-old]"), { opacity: 0, y: -20, scale: 0.97, duration: 0.4 })
      .from(q("[data-new]"), { opacity: 0, y: 30, duration: 0.4 }, "<0.15")
      .from(q("[data-caption]"), { opacity: 0, y: 16, duration: 0.3 })
      .to({}, { duration: 0.6 });
  });

  const typo = "rounded bg-danger/15 px-0.5 text-danger-ink underline decoration-danger decoration-wavy";

  return (
    <section ref={ref} className="relative motion-safe:h-[280vh]" aria-labelledby="ai-title">
      <div className="flex min-h-dvh items-center motion-safe:sticky motion-safe:top-0 motion-safe:h-dvh">
        <div className="container-page py-16">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow">Old advice, retired</p>
            <h2 id="ai-title" className="mt-3 text-headline font-bold">
              “Look for bad spelling” <span className="text-subtle">doesn’t work anymore.</span>
            </h2>
          </div>
          <div className="mx-auto mt-10 grid max-w-2xl">
            <div data-old className="card mb-6 p-6 motion-safe:mb-0 motion-safe:[grid-area:1/1]">
              <p className="text-xs font-semibold uppercase tracking-wide text-subtle">Phishing, 2015</p>
              <p className="mt-3 text-lg leading-relaxed">
                Dear <span data-typo className={typo}>costumer</span>, you <span data-typo className={typo}>acount</span>{" "}
                has been <span data-typo className={typo}>suspend</span>. Kindly <span data-typo className={typo}>verfy</span>{" "}
                you details <span data-typo className={typo}>imediately</span>!!!
              </p>
            </div>
            <div data-new className="card p-6 ring-2 ring-brand motion-safe:[grid-area:1/1]">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand">Phishing, today (AI-written)</p>
              <p className="mt-3 text-lg leading-relaxed">
                Hi Jordan, we noticed a sign-in to your account from a new device in Denver. If this wasn’t you, please
                review your recent activity so we can keep your account secure.
              </p>
            </div>
          </div>
          <p data-caption className="mx-auto mt-8 max-w-xl text-center text-lead text-muted">
            AI tools write flawless, personalized scams in seconds. Judge a message by <strong className="text-fg">what it
            asks you to do</strong> and <strong className="text-fg">where it really comes from</strong> — not by its grammar.
          </p>
        </div>
      </div>
    </section>
  );
}
