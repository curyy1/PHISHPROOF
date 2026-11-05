"use server";

import { isSupabaseConfigured } from "@/lib/env";
import { applyEvent, gradeEvent, GradingError } from "@/lib/progress";
import { loadState, persistApplied } from "@/lib/progress/server-store";
import type { ProgressState } from "@/lib/progress/types";
import { guestImportSchema, isPlausibleDay, rawEventSchema } from "@/lib/progress/validation";
import { rateLimitCheck } from "@/lib/ratelimit";
import { getAdminSupabase } from "@/lib/supabase/admin";
import { getCurrentUser, getServerSupabase } from "@/lib/supabase/server";

export type RecordResult =
  | { ok: true; state: ProgressState; xpGained: number; newBadges: string[]; graded: ReturnType<typeof gradeEvent> }
  | { ok: false; error: string; code?: "auth" | "config" | "invalid" | "rate" };

/** Load the signed-in learner's progress (null for guests / demo mode). */
export async function getMyProgress(): Promise<ProgressState | null> {
  if (!isSupabaseConfigured) return null;
  const user = await getCurrentUser();
  const supabase = await getServerSupabase();
  if (!user || !supabase) return null;
  return loadState(supabase, user.id);
}

/**
 * Record a learning event for the signed-in user. The answer is validated and
 * re-graded on the server from repo content; the client never supplies scores or XP.
 */
export async function recordEvent(input: unknown, day: unknown): Promise<RecordResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Sign in to save progress.", code: "auth" };
  const parsed = rawEventSchema.safeParse(input);
  if (!parsed.success || typeof day !== "string" || !isPlausibleDay(day)) return { ok: false, error: "Invalid submission.", code: "invalid" };
  if (!rateLimitCheck(`record:${user.id}`, 120, 60_000).ok) return { ok: false, error: "Slow down a little!", code: "rate" };
  const admin = getAdminSupabase();
  if (!admin) return { ok: false, error: "Progress saving needs SUPABASE_SERVICE_ROLE_KEY (see SETUP.md).", code: "config" };

  try {
    const graded = gradeEvent(parsed.data);
    const prev = await loadState(admin, user.id);
    const at = new Date().toISOString();
    const result = applyEvent(prev, graded, at, day);
    await persistApplied(admin, user.id, prev, graded, result, at, day, day);
    return { ok: true, state: result.state, xpGained: result.xpGained, newBadges: result.newBadges, graded };
  } catch (e) {
    if (e instanceof GradingError) return { ok: false, error: "That item doesn’t exist.", code: "invalid" };
    console.error(e);
    return { ok: false, error: "Couldn’t save your progress. Please try again." };
  }
}

/**
 * Import progress a guest made before signing up. Every logged event is
 * re-validated and re-graded; only events from the last 60 days are accepted.
 */
export async function importGuestProgress(log: unknown): Promise<RecordResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Sign in first.", code: "auth" };
  if (!rateLimitCheck(`import:${user.id}`, 3, 10 * 60_000).ok) return { ok: false, error: "Please wait before importing again.", code: "rate" };
  const parsed = guestImportSchema.safeParse(log);
  if (!parsed.success) return { ok: false, error: "Saved guest progress looks invalid.", code: "invalid" };
  const admin = getAdminSupabase();
  if (!admin) return { ok: false, error: "Progress saving needs SUPABASE_SERVICE_ROLE_KEY (see SETUP.md).", code: "config" };

  const now = Date.now();
  const today = new Date().toISOString().slice(0, 10);
  let state = await loadState(admin, user.id);
  let xpGained = 0;
  const newBadges: string[] = [];
  let lastGraded: ReturnType<typeof gradeEvent> | null = null;
  for (const entry of parsed.data) {
    const t = Date.parse(entry.at);
    if (!(t <= now + 5 * 60_000 && t >= now - 60 * 86_400_000)) continue;
    let graded;
    try {
      graded = gradeEvent(entry.event);
    } catch {
      continue;
    }
    const result = applyEvent(state, graded, entry.at, entry.day);
    await persistApplied(admin, user.id, state, graded, result, entry.at, entry.day, today);
    state = result.state;
    xpGained += result.xpGained;
    newBadges.push(...result.newBadges);
    lastGraded = graded;
  }
  if (!lastGraded) return { ok: false, error: "Nothing to import.", code: "invalid" };
  return { ok: true, state, xpGained, newBadges, graded: lastGraded };
}
