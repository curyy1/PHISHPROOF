import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { moduleById, modules } from "@/content";
import { AccountGate } from "@/components/course/Gate";
import { QuizRunner } from "@/components/course/QuizRunner";
import { canAccessModule } from "@/lib/access";

type Props = { params: Promise<{ moduleId: string }> };

export function generateStaticParams() {
  return modules.map((m) => ({ moduleId: m.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const m = moduleById.get((await params).moduleId);
  return m ? { title: `Quiz: ${m.title}` } : {};
}

export default async function QuizPage({ params }: Props) {
  const m = moduleById.get((await params).moduleId);
  if (!m) notFound();
  if (!(await canAccessModule(m))) return <AccountGate next={`/learn/${m.id}/quiz`} />;
  const nextModule = modules[m.number];
  return (
    <div className="container-prose py-12 sm:py-16">
      <QuizRunner
        quizId={m.id}
        title={`Module ${m.number} quiz: ${m.title}`}
        passPercent={70}
        continueHref={nextModule ? `/learn/${nextModule.id}` : "/exam"}
        continueLabel={nextModule ? `Start Module ${nextModule.number} →` : "Go to the final exam →"}
      />
    </div>
  );
}
