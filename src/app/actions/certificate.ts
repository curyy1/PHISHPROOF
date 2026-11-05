"use server";

import { revalidatePath } from "next/cache";
import { bestQuiz, examPassed, FINAL_EXAM_ID } from "@/lib/progress";
import { loadState } from "@/lib/progress/server-store";
import { fullNameSchema } from "@/lib/progress/validation";
import { newCertificateId } from "@/lib/certificate";
import { limitByIp } from "@/lib/ratelimit";
import { getAdminSupabase } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/supabase/server";

export type CertState = { error?: string; id?: string } | undefined;

/** Issue the certificate once the server confirms a passing final-exam attempt. */
export async function claimCertificateAction(_: CertState, form: FormData): Promise<CertState> {
  const limited = await limitByIp("certificate", 5, 10 * 60_000);
  if (limited) return { error: limited };
  const user = await getCurrentUser();
  if (!user) return { error: "Sign in first." };
  const name = fullNameSchema.safeParse(form.get("fullName"));
  if (!name.success) return { error: name.error.issues[0].message };
  const admin = getAdminSupabase();
  if (!admin) return { error: "Certificates need SUPABASE_SERVICE_ROLE_KEY on the server (see SETUP.md)." };

  const { data: existing } = await admin.from("certificates").select("id").eq("user_id", user.id).maybeSingle();
  if (existing) return { id: existing.id as string };

  const state = await loadState(admin, user.id);
  if (!examPassed(state)) return { error: "Pass the final exam (80%+) to earn your certificate." };
  const best = bestQuiz(state, FINAL_EXAM_ID)!;

  for (let attempt = 0; attempt < 3; attempt++) {
    const id = newCertificateId();
    const { error } = await admin.from("certificates").insert({ id, user_id: user.id, full_name: name.data, score: best.score, total: best.total });
    if (!error) {
      await admin.from("profiles").update({ full_name: name.data }).eq("id", user.id);
      revalidatePath("/certificate");
      return { id };
    }
    if (!/duplicate|unique/i.test(error.message)) return { error: "Couldn’t issue the certificate. Please try again." };
  }
  return { error: "Couldn’t issue the certificate. Please try again." };
}
