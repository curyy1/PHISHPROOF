import { Fragment, type ReactNode } from "react";

/**
 * Renders the tiny markdown subset used in course content: **bold**, *italic*, `code`.
 * Produces React elements only (never dangerouslySetInnerHTML), so content can't inject HTML.
 */
export function RichText({ text }: { text: string }) {
  return <>{parse(text)}</>;
}

const TOKEN = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*\s][^*]*\*)/g;

function parse(text: string): ReactNode[] {
  return text.split(TOKEN).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4)
      return <strong key={i} className="font-semibold text-fg">{part.slice(2, -2)}</strong>;
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2)
      return (
        <code key={i} className="rounded-md bg-sunken [overflow-wrap:anywhere] px-1.5 py-0.5 font-mono text-[0.88em] text-fg">
          {part.slice(1, -1)}
        </code>
      );
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) return <em key={i}>{part.slice(1, -1)}</em>;
    return <Fragment key={i}>{part}</Fragment>;
  });
}

/** Plain-text version (for aria-labels, metadata). */
export function plain(text: string) {
  return text.replace(/\*\*|`|\*/g, "");
}
