/** Date helpers use plain YYYY-MM-DD strings (the learner's local calendar day). */

export function toDayString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function isValidDay(s: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
}

/** Whole days from a to b (b - a). */
export function dayDiff(a: string, b: string): number {
  const ms = Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`);
  return Math.round(ms / 86_400_000);
}

export function addDays(day: string, n: number): string {
  const d = new Date(`${day}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

/** Insert a day into a sorted unique list. */
export function addActiveDay(days: string[], day: string): string[] {
  if (days.includes(day)) return days;
  return [...days, day].sort();
}

/**
 * Current streak: consecutive active days ending today, or ending yesterday
 * (you still have today to keep it alive). Longest: the best run ever.
 */
export function computeStreak(days: string[], today: string): { current: number; longest: number } {
  const sorted = [...new Set(days)].filter(isValidDay).sort();
  let longest = 0;
  let run = 0;
  let prev: string | null = null;
  for (const d of sorted) {
    run = prev && dayDiff(prev, d) === 1 ? run + 1 : 1;
    longest = Math.max(longest, run);
    prev = d;
  }
  let current = 0;
  const last = sorted[sorted.length - 1];
  if (last && dayDiff(last, today) <= 1 && dayDiff(last, today) >= 0) {
    current = 1;
    for (let i = sorted.length - 1; i > 0; i--) {
      if (dayDiff(sorted[i - 1], sorted[i]) === 1) current++;
      else break;
    }
  }
  return { current, longest };
}
