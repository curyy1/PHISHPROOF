"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import {
  forgotPasswordAction,
  googleAction,
  magicLinkAction,
  signInAction,
  signUpAction,
  updatePasswordAction,
  type AuthState,
} from "@/app/actions/auth";
import { Button } from "@/components/ui/Button";
import { Field, FormMessage } from "@/components/ui/Field";

function Submit({ pending, children }: { pending: boolean; children: string }) {
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending} aria-busy={pending}>
      {pending ? "Please wait…" : children}
    </Button>
  );
}

function GoogleButton({ next }: { next: string }) {
  return (
    <form action={googleAction}>
      <input type="hidden" name="next" value={next} />
      <Button type="submit" variant="secondary" size="lg" className="w-full">
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
          <path fill="#4285F4" d="M22.5 12.3c0-.8-.1-1.5-.2-2.3H12v4.3h5.9a5 5 0 0 1-2.2 3.3v2.7h3.6c2.1-1.9 3.2-4.8 3.2-8Z" />
          <path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.7c-1 .7-2.2 1-3.7 1-2.8 0-5.2-1.9-6.1-4.5H2.2v2.8A11 11 0 0 0 12 23Z" />
          <path fill="#FBBC05" d="M5.9 14.1a6.6 6.6 0 0 1 0-4.2V7.1H2.2a11 11 0 0 0 0 9.8l3.7-2.8Z" />
          <path fill="#EA4335" d="M12 5.4c1.6 0 3 .5 4.1 1.6l3.1-3.1A11 11 0 0 0 2.2 7.1l3.7 2.8C6.8 7.3 9.2 5.4 12 5.4Z" />
        </svg>
        Continue with Google
      </Button>
    </form>
  );
}

function Divider() {
  return (
    <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wide text-subtle" aria-hidden>
      <span className="h-px flex-1 bg-line" /> or <span className="h-px flex-1 bg-line" />
    </div>
  );
}

export function LoginForm({ next, google }: { next: string; google: boolean }) {
  const [mode, setMode] = useState<"password" | "magic">("password");
  const [state, action, pending] = useActionState<AuthState, FormData>(signInAction, undefined);
  const [mState, mAction, mPending] = useActionState<AuthState, FormData>(magicLinkAction, undefined);
  return (
    <div>
      {google && (
        <>
          <GoogleButton next={next} />
          <Divider />
        </>
      )}
      <div role="tablist" aria-label="Sign-in method" className="mb-5 grid grid-cols-2 rounded-full bg-sunken p-1 text-sm font-semibold">
        {(["password", "magic"] as const).map((m) => (
          <button
            key={m}
            role="tab"
            type="button"
            aria-selected={mode === m}
            onClick={() => setMode(m)}
            className={`rounded-full py-2 transition-colors ${mode === m ? "bg-elevated shadow-sm" : "text-muted"}`}
          >
            {m === "password" ? "Password" : "Email me a link"}
          </button>
        ))}
      </div>
      {mode === "password" ? (
        <form action={action} className="space-y-4" noValidate>
          <input type="hidden" name="next" value={next} />
          <Field id="email" name="email" type="email" label="Email" autoComplete="email" required defaultValue={state?.fields?.email} />
          <Field id="password" name="password" type="password" label="Password" autoComplete="current-password" required />
          <div className="text-right text-sm">
            <Link href="/forgot-password" className="text-brand hover:underline">
              Forgot password?
            </Link>
          </div>
          <FormMessage error={state?.error} message={state?.message} />
          <Submit pending={pending}>Sign in</Submit>
        </form>
      ) : (
        <form action={mAction} className="space-y-4" noValidate>
          <input type="hidden" name="next" value={next} />
          <Field id="magic-email" name="email" type="email" label="Email" autoComplete="email" required hint="We’ll email you a one-time sign-in link. No password needed." />
          <FormMessage error={mState?.error} message={mState?.message} />
          <Submit pending={mPending}>Send sign-in link</Submit>
        </form>
      )}
    </div>
  );
}

export function SignupForm({ next, google }: { next: string; google: boolean }) {
  const [state, action, pending] = useActionState<AuthState, FormData>(signUpAction, undefined);
  return (
    <div>
      {google && (
        <>
          <GoogleButton next={next} />
          <Divider />
        </>
      )}
      <form action={action} className="space-y-4" noValidate>
        <input type="hidden" name="next" value={next} />
        <Field
          id="displayName"
          name="displayName"
          label="Display name"
          autoComplete="nickname"
          required
          maxLength={32}
          defaultValue={state?.fields?.displayName}
          hint="Shown on the leaderboard if you opt in. Don’t use your full name."
        />
        <Field id="email" name="email" type="email" label="Email" autoComplete="email" required defaultValue={state?.fields?.email} />
        <Field
          id="password"
          name="password"
          type="password"
          label="Password"
          autoComplete="new-password"
          required
          minLength={15}
          hint="15+ characters. A passphrase like “maple orbit crayon thunder” is perfect."
        />
        <label className="flex items-start gap-2.5 text-sm text-muted">
          <input type="checkbox" name="agree" className="mt-0.5 h-4 w-4 accent-[var(--brand)]" required />
          <span>
            I’ve read{" "}
            <Link href="/privacy" className="text-brand underline-offset-2 hover:underline" target="_blank">
              how Phishproof protects my data
            </Link>
            . (Under 13? Ask a parent or teacher first.)
          </span>
        </label>
        <FormMessage error={state?.error} message={state?.message} />
        <Submit pending={pending}>Create free account</Submit>
      </form>
    </div>
  );
}

export function ForgotForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(forgotPasswordAction, undefined);
  return (
    <form action={action} className="space-y-4" noValidate>
      <Field id="email" name="email" type="email" label="Email" autoComplete="email" required />
      <FormMessage error={state?.error} message={state?.message} />
      <Submit pending={pending}>Send reset link</Submit>
    </form>
  );
}

export function ResetForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(updatePasswordAction, undefined);
  return (
    <form action={action} className="space-y-4" noValidate>
      <Field id="password" name="password" type="password" label="New password" autoComplete="new-password" minLength={15} required hint="15+ characters. Try a random 4–6 word passphrase." />
      <Field id="confirm" name="confirm" type="password" label="Confirm new password" autoComplete="new-password" required />
      <FormMessage error={state?.error} message={state?.message} />
      <Submit pending={pending}>Update password</Submit>
    </form>
  );
}
