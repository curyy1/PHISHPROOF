import type { Metadata } from "next";
import Link from "next/link";
import { AccountGate } from "@/components/course/Gate";
import { ButtonLink } from "@/components/ui/Button";
import { getMyProfile } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/env";
import { getServerSupabase } from "@/lib/supabase/server";
import { CreateClassForm } from "./CreateClassForm";

export const metadata: Metadata = { title: "Teach", description: "Run Phishproof with your class, club or chapter." };

export default async function TeachPage() {
  const intro = (
    <>
      <p className="eyebrow">For teachers & club leaders</p>
      <h1 className="mt-3 text-display font-bold">Run Phishproof with your group.</h1>
      <p className="mt-3 text-lead text-muted">
        Create a class, share the 6-character code, and watch progress roll in: lessons, quiz scores, simulator accuracy, weak spots and certificates.
        Students only share course progress with you — never passwords or email addresses.
      </p>
    </>
  );
  if (!isSupabaseConfigured)
    return (
      <div className="container-prose py-16">
        {intro}
        <p className="card mt-8 p-6 text-muted">Classes need accounts, which aren’t set up on this deployment yet. See SETUP.md.</p>
      </div>
    );
  const profile = await getMyProfile();
  if (!profile) return <AccountGate next="/teach" title="Sign in to use teacher tools" />;
  if (profile.role === "student")
    return (
      <div className="container-prose py-16">
        {intro}
        <div className="card mt-8 p-6">
          <p className="font-semibold">Your account is a student account.</p>
          <p className="mt-1 text-sm text-muted">
            Teacher access is granted by the site admin. If you were given a teacher invite code, enter it in your account settings. Otherwise ask the person who runs this
            Phishproof site to upgrade your account (see SETUP.md).
          </p>
          <ButtonLink href="/account" className="mt-4" variant="secondary">Account settings</ButtonLink>
        </div>
      </div>
    );

  const supabase = (await getServerSupabase())!;
  const { data: classes } = await supabase
    .from("classes")
    .select("id, name, join_code, created_at, class_members(count)")
    .eq("teacher_id", profile.id)
    .order("created_at", { ascending: false });

  return (
    <div className="container-page max-w-4xl py-12 sm:py-16">
      {intro}
      <section className="card mt-10 p-6" aria-label="Create a class">
        <CreateClassForm />
      </section>
      <h2 className="mt-10 text-title font-bold">Your classes</h2>
      {!classes?.length ? (
        <p className="mt-3 text-muted">No classes yet.</p>
      ) : (
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {classes.map((c) => {
            const count = (c.class_members as unknown as { count: number }[])?.[0]?.count ?? 0;
            return (
              <li key={c.id}>
                <Link href={`/teach/${c.id}`} className="card block p-5 transition-transform hover:-translate-y-0.5">
                  <p className="text-lg font-bold">{c.name}</p>
                  <p className="mt-1 text-sm text-muted">
                    Code <span className="font-mono font-bold tracking-widest text-fg">{c.join_code}</span> · {count} student{count === 1 ? "" : "s"}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
