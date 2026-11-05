import type { Metadata } from "next";
import Link from "next/link";
import { clsx } from "clsx";
import { isSupabaseConfigured } from "@/lib/env";
import { getCurrentUser, getServerSupabase } from "@/lib/supabase/server";
import { getMyProfile } from "@/lib/auth";

export const metadata: Metadata = { title: "Leaderboard", description: "Top learners by XP. Opt-in only; display names only." };

type Row = { rank: number; display_name: string; xp: number; longest_streak: number; is_me: boolean };

export default async function LeaderboardPage() {
  const supabase = await getServerSupabase();
  const rows: Row[] = supabase ? (((await supabase.rpc("get_leaderboard", { max_rows: 50 })).data ?? []) as Row[]) : [];
  const user = await getCurrentUser();
  const profile = user ? await getMyProfile() : null;
  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div className="container-prose py-14 sm:py-20">
      <p className="eyebrow">Leaderboard</p>
      <h1 className="mt-3 text-display font-bold">Top phish catchers</h1>
      <p className="mt-3 text-lead text-muted">
        Opt-in only. We show display names and XP — nothing else. XP comes from server-graded lessons, quizzes and drills, so it can’t be faked.
      </p>

      {profile && !profile.leaderboard_opt_in && (
        <p className="mt-6 rounded-2xl bg-brand-soft p-4 text-sm text-brand-ink">
          You’re not on the board. <Link href="/account" className="font-semibold underline">Opt in from your account settings</Link> if you’d like to be.
        </p>
      )}

      {!isSupabaseConfigured ? (
        <p className="card mt-8 p-6 text-muted">The leaderboard needs accounts, which aren’t set up on this deployment yet.</p>
      ) : rows.length === 0 ? (
        <p className="card mt-8 p-6 text-muted">No one has opted in yet. Be the first!</p>
      ) : (
        <ol className="card mt-8 divide-y divide-line overflow-hidden" aria-label="Leaderboard">
          {rows.map((r) => (
            <li key={`${r.rank}-${r.display_name}`} className={clsx("flex items-center gap-4 px-5 py-3.5", r.is_me && "bg-brand-soft")}>
              <span className="w-8 text-center font-display text-lg font-bold tabular-nums">{medals[r.rank - 1] ?? r.rank}</span>
              <span className="min-w-0 flex-1 truncate font-semibold">
                {r.display_name}
                {r.is_me && <span className="ml-2 text-xs font-normal text-brand-ink">(you)</span>}
              </span>
              <span className="hidden text-sm text-subtle sm:inline">🔥 {r.longest_streak}</span>
              <span className="w-24 text-right font-semibold tabular-nums">{r.xp.toLocaleString()} XP</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
