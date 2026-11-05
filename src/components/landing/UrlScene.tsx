"use client";

import { useRef } from "react";
import { useScrollScene } from "./useScrollScene";

const steps = [
  { id: "a", title: "Looks like PayLoop…", body: "Scammers put a trusted name at the start, where your eye lands first." },
  {
    id: "b",
    title: "…but this is the real domain.",
    body: "Find the first single slash, then read the name just before it, from right to left. That’s who owns the page.",
  },
  {
    id: "c",
    title: "And the padlock?",
    body: "HTTPS means the connection is encrypted — not that the site is honest. Scam sites get padlocks too.",
  },
];

export function UrlScene() {
  const ref = useRef<HTMLElement>(null);
  useScrollScene(ref, (tl, q) => {
    tl.from(q("[data-url]"), { opacity: 0, y: 40, duration: 0.5 })
      .set(q("[data-step]"), { opacity: 0, y: 24 })
      .to(q("[data-hl='brand']"), { opacity: 1, duration: 0.3 })
      .to(q("[data-step='a']"), { opacity: 1, y: 0, duration: 0.3 }, "<")
      .to({}, { duration: 0.5 })
      .to(q("[data-hl='brand']"), { opacity: 0, duration: 0.3 })
      .to(q("[data-dim]"), { opacity: 0.25, duration: 0.3 }, "<")
      .to(q("[data-hl='real']"), { opacity: 1, duration: 0.3 }, "<")
      .to(q("[data-step='a']"), { opacity: 0, y: -24, duration: 0.3 }, "<")
      .to(q("[data-step='b']"), { opacity: 1, y: 0, duration: 0.3 }, "<0.1")
      .to({}, { duration: 0.6 })
      .to(q("[data-hl='real']"), { opacity: 0, duration: 0.3 })
      .to(q("[data-dim]"), { opacity: 1, duration: 0.3 }, "<")
      .to(q("[data-hl='lock']"), { opacity: 1, duration: 0.3 }, "<")
      .to(q("[data-step='b']"), { opacity: 0, y: -24, duration: 0.3 }, "<")
      .to(q("[data-step='c']"), { opacity: 1, y: 0, duration: 0.3 }, "<0.1")
      .to({}, { duration: 0.6 });
  });

  const hl = "pointer-events-none absolute -inset-x-1 -inset-y-1 rounded-lg opacity-0";

  return (
    <section ref={ref} className="relative bg-elevated motion-safe:h-[340vh]" aria-labelledby="url-title">
      <div className="flex min-h-dvh items-center motion-safe:sticky motion-safe:top-0 motion-safe:h-dvh">
        <div className="container-page py-16 text-center">
          <p className="eyebrow">Read the link, not the label</p>
          <h2 id="url-title" className="mt-3 text-headline font-bold">
            The trick hides in plain sight.
          </h2>

          <div
            data-url
            className="mx-auto mt-10 max-w-4xl overflow-x-auto rounded-2xl bg-sunken px-4 py-5 font-mono text-[clamp(0.9rem,0.6rem+1.2vw,1.4rem)] sm:px-6"
          >
            <span className="flex flex-wrap items-center justify-center whitespace-nowrap">
              <span className="relative mr-2">
                <span data-hl="lock" className={`${hl} bg-warn/25 ring-2 ring-warn motion-reduce:hidden`} />
                <span aria-hidden className="relative">🔒</span>
              </span>
              <span data-dim className="relative text-subtle">https://</span>
              <span data-dim className="relative">
                <span data-hl="brand" className={`${hl} bg-brand/20 ring-2 ring-brand motion-reduce:hidden`} />
                <span className="relative font-semibold">payloop.example</span>
              </span>
              <span className="relative">
                <span data-hl="real" className={`${hl} bg-danger/20 ring-2 ring-danger motion-reduce:opacity-100`} />
                <span className="relative font-semibold">.secure-login.test</span>
              </span>
              <span data-dim className="relative text-subtle">/account/verify</span>
            </span>
          </div>

          <div className="relative mx-auto mt-10 grid max-w-xl text-left">
            {steps.map((s) => (
              <div key={s.id} data-step={s.id} className="mb-6 motion-safe:mb-0 motion-safe:[grid-area:1/1]">
                <p className="font-display text-title font-bold">{s.title}</p>
                <p className="mt-2 text-lead text-muted">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
