import { browserPages, emailById, modules, smsById } from "@/content";
import { computeStreak } from "./streak";
import { answeredItems, examPassed, moduleProgress, quizPassed } from "./selectors";
import type { ProgressState } from "./types";

export type Badge = {
  id: string;
  name: string;
  icon: string;
  description: string;
  earned: (s: ProgressState) => boolean;
};

const difficultyOf = (drill: string, id: string) =>
  drill === "inbox" ? emailById.get(id)?.difficulty : drill === "sms" ? smsById.get(id)?.difficulty : undefined;

export const BADGES: Badge[] = [
  { id: "first-step", name: "First Step", icon: "👣", description: "Complete your first lesson.", earned: (s) => Object.keys(s.lessons).length > 0 },
  {
    id: "first-catch",
    name: "First Catch",
    icon: "🎣",
    description: "Correctly identify your first phish in a simulator.",
    earned: (s) => s.drills.some((d) => d.isPhish && d.correct),
  },
  {
    id: "perfect-quiz",
    name: "Perfect Quiz",
    icon: "💯",
    description: "Score 100% on any module quiz.",
    earned: (s) => s.quizzes.some((q) => q.quizId !== "final" && q.score === q.total),
  },
  {
    id: "link-detective",
    name: "Link Detective",
    icon: "🔎",
    description: "Correctly judge 25 different URLs in the URL inspector.",
    earned: (s) => answeredItems(s.drills, "urls", true).size >= 25,
  },
  {
    id: "inbox-hero",
    name: "Inbox Hero",
    icon: "📬",
    description: "Get 20 different emails right in Spot the Phish.",
    earned: (s) => answeredItems(s.drills, "inbox", true).size >= 20,
  },
  {
    id: "text-tactician",
    name: "Text Tactician",
    icon: "💬",
    description: "Get 10 different texts or DMs right.",
    earned: (s) => answeredItems(s.drills, "sms", true).size >= 10,
  },
  {
    id: "login-guard",
    name: "Login Guard",
    icon: "🛂",
    description: "Judge every fake-login drill page correctly.",
    earned: (s) => browserPages.every((b) => answeredItems(s.drills, "browser", true).has(b.id)),
  },
  {
    id: "sharp-eye",
    name: "Sharp Eye",
    icon: "🦅",
    description: "Find every red flag in a hard phishing message.",
    earned: (s) =>
      s.drills.some((d) => d.isPhish && d.correct && d.missed.length === 0 && d.found.length > 0 && difficultyOf(d.drill, d.itemId) === "hard"),
  },
  {
    id: "passphrase-pro",
    name: "Passphrase Pro",
    icon: "🔐",
    description: "Complete the Password Lab challenge.",
    earned: (s) => !!s.activities["passwords"],
  },
  {
    id: "module-master",
    name: "Module Master",
    icon: "🧩",
    description: "Finish every lesson, the drill and the quiz in one module.",
    earned: (s) => modules.some((m) => moduleProgress(s, m).complete),
  },
  {
    id: "streak-3",
    name: "On a Roll",
    icon: "🔥",
    description: "Learn 3 days in a row.",
    earned: (s) => computeStreak(s.days, s.days[s.days.length - 1] ?? "1970-01-01").longest >= 3,
  },
  {
    id: "streak-7",
    name: "7-Day Streak",
    icon: "⚡",
    description: "Learn 7 days in a row.",
    earned: (s) => computeStreak(s.days, s.days[s.days.length - 1] ?? "1970-01-01").longest >= 7,
  },
  { id: "xp-1000", name: "Level Up", icon: "🚀", description: "Earn 1,000 XP.", earned: (s) => s.xp >= 1000 },
  {
    id: "graduate",
    name: "Graduate",
    icon: "🎓",
    description: "Pass every module quiz.",
    earned: (s) => modules.every((m) => quizPassed(s, m.id)),
  },
  { id: "certified", name: "Phishproof Certified", icon: "🏅", description: "Pass the final exam.", earned: (s) => examPassed(s) },
];

export const badgeById = new Map(BADGES.map((b) => [b.id, b]));

/** Badges newly earned in `state` that aren't recorded yet. */
export function newlyEarnedBadges(state: ProgressState): string[] {
  return BADGES.filter((b) => !state.badges[b.id] && b.earned(state)).map((b) => b.id);
}
