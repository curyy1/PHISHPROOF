import type { Metadata } from "next";
import { AccountGate } from "@/components/course/Gate";
import { ExamGate } from "@/components/course/ExamGate";
import { isSignedInOrDemo } from "@/lib/access";

export const metadata: Metadata = { title: "Final exam", description: "20 questions. Score 80% to earn your Phishproof certificate." };

export default async function ExamPage() {
  if (!(await isSignedInOrDemo())) return <AccountGate next="/exam" title="Sign in to take the final exam" />;
  return (
    <div className="container-prose py-12 sm:py-16">
      <ExamGate />
    </div>
  );
}
