"use client";

import { useState } from "react";
import { Button } from "./ui/Button";

export function CopyLink({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="mt-3 flex flex-col gap-2 sm:flex-row">
      <input readOnly value={value} aria-label="Verification link" className="h-11 min-w-0 flex-1 rounded-xl border border-line bg-sunken px-3 font-mono text-sm" onFocus={(e) => e.currentTarget.select()} />
      <Button
        variant="secondary"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
          } catch {}
        }}
      >
        {copied ? "Copied ✓" : "Copy link"}
      </Button>
    </div>
  );
}
