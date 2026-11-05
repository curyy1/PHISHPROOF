import { describe, expect, it } from "vitest";
import { emailById, examQuestions, moduleById } from "@/content";
import { GradingError, gradeDrill, gradeEvent, gradeQuiz } from "@/lib/progress";

describe("quiz grading", () => {
  const quiz = moduleById.get("what-is-phishing")!.quiz;
  const allCorrect = Object.fromEntries(quiz.map((q) => [q.id, q.options.findIndex((o) => o.correct)]));

  it("scores all-correct answers as perfect", () => {
    expect(gradeQuiz("what-is-phishing", allCorrect)).toMatchObject({ score: quiz.length, total: quiz.length });
  });
  it("counts unanswered and out-of-range answers as wrong", () => {
    const answers = { ...allCorrect, [quiz[0].id]: 99 };
    delete (answers as Record<string, number>)[quiz[1].id];
    const r = gradeQuiz("what-is-phishing", answers);
    expect(r.score).toBe(quiz.length - 2);
    expect(r.results[quiz[0].id]).toBe(false);
  });
  it("grades the final exam", () => {
    const answers = Object.fromEntries(examQuestions.map((q) => [q.id, q.options.findIndex((o) => o.correct)]));
    expect(gradeQuiz("final", answers).score).toBe(examQuestions.length);
  });
  it("rejects unknown quizzes", () => {
    expect(() => gradeQuiz("nope", {})).toThrow(GradingError);
  });
});

describe("drill grading", () => {
  it("finds and misses red flags by clicked element", () => {
    const e = emailById.get("e01")!;
    const r = gradeDrill("inbox", "e01", "phish", ["from", "l1", "s1-bogus"]);
    expect(r.correct).toBe(true);
    expect(r.foundIds.sort()).toEqual(["h-link", "h-sender"]);
    expect(r.missedIds.length).toBe(e.hotspots.length - 2);
    expect(r.found).toContain("sender");
  });
  it("counts decoy clicks as false flags", () => {
    const r = gradeDrill("inbox", "e02", "legit", ["s1", "s2", "from"]);
    expect(r).toMatchObject({ correct: true, falseFlags: 3, found: [], missed: [] });
  });
  it("marks a wrong verdict incorrect", () => {
    expect(gradeDrill("inbox", "e02", "phish", []).correct).toBe(false);
    expect(gradeDrill("sms", "s01", "legit", []).correct).toBe(false);
  });
  it("grades URLs as safe/sketchy", () => {
    expect(gradeDrill("urls", "u01", "legit", []).correct).toBe(true);
    const sketchy = gradeDrill("urls", "u02", "phish", []);
    expect(sketchy).toMatchObject({ correct: true, found: ["url-structure"] });
    expect(gradeDrill("urls", "u02", "legit", []).missed).toEqual(["url-structure"]);
  });
  it("grades browser pages by URL parts", () => {
    const r = gradeDrill("browser", "b01", "phish", ["p2"]);
    expect(r.foundIds).toEqual(["h-real"]);
    expect(r.missedIds).toEqual(["h-sub"]);
  });
  it("rejects unknown items", () => {
    expect(() => gradeEvent({ type: "drill_answer", drill: "inbox", itemId: "zzz", verdict: "phish", clicked: [] })).toThrow();
    expect(() => gradeEvent({ type: "lesson_complete", lessonId: "zzz" })).toThrow();
    expect(() => gradeEvent({ type: "activity_complete", key: "scenario:zzz" })).toThrow();
  });
});
