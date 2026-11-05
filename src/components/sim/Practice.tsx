"use client";

import Link from "next/link";
import { clsx } from "clsx";
import { useState } from "react";
import { browserPages, emails, smsItems, urlItems } from "@/content";
import type { Difficulty } from "@/content/types";
import { answeredItems } from "@/lib/progress";
import { useProgress } from "@/components/ProgressProvider";
import { InboxSimulator } from "./InboxSimulator";
import { SmsSimulator } from "./SmsSimulator";
import { BrowserDrill } from "./BrowserDrill";

const levels: (Difficulty | "all")[] = ["all", "easy", "medium", "hard"];

function DifficultyTabs({ value, onChange }: { value: Difficulty | "all"; onChange: (d: Difficulty | "all") => void }) {
  return (
    <div role="tablist" aria-label="Difficulty" className="inline-flex rounded-full bg-sunken p-1 text-sm font-semibold">
      {levels.map((l) => (
        <button
          key={l}
          role="tab"
          type="button"
          aria-selected={value === l}
          onClick={() => onChange(l)}
          className={clsx("rounded-full px-4 py-1.5 capitalize transition-colors", value === l ? "bg-elevated shadow-sm" : "text-muted hover:text-fg")}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

export function InboxPractice() {
  const [d, setD] = useState<Difficulty | "all">("all");
  const ids = emails.filter((e) => d === "all" || e.difficulty === d).map((e) => e.id);
  return (
    <div className="space-y-5">
      <DifficultyTabs value={d} onChange={setD} />
      <InboxSimulator key={d} itemIds={ids} />
    </div>
  );
}

export function SmsPractice() {
  const [d, setD] = useState<Difficulty | "all">("all");
  const ids = smsItems.filter((e) => d === "all" || e.difficulty === d).map((e) => e.id);
  return (
    <div className="space-y-5">
      <DifficultyTabs value={d} onChange={setD} />
      <SmsSimulator key={d} itemIds={ids} />
    </div>
  );
}

export function BrowserPractice() {
  return <BrowserDrill itemIds={browserPages.map((b) => b.id)} />;
}

const tools = [
  { href: "/practice/inbox", icon: "📥", title: "Spot the Phish", body: "Flag the red flags in a realistic inbox.", drill: "inbox", total: emails.length },
  { href: "/practice/sms", icon: "📱", title: "Text & DM simulator", body: "Smishing, fake support, voicemail and QR scams.", drill: "sms", total: smsItems.length },
  { href: "/practice/browser", icon: "🧭", title: "Fake login lab", body: "Inspect the address bar before you sign in.", drill: "browser", total: browserPages.length },
  { href: "/practice/urls", icon: "⏱️", title: "URL inspector", body: "Timed rounds of safe or sketchy.", drill: "urls", total: urlItems.length },
  { href: "/practice/passwords", icon: "🔐", title: "Password lab", body: "Strength meter and passphrase generator.", drill: null, total: 0 },
] as const;

export function PracticeHub() {
  const { state } = useProgress();
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {tools.map((t) => {
        const done = t.drill && state ? answeredItems(state.drills, t.drill, true).size : 0;
        return (
          <li key={t.href}>
            <Link href={t.href} className="card group block h-full p-6 transition-transform duration-300 hover:-translate-y-1">
              <span aria-hidden className="text-4xl">{t.icon}</span>
              <h2 className="mt-4 text-title font-bold">{t.title}</h2>
              <p className="mt-1 text-muted">{t.body}</p>
              {t.drill && (
                <p className="mt-4 text-sm text-subtle">
                  {done}/{t.total} mastered
                </p>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
