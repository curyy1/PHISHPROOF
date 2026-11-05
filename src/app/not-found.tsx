import Link from "next/link";
import { LogoMark } from "@/components/Logo";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="container-prose py-24 text-center">
      <LogoMark className="mx-auto h-14 w-14" />
      <p className="mt-6 font-display text-display font-extrabold text-gradient">404</p>
      <h1 className="mt-2 text-headline font-bold">This link went nowhere.</h1>
      <p className="mt-3 text-lead text-muted">
        Unlike a phishing link, at least it was honest about it. Check the address, or head somewhere useful:
      </p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <ButtonLink href="/learn">Go to the course</ButtonLink>
        <ButtonLink href="/practice" variant="secondary">Practice</ButtonLink>
      </div>
      <p className="mt-8 text-sm text-subtle">
        Got here from a message you weren’t expecting? <Link href="/learn/reading-links/url-anatomy" className="text-brand underline">Learn to read links</Link>.
      </p>
    </div>
  );
}
