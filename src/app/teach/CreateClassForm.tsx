"use client";

import { useActionState } from "react";
import { createClassAction, type ClassFormState } from "@/app/actions/classes";
import { Button } from "@/components/ui/Button";
import { Field, FormMessage } from "@/components/ui/Field";

export function CreateClassForm() {
  const [state, action, pending] = useActionState<ClassFormState, FormData>(createClassAction, undefined);
  return (
    <form action={action} className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <Field id="name" name="name" label="New class name" placeholder="e.g. TSA Chapter — Fall 2026" className="flex-1" maxLength={60} required />
        <Button type="submit" disabled={pending}>
          {pending ? "Creating…" : "Create class"}
        </Button>
      </div>
      <FormMessage error={state?.error} />
    </form>
  );
}
