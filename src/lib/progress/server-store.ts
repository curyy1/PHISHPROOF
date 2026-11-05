import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { FlagType } from "@/content/types";
import { computeStreak } from "./streak";
import { ACTIVITY_LOG_LIMIT } from "./reducer";
import { emptyState, type ApplyResult, type DrillKind, type GradedEvent, type ProgressState } from "./types";

type Row = Record<string, unknown>;

/**
 * Build a learner's ProgressState from the database. Works with either the
 * user's own client (RLS: own rows, or a teacher reading a student) or the admin client.
 */
export async function loadState(db: SupabaseClient, userId: string): Promise<ProgressState> {
  const [profile, lessons, quizzes, drills, acts, days, badges, log] = await Promise.all([
    db.from("profiles").select("xp").eq("id", userId).maybeSingle(),
    db.from("lesson_progress").select("lesson_id, completed_at").eq("user_id", userId),
    db.from("quiz_attempts").select("quiz_id, score, total, created_at").eq("user_id", userId).order("created_at"),
    db.from("drill_results").select("drill, item_id, is_phish, correct, found, missed, false_flags, created_at").eq("user_id", userId).order("created_at"),
    db.from("user_activities").select("key, completed_at").eq("user_id", userId),
    db.from("daily_activity").select("day").eq("user_id", userId).order("day"),
    db.from("user_badges").select("badge_id, earned_at").eq("user_id", userId),
    db.from("activity_log").select("kind, label, xp, href, created_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(ACTIVITY_LOG_LIMIT),
  ]);
  const firstError = [profile, lessons, quizzes, drills, acts, days, badges].find((r) => r.error)?.error;
  if (firstError) throw new Error(`Failed to load progress: ${firstError.message}`);

  const s = emptyState();
  s.xp = (profile.data?.xp as number) ?? 0;
  for (const r of (lessons.data ?? []) as Row[]) s.lessons[r.lesson_id as string] = r.completed_at as string;
  s.quizzes = ((quizzes.data ?? []) as Row[]).map((r) => ({
    quizId: r.quiz_id as string,
    score: r.score as number,
    total: r.total as number,
    at: r.created_at as string,
  }));
  s.drills = ((drills.data ?? []) as Row[]).map((r) => ({
    drill: r.drill as DrillKind,
    itemId: r.item_id as string,
    isPhish: r.is_phish as boolean,
    correct: r.correct as boolean,
    found: (r.found as FlagType[]) ?? [],
    missed: (r.missed as FlagType[]) ?? [],
    falseFlags: (r.false_flags as number) ?? 0,
    at: r.created_at as string,
  }));
  for (const r of (acts.data ?? []) as Row[]) s.activities[r.key as string] = r.completed_at as string;
  s.days = ((days.data ?? []) as Row[]).map((r) => String(r.day).slice(0, 10));
  for (const r of (badges.data ?? []) as Row[]) s.badges[r.badge_id as string] = r.earned_at as string;
  s.activity = ((log.data ?? []) as Row[]).map((r) => ({
    kind: r.kind as string,
    label: r.label as string,
    xp: r.xp as number,
    href: (r.href as string) ?? undefined,
    at: r.created_at as string,
  }));
  return s;
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
