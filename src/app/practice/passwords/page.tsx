import type { Metadata } from "next";
import Link from "next/link";
import { PasswordLab } from "@/components/sim/PasswordLab";


export const metadata: Metadata = { title: "Password lab", description: "Test how strong passwords really are and generate memorable passphrases — entirely on your device." };

export default async function Page() {

  return (
    <div className="container-page max-w-5xl py-12 sm:py-16">
      <Link href="/practice" className="text-sm text-muted hover:text-fg">← Practice</Link>
      <h1 className="mt-6 text-headline font-bold">Password lab</h1>
      <p className="mt-2 max-w-2xl text-muted">Test how strong passwords really are and generate memorable passphrases — entirely on your device.</p>
      <div className="mt-8">
        <PasswordLab challenge />
      </div>
    </div>
  );
}
