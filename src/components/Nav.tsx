"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { clsx } from "clsx";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { buttonClass } from "./ui/Button";

export type NavUser = { displayName: string; role: "student" | "teacher" | "admin" } | null;

const links = [
  { href: "/learn", label: "Learn" },
  { href: "/practice", label: "Practice" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/leaderboard", label: "Leaderboard" },
];

export function Nav({ user, authEnabled }: { user: NavUser; authEnabled: boolean }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on navigation.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset UI when the route changes
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const allLinks = user && user.role !== "student" ? [...links, { href: "/teach", label: "Teach" }] : links;
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="no-print sticky top-0 z-50">
      {/* Frosted backdrop fades in and "shrinks" (scaleY) as you scroll. Only transform + opacity animate. */}
      <div
        aria-hidden
        className={clsx(
          "glass absolute inset-0 origin-top border-b border-line transition-[opacity,transform] duration-300 ease-out",
          scrolled ? "scale-y-100 opacity-100" : "scale-y-[1.15] opacity-0",
        )}
      />
      <nav
        aria-label="Main"
        className={clsx(
          "container-page relative flex h-14 items-center justify-between gap-4 transition-transform duration-300 ease-out",
          scrolled ? "translate-y-0" : "translate-y-1",
        )}
      >
        <Link href="/" className="rounded-lg text-[1.05rem]" aria-label="Phishproof home">
          <Logo className={clsx("origin-left transition-transform duration-300", scrolled ? "scale-95" : "scale-100")} />
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {allLinks.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                aria-current={isActive(l.href) ? "page" : undefined}
                className={clsx(
                  "rounded-full px-3 py-1.5 text-sm transition-colors",
                  isActive(l.href) ? "bg-sunken font-semibold text-fg" : "text-muted hover:text-fg",
                )}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          {authEnabled &&
            (user ? (
              <Link
                href="/account"
                className="hidden items-center gap-2 rounded-full py-1 pl-1 pr-3 text-sm font-medium hover:bg-sunken sm:inline-flex"
                aria-label={`Account settings for ${user.displayName}`}
              >
                <span
                  aria-hidden
                  className="grid h-7 w-7 place-items-center rounded-full bg-brand text-xs font-bold text-brand-fg"
                >
                  {user.displayName.slice(0, 1).toUpperCase()}
                </span>
                <span className="max-w-[9rem] truncate">{user.displayName}</span>
              </Link>
            ) : (
              <>
                <Link href="/login" className="hidden rounded-full px-3 py-1.5 text-sm text-muted hover:text-fg sm:inline-block">
                  Sign in
                </Link>
                <Link href="/signup" className={buttonClass("primary", "sm", "hidden sm:inline-flex")}>
                  Start free
                </Link>
              </>
            ))}
          <button
            ref={menuButton}
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <path d={open ? "M6 6l12 12" : "M4 8h16"} />
              <path d={open ? "M18 6L6 18" : "M4 16h16"} />
            </svg>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <m.div
            id="mobile-menu"
            key="menu"
            className="glass fixed inset-x-0 bottom-0 top-14 z-40 border-t border-line md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ul className="container-page flex flex-col gap-1 pt-6">
              {allLinks.map((l, i) => (
                <m.li
                  key={l.href}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.03 * i, duration: 0.25 }}
                >
                  <Link
                    href={l.href}
                    aria-current={isActive(l.href) ? "page" : undefined}
                    className="block rounded-2xl px-3 py-3 font-display text-3xl font-semibold tracking-tight"
                  >
                    {l.label}
                  </Link>
                </m.li>
              ))}
              {authEnabled && (
                <li className="mt-6 flex gap-3 px-3">
                  {user ? (
                    <Link href="/account" className={buttonClass("secondary", "md")}>
                      Account
                    </Link>
                  ) : (
                    <>
                      <Link href="/signup" className={buttonClass("primary", "md")}>
                        Start free
                      </Link>
                      <Link href="/login" className={buttonClass("secondary", "md")}>
                        Sign in
                      </Link>
                    </>
                  )}
                </li>
              )}
            </ul>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}
