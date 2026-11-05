import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { FlagType } from "@/content/types";
import { computeStreak } from "./streak";
import { ACTIVITY_LOG_LIMIT } from "./reducer";
import { emptyState, type ApplyResult, type DrillKind, type GradedEvent, type ProgressState } from "./types";

type Row = Record<string, unknown>;

/**
 * Build learners' ProgressState from the database (batched: 8 queries total, any number of users).
 * Works with the user's own client (RLS: own rows, or a teacher reading their students) or the admin client.
 */
export async function loadStates(db: SupabaseClient, userIds: string[]): Promise<Map<string, ProgressState>> {
  const out = new Map<string, ProgressState>(userIds.map((id) => [id, emptyState()]));
  if (userIds.length === 0) return out;
  const [profile, lessons, quizzes, drills, acts, days, badges, log] = await Promise.all([
    db.from("profiles").select("id, xp").in("id", userIds),
    db.from("lesson_progress").select("user_id, lesson_id, completed_at").in("user_id", userIds),
    db.from("quiz_attempts").select("user_id, quiz_id, score, total, created_at").in("user_id", userIds).order("created_at"),
    db.from("drill_results").select("user_id, drill, item_id, is_phish, correct, found, missed, false_flags, created_at").in("user_id", userIds).order("created_at"),
    db.from("user_activities").select("user_id, key, completed_at").in("user_id", userIds),
    db.from("daily_activity").select("user_id, day").in("user_id", userIds).order("day"),
    db.from("user_badges").select("user_id, badge_id, earned_at").in("user_id", userIds),
    userIds.length === 1
      ? db.from("activity_log").select("user_id, kind, label, xp, href, created_at").eq("user_id", userIds[0]).order("created_at", { ascending: false }).limit(ACTIVITY_LOG_LIMIT)
      : Promise.resolve({ data: [] as Row[], error: null }),
  ]);
  const firstError = [profile, lessons, quizzes, drills, acts, days, badges].find((r) => r.error)?.error;
  if (firstError) throw new Error(`Failed to load progress: ${firstError.message}`);
  const get = (r: Row) => out.get(r.user_id as string ?? r.id as string);

  for (const r of (profile.data ?? []) as Row[]) {
    const s = out.get(r.id as string);
    if (s) s.xp = (r.xp as number) ?? 0;
  }
  for (const r of (lessons.data ?? []) as Row[]) get(r)!.lessons[r.lesson_id as string] = r.completed_at as string;
  for (const r of (quizzes.data ?? []) as Row[])
    get(r)!.quizzes.push({ quizId: r.quiz_id as string, score: r.score as number, total: r.total as number, at: r.created_at as string });
  for (const r of (drills.data ?? []) as Row[])
    get(r)!.drills.push({
      drill: r.drill as DrillKind,
      itemId: r.item_id as string,
      isPhish: r.is_phish as boolean,
      correct: r.correct as boolean,
      found: (r.found as FlagType[]) ?? [],
      missed: (r.missed as FlagType[]) ?? [],
      falseFlags: (r.false_flags as number) ?? 0,
      at: r.created_at as string,
    });
  for (const r of (acts.data ?? []) as Row[]) get(r)!.activities[r.key as string] = r.completed_at as string;
  for (const r of (days.data ?? []) as Row[]) get(r)!.days.push(String(r.day).slice(0, 10));
  for (const r of (badges.data ?? []) as Row[]) get(r)!.badges[r.badge_id as string] = r.earned_at as string;
  for (const r of (log.data ?? []) as Row[])
    get(r)?.activity.push({ kind: r.kind as string, label: r.label as string, xp: r.xp as number, href: (r.href as string) ?? undefined, at: r.created_at as string });
  return out;
}

export async function loadState(db: SupabaseClient, userId: string): Promise<ProgressState> {
  return (await loadStates(db, [userId])).get(userId)!;
}

/** Persist the effects of one applied event. Uses the admin client, always scoped to `userId`. */
export async function persistApplied(
  admin: SupabaseClient,
  userId: string,
  prev: ProgressState,
  e: GradedEvent,
  result: ApplyResult,
  at: string,
  day: string,
  today: string,
) {
  const writes: PromiseLike<{ error: { message: string } | null }>[] = [];
  switch (e.type) {
    case "lesson":
      if (!prev.lessons[e.lessonId])
        writes.push(admin.from("lesson_progress").upsert({ user_id: userId, lesson_id: e.lessonId, completed_at: at }, { ignoreDuplicates: true }));
      break;
    case "activity":
      if (!prev.activities[e.key])
        writes.push(admin.from("user_activities").upsert({ user_id: userId, key: e.key, completed_at: at }, { ignoreDuplicates: true }));
      break;
    case "quiz":
      writes.push(admin.from("quiz_attempts").insert({ user_id: userId, quiz_id: e.quizId, score: e.score, total: e.total, created_at: at }));
      break;
    case "drill":
      writes.push(
        admin.from("drill_results").insert({
          user_id: userId,
          drill: e.drill,
          item_id: e.itemId,
          is_phish: e.isPhish,
          correct: e.correct,
          found: e.found,
          missed: e.missed,
          false_flags: e.falseFlags,
          created_at: at,
        }),
      );
      break;
  }
  if (!prev.days.includes(day)) writes.push(admin.from("daily_activity").upsert({ user_id: userId, day }, { ignoreDuplicates: true }));
  if (result.newBadges.length)
    writes.push(
      admin.from("user_badges").upsert(
        result.newBadges.map((badge_id) => ({ user_id: userId, badge_id, earned_at: at })),
        { ignoreDuplicates: true },
      ),
    );
  const newLog = result.state.activity.slice(0, result.newBadges.length + 1).reverse();
  writes.push(
    admin.from("activity_log").insert(newLog.map((a) => ({ user_id: userId, kind: a.kind, label: a.label, xp: a.xp, href: a.href ?? null, created_at: a.at }))),
  );
  const streak = computeStreak(result.state.days, today);
  writes.push(
    admin
      .from("profiles")
      .update({ xp: result.state.xp, current_streak: streak.current, longest_streak: streak.longest, last_active_on: day })
      .eq("id", userId),
  );
  const results = await Promise.all(writes);
  const err = results.find((r) => r.error)?.error;
  if (err) throw new Error(`Failed to save progress: ${err.message}`);
}
