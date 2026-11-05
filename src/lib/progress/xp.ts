import { FINAL_EXAM_ID } from "./grading";
import { bestQuiz, EXAM_PASS } from "./selectors";
import type { GradedEvent, ProgressState } from "./types";

export const XP = {
  lesson: 20,
  quizPerCorrect: 5,
  quizPerfectBonus: 25,
  examPass: 100,
  drillCorrect: 10,
  drillPerFlag: 2,
  activity: 30,
  dailyBonus: 5,
} as const;

/**
 * XP for an event given the state *before* applying it.
 * Anti-farming rules: lessons/activities pay once; quizzes pay only for improving your best
 * score; simulator items pay only the first time you get them right.
 */
export function xpForEvent(state: ProgressState, e: GradedEvent): number {
  switch (e.type) {
    case "lesson":
      return state.lessons[e.lessonId] ? 0 : XP.lesson;
    case "activity":
      return state.activities[e.key] ? 0 : XP.activity;
    case "quiz": {
      const prev = bestQuiz(state, e.quizId);
      const prevScore = prev ? Math.round((prev.score / prev.total) * e.total) : 0;
      let xp = Math.max(0, e.score - prevScore) * XP.quizPerCorrect;
      const wasPerfect = state.quizzes.some((q) => q.quizId === e.quizId && q.score === q.total);
      if (e.score === e.total && !wasPerfect) xp += XP.quizPerfectBonus;
      if (e.quizId === FINAL_EXAM_ID) {
        const passedBefore = !!prev && prev.score / prev.total >= EXAM_PASS;
        if (!passedBefore && e.score / e.total >= EXAM_PASS) xp += XP.examPass;
      }
      return xp;
    }
    case "drill": {
      if (!e.correct) return 0;
      const before = state.drills.some((d) => d.drill === e.drill && d.itemId === e.itemId && d.correct);
      if (before) return 0;
      return XP.drillCorrect + XP.drillPerFlag * e.found.length;
    }
  }
}

/** Simple leveling curve shown on the dashboard. Level n needs 150·n·(n−1)/2 XP. */
export function levelFor(xp: number) {
  let level = 1;
  while (xp >= (150 * level * (level + 1)) / 2) level++;
  const floor = (150 * level * (level - 1)) / 2;
  const ceil = (150 * level * (level + 1)) / 2;
  return { level, progress: (xp - floor) / (ceil - floor), toNext: ceil - xp };
}
