"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { clsx } from "clsx";
import { modules } from "@/content";
import {
  addDays,
  BADGES,
  computeStreak,
  examPassed,
  flagAccuracy,
  levelFor,
  moduleProgress,
  nextStep,
  overallProgress,
  toDayString,
  weakSpots,
} from "@/lib/progress";
import { useProgress } from "@/components/ProgressProvider";
import { ProgressBar, ProgressRing } from "@/components/ui/ProgressRing";
import { Button, ButtonLink } from "@/components/ui/Button";

const fade = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } };

function Card({ children, className, delay = 0, id, label }: { children: React.ReactNode; className?: string; delay?: number; id?: string; label?: string }) {
  return (
    <motion.section
      id={id}
      aria-label={label}
      variants={fade}
      initial="hidden"
      animate="show"
      transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={clsx("card p-5 sm:p-6", className)}
    >
      {children}
    </motion.section>
  );
}

function timeAgo(iso: string) {
  const s = (Date.now() - Date.parse(iso)) / 1000;
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export function Dashboard({ displayName }: { displayName: string | null }) {
  const { state, loading, signedIn, authEnabled, pendingGuestImport, importGuest, discardGuest } = useProgress();
  if (loading || !state)
    return (
      <div className="grid gap-4 md:grid-cols-3" aria-busy="true" aria-label="Loading your dashboard">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="card h-40 animate-pulse" />
        ))}
      </div>
    );

  const today = toDayString(new Date());
  const streak = computeStreak(state.days, today);
  const lvl = levelFor(state.xp);
  const overall = overallProgress(state);
  const step = nextStep(state);
  const spots = weakSpots(state);
  const flags = flagAccuracy(state).filter((f) => f.found + f.missed > 0);
  const last14 = Array.from({ length: 14 }, (_, i) => addDays(today, i - 13));
  const activeSet = new Set(state.days);
  const earned = BADGES.filter((b) => state.badges[b.id]).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1 className="mt-2 text-display font-bold">{displayName ? `Hey, ${displayName}` : "Your progress"}</h1>
        </div>
        {examPassed(state) && (
          <ButtonLink href="/certificate" variant="secondary">
            🏅 View certificate
          </ButtonLink>
        )}
      </div>

      {!signedIn && authEnabled && (
        <div className="flex flex-col gap-3 rounded-2xl bg-warn-soft p-4 text-warn-ink sm:flex-row sm:items-center sm:justify-between" role="note">
          <p className="text-sm">
            <span className="font-bold">Guest mode:</span> your progress is saved only in this browser. Create a free account to keep it, unlock every module,
            and earn a certificate.
          </p>
          <ButtonLink href="/signup?next=/dashboard" size="sm">Save my progress</ButtonLink>
        </div>
      )}
      {signedIn && pendingGuestImport > 0 && (
        <div className="flex flex-col gap-3 rounded-2xl bg-brand-soft p-4 sm:flex-row sm:items-center sm:justify-between" role="note">
          <p className="text-sm text-brand-ink">
            <span className="font-bold">Welcome!</span> We found progress you made as a guest on this device. Add it to your account?
          </p>
          <div className="flex gap-2">
            <Button size="sm" onClick={importGuest} data-testid="import-guest">Save it to my account</Button>
            <Button size="sm" variant="ghost" onClick={discardGuest}>No thanks</Button>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="flex items-center gap-5 md:col-span-1" label="Overall progress">
          <ProgressRing value={overall} size={112} sublabel="complete" />
          <div>
            <p className="text-sm text-subtle">Course progress</p>
            <p className="mt-1 text-sm text-muted">
              {Object.keys(state.lessons).length} lessons · {modules.filter((m) => moduleProgress(state, m).complete).length}/{modules.length} modules
            </p>
          </div>
        </Card>

        <Card delay={0.05} label="Experience points">
          <div className="flex items-baseline justify-between">
            <p className="text-sm text-subtle">Level {lvl.level}</p>
            <p className="text-sm text-muted">{lvl.toNext} XP to level {lvl.level + 1}</p>
          </div>
          <p className="mt-1 font-display text-headline font-bold tabular-nums" data-testid="xp-total">
            {state.xp.toLocaleString()} <span className="text-lg text-subtle">XP</span>
          </p>
          <ProgressBar value={lvl.progress} label={`Progress to level ${lvl.level + 1}`} className="mt-3" />
        </Card>

        <Card delay={0.1} label="Streak">
          <div className="flex items-baseline justify-between">
            <p className="text-sm text-subtle">Streak</p>
            <p className="text-sm text-muted">Best: {streak.longest} day{streak.longest === 1 ? "" : "s"}</p>
          </div>
          <p className="mt-1 font-display text-headline font-bold">
            <span aria-hidden>{streak.current > 0 ? "🔥 " : "💤 "}</span>
            {streak.current} day{streak.current === 1 ? "" : "s"}
          </p>
          <ol className="mt-3 flex gap-1" aria-label="Activity in the last 14 days">
            {last14.map((d) => (
              <li
                key={d}
                title={`${d}${activeSet.has(d) ? " — active" : ""}`}
                className={clsx("h-6 flex-1 rounded-md", activeSet.has(d) ? "bg-brand" : "bg-sunken", d === today && "ring-2 ring-brand/40")}
              >
                <span className="sr-only">
                  {d}: {activeSet.has(d) ? "active" : "no activity"}
                </span>
              </li>
            ))}
          </ol>
        </Card>
      </div>

      <Card delay={0.12} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between" label="Continue">
        <div>
          <p className="text-sm text-subtle">Continue where you left off</p>
          <p className="mt-1 text-title font-bold">{step.label}</p>
          <p className="text-sm text-muted">{step.detail}</p>
        </div>
        <ButtonLink href={step.href} size="lg" data-testid="continue">Continue →</ButtonLink>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card delay={0.15} label="Modules">
          <h2 className="text-title font-bold">Modules</h2>
          <ul className="mt-4 space-y-3">
            {modules.map((m) => {
              const p = moduleProgress(state, m);
              return (
                <li key={m.id}>
                  <Link href={`/learn/${m.id}`} className="group flex items-center gap-3 rounded-xl p-1.5 hover:bg-sunken">
                    <span aria-hidden className="text-2xl">{m.icon}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between gap-2 text-sm">
                        <span className="truncate font-semibold">{m.number}. {m.title}</span>
                        <span className="shrink-0 tabular-nums text-muted">{Math.round(p.ratio * 100)}%</span>
                      </div>
                      <ProgressBar value={p.ratio} label={`${m.title}: ${Math.round(p.ratio * 100)}%`} className="mt-1.5" />
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Card>

        <div className="space-y-4">
          <Card delay={0.2} label="Weak spots">
            <h2 className="text-title font-bold">Weak spots</h2>
            {spots.length === 0 ? (
              <p className="mt-3 text-sm text-muted">
                {state.drills.length < 4 ? "Do a few simulator drills and we’ll show you what to review." : "Nothing stands out — nice work! Keep practicing the hard levels."}
              </p>
            ) : (
              <ul className="mt-4 space-y-2.5">
                {spots.map((s) => (
                  <li key={s.key}>
                    <Link href={s.href} className="block rounded-xl bg-warn-soft p-3 transition-transform hover:-translate-y-0.5">
                      <p className="text-sm font-semibold text-warn-ink">{s.label}</p>
                      <p className="text-sm text-muted">{s.detail}</p>
                      <p className="mt-1 text-xs font-semibold text-brand">Review →</p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card delay={0.25} label="Red flags caught by type">
            <h2 className="text-title font-bold">Red flags you catch</h2>
            {flags.length === 0 ? (
              <p className="mt-3 text-sm text-muted">Flag suspicious parts in the simulators to see your accuracy by red-flag type.</p>
            ) : (
              <table className="mt-4 w-full text-sm">
                <caption className="sr-only">Share of red flags found in simulators, by type</caption>
                <thead className="sr-only">
                  <tr>
                    <th>Red-flag type</th>
                    <th>Caught</th>
                  </tr>
                </thead>
                <tbody>
                  {flags.map((f) => {
                    const total = f.found + f.missed;
                    const pct = f.found / total;
                    return (
                      <tr key={f.flag} title={`${f.label}: caught ${f.found} of ${total}`}>
                        <th scope="row" className="py-1.5 pr-3 text-left align-top font-normal">
                          <span className="block">{f.label}</span>
                          <span className="mt-1 block h-2 overflow-hidden rounded-[4px] bg-sunken" aria-hidden>
                            <span className="block h-full origin-left rounded-[4px] bg-brand transition-transform duration-700" style={{ transform: `scaleX(${pct})` }} />
                          </span>
                        </th>
                        <td className="w-20 py-1.5 text-right align-top tabular-nums text-muted">
                          {f.found}/{total}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </Card>
        </div>
      </div>

      <Card delay={0.3} id="badges" label="Badges">
        <div className="flex items-baseline justify-between">
          <h2 className="text-title font-bold">Badges</h2>
          <p className="text-sm text-muted">{earned}/{BADGES.length} earned</p>
        </div>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {BADGES.map((b) => {
            const at = state.badges[b.id];
            return (
              <li
                key={b.id}
                className={clsx("rounded-2xl border p-4 text-center transition-transform", at ? "border-brand/30 bg-brand-soft hover:-translate-y-0.5" : "border-dashed border-line")}
                title={b.description}
              >
                <span aria-hidden className={clsx("text-3xl", !at && "opacity-40 grayscale")}>{b.icon}</span>
                <p className="mt-2 text-sm font-semibold">{b.name}</p>
                <p className="mt-0.5 text-xs text-muted">{at ? `Earned ${new Date(at).toLocaleDateString()}` : b.description}</p>
                <span className="sr-only">{at ? "earned" : "locked"}</span>
              </li>
            );
          })}
        </ul>
      </Card>

      <Card delay={0.35} label="Recent activity">
        <h2 className="text-title font-bold">Recent activity</h2>
        {state.activity.length === 0 ? (
          <p className="mt-3 text-sm text-muted">Nothing yet — start a lesson!</p>
        ) : (
          <ul className="mt-3 divide-y divide-line">
            {state.activity.slice(0, 10).map((a, i) => (
              <li key={i} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                {a.href ? (
                  <Link href={a.href} className="min-w-0 truncate hover:underline">{a.label}</Link>
                ) : (
                  <span className="min-w-0 truncate">{a.label}</span>
                )}
                <span className="flex shrink-0 items-center gap-3 text-subtle">
                  {a.xp > 0 && <span className="font-semibold text-brand">+{a.xp} XP</span>}
                  <time dateTime={a.at}>{timeAgo(a.at)}</time>
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
