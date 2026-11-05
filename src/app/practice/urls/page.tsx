import type { Metadata } from "next";
import Link from "next/link";
import { UrlGame } from "@/components/sim/UrlGame";
import { AccountGate } from "@/components/course/Gate";
import { isSignedInOrDemo } from "@/lib/access";

export const metadata: Metadata = { title: "URL inspector", description: "Find the real domain, then call it: safe or sketchy?" };

export default async function Page() {
  if (!(await isSignedInOrDemo())) return <AccountGate next="/practice/urls" title="Sign in to use the URL inspector" />;
  return (
    <div className="container-page max-w-5xl py-12 sm:py-16">
      <Link href="/practice" className="text-sm text-muted hover:text-fg">← Practice</Link>
      <h1 className="mt-6 text-headline font-bold">URL inspector</h1>
      <p className="mt-2 max-w-2xl text-muted">Find the real domain, then call it: safe or sketchy?</p>
      <div className="mt-8">
        <UrlGame />
      </div>
    </div>
  );
}
