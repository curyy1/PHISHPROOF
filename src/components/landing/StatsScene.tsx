"use client";

import { useRef } from "react";
import { useScrollScene } from "./useScrollScene";

const DOTS = 100;
const HUMAN = 62;
const PHISH = 16;

/** Pinned scene: a 10×10 grid of breaches fills in as you scroll — 62 human element, then 16 phishing. */
export function StatsScene() {
  const ref = useRef<HTMLElement>(null);

  useScrollScene(ref, (tl, q) => {
    const human = q("[data-human]");
    const phish = q("[data-phish]");
    const counter = q("[data-counter]")[0] as HTMLElement | undefined;
    const proxy = { v: 0 };
    tl.set(human, { opacity: 0, scale: 0.4 })
      .set(phish, { opacity: 0 })
      .set(q("[data-step='2']"), { opacity: 0, y: 30 })
      .from(q("[data-step='1']"), { opacity: 0, y: 30, duration: 0.6 })
      .to(human, { opacity: 1, scale: 1, stagger: 0.03, duration: 0.4 }, "<")
      .to(
        proxy,
        {
          v: HUMAN,
          duration: human.length * 0.03 + 0.4,
          onUpdate: () => {
            if (counter) counter.textContent = `${Math.round(proxy.v)}%`;
          },
        },
        "<",
      )
      .to({}, { duration: 0.6 })
      .to(q("[data-step='1']"), { opacity: 0, y: -30, duration: 0.5 })
      .to(q("[data-step='2']"), { opacity: 1, y: 0, duration: 0.5 }, "<0.2")
      .to(phish, { opacity: 1, stagger: 0.05, duration: 0.3 }, "<")
      .to({}, { duration: 0.8 });
  });

  return (
    <section ref={ref} className="relative motion-safe:h-[300vh]" aria-labelledby="stats-title">
      <div className="flex min-h-dvh items-center motion-safe:sticky motion-safe:top-0 motion-safe:h-dvh">
        <div className="container-page grid items-center gap-12 py-16 lg:grid-cols-2">
          <div className="relative grid">
            <h2 id="stats-title" className="sr-only">
              Why people are the target
            </h2>
            <div data-step="1" className="motion-safe:[grid-area:1/1]">
              <p className="eyebrow">The real target</p>
              <p className="mt-4 font-display text-[clamp(5rem,3rem+10vw,11rem)] font-extrabold leading-none tracking-tighter">
                <span data-counter aria-hidden>
                  62%
                </span>
                <span className="sr-only">62 percent</span>
              </p>
              <p className="mt-4 max-w-md text-lead text-muted">
                of data breaches involved the <strong className="text-fg">human element</strong> — someone clicking,
                trusting, or slipping up.
              </p>
            </div>
            <div data-step="2" className="mt-12 motion-safe:mt-0 motion-safe:[grid-area:1/1]">
              <p className="eyebrow !text-danger">The way in</p>
              <p className="mt-4 font-display text-[clamp(5rem,3rem+10vw,11rem)] font-extrabold leading-none tracking-tighter text-danger">
                16%
              </p>
              <p className="mt-4 max-w-md text-lead text-muted">
                of breaches started with <strong className="text-fg">phishing</strong>. One convincing message is all it
                takes.
              </p>
            </div>
            <p className="mt-8 text-xs text-subtle">Approximate figures from the Verizon 2026 Data Breach Investigations Report.</p>
          </div>

          <div
            className="mx-auto grid w-full max-w-md grid-cols-10 gap-1.5 sm:gap-2"
            role="img"
            aria-label="Grid of 100 breaches: 62 involved people, and 16 started with phishing."
          >
            {Array.from({ length: DOTS }, (_, i) => (
              <span key={i} className="relative aspect-square rounded-[30%] bg-sunken">
                {i < HUMAN && <span data-human className="absolute inset-0 rounded-[30%] bg-brand" />}
                {i < PHISH && <span data-phish className="absolute inset-0 rounded-[30%] bg-danger" />}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
