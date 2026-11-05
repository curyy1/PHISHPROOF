import { describe, expect, it } from "vitest";
import { examQuestions, moduleById, modules, urlItems } from "@/content";
import { applyEvent, emptyState, gradeEvent, levelFor, nextStep, overallProgress, weakSpots, XP, type ProgressState, type RawEvent } from "@/lib/progress";

const AT = "2026-11-05T12:00:00.000Z";
function run(events: RawEvent[], day = "2026-11-05", start: ProgressState = emptyState()) {
  let s = start;
  const gained: number[] = [];
  const badges: string[] = [];
  for (const e of events) {
    const r = applyEvent(s, gradeEvent(e), AT, day);
    s = r.state;
    gained.push(r.xpGained);
    badges.push(...r.newBadges);
  }
  return { s, gained, badges };
}
const correctAnswers = (quizId: string) => {
  const qs = quizId === "final" ? examQuestions : moduleById.get(quizId)!.quiz;
  return Object.fromEntries(qs.map((q) => [q.id, q.options.findIndex((o) => o.correct)]));
};

describe("XP", () => {
  it("awards lesson XP only once", () => {
    const { s, gained } = run([
      { type: "lesson_complete", lessonId: "phishing-101" },
      { type: "lesson_complete", lessonId: "phishing-101" },
    ]);
    expect(gained).toEqual([XP.lesson, 0]);
    expect(s.xp).toBe(XP.lesson);
  });

  it("awards quiz XP only for improvement, plus a one-time perfect bonus", () => {
    const quiz = moduleById.get("what-is-phishing")!.quiz;
    const half = Object.fromEntries(quiz.slice(0, 3).map((q) => [q.id, q.options.findIndex((o) => o.correct)]));
    const { gained } = run([
      { type: "quiz_submit", quizId: "what-is-phishing", answers: half },
      { type: "quiz_submit", quizId: "what-is-phishing", answers: half },
      { type: "quiz_submit", quizId: "what-is-phishing", answers: correctAnswers("what-is-phishing") },
      { type: "quiz_submit", quizId: "what-is-phishing", answers: correctAnswers("what-is-phishing") },
    ]);
    expect(gained).toEqual([3 * XP.quizPerCorrect, 0, (quiz.length - 3) * XP.quizPerCorrect + XP.quizPerfectBonus, 0]);
  });

  it("awards drill XP on the first correct answer only, with flag bonus", () => {
    const { gained } = run([
      { type: "drill_answer", drill: "inbox", itemId: "e01", verdict: "legit", clicked: [] },
      { type: "drill_answer", drill: "inbox", itemId: "e01", verdict: "phish", clicked: ["from", "l1"] },
      { type: "drill_answer", drill: "inbox", itemId: "e01", verdict: "phish", clicked: ["from", "l1"] },
    ]);
    expect(gained).toEqual([0, XP.drillCorrect + 2 * XP.drillPerFlag, 0]);
  });

  it("gives a daily bonus on a new day after the first", () => {
    const first = run([{ type: "lesson_complete", lessonId: "phishing-101" }], "2026-11-04");
    const second = run([{ type: "lesson_complete", lessonId: "why-phishing-works" }], "2026-11-05", first.s);
    expect(second.gained).toEqual([XP.lesson + XP.dailyBonus]);
    expect(second.s.days).toEqual(["2026-11-04", "2026-11-05"]);
  });

  it("awards the exam pass bonus once", () => {
    const { gained } = run([
      { type: "quiz_submit", quizId: "final", answers: correctAnswers("final") },
      { type: "quiz_submit", quizId: "final", answers: correctAnswers("final") },
    ]);
    expect(gained[0]).toBe(examQuestions.length * XP.quizPerCorrect + XP.quizPerfectBonus + XP.examPass);
    expect(gained[1]).toBe(0);
  });

  it("levels", () => {
    expect(levelFor(0).level).toBe(1);
    expect(levelFor(150).level).toBe(2);
    expect(levelFor(449).level).toBe(2);
    expect(levelFor(450).level).toBe(3);
  });
});

describe("badges", () => {
  it("First Step and First Catch", () => {
    const { badges } = run([
      { type: "lesson_complete", lessonId: "phishing-101" },
      { type: "drill_answer", drill: "inbox", itemId: "e02", verdict: "legit", clicked: [] },
      { type: "drill_answer", drill: "inbox", itemId: "e01", verdict: "phish", clicked: [] },
    ]);
    expect(badges).toEqual(["first-step", "first-catch"]);
  });

  it("Perfect Quiz", () => {
    expect(run([{ type: "quiz_submit", quizId: "reading-links", answers: correctAnswers("reading-links") }]).badges).toContain("perfect-quiz");
  });

  it("Link Detective after 25 distinct correct URLs", () => {
    const events: RawEvent[] = urlItems.slice(0, 25).map((u) => ({
      type: "drill_answer",
      drill: "urls",
      itemId: u.id,
      verdict: u.safe ? "legit" : "phish",
      clicked: [],
    }));
    const { badges } = run(events);
    expect(badges).toContain("link-detective");
    expect(run(events.slice(0, 24)).badges).not.toContain("link-detective");
  });

  it("7-Day Streak", () => {
    let s = emptyState();
    const days = ["2026-11-01", "2026-11-02", "2026-11-03", "2026-11-04", "2026-11-05", "2026-11-06"];
    const lessons = modules.flatMap((m) => m.lessons.map((l) => l.id));
    days.forEach((d, i) => (s = run([{ type: "lesson_complete", lessonId: lessons[i] }], d, s).s));
    expect(s.badges["streak-3"]).toBeTruthy();
    expect(s.badges["streak-7"]).toBeUndefined();
    s = run([{ type: "lesson_complete", lessonId: lessons[6] }], "2026-11-07", s).s;
    expect(s.badges["streak-7"]).toBeTruthy();
  });

  it("Sharp Eye needs every flag in a hard phish", () => {
    expect(run([{ type: "drill_answer", drill: "inbox", itemId: "e31", verdict: "phish", clicked: ["from", "l1"] }]).badges).not.toContain("sharp-eye");
    expect(
      run([{ type: "drill_answer", drill: "inbox", itemId: "e31", verdict: "phish", clicked: ["from", "l1", "s2"] }]).badges,
    ).toContain("sharp-eye");
  });
});

describe("progress selectors", () => {
  it("next step walks the course in order", () => {
    expect(nextStep(emptyState()).href).toBe("/learn/what-is-phishing/phishing-101");
    const m1 = moduleById.get("what-is-phishing")!;
    const { s } = run(m1.lessons.map((l) => ({ type: "lesson_complete", lessonId: l.id }) as RawEvent));
    expect(nextStep(s).href).toBe("/learn/what-is-phishing/drill");
  });
  it("overall progress grows from 0", () => {
    expect(overallProgress(emptyState())).toBe(0);
    const { s } = run([{ type: "lesson_complete", lessonId: "phishing-101" }]);
    expect(overallProgress(s)).toBeGreaterThan(0);
  });
  it("weak spots surface repeatedly missed flag types", () => {
    const events: RawEvent[] = ["e01", "e03", "e05", "e06"].map((id) => ({ type: "drill_answer", drill: "inbox", itemId: id, verdict: "phish", clicked: [] }));
    const spots = weakSpots(run(events).s);
    expect(spots.length).toBeGreaterThan(0);
    expect(spots[0].accuracy).toBe(0);
    expect(spots[0].href).toMatch(/^\/learn\//);
  });
});
