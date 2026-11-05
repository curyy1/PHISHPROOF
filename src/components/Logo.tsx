import { clsx } from "clsx";

/** Phishproof mark: a shield with a fishing hook that's been "caught". Original artwork. */
export function LogoMark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={clsx("shrink-0", className)}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <defs>
        <linearGradient id="pp-shield" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3b5bff" />
          <stop offset="1" stopColor="#7c4dff" />
        </linearGradient>
      </defs>
      <path
        d="M16 2.25 27.25 6.4v8.45c0 7.05-4.7 12.6-11.25 14.9C9.45 27.45 4.75 21.9 4.75 14.85V6.4L16 2.25Z"
        fill="url(#pp-shield)"
      />
      <path
        d="M16 2.25 27.25 6.4v8.45c0 7.05-4.7 12.6-11.25 14.9C9.45 27.45 4.75 21.9 4.75 14.85V6.4L16 2.25Z"
        fill="none"
        stroke="#fff"
        strokeOpacity=".18"
      />
      <circle cx="17.4" cy="8.6" r="1.55" fill="none" stroke="#fff" strokeWidth="1.6" />
      <path
        d="M17.4 10.2v7.3a3.55 3.55 0 0 1-7.1 0v-1.9l-1.7 1.7"
        fill="none"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="m19.6 20.6 1.5 1.5 3-3.4" fill="none" stroke="#9ff2c4" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={clsx("inline-flex items-center gap-2 font-display font-semibold tracking-tight", className)}>
      <LogoMark className="h-7 w-7" />
      <span>Phishproof</span>
    </span>
  );
}
