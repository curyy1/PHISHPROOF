import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthDisabled, AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/forms";
import { FormMessage } from "@/components/ui/Field";
import { isGoogleEnabled, isSupabaseConfigured } from "@/lib/env";
import { safeNext } from "@/lib/safe-next";
import { getCurrentUser } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Sign in" };

const errors: Record<string, string> = {
  link: "That link is invalid or has expired. Request a new one.",
  oauth: "Google sign-in didn’t complete. Please try again.",
  "rate-limited": "Too many attempts. Please wait a minute.",
  "google-disabled": "Google sign-in isn’t enabled on this site.",
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const sp = await searchParams;
  const next = safeNext(sp.next);
  if (await getCurrentUser()) redirect(next);
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to keep your streak going."
      footer={
        <>
          New here?{" "}
          <Link href={`/signup?next=${encodeURIComponent(next)}`} className="font-semibold text-brand hover:underline">
            Create a free account
          </Link>
        </>
      }
    >
      {sp.error && errors[sp.error] && (
        <div className="mb-4">
          <FormMessage error={errors[sp.error]} />
        </div>
      )}
      {isSupabaseConfigured ? <LoginForm next={next} google={isGoogleEnabled} /> : <AuthDisabled />}
    </AuthShell>
  );
}
