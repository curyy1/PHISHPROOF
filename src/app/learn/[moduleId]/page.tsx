import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { moduleById, modules } from "@/content";
import { AccountGate } from "@/components/course/Gate";
import { ModuleChecklist } from "@/components/course/ModuleChecklist";
import { canAccessModule } from "@/lib/access";

type Props = { params: Promise<{ moduleId: string }> };

export function generateStaticParams() {
  return modules.map((m) => ({ moduleId: m.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const m = moduleById.get((await params).moduleId);
  return m ? { title: `Module ${m.number}: ${m.title}`, description: m.description } : {};
}

export default async function ModulePage({ params }: Props) {
  const m = moduleById.get((await params).moduleId);
  if (!m) notFound();
  if (!(await canAccessModule(m))) return <AccountGate next={`/learn/${m.id}`} />;
  return (
    <div className="container-prose py-14 sm:py-20">
      <Link href="/learn" className="text-sm text-muted hover:text-fg">← All modules</Link>
      <div className="mt-8 flex items-center gap-4">
        <span aria-hidden className="text-5xl">{m.icon}</span>
        <p className="eyebrow">Module {m.number}</p>
      </div>
      <h1 className="mt-3 text-display font-bold">{m.title}</h1>
      <p className="mt-4 text-lead text-muted">{m.description}</p>
      <div className="mt-10">
        <ModuleChecklist moduleId={m.id} />
      </div>
    </div>
  );
}
