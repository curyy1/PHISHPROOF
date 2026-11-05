import type { Metadata } from "next";
import Link from "next/link";
import { BrowserPractice } from "@/components/sim/Practice";
import { AccountGate } from "@/components/course/Gate";
import { isSignedInOrDemo } from "@/lib/access";

export const metadata: Metadata = { title: "Fake login lab", description: "You’ve landed on a sign-in page. Click the parts of the address bar that look wrong, then decide whether to sign in or get out." };

export default async function Page() {
  if (!(await isSignedInOrDemo())) return <AccountGate next="/practice/browser" title="Sign in to use the Fake login lab" />;
  return (
    <div className="container-page max-w-5xl py-12 sm:py-16">
      <Link href="/practice" className="text-sm text-muted hover:text-fg">← Practice</Link>
      <h1 className="mt-6 text-headline font-bold">Fake login lab</h1>
      <p className="mt-2 max-w-2xl text-muted">You’ve landed on a sign-in page. Click the parts of the address bar that look wrong, then decide whether to sign in or get out.</p>
      <div className="mt-8">
        <BrowserPractice />
      </div>
    </div>
  );
}
