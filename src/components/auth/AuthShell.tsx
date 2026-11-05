import Link from "next/link";
import type { ReactNode } from "react";
import { LogoMark } from "@/components/Logo";

export function AuthShell({ title, subtitle, children, footer }: { title: string; subtitle?: string; children: ReactNode; footer?: ReactNode }) {
  return (
    <div className="container-page flex min-h-[80dvh] items-start justify-center py-12 sm:items-center">
      <div className="w-full max-w-md">
        <div className="text-center">
          <LogoMark className="mx-auto h-12 w-12" />
          <h1 className="mt-5 text-headline font-bold">{title}</h1>
          {subtitle && <p className="mt-2 text-muted">{subtitle}</p>}
        </div>
        <div className="card mt-8 p-6 sm:p-8">{children}</div>
        {footer && <div className="mt-6 text-center text-sm text-muted">{footer}</div>}
        <p className="mt-6 text-center text-xs text-subtle">
          <Link href="/privacy" className="underline underline-offset-2 hover:text-fg">
            How Phishproof protects your data
          </Link>
        </p>
      </div>
    </div>
  );
}

export function AuthDisabled() {
  return (
    <div className="space-y-4 text-center">
      <p className="text-muted">
        Accounts aren’t switched on for this copy of Phishproof yet. Everything still works in guest mode — your progress is
        saved in this browser.
      </p>
      <Link href="/learn" className="inline-flex h-11 items-center rounded-full bg-brand px-5 font-semibold text-brand-fg">
        Start learning
      </Link>
    </div>
  );
}
