import { m1 } from "./modules/m1";
import { m2 } from "./modules/m2";
import { m3 } from "./modules/m3";
import { m4 } from "./modules/m4";
import { m5 } from "./modules/m5";
import { m6 } from "./modules/m6";
import { m7 } from "./modules/m7";
import type { FlagType, Lesson, Module, QuizQuestion } from "./types";

export const modules: Module[] = [m1, m2, m3, m4, m5, m6, m7];

export const moduleById = new Map(modules.map((m) => [m.id, m]));

export const lessonIndex = new Map<string, { lesson: Lesson; module: Module; index: number }>();
for (const m of modules) m.lessons.forEach((lesson, index) => lessonIndex.set(lesson.id, { lesson, module: m, index }));

export const quizById = new Map<string, QuizQuestion[]>(modules.map((m) => [m.id, m.quiz]));

export const totalLessons = modules.reduce((n, m) => n + m.lessons.length, 0);

/** Human labels for red-flag categories and which lesson to review for each. */
export const FLAG_INFO: Record<FlagType, { label: string; review: { moduleId: string; lessonId: string } }> = {
  sender: { label: "Fake or mismatched senders", review: { moduleId: "email-red-flags", lessonId: "check-the-sender" } },
  lookalike: { label: "Lookalike domains", review: { moduleId: "email-red-flags", lessonId: "lookalike-domains" } },
  link: { label: "Hidden link destinations", review: { moduleId: "email-red-flags", lessonId: "links-and-attachments" } },
  urgency: { label: "Urgency & threats", review: { moduleId: "what-is-phishing", lessonId: "five-triggers" } },
  request: { label: "Risky requests (passwords, codes, money)", review: { moduleId: "email-red-flags", lessonId: "tone-and-requests" } },
  attachment: { label: "Dangerous attachments", review: { moduleId: "email-red-flags", lessonId: "links-and-attachments" } },
  "too-good": { label: "Too-good-to-be-true bait", review: { moduleId: "what-is-phishing", lessonId: "five-triggers" } },
  context: { label: "Out-of-context messages", review: { moduleId: "advanced-attacks", lessonId: "spear-phishing" } },
  "url-structure": { label: "URL tricks (subdomains, IPs, @)", review: { moduleId: "reading-links", lessonId: "subdomain-tricks" } },
};

export { emails, emailById } from "./emails";
export { smsItems, smsById } from "./sms";
export { browserPages, browserById } from "./browser";
export { urlItems, urlById } from "./urls";
export { scenarios, scenarioById } from "./scenarios";
export { examQuestions, EXAM_PASS_PERCENT } from "./exam";
