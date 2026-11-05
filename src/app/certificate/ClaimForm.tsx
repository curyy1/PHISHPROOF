"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { claimCertificateAction, type CertState } from "@/app/actions/certificate";
import { Button } from "@/components/ui/Button";
import { Field, FormMessage } from "@/components/ui/Field";

export function ClaimForm({ defaultName }: { defaultName: string }) {
  const [state, action, pending] = useActionState<CertState, FormData>(claimCertificateAction, undefined);
  const router = useRouter();
  useEffect(() => {
    if (state?.id) router.refresh();
  }, [state, router]);
  return (
    <form action={action} className="space-y-4">
      <Field id="fullName" name="fullName" label="Your name, as it should appear on the certificate" defaultValue={defaultName} maxLength={80} required autoComplete="name" />
      <p className="text-xs text-subtle">Your name will be visible to anyone you share the verification link with.</p>
      <FormMessage error={state?.error} />
      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Issuing…" : "Issue my certificate"}
      </Button>
    </form>
  );
}
