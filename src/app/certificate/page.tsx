import type { Metadata } from "next";
import Link from "next/link";
/* eslint-disable @next/next/no-img-element -- generated PNG served by our own API route */
import { ButtonLink } from "@/components/ui/Button";
import { CopyLink } from "@/components/CopyLink";
import { AccountGate } from "@/components/course/Gate";
import { getMyProfile } from "@/lib/auth";
import { SITE_URL, isSupabaseConfigured } from "@/lib/env";
import { examPassed } from "@/lib/progress";
import { loadState } from "@/lib/progress/server-store";
import { getCurrentUser, getServerSupabase } from "@/lib/supabase/server";
import { ClaimForm } from "./ClaimForm";

export const metadata: Metadata = { title: "Your certificate" };

export default async function CertificatePage() {
  if (!isSupabaseConfigured)
    return (
      <div className="container-prose py-16">
        <h1 className="text-display font-bold">Certificates</h1>
        <p className="mt-3 text-lead text-muted">Certificates need accounts, which aren’t set up on this deployment yet. Here’s what one looks like:</p>
        <img src="/api/certificate/sample" alt="Sample Phishproof certificate" className="mt-8 w-full rounded-2xl border border-line" width={1600} height={1131} />
      </div>
    );
  const user = await getCurrentUser();
  if (!user) return <AccountGate next="/certificate" title="Sign in to see your certificate" />;
  const supabase = (await getServerSupabase())!;
  const { data: cert } = await supabase.from("certificates").select("id, full_name, issued_at, score, total").eq("user_id", user.id).maybeSingle();

  if (cert) {
    const verifyUrl = `${SITE_URL}/verify/${cert.id}`;
    return (
      <div className="container-page max-w-5xl py-12 sm:py-16">
        <p className="eyebrow">Certificate of completion</p>
        <h1 className="mt-2 text-display font-bold">You’re Phishproof certified. 🏅</h1>
        <img
          src={`/api/certificate/${cert.id}`}
          alt={`Phishproof certificate for ${cert.full_name}, issued ${new Date(cert.issued_at).toLocaleDateString()}, verification ID ${cert.id}`}
          className="mt-8 w-full rounded-2xl border border-line shadow-xl"
          width={1600}
          height={1131}
        />
        <div className="mt-6 flex flex-wrap gap-3">
          <ButtonLink href={`/api/certificate/${cert.id}?download=1`} prefetch={false}>Download PNG</ButtonLink>
          <ButtonLink href={`/api/certificate/${cert.id}?format=pdf`} variant="secondary" prefetch={false}>Download PDF</ButtonLink>
          <ButtonLink href={`/verify/${cert.id}`} variant="ghost">Public verification page</ButtonLink>
        </div>
        <div className="card mt-8 p-5">
          <p className="font-semibold">Share your verification link</p>
          <p className="mt-1 text-sm text-muted">Anyone can confirm your certificate is real at this address (it shows your name, date and score only).</p>
          <CopyLink value={verifyUrl} />
        </div>
      </div>
    );
  }

  const state = await loadState(supabase, user.id);
  const profile = await getMyProfile();
  return (
    <div className="container-prose py-12 sm:py-16">
      <h1 className="text-display font-bold">Your certificate</h1>
      {examPassed(state) ? (
        <div className="card mt-8 p-6 sm:p-8">
          <p className="text-lead">🎉 You passed the final exam! Claim your certificate.</p>
          <div className="mt-6">
            <ClaimForm defaultName={profile?.full_name ?? ""} />
          </div>
        </div>
      ) : (
        <div className="card mt-8 p-6 sm:p-8">
          <p className="text-lead text-muted">Pass the final exam with 80% or higher to earn a certificate with a unique verification ID.</p>
          <ButtonLink href="/exam" className="mt-6">Go to the final exam</ButtonLink>
          <p className="mt-6 text-sm text-subtle">
            Preview: <Link href="/api/certificate/sample" className="underline">sample certificate</Link>
          </p>
        </div>
      )}
    </div>
  );
}
