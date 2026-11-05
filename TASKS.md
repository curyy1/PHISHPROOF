# Phishproof build log / task list

Legend: [x] done · [ ] todo · [~] stubbed or partially verified (see SETUP.md → Known limitations)

## Phase 1 — Setup & design system
- [x] Next.js 16 (App Router) + TypeScript + Tailwind v4 scaffold (cacheComponents off: session-dependent + nonce CSP)
- [x] Design tokens (light/dark), fluid type scale, focus states, reduced-motion
- [x] Frosted sticky nav that shrinks on scroll, mobile menu, theme toggle (system/light/dark, no flash)
- [x] Original Phishproof shield+hook logo (SVG)
- [x] Security headers + per-request CSP nonce (src/proxy.ts)

## Phase 2 — Landing page
- [x] Hero with animated inbox
- [x] Pinned scroll scenes (GSAP ScrollTrigger): breach stats grid, six-red-flag email, URL anatomy, AI-grammar
- [x] Features grid, module teaser, final CTA

## Phase 3 — Supabase
- [x] Schema + RLS + column grants + SECURITY DEFINER helpers (migration)
- [x] Local Postgres RLS test suite (`npm run test:db`)
- [x] Auth: email/password, magic link, Google (flag), reset, sign out, delete account
- [x] Rate limiting (in-memory) [~ per-instance; Upstash suggested]
- [~] Live Supabase project not available in the build sandbox → client glue type-checked, e2e sign-up test ready

## Phase 4 — Course engine + content
- [x] 7 modules / 31 lessons / 44 quiz questions / 20-question final exam (all written)
- [x] Lesson renderer (safe rich text, callouts, annotated URLs, message exhibits, inline checks)
- [x] Quiz runner with per-answer explanations; exam gating + 80% pass
- [x] Content validator (reserved domains only, ids, hotspots, ~40% legit) + seed generator

## Phase 5 — Simulators
- [x] Spot the Phish inbox (32 emails, 13 legit)
- [x] Text/DM/voicemail phone simulator (12) with QR preview
- [x] Fake login lab (8 pages, disabled forms, training badge)
- [x] URL inspector game (40 URLs, timed rounds, timer toggle)
- [x] Password lab (zxcvbn-ts, passphrase generator, on-device only)
- [x] Incident scenario (Module 7 drill)

## Phase 6 — Gamification
- [x] Server-graded progress, XP + levels, anti-farming rules
- [x] Streaks, 15 badges, weak spots, red-flag accuracy, recent activity, continue card
- [x] Guest mode with server re-graded import on sign-up
- [x] Opt-in leaderboard (SECURITY DEFINER, display name + XP only)

## Phase 7 — Certificates & classes
- [x] Certificate PNG (next/og) + PDF (pdf-lib), unguessable IDs, public /verify/[id]
- [x] Teacher role (SQL or invite code), classes with join codes, roster, class weak spots, CSV export

## Phase 8 — Polish
- [x] PWA: manifest, icons, service worker, offline page
- [x] Accessibility: axe-core e2e on 18 pages × light/dark, contrast + name fixes, keyboard support
- [x] Performance: lazy engine/badges, LazyMotion, lightweight landing catalog (lesson JS 284→186 KB gz)
- [x] Tests: 36 unit, RLS suite, 45 Playwright (smoke, mobile, a11y)
- [x] README (screenshots, features, stack) and SETUP.md

## Review round — 10 improvements (picky-user pass)
- [x] 1. Branded 404 page with useful links
- [x] 2. Fake login address bar shows the whole URL on phones (the domain is the lesson!)
- [x] 3. Inline code wraps at sensible points instead of mid-word
- [x] 4. Tap-to-preview link destinations in simulators (touch screens can't hover)
- [x] 5. "Next" scrolls the next simulator item into view on mobile
- [x] 6. Quiz "Exit" returns to the current module (was pointing at the next one)
- [x] 7. Flash toasts after sign-up, password update and account deletion
- [x] 8. Guests can reset their local progress
- [x] 9. Dashboard module card no longer stretches to the sidebar height
- [x] 10. Social share image (opengraph-image), sitemap.xml and robots.txt

## Extras
- [x] "About the creator" section on the landing page + footer credit
- [x] Creator photo (public/creator.jpg, cropped + compressed to 512px JPEG)
