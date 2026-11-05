import type { Metadata } from "next";
import Link from "next/link";
import { InboxPractice } from "@/components/sim/Practice";


export const metadata: Metadata = { title: "Spot the Phish", description: "Read each email, click anything suspicious to flag it, then decide: phish or legit? About 40% are legit, so think before you flag." };

export default async function Page() {

  return (
    <div className="container-page max-w-5xl py-12 sm:py-16">
      <Link href="/practice" className="text-sm text-muted hover:text-fg">← Practice</Link>
      <h1 className="mt-6 text-headline font-bold">Spot the Phish</h1>
      <p className="mt-2 max-w-2xl text-muted">Read each email, click anything suspicious to flag it, then decide: phish or legit? About 40% are legit, so think before you flag.</p>
      <div className="mt-8">
        <InboxPractice />
      </div>
    </div>
  );
}
