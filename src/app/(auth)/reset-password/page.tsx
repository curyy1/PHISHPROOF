import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { ResetForm } from "@/components/auth/forms";
import { getCurrentUser } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Choose a new password" };

export default async function ResetPage() {
  // The reset email link signs you in via /auth/callback first.
  if (!(await getCurrentUser())) redirect("/forgot-password");
  return (
    <AuthShell title="Choose a new password" subtitle="Make it long: 15+ characters.">
      <ResetForm />
    </AuthShell>
  );
}
