"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { getMyProgress, importGuestProgress, recordEvent } from "@/app/actions/progress";
import { applyEvent, badgeById, emptyState, gradeEvent, toDayString, type GradedEvent, type ProgressState, type RawEvent } from "@/lib/progress";
import type { GuestLogEntry } from "@/lib/progress/validation";
import { useToast } from "./Toaster";

const GUEST_KEY = "pp-guest-v1";
type GuestStore = { state: ProgressState; log: GuestLogEntry[] };

function readGuest(): GuestStore | null {
  try {
    const raw = localStorage.getItem(GUEST_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as GuestStore;
    if (parsed?.state?.version !== 1 || !Array.isArray(parsed.log)) return null;
    return parsed;
  } catch {
    return null;
  }
}
function writeGuest(store: GuestStore | null) {
  try {
    if (store) localStorage.setItem(GUEST_KEY, JSON.stringify(store));
    else localStorage.removeItem(GUEST_KEY);
  } catch {}
}

export type SubmitOutcome = { graded: GradedEvent; xpGained: number; newBadges: string[] } | { error: string };

type Ctx = {
  state: ProgressState | null;
  loading: boolean;
  signedIn: boolean;
  authEnabled: boolean;
  /** Guest progress waiting to be saved to the account. */
  pendingGuestImport: number;
  submit: (e: RawEvent) => Promise<SubmitOutcome>;
  importGuest: () => Promise<void>;
  discardGuest: () => void;
};

const ProgressContext = createContext<Ctx | null>(null);

export function ProgressProvider({ children, signedIn, authEnabled }: { children: ReactNode; signedIn: boolean; authEnabled: boolean }) {
  const [state, setState] = useState<ProgressState | null>(null);
  const [loading, setLoading] = useState(true);
  const [pendingGuestImport, setPendingGuestImport] = useState(0);
  const { toast } = useToast();
  const queue = useRef<Promise<unknown>>(Promise.resolve());

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (signedIn) {
        const s = await getMyProgress().catch(() => null);
        if (cancelled) return;
        setState(s ?? emptyState());
        setPendingGuestImport(readGuest()?.log.length ?? 0);
      } else {
        setState(readGuest()?.state ?? emptyState());
        setPendingGuestImport(0);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [signedIn]);

  const celebrate = useCallback(
    (xp: number, badges: string[]) => {
      if (xp > 0) toast({ title: `+${xp} XP`, icon: "✨" });
      for (const id of badges) {
        const b = badgeById.get(id);
        if (b) toast({ title: `Badge unlocked: ${b.name}`, body: b.description, icon: b.icon });
      }
    },
    [toast],
  );

  const submit = useCallback(
    (e: RawEvent): Promise<SubmitOutcome> => {
      // Serialize submissions so XP/badge logic always sees the latest state.
      const run = async (): Promise<SubmitOutcome> => {
        const day = toDayString(new Date());
        if (signedIn) {
          const r = await recordEvent(e, day);
          if (!r.ok) return { error: r.error };
          setState(r.state);
          celebrate(r.xpGained, r.newBadges);
          return { graded: r.graded, xpGained: r.xpGained, newBadges: r.newBadges };
        }
        let graded: GradedEvent;
        try {
          graded = gradeEvent(e);
        } catch {
          return { error: "Unknown item." };
        }
        const at = new Date().toISOString();
        const store = readGuest() ?? { state: emptyState(), log: [] };
        const result = applyEvent(store.state, graded, at, day);
        writeGuest({ state: result.state, log: [...store.log, { event: e, at, day }].slice(-800) });
        setState(result.state);
        celebrate(result.xpGained, result.newBadges);
        return { graded, xpGained: result.xpGained, newBadges: result.newBadges };
      };
      const p = queue.current.then(run, run);
      queue.current = p.catch(() => {});
      return p;
    },
    [signedIn, celebrate],
  );

  const importGuest = useCallback(async () => {
    const store = readGuest();
    if (!store) return;
    const r = await importGuestProgress(store.log);
    if (r.ok) {
      writeGuest(null);
      setPendingGuestImport(0);
      setState(r.state);
      toast({ title: "Guest progress saved to your account", body: r.xpGained ? `+${r.xpGained} XP` : undefined, icon: "💾" });
    } else {
      toast({ title: "Couldn’t import guest progress", body: r.error, icon: "⚠️" });
    }
  }, [toast]);

  const discardGuest = useCallback(() => {
    writeGuest(null);
    setPendingGuestImport(0);
  }, []);

  const value = useMemo(
    () => ({ state, loading, signedIn, authEnabled, pendingGuestImport, submit, importGuest, discardGuest }),
    [state, loading, signedIn, authEnabled, pendingGuestImport, submit, importGuest, discardGuest],
  );
  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used inside ProgressProvider");
  return ctx;
}
