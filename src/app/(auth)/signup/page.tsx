import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthDisabled, AuthShell } from "@/components/auth/AuthShell";
import { SignupForm } from "@/components/auth/forms";
import { isGoogleEnabled, isSupabaseConfigured } from "@/lib/env";
import { safeNext } from "@/lib/safe-next";
import { getCurrentUser } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Create your account" };

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const next = safeNext((await searchParams).next);
  if (await getCurrentUser()) redirect(next);
  return (
    <AuthShell
      title="Become phishproof"
      subtitle="Free forever. Save progress, earn badges, and get your certificate."
      footer={
        <>
          Already have an account?{" "}
          <Link href={`/login?next=${encodeURIComponent(next)}`} className="font-semibold text-brand hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      {isSupabaseConfigured ? <SignupForm next={next} google={isGoogleEnabled} /> : <AuthDisabled />}
    </AuthShell>
  );
}
