"use client";

import { clsx } from "clsx";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ZxcvbnFactory, ZxcvbnResult } from "@zxcvbn-ts/core";
import { WORDS } from "@/content/wordlist";
import { useProgress } from "@/components/ProgressProvider";
import { Button } from "@/components/ui/Button";

const LABELS = ["Very weak", "Weak", "Fair", "Strong", "Very strong"];
const COLORS = ["bg-danger", "bg-danger", "bg-warn", "bg-success", "bg-success"];

/** Uniform random index using rejection sampling (no modulo bias). */
function randomIndex(n: number) {
  const max = Math.floor(0x100000000 / n) * n;
  const buf = new Uint32Array(1);
  do crypto.getRandomValues(buf);
  while (buf[0] >= max);
  return buf[0] % n;
}

export function generatePassphrase(words: number, sep: string, capitalize: boolean, addNumber: boolean) {
  const picked = Array.from({ length: words }, () => {
    const w = WORDS[randomIndex(WORDS.length)];
    return capitalize ? w[0].toUpperCase() + w.slice(1) : w;
  });
  if (addNumber) picked.push(String(randomIndex(90) + 10));
  return picked.join(sep);
}

/**
 * Password Lab. 100% client-side: the zxcvbn-ts estimator runs in your browser,
 * typed passwords are never sent anywhere or stored, and the input isn't part of any form.
 */
export function PasswordLab({ challenge = false }: { challenge?: boolean }) {
  const { state, submit } = useProgress();
  const zx = useRef<ZxcvbnFactory | null>(null);
  const [ready, setReady] = useState(false);
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [result, setResult] = useState<ZxcvbnResult | null>(null);
  const [nWords, setNWords] = useState(5);
  const [sep, setSep] = useState("-");
  const [cap, setCap] = useState(false);
  const [num, setNum] = useState(false);
  const [generated, setGenerated] = useState("");
  const [copied, setCopied] = useState(false);
  const [completing, setCompleting] = useState(false);
  const challengeDone = !!state?.activities["passwords"];

  // Lazy-load the strength estimator + dictionaries (they're big) only when the lab opens.
  useEffect(() => {
    let alive = true;
    (async () => {
      const [{ ZxcvbnFactory }, common, en] = await Promise.all([
        import("@zxcvbn-ts/core"),
        import("@zxcvbn-ts/language-common"),
        import("@zxcvbn-ts/language-en"),
      ]);
      if (!alive) return;
      zx.current = new ZxcvbnFactory({
        translations: en.translations,
        graphs: common.adjacencyGraphs,
        dictionary: { ...common.dictionary, ...en.dictionary },
      });
      setReady(true);
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!ready || !zx.current) return;
    setResult(pw ? zx.current.check(pw.slice(0, 128)) : null);
  }, [pw, ready]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- generate once on mount (crypto RNG isn't available during SSR)
    setGenerated(generatePassphrase(5, "-", false, false));
  }, []);

  const entropyBits = useMemo(() => Math.round(nWords * Math.log2(WORDS.length) + (num ? Math.log2(90) : 0)), [nWords, num]);
  const length = [...pw].length;
  const score = result?.score ?? 0;
  const checks = [
    { ok: length >= 15, label: "15 or more characters (NIST recommends at least 15 for password-only logins)" },
    { ok: !!result && score >= 3, label: "Not a common or easily guessed password" },
    { ok: !!result && !result.sequence.some((m) => m.pattern === "repeat" || m.pattern === "sequence" || m.pattern === "spatial"), label: "No obvious patterns (aaaa, 1234, qwerty)" },
  ];
  const challengeMet = length >= 15 && score === 4;

  async function completeChallenge() {
    setCompleting(true);
    // Only the fact that you finished is recorded — never the password.
    await submit({ type: "activity_complete", key: "passwords" });
    setCompleting(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3 rounded-2xl bg-success-soft p-4 text-success-ink" role="note">
        <span aria-hidden className="text-xl">🔒</span>
        <p className="text-sm">
          <span className="font-bold">Private by design.</span> Everything here runs on your device. Nothing you type is sent to Phishproof’s servers,
          saved, or logged. Still, don’t type a password you actually use — practice with made-up ones.
        </p>
      </div>

      <section className="card p-5 sm:p-7" aria-labelledby="meter-h">
        <h2 id="meter-h" className="text-title font-bold">Strength meter</h2>
        <label htmlFor="pw-lab-input" className="mt-4 block text-sm font-semibold">
          Try a password or passphrase
        </label>
        <div className="mt-1.5 flex gap-2">
          <input
            id="pw-lab-input"
            type={show ? "text" : "password"}
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            data-1p-ignore
            data-lpignore="true"
            maxLength={128}
            placeholder="e.g. Summer2025!  vs  maple-orbit-crayon-thunder"
            className="h-12 min-w-0 flex-1 rounded-xl border border-line bg-elevated px-3.5 font-mono text-base focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/20"
            aria-describedby="pw-lab-status"
          />
          <Button variant="secondary" onClick={() => setShow((s) => !s)} aria-pressed={show} aria-controls="pw-lab-input">
            {show ? "Hide" : "Show"}
          </Button>
        </div>

        <div className="mt-5" id="pw-lab-status" aria-live="polite">
          <div className="grid grid-cols-5 gap-1.5" aria-hidden>
            {[0, 1, 2, 3, 4].map((i) => (
              <span key={i} className="h-2 overflow-hidden rounded-full bg-sunken">
                <span
                  className={clsx("block h-full origin-left rounded-full transition-transform duration-300", COLORS[score])}
                  style={{ transform: `scaleX(${result && i <= score ? 1 : 0})` }}
                />
              </span>
            ))}
          </div>
          {!ready ? (
            <p className="mt-3 text-sm text-subtle">Loading the strength estimator…</p>
          ) : result ? (
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-lg font-bold">{LABELS[score]}</p>
                <p className="text-sm text-muted">{length} characters</p>
              </div>
              <dl className="grid grid-cols-1 gap-1 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">If a site’s database leaked*</dt>
                  <dd className="font-semibold">{result.crackTimes.offlineSlowHashingXPerSecond.display}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">Guessing online (rate-limited)</dt>
                  <dd className="font-semibold">{result.crackTimes.onlineThrottlingXPerHour.display}</dd>
                </div>
              </dl>
            </div>
          ) : (
            <p className="mt-3 text-sm text-subtle">Start typing to see an estimate.</p>
          )}
          {result?.feedback.warning && <p className="mt-3 rounded-xl bg-warn-soft px-3 py-2 text-sm text-warn-ink">⚠️ {result.feedback.warning}</p>}
          {result && result.feedback.suggestions.length > 0 && (
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted">
              {result.feedback.suggestions.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          )}
        </div>

        <ul className="mt-5 space-y-1.5 text-sm">
          {checks.map((c) => (
            <li key={c.label} className="flex gap-2">
              <span className={c.ok ? "text-success" : "text-subtle"} aria-hidden>{c.ok ? "✓" : "○"}</span>
              <span className={c.ok ? "" : "text-muted"}>{c.label}</span>
              <span className="sr-only">{c.ok ? "met" : "not met"}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-subtle">
          *Estimates from zxcvbn-ts assume a slow, properly protected password hash (10,000 guesses/second). They’re a rough guide, not a guarantee.
        </p>

        {challenge && (
          <div className={clsx("mt-6 rounded-2xl p-4", challengeDone ? "bg-success-soft" : "bg-brand-soft")}>
            <p className="font-semibold">{challengeDone ? "✓ Challenge complete!" : "Challenge: make a passphrase that’s 15+ characters and rated “Very strong.”"}</p>
            {!challengeDone && (
              <Button className="mt-3" onClick={completeChallenge} disabled={!challengeMet || completing} data-testid="complete-password-challenge">
                {challengeMet ? (completing ? "Saving…" : "Complete challenge") : "Keep going…"}
              </Button>
            )}
          </div>
        )}
      </section>

      <section className="card p-5 sm:p-7" aria-labelledby="gen-h">
        <h2 id="gen-h" className="text-title font-bold">Passphrase generator</h2>
        <p className="mt-1 text-sm text-muted">
          Random words chosen with your browser’s cryptographic random number generator from a list of {WORDS.length} words.
        </p>
        <output className="mt-4 block break-all rounded-xl bg-sunken px-4 py-4 font-mono text-lg sm:text-xl" aria-live="polite" data-testid="generated">
          {generated || "…"}
        </output>
        <p className="mt-2 text-xs text-subtle">≈ {entropyBits} bits of randomness · {[...generated].length} characters</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="text-sm">
            <span className="font-semibold">Words: {nWords}</span>
            <input type="range" min={4} max={8} value={nWords} onChange={(e) => setNWords(Number(e.target.value))} className="mt-2 block w-full accent-[var(--brand)]" />
          </label>
          <label className="text-sm">
            <span className="font-semibold">Separator</span>
            <select value={sep} onChange={(e) => setSep(e.target.value)} className="mt-1.5 block h-10 w-full rounded-xl border border-line bg-elevated px-3">
              <option value="-">Hyphen ( - )</option>
              <option value=" ">Space</option>
              <option value=".">Dot ( . )</option>
              <option value="_">Underscore ( _ )</option>
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={cap} onChange={(e) => setCap(e.target.checked)} className="h-4 w-4 accent-[var(--brand)]" /> Capitalize words
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={num} onChange={(e) => setNum(e.target.checked)} className="h-4 w-4 accent-[var(--brand)]" /> Add a number
          </label>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button onClick={() => { setGenerated(generatePassphrase(nWords, sep, cap, num)); setCopied(false); }} data-testid="generate">
            Generate
          </Button>
          <Button
            variant="secondary"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(generated);
                setCopied(true);
              } catch {}
            }}
          >
            {copied ? "Copied ✓" : "Copy"}
          </Button>
          <Button variant="ghost" onClick={() => setPw(generated)} data-testid="test-generated">
            Test it in the meter ↑
          </Button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3" aria-label="Password tips">
        {[
          { t: "Length wins", b: "15+ characters. Four to six random words beat short, complex passwords." },
          { t: "One per account", b: "Never reuse. A password manager remembers them for you." },
          { t: "Add MFA or passkeys", b: "Even a great password can be phished. Passkeys can’t be." },
        ].map((x) => (
          <div key={x.t} className="rounded-2xl bg-sunken p-5">
            <p className="font-semibold">{x.t}</p>
            <p className="mt-1 text-sm text-muted">{x.b}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
