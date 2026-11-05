import { ButtonLink } from "@/components/ui/Button";
import { LogoMark } from "@/components/Logo";

/** Shown to guests on content that needs a free account. */
export function AccountGate({ next, title = "Create a free account to keep going" }: { next: string; title?: string }) {
  return (
    <div className="container-prose py-20 text-center">
      <LogoMark className="mx-auto h-14 w-14" />
      <h1 className="mt-6 text-headline font-bold">{title}</h1>
      <p className="mx-auto mt-3 max-w-md text-lead text-muted">
        Module 1 is free to try as a guest. A free account unlocks every module, the simulators, badges, and your certificate —
        and saves the progress you’ve already made.
      </p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <ButtonLink href={`/signup?next=${encodeURIComponent(next)}`} size="lg">
          Create free account
        </ButtonLink>
        <ButtonLink href={`/login?next=${encodeURIComponent(next)}`} variant="secondary" size="lg">
          Sign in
        </ButtonLink>
      </div>
    </div>
  );
}
