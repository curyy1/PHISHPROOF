import { describe, expect, it } from "vitest";
import { addDays, computeStreak, dayDiff, isValidDay } from "@/lib/progress";

describe("streaks", () => {
  it("is zero with no activity", () => {
    expect(computeStreak([], "2026-11-05")).toEqual({ current: 0, longest: 0 });
  });
  it("counts consecutive days ending today", () => {
    expect(computeStreak(["2026-11-03", "2026-11-04", "2026-11-05"], "2026-11-05")).toEqual({ current: 3, longest: 3 });
  });
  it("keeps the streak alive if the last activity was yesterday", () => {
    expect(computeStreak(["2026-11-03", "2026-11-04"], "2026-11-05").current).toBe(2);
  });
  it("breaks the streak after a missed day but remembers the longest", () => {
    const days = ["2026-10-01", "2026-10-02", "2026-10-03", "2026-10-04", "2026-11-04"];
    expect(computeStreak(days, "2026-11-06")).toEqual({ current: 0, longest: 4 });
    expect(computeStreak(days, "2026-11-05")).toEqual({ current: 1, longest: 4 });
  });
  it("handles month/year boundaries and duplicates", () => {
    const days = ["2025-12-30", "2025-12-31", "2026-01-01", "2026-01-01"];
    expect(computeStreak(days, "2026-01-01")).toEqual({ current: 3, longest: 3 });
  });
  it("ignores invalid days", () => {
    expect(computeStreak(["2026-02-30", "nope"], "2026-03-01")).toEqual({ current: 0, longest: 0 });
  });
  it("date helpers", () => {
    expect(dayDiff("2026-02-28", "2026-03-01")).toBe(1);
    expect(addDays("2024-02-28", 1)).toBe("2024-02-29");
    expect(isValidDay("2026-11-05")).toBe(true);
    expect(isValidDay("2026-13-01")).toBe(false);
  });
});
