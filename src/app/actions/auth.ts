"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { SITE_URL, isGoogleEnabled } from "@/lib/env";
import { limitByIp } from "@/lib/ratelimit";
import { getAdminSupabase } from "@/lib/supabase/admin";
import { getCurrentUser, getServerSupabase } from "@/lib/supabase/server";
import { displayNameSchema } from "@/lib/progress/validation";
import { safeNext } from "@/lib/safe-next";

export type AuthState = { error?: string; message?: string; fields?: Record<string, string> } | undefined;

const email = z.string().trim().toLowerCase().email("Enter a valid email address").max(254);
const password = z
  .string()
  .min(15, "Use at least 15 characters — a passphrase of 4+ random words works great")
  .max(128, "Passwords can be up to 128 characters");

const notConfigured: AuthState = {
  error: "Accounts aren’t set up on this deployment yet (Supabase isn’t configured). You can still learn as a guest.",
};

export async function signUpAction(_: AuthState, form: FormData): Promise<AuthState> {
  const limited = await limitByIp("signup", 5, 10 * 60_000);
  if (limited) return { error: limited };
  const parsed = z
    .object({ email, password, displayName: displayNameSchema, agree: z.literal("on", { message: "Please confirm you’ve read how we handle your data" }) })
    .safeParse({ email: form.get("email"), password: form.get("password"), displayName: form.get("displayName"), agree: form.get("agree") });
  if (!parsed.success) return { error: parsed.error.issues[0].message, fields: { email: String(form.get("email") ?? ""), displayName: String(form.get("displayName") ?? "") } };
  const supabase = await getServerSupabase();
  if (!supabase) return notConfigured;
  const next = safeNext(form.get("next"));
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { display_name: parsed.data.displayName },
      emailRedirectTo: `${SITE_URL}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });
  if (error) return { error: friendly(error.message) };
  if (!data.session) return { message: "Check your email to confirm your account, then come back to sign in." };
  redirect(`${next}${next.includes("?") ? "&" : "?"}welcome=1`);
}

export async function signInAction(_: AuthState, form: FormData): Promise<AuthState> {
  const limited = await limitByIp("signin", 10, 10 * 60_000);
  if (limited) return { error: limited };
  const parsed = z
    .object({ email, password: z.string().min(1, "Enter your password").max(128) })
    .safeParse({ email: form.get("email"), password: form.get("password") });
  if (!parsed.success) return { error: parsed.error.issues[0].message, fields: { email: String(form.get("email") ?? "") } };
  const supabase = await getServerSupabase();
  if (!supabase) return notConfigured;
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  // Same message for unknown email and wrong password (don't leak which accounts exist).
  if (error) return { error: "That email and password don’t match. Try again or reset your password.", fields: { email: parsed.data.email } };
  redirect(safeNext(form.get("next")));
}

export async function magicLinkAction(_: AuthState, form: FormData): Promise<AuthState> {
  const limited = await limitByIp("magic", 5, 10 * 60_000);
  if (limited) return { error: limited };
  const parsed = email.safeParse(form.get("email"));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const supabase = await getServerSupabase();
  if (!supabase) return notConfigured;
  const next = safeNext(form.get("next"));
  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data,
    options: { shouldCreateUser: false, emailRedirectTo: `${SITE_URL}/auth/callback?next=${encodeURIComponent(next)}` },
  });
  if (error && !/signups not allowed|not found/i.test(error.message)) return { error: friendly(error.message) };
  // Same response whether or not the account exists.
  return { message: "If that email has an account, a sign-in link is on its way. It expires in 1 hour." };
}

export async function googleAction(form: FormData) {
  if (!isGoogleEnabled) redirect("/login?error=google-disabled");
  const limited = await limitByIp("oauth", 10, 10 * 60_000);
  if (limited) redirect("/login?error=rate-limited");
  const supabase = await getServerSupabase();
  if (!supabase) redirect("/login");
  const next = safeNext(form.get("next"));
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${SITE_URL}/auth/callback?next=${encodeURIComponent(next)}` },
  });
  if (error || !data.url) redirect("/login?error=oauth");
  redirect(data.url);
}

export async function forgotPasswordAction(_: AuthState, form: FormData): Promise<AuthState> {
  const limited = await limitByIp("forgot", 5, 15 * 60_000);
  if (limited) return { error: limited };
  const parsed = email.safeParse(form.get("email"));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const supabase = await getServerSupabase();
  if (!supabase) return notConfigured;
  await supabase.auth.resetPasswordForEmail(parsed.data, {
    redirectTo: `${SITE_URL}/auth/callback?next=/reset-password`,
  });
  return { message: "If that email has an account, we sent a link to reset your password." };
}

export async function updatePasswordAction(_: AuthState, form: FormData): Promise<AuthState> {
  const limited = await limitByIp("update-password", 10, 15 * 60_000);
  if (limited) return { error: limited };
  const parsed = z
    .object({ password, confirm: z.string() })
    .refine((v) => v.password === v.confirm, { message: "Passwords don’t match" })
    .safeParse({ password: form.get("password"), confirm: form.get("confirm") });
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const supabase = await getServerSupabase();
  if (!supabase) return notConfigured;
  const user = await getCurrentUser();
  if (!user) return { error: "Your reset link expired. Request a new one." };
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) return { error: friendly(error.message) };
  redirect("/dashboard?password=updated");
}

export async function signOutAction() {
  const supabase = await getServerSupabase();
  await supabase?.auth.signOut();
  redirect("/");
}

export async function deleteAccountAction(_: AuthState, form: FormData): Promise<AuthState> {
  const limited = await limitByIp("delete-account", 3, 15 * 60_000);
  if (limited) return { error: limited };
  if (form.get("confirm") !== "DELETE") return { error: "Type DELETE to confirm." };
  const user = await getCurrentUser();
  if (!user) return { error: "You’re not signed in." };
  const admin = getAdminSupabase();
  if (!admin) return { error: "Account deletion needs SUPABASE_SERVICE_ROLE_KEY on the server (see SETUP.md)." };
  // Deleting the auth user cascades to the profile and every progress row.
  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) return { error: "We couldn’t delete your account. Please try again." };
  const supabase = await getServerSupabase();
  await supabase?.auth.signOut();
  redirect("/?deleted=1");
}

function friendly(msg: string) {
  if (/already registered|already exists/i.test(msg)) return "An account with that email already exists. Try signing in.";
  if (/pwned|leaked|compromised|weak/i.test(msg)) return "That password has appeared in a data breach. Please choose a different passphrase.";
  if (/rate limit|too many/i.test(msg)) return "Too many attempts. Please wait a minute and try again.";
  return "Something went wrong. Please try again.";
}
