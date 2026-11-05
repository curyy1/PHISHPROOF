import type { Metadata } from "next";
import { ModuleGrid } from "@/components/course/ModuleGrid";
import { ContinueCard } from "@/components/course/ContinueCard";
import { totalLessons } from "@/content";
import { isSignedInOrDemo } from "@/lib/access";

export const metadata: Metadata = { title: "Course", description: "Seven short modules, interactive drills, quizzes and a final exam." };

export default async function LearnPage() {
  const unlocked = await isSignedInOrDemo();
  return (
    <div className="container-page py-14 sm:py-20">
      <p className="eyebrow">The course</p>
      <h1 className="mt-3 max-w-3xl text-display font-bold">Seven modules. One very hard-to-fool you.</h1>
      <p className="mt-4 max-w-2xl text-lead text-muted">
        {totalLessons} bite-size lessons, a hands-on drill in every module, quizzes with explanations, and a final exam. About
        two and a half hours total — go at your own pace.
      </p>
      <div className="mt-10">
        <ContinueCard />
      </div>
      <div className="mt-10">
        <ModuleGrid locked={!unlocked} />
      </div>
    </div>
  );
}
