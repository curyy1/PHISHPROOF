# Phishproof setup guide

This guide takes you from zero to a deployed Phishproof site with accounts, progress tracking, certificates and classes.

Plan on about 20 minutes. If you skip the Supabase steps, the site still runs in **demo mode**: every page works, progress saves in the browser, and accounts, the leaderboard, certificates and classes are switched off.

---

## 1. Prerequisites

- **Node.js 20.9+** (22 LTS recommended) and npm
- A free **Supabase** account: <https://supabase.com>
- A free **Vercel** account for deploying: <https://vercel.com>
- Optional: the **Supabase CLI** (`npm i -g supabase`) for applying migrations from the terminal

## 2. Run it locally in demo mode

```bash
npm install
```

```bash
npm run dev
```

Open <http://localhost:3000>. With no env vars set, you're in demo mode.

## 3. Create the Supabase project

1. In the Supabase dashboard, click **New project**. Pick a name and region, and save the database password somewhere safe.
2. When it's ready, open **Project Settings → API** (called **API Keys** in newer dashboards) and copy:
   - the **Project URL**
   - the **anon / publishable** key (safe for the browser)
   - the **service_role / secret** key (**server only**: never put it in client code or commit it)

## 4. Environment variables

Copy the example file and fill it in:

```bash
cp .env.example .env.local
```

| Variable | Required | What it's for |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | yes | Your project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` (or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`) | yes | Public key used by the browser and server with the user's session (RLS applies) |
| `SUPABASE_SERVICE_ROLE_KEY` | yes | Server-only key. Used **after** the server re-grades an answer to write progress, plus issuing certificates, deleting accounts and promoting teachers |
| `NEXT_PUBLIC_SITE_URL` | yes in production | e.g. `https://phishproof.vercel.app`. Used in email links and printed on certificates |
| `NEXT_PUBLIC_ENABLE_GOOGLE_AUTH` | optional | `true` shows "Continue with Google" (set up step 7 first) |
| `TEACHER_INVITE_CODE` | optional | A secret of 8+ characters. Anyone who knows it can make their account a teacher from **Account → Classes** |

Restart `npm run dev` after editing `.env.local`.

## 5. Run the database migration and seed

The schema lives in `supabase/migrations/` and the course catalog seed in `supabase/seed.sql`. That seed is generated from the typed content in `src/content`, so regenerate it whenever you add lessons:

```bash
npm run seed:generate
```

**Option A: Supabase CLI (recommended)**

```bash
supabase login
```

```bash
supabase link --project-ref YOUR-PROJECT-REF
```

```bash
supabase db push
```

```bash
psql "$(supabase db url)" -f supabase/seed.sql
```

If `supabase db url` isn't available in your CLI version, copy the connection string from **Project Settings → Database** instead, or use option B for the seed.

**Option B: SQL editor (no CLI)**

1. Open **SQL Editor** in the dashboard.
2. Paste the whole contents of `supabase/migrations/20261105000000_init.sql` and click **Run**.
3. Paste the contents of `supabase/seed.sql` and click **Run**.

The seed is safe to re-run; it upserts. Run it again after content changes, otherwise saving progress on a new lesson will fail the foreign-key check.

**What the migration creates:** tables for profiles, lesson progress, quiz attempts, drill results, badges, streak days, activity log, certificates, classes and class members. It also turns on **Row Level Security** on every table and adds:

- policies so users can read only their own rows (teachers can also read students in their classes)
- column-level grants so users can edit only `display_name`, `full_name` and `leaderboard_opt_in`
- narrow `SECURITY DEFINER` functions for joining a class, the public leaderboard and certificate verification
- a trigger that creates a profile when someone signs up

You can test all of this locally without a Supabase project, against a throwaway Postgres (needs Postgres 15+ binaries):

```bash
npm run test:db
```

## 6. Configure Supabase Auth

In **Authentication → URL Configuration**:

- **Site URL**: your production URL (e.g. `https://phishproof.vercel.app`), or `http://localhost:3000` for now.
- **Redirect URLs**: add both of these:
  - `http://localhost:3000/auth/callback`
  - `https://YOUR-DOMAIN/auth/callback`

In **Authentication → Providers → Email**:

- Keep **Email** enabled. Magic links use the same provider.
- **Confirm email**: on for production. For the Playwright sign-up test against a test project, turn it off.
- **Minimum password length**: set it to **15** to match the app and NIST SP 800-63B.
- **Leaked password protection** (Pro plan): turn it on to block passwords found in breaches.

**Rate limits:** Supabase Auth has its own limits (**Authentication → Rate Limits**). The app also rate-limits auth actions per IP (`src/lib/ratelimit.ts`).

**Optional, for cross-device email links:** edit the email templates to use the token-hash route, e.g. `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery`. The default PKCE `/auth/callback` flow works when the link is opened in the same browser.

## 7. Optional: Google sign-in

1. In Google Cloud Console, create an **OAuth client ID** (type: Web application).
2. Add the authorized redirect URI that Supabase shows you: `https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback`.
3. In Supabase, open **Authentication → Providers → Google**, paste the client ID and secret, and enable it.
4. Set `NEXT_PUBLIC_ENABLE_GOOGLE_AUTH=true`.

## 8. Make yourself a teacher or admin

Sign up on your site first. Then either:

- set `TEACHER_INVITE_CODE`, go to **Account → Classes → "I'm a teacher or club leader"** and enter the code; or
- run this in the SQL editor:

```sql
update public.profiles set role = 'admin'
where id = (select id from auth.users where email = 'you@yourschool.org');
```

Teachers see a **Teach** tab where they can:

- create classes, each with a 6-character join code
- watch roster progress
- export a CSV
- remove students

Students join from **Account → Classes**.

## 9. Deploy to Vercel

1. Push the repo to GitHub.
2. In Vercel, click **Add New → Project** and import the repo. The framework preset is detected automatically.
3. Add the environment variables from step 4 under **Settings → Environment Variables**, for Production and Preview. Set `NEXT_PUBLIC_SITE_URL` to the Vercel URL or your custom domain.
4. Deploy.
5. Back in Supabase, set **Site URL** and add `https://YOUR-DOMAIN/auth/callback` to **Redirect URLs** (step 6).
6. Visit `/manifest.webmanifest` to confirm the PWA manifest, then on a phone use **Add to Home Screen**.

## 10. Quality checks

```bash
npm run check
```

That runs ESLint, the TypeScript type-check and the Vitest unit tests (scoring, XP, streaks, badges, validation and content safety).

```bash
npm run validate:content
```

That checks the content: unique IDs, valid hotspot references, about 40% legit emails, and every simulated domain reserved.

```bash
npm run test:db
```

That runs the RLS and privilege tests against a throwaway local Postgres.

```bash
npm run test:e2e
```

That builds the site and runs the Playwright tests: the smoke flow, simulators, password privacy, security headers, mobile layout, and axe accessibility checks in light and dark mode.

The **sign up → complete a lesson → see progress** e2e test runs only when Supabase env vars are present. Use a separate test project with **Confirm email turned off**. The test deletes its own account afterwards. Without Supabase, the same flow runs as a guest.

The tests use the Playwright version pinned in `package.json`. If browsers are missing:

```bash
npx playwright install chromium
```

---

## Known limitations / stubs

- **Rate limiting is per server instance.** `src/lib/ratelimit.ts` keeps counters in memory. On Vercel each serverless instance has its own counters, so the limits are best-effort. Supabase Auth's server-side limits still apply. For strict global limits, back `rateLimitCheck` with Upstash Redis or Vercel KV.
- **What this build environment couldn't test.** The Supabase client calls (sign-up, server-graded saves, certificate issuing, class rosters) were type-checked. The database layer was tested against a real Postgres with the RLS test suite. They have **not** been exercised against a live Supabase project yet. Run `npm run test:e2e` with a test project's keys after setup to confirm the full flow.
- **Email delivery.** Supabase's built-in email sender is heavily rate-limited and meant for testing. Configure custom SMTP (**Authentication → SMTP Settings**) before inviting a class.
- **Statistics in the course.** Module 1 cites the Verizon 2026 Data Breach Investigations Report: human element ≈62%, phishing ≈16% of breaches. Re-check these when a new DBIR is published.
