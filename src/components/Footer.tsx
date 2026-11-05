import Link from "next/link";
import { Logo } from "./Logo";

const cols = [
  {
    title: "Course",
    links: [
      { href: "/learn", label: "All modules" },
      { href: "/learn/what-is-phishing", label: "Start Module 1" },
      { href: "/exam", label: "Final exam" },
    ],
  },
  {
    title: "Practice",
    links: [
      { href: "/practice/inbox", label: "Spot the Phish" },
      { href: "/practice/sms", label: "Text simulator" },
      { href: "/practice/browser", label: "Fake login drill" },
      { href: "/practice/urls", label: "URL inspector" },
      { href: "/practice/passwords", label: "Password lab" },
    ],
  },
  {
    title: "Phishproof",
    links: [
      { href: "/privacy", label: "How we protect your data" },
      { href: "/leaderboard", label: "Leaderboard" },
      { href: "/teach", label: "For teachers" },
      { href: "/verify", label: "Verify a certificate" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="no-print mt-24 border-t border-line bg-elevated">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo className="text-lg" />
          <p className="mt-3 max-w-xs text-sm text-muted">
            A free course that teaches you to spot phishing before it spots you. Every scam you see here is fake and uses
            reserved example domains.
          </p>
        </div>
        {cols.map((c) => (
          <nav key={c.title} aria-label={c.title}>
            <h2 className="text-sm font-semibold">{c.title}</h2>
            <ul className="mt-3 space-y-2">
              {c.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-muted hover:text-fg">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="container-page border-t border-line py-6 text-xs text-subtle">
        © {new Date().getFullYear()} Phishproof. Educational project. All brands in simulations are fictional.
      </div>
    </footer>
  );
}
