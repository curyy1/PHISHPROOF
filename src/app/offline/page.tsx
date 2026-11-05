import type { Metadata } from "next";
import { LogoMark } from "@/components/Logo";

export const metadata: Metadata = { title: "You’re offline" };

export default function Offline() {
  return (
    <div className="container-prose py-24 text-center">
      <LogoMark className="mx-auto h-14 w-14" />
      <h1 className="mt-6 text-headline font-bold">You’re offline</h1>
      <p className="mt-3 text-lead text-muted">
        Phishproof needs a connection to load new lessons and save progress. Reconnect and try again.
      </p>
      <p className="mt-6 text-sm text-subtle">Tip while you wait: if a message makes you feel rushed, that’s your cue to slow down.</p>
    </div>
  );
}
