"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useToast } from "./Toaster";

const MESSAGES: Record<string, { title: string; body?: string; icon: string }> = {
  "welcome=1": { title: "Welcome to Phishproof! 🎉", body: "Your progress now saves to your account.", icon: "👋" },
  "password=updated": { title: "Password updated", body: "Use your new passphrase next time you sign in.", icon: "🔐" },
  "deleted=1": { title: "Account deleted", body: "Your account and all progress were permanently removed.", icon: "🗑️" },
};

/** Shows a one-time toast for ?welcome=1 etc. after redirects, then cleans the URL. */
export function FlashMessages() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  useEffect(() => {
    let changed = false;
    const next = new URLSearchParams(params.toString());
    for (const [key, msg] of Object.entries(MESSAGES)) {
      const [k, v] = key.split("=");
      if (params.get(k) === v) {
        toast(msg);
        next.delete(k);
        changed = true;
      }
    }
    if (changed) router.replace(next.size ? `${pathname}?${next}` : pathname, { scroll: false });
  }, [params, pathname, router, toast]);
  return null;
}
