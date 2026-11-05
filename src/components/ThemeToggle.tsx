"use client";

import { useTheme, type ThemeChoice } from "./ThemeProvider";

const order: ThemeChoice[] = ["system", "light", "dark"];
const labels: Record<ThemeChoice, string> = { system: "System theme", light: "Light theme", dark: "Dark theme" };

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { choice, setChoice } = useTheme();
  const next = order[(order.indexOf(choice) + 1) % order.length];
  return (
    <button
      type="button"
      onClick={() => setChoice(next)}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-muted transition-transform hover:text-fg active:scale-90 ${className}`}
      aria-label={`${labels[choice]} (switch to ${labels[next].toLowerCase()})`}
      title={labels[choice]}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        {choice === "light" && (
          <>
            <circle cx="12" cy="12" r="4.2" />
            <path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6" strokeLinecap="round" />
          </>
        )}
        {choice === "dark" && <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" strokeLinejoin="round" />}
        {choice === "system" && (
          <>
            <rect x="3" y="4.5" width="18" height="12" rx="2" />
            <path d="M8.5 20h7M12 16.5V20" strokeLinecap="round" />
          </>
        )}
      </svg>
    </button>
  );
}
