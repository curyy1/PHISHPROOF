import type { FlagType } from "@/content/types";

export type DrillKind = "inbox" | "sms" | "browser" | "urls";

/** What the client sends. Everything is re-graded from repo content (never trusted). */
export type RawEvent =
  | { type: "lesson_complete"; lessonId: string }
  | { type: "quiz_submit"; quizId: string; answers: Record<string, number> }
  | {
      type: "drill_answer";
      drill: DrillKind;
      itemId: string;
      verdict: "phish" | "legit";
      /** Ids of clickable elements the learner flagged (sender, segments, attachments, URL parts). */
      clicked: string[];
    }
  | { type: "activity_complete"; key: ActivityKey };

export type ActivityKey = "passwords" | `scenario:${string}`;

/** Result of server/client grading. */
export type GradedEvent =
  | { type: "lesson"; lessonId: string; moduleId: string }
  | { type: "quiz"; quizId: string; score: number; total: number; results: Record<string, boolean> }
  | {
      type: "drill";
      drill: DrillKind;
      itemId: string;
      isPhish: boolean;
      correct: boolean;
      found: FlagType[];
      missed: FlagType[];
      foundIds: string[];
      missedIds: string[];
      falseFlags: number;
    }
  | { type: "activity"; key: ActivityKey };

export type QuizAttempt = { quizId: string; score: number; total: number; at: string };
export type DrillResult = {
  drill: DrillKind;
  itemId: string;
  isPhish: boolean;
  correct: boolean;
  found: FlagType[];
  missed: FlagType[];
  falseFlags: number;
  at: string;
};
export type ActivityItem = { kind: string; label: string; xp: number; at: string; href?: string };

export type ProgressState = {
  version: 1;
  xp: number;
  lessons: Record<string, string>; // lessonId -> completedAt ISO
  quizzes: QuizAttempt[];
  drills: DrillResult[];
  activities: Record<string, string>; // ActivityKey -> completedAt
  days: string[]; // YYYY-MM-DD (learner's local date), sorted unique
  badges: Record<string, string>; // badgeId -> earnedAt
  activity: ActivityItem[]; // newest first, capped
};

export type ApplyResult = {
  state: ProgressState;
  xpGained: number;
  newBadges: string[];
  activityItem: ActivityItem;
};

export const emptyState = (): ProgressState => ({
  version: 1,
  xp: 0,
  lessons: {},
  quizzes: [],
  drills: [],
  activities: {},
  days: [],
  badges: {},
  activity: [],
});
