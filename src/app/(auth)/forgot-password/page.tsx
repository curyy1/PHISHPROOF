import type { Metadata } from "next";
import Link from "next/link";
import { AuthDisabled, AuthShell } from "@/components/auth/AuthShell";
import { ForgotForm } from "@/components/auth/forms";
import { isSupabaseConfigured } from "@/lib/env";

export const metadata: Metadata = { title: "Reset your password" };

export default function ForgotPage() {
  return (
    <AuthShell
      title="Reset your password"
      subtitle="We’ll email you a secure link. It only works once."
      footer={<Link href="/login" className="font-semibold text-brand hover:underline">Back to sign in</Link>}
    >
      {isSupabaseConfigured ? <ForgotForm /> : <AuthDisabled />}
    </AuthShell>
  );
}
