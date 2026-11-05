import { FLAG_INFO, modules } from "@/content";
import type { FlagType, Module } from "@/content/types";
import { FINAL_EXAM_ID } from "./grading";
import type { DrillResult, ProgressState } from "./types";

export const MODULE_QUIZ_PASS = 0.7;
export const EXAM_PASS = 0.8;

export function bestQuiz(state: ProgressState, quizId: string) {
  let best: { score: number; total: number } | null = null;
  for (const q of state.quizzes)
    if (q.quizId === quizId && (!best || q.score / q.total > best.score / best.total)) best = { score: q.score, total: q.total };
  return best;
}

export function quizPassed(state: ProgressState, quizId: string, threshold = MODULE_QUIZ_PASS) {
  const b = bestQuiz(state, quizId);
  return !!b && b.score / b.total >= threshold;
}

export function examPassed(state: ProgressState) {
  return quizPassed(state, FINAL_EXAM_ID, EXAM_PASS);
}

/** Distinct item ids answered (any result) / answered correctly for a drill. */
export function answeredItems(drills: DrillResult[], drill: string, correctOnly = false) {
  const s = new Set<string>();
  for (const d of drills) if (d.drill === drill && (!correctOnly || d.correct)) s.add(d.itemId);
  return s;
}

export function drillDone(state: ProgressState, m: Module): boolean {
  const r = m.drill.ref;
  if (r.kind === "passwords") return !!state.activities["passwords"];
  if (r.kind === "scenario") return !!state.activities[`scenario:${r.scenarioId}`];
  const answered = answeredItems(state.drills, r.kind);
  return r.itemIds.every((id) => answered.has(id));
}

export function drillProgress(state: ProgressState, m: Module): number {
  const r = m.drill.ref;
  if (r.kind === "passwords" || r.kind === "scenario") return drillDone(state, m) ? 1 : 0;
  const answered = answeredItems(state.drills, r.kind);
  return r.itemIds.filter((id) => answered.has(id)).length / r.itemIds.length;
}

/** Module completion: each lesson + the drill + passing the quiz are equal units. */
export function moduleProgress(state: ProgressState, m: Module) {
  const lessonsDone = m.lessons.filter((l) => state.lessons[l.id]).length;
  const drill = drillDone(state, m);
  const quiz = quizPassed(state, m.id);
  const units = m.lessons.length + 2;
  const done = lessonsDone + (drill ? 1 : 0) + (quiz ? 1 : 0);
  return { lessonsDone, lessonsTotal: m.lessons.length, drill, quiz, ratio: done / units, complete: done === units };
}

export function overallProgress(state: ProgressState) {
  let done = 0;
  let units = 0;
  for (const m of modules) {
    const p = moduleProgress(state, m);
    done += p.ratio * (m.lessons.length + 2);
    units += m.lessons.length + 2;
  }
  // Final exam counts as 2 units.
  units += 2;
  if (examPassed(state)) done += 2;
  return done / units;
}

export function examUnlocked(state: ProgressState) {
  return modules.every((m) => quizPassed(state, m.id));
}

export type NextStep = { label: string; detail: string; href: string };

/** "Continue where you left off": the first unfinished thing, in course order. */
export function nextStep(state: ProgressState): NextStep {
  for (const m of modules) {
    const lesson = m.lessons.find((l) => !state.lessons[l.id]);
    if (lesson)
      return { label: lesson.title, detail: `Module ${m.number} · ${m.title}`, href: `/learn/${m.id}/${lesson.id}` };
    if (!drillDone(state, m)) return { label: m.drill.title, detail: `Module ${m.number} drill`, href: `/learn/${m.id}/drill` };
    if (!quizPassed(state, m.id)) return { label: `${m.title} quiz`, detail: `Module ${m.number} quiz`, href: `/learn/${m.id}/quiz` };
  }
  if (!examPassed(state)) return { label: "Final exam", detail: "Score 80% to earn your certificate", href: "/exam" };
  return { label: "Your certificate", detail: "You finished the course 🎉", href: "/certificate" };
}

export type WeakSpot = { key: string; label: string; detail: string; accuracy: number; href: string };

/**
 * Weak spots: red-flag categories you miss most in simulators, verdict accuracy
 * by simulator, and module quizzes below the pass mark.
 */
export function weakSpots(state: ProgressState, limit = 3): WeakSpot[] {
  const spots: WeakSpot[] = [];
  const tally = new Map<FlagType, { found: number; missed: number }>();
  for (const d of state.drills) {
    for (const f of d.found) tally.set(f, { found: (tally.get(f)?.found ?? 0) + 1, missed: tally.get(f)?.missed ?? 0 });
    for (const f of d.missed) tally.set(f, { found: tally.get(f)?.found ?? 0, missed: (tally.get(f)?.missed ?? 0) + 1 });
  }
  for (const [flag, t] of tally) {
    const n = t.found + t.missed;
    if (n < 3) continue;
    const acc = t.found / n;
    if (acc >= 0.75) continue;
    const info = FLAG_INFO[flag];
    spots.push({
      key: `flag:${flag}`,
      label: info.label,
      detail: `You caught ${t.found} of ${n} of these red flags.`,
      accuracy: acc,
      href: `/learn/${info.review.moduleId}/${info.review.lessonId}`,
    });
  }
  const drillNames: Record<string, { label: string; href: string }> = {
    inbox: { label: "Email verdicts", href: "/practice/inbox" },
    sms: { label: "Text & DM verdicts", href: "/practice/sms" },
    browser: { label: "Login page verdicts", href: "/practice/browser" },
    urls: { label: "URL verdicts", href: "/practice/urls" },
  };
  for (const kind of Object.keys(drillNames)) {
    const rs = state.drills.filter((d) => d.drill === kind);
    if (rs.length < 4) continue;
    const acc = rs.filter((d) => d.correct).length / rs.length;
    if (acc >= 0.75) continue;
    const legitWrong = rs.filter((d) => !d.isPhish && !d.correct).length;
    const phishWrong = rs.filter((d) => d.isPhish && !d.correct).length;
    spots.push({
      key: `drill:${kind}`,
      label: drillNames[kind].label,
      detail:
        legitWrong > phishWrong
          ? `${Math.round(acc * 100)}% correct — you’re flagging some legit messages. Look for the good signs too.`
          : `${Math.round(acc * 100)}% correct — some phish are slipping through.`,
      accuracy: acc,
      href: drillNames[kind].href,
    });
  }
  for (const m of modules) {
    const b = bestQuiz(state, m.id);
    if (b && b.score / b.total < MODULE_QUIZ_PASS)
      spots.push({
        key: `quiz:${m.id}`,
        label: `Module ${m.number}: ${m.title}`,
        detail: `Best quiz score ${b.score}/${b.total}. Review the lessons and retake it.`,
        accuracy: b.score / b.total,
        href: `/learn/${m.id}`,
      });
  }
  return spots.sort((a, b) => a.accuracy - b.accuracy).slice(0, limit);
}

/** Accuracy per red-flag category, for the dashboard chart. */
export function flagAccuracy(state: ProgressState) {
  const out: { flag: FlagType; label: string; found: number; missed: number }[] = [];
  for (const flag of Object.keys(FLAG_INFO) as FlagType[]) {
    let found = 0;
    let missed = 0;
    for (const d of state.drills) {
      found += d.found.filter((f) => f === flag).length;
      missed += d.missed.filter((f) => f === flag).length;
    }
    out.push({ flag, label: FLAG_INFO[flag].label, found, missed });
  }
  return out;
}
