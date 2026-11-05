"use server";

import { revalidatePath } from "next/cache";
import { timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { displayNameSchema, fullNameSchema } from "@/lib/progress/validation";
import { limitByIp } from "@/lib/ratelimit";
import { getAdminSupabase } from "@/lib/supabase/admin";
import { getCurrentUser, getServerSupabase } from "@/lib/supabase/server";

export type FormState = { error?: string; message?: string } | undefined;

/** Update safe profile fields. Runs as the user, so RLS + column grants apply. */
export async function updateProfileAction(_: FormState, form: FormData): Promise<FormState> {
  const user = await getCurrentUser();
  const supabase = await getServerSupabase();
  if (!user || !supabase) return { error: "Sign in first." };
  const parsed = z
    .object({
      displayName: displayNameSchema,
      fullName: z.union([z.literal(""), fullNameSchema]),
      optIn: z.boolean(),
    })
    .safeParse({ displayName: form.get("displayName"), fullName: String(form.get("fullName") ?? "").trim(), optIn: form.get("optIn") === "on" });
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { error } = await supabase
    .from("profiles")
    .update({ display_name: parsed.data.displayName, full_name: parsed.data.fullName || null, leaderboard_opt_in: parsed.data.optIn })
    .eq("id", user.id);
  if (error) return { error: "Couldn’t save your profile." };
  revalidatePath("/", "layout");
  return { message: "Saved." };
}

const code = z.string().trim().toUpperCase().regex(/^[A-Z2-9]{6}$/, "Class codes are 6 letters/numbers");

export async function joinClassAction(_: FormState, form: FormData): Promise<FormState> {
  const limited = await limitByIp("join-class", 10, 10 * 60_000);
  if (limited) return { error: limited };
  const supabase = await getServerSupabase();
  if (!supabase || !(await getCurrentUser())) return { error: "Sign in first." };
  const parsed = code.safeParse(form.get("code"));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { error } = await supabase.rpc("join_class", { code: parsed.data });
  if (error) return { error: /No class/.test(error.message) ? "No class found with that code." : "Couldn’t join the class." };
  revalidatePath("/account");
  return { message: "You joined the class! Your teacher can now see your course progress." };
}

export async function leaveClassAction(form: FormData) {
  const supabase = await getServerSupabase();
  const user = await getCurrentUser();
  const classId = z.string().uuid().safeParse(form.get("classId"));
  if (!supabase || !user || !classId.success) return;
  await supabase.from("class_members").delete().eq("class_id", classId.data).eq("user_id", user.id);
  revalidatePath("/account");
}

/** Become a teacher with the invite code set in TEACHER_INVITE_CODE (see SETUP.md). */
export async function redeemTeacherCodeAction(_: FormState, form: FormData): Promise<FormState> {
  const limited = await limitByIp("teacher-code", 5, 15 * 60_000);
  if (limited) return { error: limited };
  const user = await getCurrentUser();
  if (!user) return { error: "Sign in first." };
  const expected = process.env.TEACHER_INVITE_CODE ?? "";
  const given = String(form.get("code") ?? "").trim();
  const ok =
    expected.length >= 8 && given.length === expected.length && timingSafeEqual(Buffer.from(given), Buffer.from(expected));
  if (!ok) return { error: "That teacher code isn’t valid." };
  const admin = getAdminSupabase();
  if (!admin) return { error: "Server isn’t configured for this (see SETUP.md)." };
  const { error } = await admin.from("profiles").update({ role: "teacher" }).eq("id", user.id).eq("role", "student");
  if (error) return { error: "Couldn’t update your role." };
  revalidatePath("/", "layout");
  return { message: "You’re now a teacher. Open the Teach tab to create a class." };
}
