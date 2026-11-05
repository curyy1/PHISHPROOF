import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_URL } from "@/lib/env";

let admin: SupabaseClient | null = null;

/**
 * Service-role client. NEVER import this from client code. It bypasses RLS, so
 * every caller must scope its queries to the already-authenticated user id.
 * Progress writes go through here *after* the server has graded the answer,
 * so users can't forge XP or scores by writing to tables directly.
 */
export function getAdminSupabase(): SupabaseClient | null {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;
  if (!SUPABASE_URL || !key) return null;
  admin ??= createClient(SUPABASE_URL, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return admin;
}
