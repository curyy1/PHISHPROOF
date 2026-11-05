"use client";

import { useActionState } from "react";
import { joinClassAction, redeemTeacherCodeAction, updateProfileAction, type FormState } from "@/app/actions/account";
import { deleteAccountAction, type AuthState } from "@/app/actions/auth";
import { Button } from "@/components/ui/Button";
import { Field, FormMessage } from "@/components/ui/Field";

export function ProfileForm({ displayName, fullName, optIn }: { displayName: string; fullName: string; optIn: boolean }) {
  const [state, action, pending] = useActionState<FormState, FormData>(updateProfileAction, undefined);
  return (
    <form action={action} className="space-y-4">
      <Field id="displayName" name="displayName" label="Display name" defaultValue={displayName} maxLength={32} required hint="Shown on the leaderboard (if you opt in) and to your teacher." />
      <Field id="fullName" name="fullName" label="Name for your certificate" defaultValue={fullName} maxLength={80} hint="Only printed on your certificate. Leave blank until you need it." />
      <label className="flex items-start gap-3 rounded-2xl bg-sunken p-4 text-sm">
        <input type="checkbox" name="optIn" defaultChecked={optIn} className="mt-0.5 h-4 w-4 accent-[var(--brand)]" />
        <span>
          <span className="font-semibold">Show me on the public leaderboard</span>
          <span className="block text-muted">Only your display name and XP are shown. You can turn this off anytime.</span>
        </span>
      </label>
      <FormMessage error={state?.error} message={state?.message} />
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save profile"}
      </Button>
    </form>
  );
}

export function JoinClassForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(joinClassAction, undefined);
  return (
    <form action={action} className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <Field id="code" name="code" label="Class code" placeholder="e.g. K7MP2Q" className="flex-1" autoCapitalize="characters" maxLength={6} required />
        <Button type="submit" disabled={pending}>
          Join class
        </Button>
      </div>
      <FormMessage error={state?.error} message={state?.message} />
    </form>
  );
}

export function TeacherCodeForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(redeemTeacherCodeAction, undefined);
  return (
    <form action={action} className="space-y-3">
      <Field id="teacherCode" name="code" type="password" label="Teacher invite code" autoComplete="off" required />
      <FormMessage error={state?.error} message={state?.message} />
      <Button type="submit" variant="secondary" disabled={pending}>
        Unlock teacher tools
      </Button>
    </form>
  );
}

export function DeleteAccountForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(deleteAccountAction, undefined);
  return (
    <form action={action} className="space-y-3">
      <Field id="confirm" name="confirm" label='Type "DELETE" to permanently delete your account and all progress' autoComplete="off" required />
      <FormMessage error={state?.error} />
      <Button type="submit" variant="danger" disabled={pending}>
        {pending ? "Deleting…" : "Delete my account"}
      </Button>
    </form>
  );
}
