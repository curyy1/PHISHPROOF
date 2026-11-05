import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { lessonIndex, modules } from "@/content";
import { BlockView } from "@/components/course/Blocks";
import { AccountGate } from "@/components/course/Gate";
import { LessonComplete } from "@/components/course/LessonComplete";
import { RichText } from "@/components/RichText";
import { ProgressBar } from "@/components/ui/ProgressRing";
import { canAccessModule } from "@/lib/access";

type Props = { params: Promise<{ moduleId: string; lessonId: string }> };

export function generateStaticParams() {
  return modules.flatMap((m) => m.lessons.map((l) => ({ moduleId: m.id, lessonId: l.id })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const e = lessonIndex.get((await params).lessonId);
  return e ? { title: e.lesson.title, description: e.lesson.summary } : {};
}

export default async function LessonPage({ params }: Props) {
  const { moduleId, lessonId } = await params;
  const entry = lessonIndex.get(lessonId);
  if (!entry || entry.module.id !== moduleId) notFound();
  const { lesson, module: m, index } = entry;
  if (!(await canAccessModule(m))) return <AccountGate next={`/learn/${m.id}/${lesson.id}`} />;
  const next = m.lessons[index + 1];
  const prev = m.lessons[index - 1];
  const nextHref = next ? `/learn/${m.id}/${next.id}` : `/learn/${m.id}/drill`;

  return (
    <article className="container-prose py-12 sm:py-16">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-muted">
        <Link href="/learn" className="hover:text-fg">Course</Link>
        <span aria-hidden>/</span>
        <Link href={`/learn/${m.id}`} className="hover:text-fg">Module {m.number}</Link>
        <span aria-hidden>/</span>
        <span className="text-fg">Lesson {index + 1} of {m.lessons.length}</span>
      </nav>
      <ProgressBar value={(index + 1) / m.lessons.length} label={`Lesson ${index + 1} of ${m.lessons.length}`} className="mt-4" />
      <header className="mt-10">
        <p className="eyebrow">{m.icon} {m.title} · {lesson.minutes} min</p>
        <h1 className="mt-3 text-display font-bold">{lesson.title}</h1>
        <p className="mt-3 text-lead text-muted">{lesson.summary}</p>
      </header>
      <div className="mt-10 space-y-6">
        {lesson.blocks.map((b, i) => (
          <BlockView key={i} block={b} />
        ))}
      </div>
      <section className="mt-12 rounded-[var(--radius-card)] bg-brand-soft p-6 sm:p-8" aria-labelledby="takeaways-h">
        <h2 id="takeaways-h" className="text-title font-bold text-brand-ink">Key takeaways</h2>
        <ul className="mt-4 space-y-2">
          {lesson.takeaways.map((t, i) => (
            <li key={i} className="flex gap-3">
              <span aria-hidden className="text-brand">✓</span>
              <span><RichText text={t} /></span>
            </li>
          ))}
        </ul>
      </section>
      <div className="mt-10">
        <LessonComplete lessonId={lesson.id} nextHref={nextHref} nextLabel={next ? `Next: ${next.title}` : `Next: ${m.drill.title}`} />
      </div>
      {prev && (
        <p className="mt-6 text-center text-sm">
          <Link href={`/learn/${m.id}/${prev.id}`} className="text-muted hover:text-fg">← Previous: {prev.title}</Link>
        </p>
      )}
    </article>
  );
}
