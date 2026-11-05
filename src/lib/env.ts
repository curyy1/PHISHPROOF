/**
 * Central place for environment configuration. Public values are safe to ship
 * to the browser; the service role key is only read on the server (see
 * src/lib/supabase/admin.ts which imports "server-only").
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** When false the site runs in "demo mode": everything works locally as a guest, accounts are disabled. */
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

/** Google sign-in is only shown when you've enabled the provider in Supabase. */
export const isGoogleEnabled = process.env.NEXT_PUBLIC_ENABLE_GOOGLE_AUTH === "true";
