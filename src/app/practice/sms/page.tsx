import type { Metadata } from "next";
import Link from "next/link";
import { SmsPractice } from "@/components/sim/Practice";
import { AccountGate } from "@/components/course/Gate";
import { isSignedInOrDemo } from "@/lib/access";

export const metadata: Metadata = { title: "Text & DM simulator", description: "Messages, DMs and voicemails on a simulated phone. Tap anything suspicious, then decide." };

export default async function Page() {
  if (!(await isSignedInOrDemo())) return <AccountGate next="/practice/sms" title="Sign in to use the Text & DM simulator" />;
  return (
    <div className="container-page max-w-5xl py-12 sm:py-16">
      <Link href="/practice" className="text-sm text-muted hover:text-fg">← Practice</Link>
      <h1 className="mt-6 text-headline font-bold">Text & DM simulator</h1>
      <p className="mt-2 max-w-2xl text-muted">Messages, DMs and voicemails on a simulated phone. Tap anything suspicious, then decide.</p>
      <div className="mt-8">
        <SmsPractice />
      </div>
    </div>
  );
}
