import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { moduleById, modules } from "@/content";
import { AccountGate } from "@/components/course/Gate";
import { DrillRunner } from "@/components/sim/DrillRunner";
import { canAccessModule } from "@/lib/access";

type Props = { params: Promise<{ moduleId: string }> };

export function generateStaticParams() {
  return modules.map((m) => ({ moduleId: m.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const m = moduleById.get((await params).moduleId);
  return m ? { title: `Drill: ${m.drill.title}` } : {};
}

export default async function DrillPage({ params }: Props) {
  const m = moduleById.get((await params).moduleId);
  if (!m) notFound();
  if (!(await canAccessModule(m))) return <AccountGate next={`/learn/${m.id}/drill`} />;
  return (
    <div className="container-page max-w-5xl py-12 sm:py-16">
      <Link href={`/learn/${m.id}`} className="text-sm text-muted hover:text-fg">← Module {m.number}: {m.title}</Link>
      <p className="eyebrow mt-8">Module {m.number} drill</p>
      <h1 className="mt-2 text-headline font-bold">{m.drill.title}</h1>
      <p className="mt-2 max-w-2xl text-muted">{m.drill.description}</p>
      <div className="mt-8">
        <DrillRunner moduleId={m.id} />
      </div>
    </div>
  );
}
