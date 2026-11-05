"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";
import { ThemeProvider } from "./ThemeProvider";
import { ToastProvider } from "./Toaster";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      {/* reducedMotion="user": Framer Motion skips transform animations when the OS asks for reduced motion. */}
      <MotionConfig reducedMotion="user">
        <ToastProvider>{children}</ToastProvider>
      </MotionConfig>
    </ThemeProvider>
  );
}
