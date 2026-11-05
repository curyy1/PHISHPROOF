import "server-only";
import type { Module } from "@/content/types";
import { isSupabaseConfigured } from "@/lib/env";
import { getCurrentUser } from "@/lib/supabase/server";

/** Guests can open guest-accessible modules. In demo mode (no Supabase) everything is open. */
export async function canAccessModule(m: Module): Promise<boolean> {
  if (!isSupabaseConfigured || m.guestAccessible) return true;
  return !!(await getCurrentUser());
}

export async function isSignedInOrDemo(): Promise<boolean> {
  return !isSupabaseConfigured || !!(await getCurrentUser());
}
