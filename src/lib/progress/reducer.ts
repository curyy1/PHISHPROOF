import { lessonIndex, moduleById } from "@/content";
import { badgeById, newlyEarnedBadges } from "./badges";
import { FINAL_EXAM_ID } from "./grading";
import { addActiveDay } from "./streak";
import type { ActivityItem, ApplyResult, GradedEvent, ProgressState } from "./types";
import { XP, xpForEvent } from "./xp";

export const ACTIVITY_LOG_LIMIT = 30;

function describe(e: GradedEvent): Omit<ActivityItem, "xp" | "at"> {
  switch (e.type) {
    case "lesson": {
      const l = lessonIndex.get(e.lessonId);
      return { kind: "lesson", label: `Finished “${l?.lesson.title ?? e.lessonId}”`, href: `/learn/${e.moduleId}/${e.lessonId}` };
    }
    case "quiz":
      return e.quizId === FINAL_EXAM_ID
        ? { kind: "exam", label: `Final exam: ${e.score}/${e.total}`, href: "/exam" }
        : {
            kind: "quiz",
            label: `${moduleById.get(e.quizId)?.title ?? e.quizId} quiz: ${e.score}/${e.total}`,
            href: `/learn/${e.quizId}/quiz`,
          };
    case "drill": {
      const names = { inbox: "Spot the Phish", sms: "Text simulator", browser: "Login page drill", urls: "URL inspector" };
      return { kind: "drill", label: `${names[e.drill]}: ${e.correct ? "correct" : "missed"} (${e.itemId})`, href: `/practice/${e.drill}` };
    }
    case "activity":
      return e.key === "passwords"
        ? { kind: "activity", label: "Completed the Password Lab challenge", href: "/practice/passwords" }
        : { kind: "activity", label: "Completed the incident scenario", href: "/learn/what-to-do/drill" };
  }
}

/**
 * Pure state transition shared by the server (signed-in users) and the browser
 * (guests). `at` is an ISO timestamp, `day` is the learner's local YYYY-MM-DD.
 */
export function applyEvent(prev: ProgressState, e: GradedEvent, at: string, day: string): ApplyResult {
  let xpGained = xpForEvent(prev, e);
  const isNewDay = !prev.days.includes(day);
  if (isNewDay && prev.days.length > 0) xpGained += XP.dailyBonus;

  const state: ProgressState = {
    ...prev,
    lessons: { ...prev.lessons },
    activities: { ...prev.activities },
    badges: { ...prev.badges },
    days: addActiveDay(prev.days, day),
  };

  switch (e.type) {
    case "lesson":
      state.lessons[e.lessonId] ??= at;
      break;
    case "activity":
      state.activities[e.key] ??= at;
      break;
    case "quiz":
      state.quizzes = [...prev.quizzes, { quizId: e.quizId, score: e.score, total: e.total, at }];
      break;
    case "drill":
      state.drills = [
        ...prev.drills,
        { drill: e.drill, itemId: e.itemId, isPhish: e.isPhish, correct: e.correct, found: e.found, missed: e.missed, falseFlags: e.falseFlags, at },
      ];
      break;
  }
  state.xp = prev.xp + xpGained;

  // Badges can unlock in a cascade (e.g. XP from a badge-triggering event), so check after XP is applied.
  const newBadges = newlyEarnedBadges(state);
  for (const id of newBadges) state.badges[id] = at;

  const activityItem: ActivityItem = { ...describe(e), xp: xpGained, at };
  const badgeItems: ActivityItem[] = newBadges.map((id) => ({
    kind: "badge",
    label: `Earned the “${badgeById.get(id)?.name ?? id}” badge`,
    xp: 0,
    at,
    href: "/dashboard#badges",
  }));
  state.activity = [...badgeItems, activityItem, ...prev.activity].slice(0, ACTIVITY_LOG_LIMIT);

  return { state, xpGained, newBadges, activityItem };
}
