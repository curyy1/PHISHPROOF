import {
  browserById,
  emailById,
  examQuestions,
  lessonIndex,
  quizById,
  scenarioById,
  smsById,
  urlById,
} from "@/content";
import type { FlagType, Hotspot, QuizQuestion } from "@/content/types";
import type { GradedEvent, RawEvent } from "./types";

export const FINAL_EXAM_ID = "final";

export class GradingError extends Error {}

export function questionsFor(quizId: string): QuizQuestion[] | undefined {
  return quizId === FINAL_EXAM_ID ? examQuestions : quizById.get(quizId);
}

/** Grade a quiz from answer indexes. Unanswered questions count as wrong. */
export function gradeQuiz(quizId: string, answers: Record<string, number>) {
  const questions = questionsFor(quizId);
  if (!questions) throw new GradingError(`Unknown quiz ${quizId}`);
  const results: Record<string, boolean> = {};
  let score = 0;
  for (const q of questions) {
    const idx = answers[q.id];
    const ok = typeof idx === "number" && q.options[idx]?.correct === true;
    results[q.id] = ok;
    if (ok) score++;
  }
  return { score, total: questions.length, results };
}

/** Map clicked element ids to the hotspots they carry for a simulator item. */
function hotspotLookup(drill: string, itemId: string): { isPhish: boolean; hotspots: Hotspot[]; map: Map<string, string | undefined> } {
  const map = new Map<string, string | undefined>();
  if (drill === "inbox") {
    const e = emailById.get(itemId);
    if (!e) throw new GradingError(`Unknown email ${itemId}`);
    map.set("from", e.from.hs);
    if (e.replyTo) map.set("replyTo", e.replyTo.hs);
    map.set("subject", e.subject.hs);
    for (const a of e.attachments ?? []) map.set(a.id, a.hs);
    for (const p of e.body) for (const s of p) if (typeof s !== "string") map.set(s.id, s.hs);
    return { isPhish: e.isPhish, hotspots: e.hotspots, map };
  }
  if (drill === "sms") {
    const s = smsById.get(itemId);
    if (!s) throw new GradingError(`Unknown text ${itemId}`);
    map.set("contact", s.contact.hs);
    for (const m of s.messages) {
      for (const seg of m.body) if (typeof seg !== "string") map.set(seg.id, seg.hs);
      if (m.image) map.set(m.image.id, m.image.hs);
    }
    return { isPhish: s.isPhish, hotspots: s.hotspots, map };
  }
  if (drill === "browser") {
    const b = browserById.get(itemId);
    if (!b) throw new GradingError(`Unknown page ${itemId}`);
    for (const p of b.url.parts) map.set(p.id, p.hs);
    return { isPhish: b.isPhish, hotspots: b.hotspots, map };
  }
  throw new GradingError(`Unknown drill ${drill}`);
}

/** Grade a simulator answer: verdict + which red flags were found or missed. */
export function gradeDrill(drill: string, itemId: string, verdict: "phish" | "legit", clicked: string[]) {
  if (drill === "urls") {
    const u = urlById.get(itemId);
    if (!u) throw new GradingError(`Unknown URL ${itemId}`);
    const correct = (verdict === "legit") === u.safe;
    const flag = u.type === "safe" ? [] : [u.type as FlagType];
    return {
      isPhish: !u.safe,
      correct,
      // For URLs the "flag" is caught when you correctly call a sketchy URL sketchy.
      found: !u.safe && correct ? flag : [],
      missed: !u.safe && !correct ? flag : [],
      foundIds: [],
      missedIds: [],
      falseFlags: 0,
    };
  }
  const { isPhish, hotspots, map } = hotspotLookup(drill, itemId);
  const flaggedHs = new Set<string>();
  let falseFlags = 0;
  for (const id of new Set(clicked)) {
    if (!map.has(id)) continue; // ignore unknown ids
    const hs = map.get(id);
    if (hs) flaggedHs.add(hs);
    else falseFlags++;
  }
  const foundHs = hotspots.filter((h) => flaggedHs.has(h.id));
  const missedHs = hotspots.filter((h) => !flaggedHs.has(h.id));
  return {
    isPhish,
    correct: (verdict === "phish") === isPhish,
    found: foundHs.map((h) => h.type),
    missed: missedHs.map((h) => h.type),
    foundIds: foundHs.map((h) => h.id),
    missedIds: missedHs.map((h) => h.id),
    falseFlags,
  };
}

/** Grade any raw event. Throws GradingError on invalid input. */
export function gradeEvent(raw: RawEvent): GradedEvent {
  switch (raw.type) {
    case "lesson_complete": {
      const entry = lessonIndex.get(raw.lessonId);
      if (!entry) throw new GradingError(`Unknown lesson ${raw.lessonId}`);
      return { type: "lesson", lessonId: raw.lessonId, moduleId: entry.module.id };
    }
    case "quiz_submit":
      return { type: "quiz", quizId: raw.quizId, ...gradeQuiz(raw.quizId, raw.answers) };
    case "drill_answer":
      return { type: "drill", drill: raw.drill, itemId: raw.itemId, ...gradeDrill(raw.drill, raw.itemId, raw.verdict, raw.clicked) };
    case "activity_complete": {
      if (raw.key !== "passwords") {
        const id = raw.key.slice("scenario:".length);
        if (!raw.key.startsWith("scenario:") || !scenarioById.has(id)) throw new GradingError(`Unknown activity ${raw.key}`);
      }
      return { type: "activity", key: raw.key };
    }
  }
}
