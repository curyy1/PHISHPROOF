/** Only allow same-site relative redirect targets (prevents open redirects like //evil.test). */
export function safeNext(next: unknown, fallback = "/dashboard"): string {
  return typeof next === "string" && /^\/(?!\/)[A-Za-z0-9/_?=&#.%-]*$/.test(next) && !next.includes("\\") ? next : fallback;
}
