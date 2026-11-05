import type { Metadata } from "next";
import Link from "next/link";
/* eslint-disable @next/next/no-img-element -- generated PNG served by our own API route */
import { CERT_ID_RE } from "@/lib/certificate";
import { getServerSupabase } from "@/lib/supabase/server";

type Props = { params: Promise<{ id: string }> };
type Row = { id: string; full_name: string; issued_at: string; score: number; total: number };

async function find(raw: string): Promise<Row | null> {
  const id = decodeURIComponent(raw).toUpperCase();
  if (!CERT_ID_RE.test(id)) return null;
  const supabase = await getServerSupabase();
  if (!supabase) return null;
  const { data } = await supabase.rpc("verify_certificate", { cert_id: id });
  return ((data as Row[] | null) ?? [])[0] ?? null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = await find((await params).id);
  return { title: c ? `Certificate ${c.id}` : "Certificate not found", robots: { index: false } };
}

export default async function VerifyPage({ params }: Props) {
  const raw = (await params).id;
  const c = await find(raw);
  return (
    <div className="container-prose py-16">
      {c ? (
        <>
          <div className="flex items-center gap-3 rounded-2xl bg-success-soft p-5 text-success-ink" role="status">
            <span aria-hidden className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-success text-xl text-on-success">✓</span>
            <div>
              <p className="text-lg font-bold">Valid certificate</p>
              <p className="text-sm">This certificate was issued by Phishproof and has not been revoked.</p>
            </div>
          </div>
          <dl className="card mt-6 grid gap-4 p-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-subtle">Awarded to</dt>
              <dd className="text-title font-bold">{c.full_name}</dd>
            </div>
            <div>
              <dt className="text-sm text-subtle">Issued</dt>
              <dd className="text-title font-bold">{new Date(c.issued_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</dd>
            </div>
            <div>
              <dt className="text-sm text-subtle">Final exam score</dt>
              <dd className="text-title font-bold">{c.score}/{c.total} ({Math.round((c.score / c.total) * 100)}%)</dd>
            </div>
            <div>
              <dt className="text-sm text-subtle">Verification ID</dt>
              <dd className="font-mono text-title font-bold">{c.id}</dd>
            </div>
          </dl>
          <img src={`/api/certificate/${c.id}`} alt={`Certificate for ${c.full_name}`} className="mt-6 w-full rounded-2xl border border-line" width={1600} height={1131} />
        </>
      ) : (
        <div className="rounded-2xl bg-danger-soft p-6 text-danger-ink" role="status">
          <p className="text-lg font-bold">✗ No certificate found</p>
          <p className="mt-1 text-sm">
            We couldn’t find a certificate with ID <span className="break-all font-mono">{decodeURIComponent(raw).slice(0, 32)}</span>. Check the ID and try again.
          </p>
        </div>
      )}
      <p className="mt-8 text-sm">
        <Link href="/verify" className="text-brand hover:underline">Verify another certificate</Link>
      </p>
    </div>
  );
}
