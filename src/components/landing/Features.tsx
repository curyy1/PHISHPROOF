"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { modules } from "@/content";

const features = [
  { href: "/practice/inbox", icon: "📥", title: "Spot the Phish", body: "A realistic inbox with 32 emails. Click the red flags, make the call, see what you missed." },
  { href: "/practice/sms", icon: "📱", title: "Text & DM simulator", body: "Smishing, fake support DMs, voicemail scams and QR codes on a phone-style screen." },
  { href: "/practice/browser", icon: "🧭", title: "Fake login lab", body: "Land on sign-in pages and inspect the address bar before you type a thing." },
  { href: "/practice/urls", icon: "⏱️", title: "URL inspector", body: "Timed rounds of “safe or sketchy?” with instant feedback. Fast fingers, sharp eyes." },
  { href: "/practice/passwords", icon: "🔐", title: "Password lab", body: "Live strength meter and passphrase generator. Runs entirely on your device." },
  { href: "/teach", icon: "🧑‍🏫", title: "Built for classes", body: "Teachers create a class code and watch progress roll in. Perfect for clubs and chapters." },
];

const rise = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } };

export function Features() {
  return (
    <section className="py-24 sm:py-32" aria-labelledby="features-title">
      <div className="container-page">
        <p className="eyebrow">Learn by doing</p>
        <h2 id="features-title" className="mt-3 max-w-3xl text-display font-bold">
          Practice on scams that can’t hurt you.
        </h2>
        <p className="mt-4 max-w-2xl text-lead text-muted">
          Every simulation uses fictional brands and reserved example domains. Make mistakes here, not in your real inbox.
        </p>
        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.li
              key={f.href}
              variants={rise}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: (i % 3) * 0.07, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link href={f.href} className="card group block h-full p-7 transition-transform duration-300 hover:-translate-y-1">
                <span aria-hidden className="inline-block text-4xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                  {f.icon}
                </span>
                <h3 className="mt-5 text-title font-bold">{f.title}</h3>
                <p className="mt-2 text-muted">{f.body}</p>
                <p className="mt-5 text-sm font-semibold text-brand">
                  Open <span aria-hidden className="inline-block transition-transform group-hover:translate-x-1">→</span>
                </p>
              </Link>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function ModulesTeaser() {
  return (
    <section className="overflow-x-clip bg-elevated py-24 sm:py-32" aria-labelledby="modules-title">
      <div className="container-page">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow">The course</p>
            <h2 id="modules-title" className="mt-3 text-display font-bold">
              Seven modules. One certificate.
            </h2>
            <p className="mt-4 text-lead text-muted">
              Short lessons written for real people, a hands-on drill in every module, and quizzes that explain every answer.
            </p>
            <Link href="/learn" className="mt-8 inline-flex h-12 items-center rounded-full bg-brand px-6 font-semibold text-brand-fg transition-transform active:scale-95">
              See the full course
            </Link>
          </div>
          <ol className="min-w-0 space-y-3">
            {modules.map((m, i) => (
              <motion.li
                key={m.id}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: 0.04 * i, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link href={`/learn/${m.id}`} className="flex items-center gap-5 rounded-2xl border border-line bg-bg p-5 transition-transform duration-300 hover:-translate-y-0.5">
                  <span aria-hidden className="text-3xl">{m.icon}</span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-subtle">Module {m.number}</p>
                    <p className="font-display text-lg font-bold tracking-tight">{m.title}</p>
                    <p className="truncate text-sm text-muted">{m.tagline}</p>
                  </div>
                </Link>
              </motion.li>
            ))}
            <li className="flex items-center gap-5 rounded-2xl bg-gradient-to-r from-brand to-[#7c4dff] p-5 text-white">
              <span aria-hidden className="text-3xl">🏅</span>
              <div>
                <p className="text-xs font-semibold text-white/80">Module 8</p>
                <p className="font-display text-lg font-bold tracking-tight">Final exam + verifiable certificate</p>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section className="py-28 text-center sm:py-36" aria-labelledby="cta-title">
      <div className="container-page">
        <h2 id="cta-title" className="mx-auto max-w-4xl text-display font-extrabold">
          Be the one who <span className="text-gradient">doesn’t click.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lead text-muted">Free. No ads. Start Module 1 right now — no account needed.</p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/learn/what-is-phishing" className="inline-flex h-13 items-center rounded-full bg-brand px-7 font-semibold text-brand-fg shadow-[0_6px_20px_-8px_var(--brand)] transition-transform active:scale-95">
            Start learning free
          </Link>
          <Link href="/signup" className="inline-flex h-13 items-center rounded-full border border-line bg-elevated px-7 font-semibold transition-transform active:scale-95">
            Create an account
          </Link>
        </div>
      </div>
    </section>
  );
}
