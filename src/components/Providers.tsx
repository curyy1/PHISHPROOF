"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";
import { ThemeProvider } from "./ThemeProvider";
import { ToastProvider } from "./Toaster";
import { ProgressProvider } from "./ProgressProvider";

export function Providers({ children, signedIn, authEnabled }: { children: ReactNode; signedIn: boolean; authEnabled: boolean }) {
  return (
    <ThemeProvider>
      {/* reducedMotion="user": Framer Motion skips transform animations when the OS asks for reduced motion. */}
      <MotionConfig reducedMotion="user">
        <ToastProvider>
          <ProgressProvider signedIn={signedIn} authEnabled={authEnabled}>
            {children}
          </ProgressProvider>
        </ToastProvider>
      </MotionConfig>
    </ThemeProvider>
  );
}
