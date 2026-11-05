import { z } from "zod";
import { dayDiff, isValidDay } from "./streak";
import type { RawEvent } from "./types";

const id = z.string().min(1).max(64).regex(/^[a-z0-9:_-]+$/i, "Invalid id");

export const rawEventSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("lesson_complete"), lessonId: id }),
  z.object({
    type: z.literal("quiz_submit"),
    quizId: id,
    answers: z.record(id, z.number().int().min(0).max(10)).refine((a) => Object.keys(a).length <= 50, "Too many answers"),
  }),
  z.object({
    type: z.literal("drill_answer"),
    drill: z.enum(["inbox", "sms", "browser", "urls"]),
    itemId: id,
    verdict: z.enum(["phish", "legit"]),
    clicked: z.array(id).max(40),
  }),
  z.object({
    type: z.literal("activity_complete"),
    key: z.union([z.literal("passwords"), z.custom<`scenario:${string}`>((v) => typeof v === "string" && /^scenario:[a-z0-9-]{1,48}$/.test(v))]),
  }),
]);

export const daySchema = z.string().refine(isValidDay, "Invalid day");

/** The learner's local day must be within ±1 day of the server's UTC date (time zones). */
export function isPlausibleDay(day: string, now = new Date()) {
  const utc = now.toISOString().slice(0, 10);
  return isValidDay(day) && Math.abs(dayDiff(utc, day)) <= 1;
}

export const guestLogEntrySchema = z.object({
  event: rawEventSchema,
  at: z.string().datetime(),
  day: daySchema,
});
export const guestImportSchema = z.array(guestLogEntrySchema).max(800);

export type GuestLogEntry = { event: RawEvent; at: string; day: string };

export const displayNameSchema = z
  .string()
  .trim()
  .min(2, "Display name must be at least 2 characters")
  .max(32, "Display name must be 32 characters or fewer")
  .regex(/^[\p{L}\p{N} ._'-]+$/u, "Use letters, numbers, spaces, and . _ ' - only");

export const fullNameSchema = z
  .string()
  .trim()
  .min(2, "Enter your full name")
  .max(80, "Name is too long")
  .regex(/^[\p{L}\p{M} .,'-]+$/u, "Use letters, spaces, and . , ' - only");
