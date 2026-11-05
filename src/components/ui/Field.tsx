import type { ComponentProps } from "react";

export function Field({
  label,
  hint,
  id,
  className = "",
  ...props
}: ComponentProps<"input"> & { label: string; hint?: string; id: string }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-semibold">
        {label}
      </label>
      <input
        id={id}
        aria-describedby={hint ? `${id}-hint` : undefined}
        className="mt-1.5 block h-12 w-full rounded-xl border border-line bg-elevated px-3.5 text-base text-fg shadow-sm transition-[border-color,box-shadow] placeholder:text-subtle focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/20"
        {...props}
      />
      {hint && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-muted">
          {hint}
        </p>
      )}
    </div>
  );
}

export function FormMessage({ error, message }: { error?: string; message?: string }) {
  if (!error && !message) return null;
  return (
    <p
      role={error ? "alert" : "status"}
      className={`rounded-xl px-3.5 py-2.5 text-sm ${error ? "bg-danger-soft text-danger-ink" : "bg-success-soft text-success-ink"}`}
    >
      {error ?? message}
    </p>
  );
}
