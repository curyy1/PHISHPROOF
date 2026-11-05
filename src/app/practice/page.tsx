import type { Metadata } from "next";
import { PracticeHub } from "@/components/sim/Practice";

export const metadata: Metadata = { title: "Practice", description: "Phishing simulators: inbox, texts, fake login pages, URL game and password lab." };

export default function PracticePage() {
  return (
    <div className="container-page py-14 sm:py-20">
      <p className="eyebrow">Practice</p>
      <h1 className="mt-3 max-w-3xl text-display font-bold">Train your eyes on scams that can’t hurt you.</h1>
      <p className="mt-4 max-w-2xl text-lead text-muted">
        Every brand here is fictional and every domain is a reserved example domain. Nothing you click goes anywhere.
      </p>
      <div className="mt-12">
        <PracticeHub />
      </div>
    </div>
  );
}
