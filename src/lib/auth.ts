import "server-only";
import { getCurrentUser, getServerSupabase } from "@/lib/supabase/server";

export type Role = "student" | "teacher" | "admin";
export type Profile = {
  id: string;
  display_name: string;
  full_name: string | null;
  role: Role;
  leaderboard_opt_in: boolean;
  xp: number;
  current_streak: number;
  longest_streak: number;
};

/** Current user's profile row (RLS: a user can only select their own profile). */
export async function getMyProfile(): Promise<Profile | null> {
  const user = await getCurrentUser();
  if (!user) return null;
  const supabase = await getServerSupabase();
  if (!supabase) return null;
  const { data } = await supabase
    .from("profiles")
    .select("id, display_name, full_name, role, leaderboard_opt_in, xp, current_streak, longest_streak")
    .eq("id", user.id)
    .maybeSingle();
  if (data) return data as Profile;
  // Profile row is created by a database trigger on sign-up; fall back gracefully if it's missing.
  return {
    id: user.id,
    display_name: (user.user_metadata?.display_name as string) || user.email?.split("@")[0] || "Learner",
    full_name: null,
    role: "student",
    leaderboard_opt_in: false,
    xp: 0,
    current_streak: 0,
    longest_streak: 0,
  };
}
