import "server-only";
import { headers } from "next/headers";

/**
 * Small in-memory sliding-window rate limiter for auth and write actions.
 * On serverless platforms each instance has its own memory, so this is a
 * first line of defense; Supabase Auth applies its own server-side limits too.
 * For strict global limits, swap this for a shared store (see SETUP.md).
 */
const buckets = new Map<string, number[]>();
const MAX_KEYS = 10_000;

export function rateLimitCheck(key: string, limit: number, windowMs: number, now = Date.now()) {
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= limit) {
    buckets.set(key, hits);
    return { ok: false as const, retryAfterSec: Math.ceil((windowMs - (now - hits[0])) / 1000) };
  }
  hits.push(now);
  buckets.set(key, hits);
  if (buckets.size > MAX_KEYS) {
    // Drop the oldest keys to bound memory.
    for (const k of buckets.keys()) {
      buckets.delete(k);
      if (buckets.size <= MAX_KEYS / 2) break;
    }
  }
  return { ok: true as const, retryAfterSec: 0 };
}

export async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

/** Rate-limit by action + client IP. Returns an error message when limited. */
export async function limitByIp(action: string, limit: number, windowMs: number): Promise<string | null> {
  const r = rateLimitCheck(`${action}:${await clientIp()}`, limit, windowMs);
  return r.ok ? null : `Too many attempts. Please wait ${r.retryAfterSec} seconds and try again.`;
}
