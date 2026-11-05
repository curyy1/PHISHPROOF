import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { deleteClassAction, removeStudentAction } from "@/app/actions/classes";
import { Button } from "@/components/ui/Button";
import { CopyLink } from "@/components/CopyLink";
import { FLAG_INFO, modules } from "@/content";
import type { FlagType } from "@/content/types";
import { SITE_URL } from "@/lib/env";
import { computeStreak, examPassed, moduleProgress, overallProgress, quizPassed } from "@/lib/progress";
import { loadStates } from "@/lib/progress/server-store";
import { getCurrentUser, getServerSupabase } from "@/lib/supabase/server";
import { RosterExport } from "./RosterExport";

export const metadata: Metadata = { title: "Class progress" };

type Props = { params: Promise<{ classId: string }> };

export default async function ClassPage({ params }: Props) {
  const { classId } = await params;
  if (!/^[0-9a-f-]{36}$/.test(classId)) notFound();
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=/teach/${classId}`);
  const supabase = (await getServerSupabase())!;
  const { data: cls } = await supabase.from("classes").select("id, name, join_code, teacher_id").eq("id", classId).maybeSingle();
  if (!cls || cls.teacher_id !== user.id) notFound();

  const { data: members } = await supabase.from("class_members").select("user_id, joined_at").eq("class_id", classId);
  const ids = (members ?? []).map((m) => m.user_id as string);
  const [{ data: profiles }, states, { data: certs }] = await Promise.all([
    ids.length ? supabase.from("profiles").select("id, display_name").in("id", ids) : Promise.resolve({ data: [] as { id: string; display_name: string }[] }),
    loadStates(supabase, ids),
    ids.length ? supabase.from("certificates").select("user_id, id").in("user_id", ids) : Promise.resolve({ data: [] as { user_id: string; id: string }[] }),
  ]);
  const nameOf = new Map((profiles ?? []).map((p) => [p.id as string, p.display_name as string]));
  const certOf = new Map((certs ?? []).map((c) => [c.user_id as string, c.id as string]));
  const today = new Date().toISOString().slice(0, 10);

  const rows = ids
    .map((id) => {
      const s = states.get(id)!;
      return {
        id,
        name: nameOf.get(id) ?? "Student",
        overall: Math.round(overallProgress(s) * 100),
        modulesDone: modules.filter((m) => moduleProgress(s, m).complete).length,
        quizzesPassed: modules.filter((m) => quizPassed(s, m.id)).length,
        drillAccuracy: s.drills.length ? Math.round((s.drills.filter((d) => d.correct).length / s.drills.length) * 100) : null,
        xp: s.xp,
        streak: computeStreak(s.days, today).current,
        lastActive: s.days[s.days.length - 1] ?? null,
        passed: examPassed(s),
        certificate: certOf.get(id) ?? null,
      };
    })
    .sort((a, b) => b.overall - a.overall);

  // Class-wide red-flag catch rate.
  const tally = new Map<FlagType, { found: number; missed: number }>();
  for (const s of states.values())
    for (const d of s.drills) {
      for (const f of d.found) tally.set(f, { found: (tally.get(f)?.found ?? 0) + 1, missed: tally.get(f)?.missed ?? 0 });
      for (const f of d.missed) tally.set(f, { found: tally.get(f)?.found ?? 0, missed: (tally.get(f)?.missed ?? 0) + 1 });
    }
  const classWeak = [...tally.entries()]
    .map(([f, t]) => ({ f, rate: t.found / (t.found + t.missed), n: t.found + t.missed }))
    .filter((x) => x.n >= 5)
    .sort((a, b) => a.rate - b.rate)
    .slice(0, 3);
  const avg = rows.length ? Math.round(rows.reduce((n, r) => n + r.overall, 0) / rows.length) : 0;

  return (
    <div className="container-page py-12 sm:py-16">
      <Link href="/teach" className="text-sm text-muted hover:text-fg">← All classes</Link>
      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Class</p>
          <h1 className="mt-2 text-display font-bold">{cls.name}</h1>
        </div>
        <RosterExport className={cls.name} rows={rows} />
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <section className="card p-5 md:col-span-1" aria-label="Join code">
          <p className="text-sm text-subtle">Join code</p>
          <p className="mt-1 font-mono text-headline font-bold tracking-[0.2em]">{cls.join_code}</p>
          <p className="mt-2 text-sm text-muted">Students go to Account → Classes and enter this code.</p>
          <CopyLink value={`${SITE_URL}/account`} />
        </section>
        <section className="card p-5" aria-label="Summary">
          <p className="text-sm text-subtle">Students</p>
          <p className="mt-1 text-headline font-bold">{rows.length}</p>
          <p className="mt-2 text-sm text-muted">
            Average progress {avg}% · {rows.filter((r) => r.passed).length} certified
          </p>
        </section>
        <section className="card p-5" aria-label="Class weak spots">
          <p className="text-sm text-subtle">Class weak spots</p>
          {classWeak.length === 0 ? (
            <p className="mt-2 text-sm text-muted">Not enough simulator data yet.</p>
          ) : (
            <ul className="mt-2 space-y-1.5 text-sm">
              {classWeak.map((w) => (
                <li key={w.f} className="flex justify-between gap-2">
                  <Link href={`/learn/${FLAG_INFO[w.f].review.moduleId}/${FLAG_INFO[w.f].review.lessonId}`} className="hover:underline">{FLAG_INFO[w.f].label}</Link>
                  <span className="tabular-nums text-muted">{Math.round(w.rate * 100)}% caught</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="card mt-6 overflow-x-auto" aria-label="Roster">
        {rows.length === 0 ? (
          <p className="p-6 text-muted">No students yet. Share the join code above.</p>
        ) : (
          <table className="w-full min-w-[760px] text-sm">
            <thead className="border-b border-line text-left text-subtle">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">Student</th>
                <th scope="col" className="px-4 py-3 font-semibold">Progress</th>
                <th scope="col" className="px-4 py-3 font-semibold">Quizzes passed</th>
                <th scope="col" className="px-4 py-3 font-semibold">Drill accuracy</th>
                <th scope="col" className="px-4 py-3 font-semibold">XP</th>
                <th scope="col" className="px-4 py-3 font-semibold">Streak</th>
                <th scope="col" className="px-4 py-3 font-semibold">Last active</th>
                <th scope="col" className="px-4 py-3 font-semibold">Certificate</th>
                <th scope="col" className="px-4 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((r) => (
                <tr key={r.id}>
                  <th scope="row" className="px-4 py-3 text-left font-semibold">{r.name}</th>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-20 overflow-hidden rounded-full bg-sunken" aria-hidden>
                        <span className="block h-full origin-left bg-brand" style={{ transform: `scaleX(${r.overall / 100})` }} />
                      </span>
                      <span className="tabular-nums">{r.overall}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 tabular-nums">{r.quizzesPassed}/{modules.length}</td>
                  <td className="px-4 py-3 tabular-nums">{r.drillAccuracy === null ? "—" : `${r.drillAccuracy}%`}</td>
                  <td className="px-4 py-3 tabular-nums">{r.xp}</td>
                  <td className="px-4 py-3 tabular-nums">{r.streak}</td>
                  <td className="px-4 py-3 text-muted">{r.lastActive ?? "—"}</td>
                  <td className="px-4 py-3">
                    {r.certificate ? <Link href={`/verify/${r.certificate}`} className="text-brand hover:underline">✓ View</Link> : <span className="text-subtle">—</span>}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <form action={removeStudentAction}>
                      <input type="hidden" name="classId" value={cls.id} />
                      <input type="hidden" name="userId" value={r.id} />
                      <Button type="submit" size="sm" variant="ghost" aria-label={`Remove ${r.name} from class`}>Remove</Button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <details className="mt-10 rounded-2xl border border-danger/30 p-5">
        <summary className="cursor-pointer font-semibold text-danger">Delete this class</summary>
        <p className="mt-2 text-sm text-muted">Students keep their own progress; they’re just removed from the class.</p>
        <form action={deleteClassAction} className="mt-3">
          <input type="hidden" name="classId" value={cls.id} />
          <Button type="submit" variant="danger" size="sm">Delete class</Button>
        </form>
      </details>
    </div>
  );
}
