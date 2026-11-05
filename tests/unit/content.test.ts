import { describe, expect, it } from "vitest";
import { findUnsafeHosts, isReservedHost, validateContent } from "../../scripts/validate-content";
import { rawEventSchema, isPlausibleDay, displayNameSchema } from "@/lib/progress";

describe("course content", () => {
  it("passes all integrity and safety checks", () => {
    expect(validateContent()).toEqual([]);
  });
  it("detects real-looking domains in simulated content", () => {
    expect(findUnsafeHosts("log in at realbank.com now")).toEqual(["realbank.com"]);
    expect(findUnsafeHosts("visit lumenbank.example or 203.0.113.9")).toEqual([]);
    expect(isReservedHost("8.8.8.8")).toBe(false);
  });
});

describe("input validation", () => {
  it("accepts valid events and rejects junk", () => {
    expect(rawEventSchema.safeParse({ type: "lesson_complete", lessonId: "phishing-101" }).success).toBe(true);
    expect(rawEventSchema.safeParse({ type: "lesson_complete", lessonId: "<script>" }).success).toBe(false);
    expect(rawEventSchema.safeParse({ type: "drill_answer", drill: "inbox", itemId: "e01", verdict: "maybe", clicked: [] }).success).toBe(false);
    expect(rawEventSchema.safeParse({ type: "activity_complete", key: "scenario:clicked-a-link" }).success).toBe(true);
  });
  it("only accepts a plausible local day", () => {
    const now = new Date("2026-11-05T12:00:00Z");
    expect(isPlausibleDay("2026-11-05", now)).toBe(true);
    expect(isPlausibleDay("2026-11-06", now)).toBe(true);
    expect(isPlausibleDay("2026-11-09", now)).toBe(false);
  });
  it("validates display names", () => {
    expect(displayNameSchema.safeParse("Jordan L.").success).toBe(true);
    expect(displayNameSchema.safeParse("<b>x</b>").success).toBe(false);
  });
});
