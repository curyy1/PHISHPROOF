"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { limitByIp } from "@/lib/ratelimit";
import { getCurrentUser, getServerSupabase } from "@/lib/supabase/server";

export type ClassFormState = { error?: string } | undefined;
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function joinCode() {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return [...bytes].map((b) => ALPHABET[b % ALPHABET.length]).join("");
}

/** Runs as the teacher: RLS only allows teachers to create classes they own. */
export async function createClassAction(_: ClassFormState, form: FormData): Promise<ClassFormState> {
  const limited = await limitByIp("create-class", 10, 10 * 60_000);
  if (limited) return { error: limited };
  const user = await getCurrentUser();
  const supabase = await getServerSupabase();
  if (!user || !supabase) return { error: "Sign in first." };
  const name = z.string().trim().min(2, "Class name must be at least 2 characters").max(60).safeParse(form.get("name"));
  if (!name.success) return { error: name.error.issues[0].message };
  for (let i = 0; i < 4; i++) {
    const { data, error } = await supabase.from("classes").insert({ name: name.data, join_code: joinCode(), teacher_id: user.id }).select("id").single();
    if (!error && data) redirect(`/teach/${data.id}`);
    if (error && !/duplicate|unique/i.test(error.message)) return { error: /row-level|permission/i.test(error.message) ? "Only teacher accounts can create classes." : "Couldn’t create the class." };
  }
  return { error: "Couldn’t create the class. Please try again." };
}

export async function deleteClassAction(form: FormData) {
  const supabase = await getServerSupabase();
  const id = z.string().uuid().safeParse(form.get("classId"));
  if (!supabase || !id.success) return;
  await supabase.from("classes").delete().eq("id", id.data);
  revalidatePath("/teach");
  redirect("/teach");
}

export async function removeStudentAction(form: FormData) {
  const supabase = await getServerSupabase();
  const classId = z.string().uuid().safeParse(form.get("classId"));
  const userId = z.string().uuid().safeParse(form.get("userId"));
  if (!supabase || !classId.success || !userId.success) return;
  // RLS: only the class's teacher (or the student themself) can delete the membership.
  await supabase.from("class_members").delete().eq("class_id", classId.data).eq("user_id", userId.data);
  revalidatePath(`/teach/${classId.data}`);
}
