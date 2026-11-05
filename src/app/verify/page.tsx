import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";

export const metadata: Metadata = { title: "Verify a certificate", description: "Confirm a Phishproof certificate is real." };

async function lookup(form: FormData) {
  "use server";
  const id = String(form.get("id") ?? "").trim().toUpperCase().replace(/\s+/g, "");
  redirect(`/verify/${encodeURIComponent(id.slice(0, 32))}`);
}

export default function VerifyIndex() {
  return (
    <div className="container-prose py-16">
      <p className="eyebrow">Certificate verification</p>
      <h1 className="mt-2 text-display font-bold">Verify a certificate</h1>
      <p className="mt-3 text-lead text-muted">Enter the verification ID printed at the bottom-right of a Phishproof certificate.</p>
      <form action={lookup} className="card mt-8 flex flex-col gap-3 p-6 sm:flex-row sm:items-end">
        <Field id="id" name="id" label="Verification ID" placeholder="PP-XXXX-XXXX-XXXX" className="flex-1" required autoCapitalize="characters" />
        <Button type="submit">Verify</Button>
      </form>
    </div>
  );
}
