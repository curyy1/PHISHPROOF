"use client";

import { domAnimation, LazyMotion, MotionConfig } from "framer-motion";
import { Suspense, type ReactNode } from "react";
import { ThemeProvider } from "./ThemeProvider";
import { ToastProvider } from "./Toaster";
import { ProgressProvider } from "./ProgressProvider";
import { ServiceWorker } from "./ServiceWorker";
import { FlashMessages } from "./FlashMessages";

export function Providers({ children, signedIn, authEnabled }: { children: ReactNode; signedIn: boolean; authEnabled: boolean }) {
  return (
    <ThemeProvider>
      {/* reducedMotion="user": Framer Motion skips transform animations when the OS asks for reduced motion. */}
      <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <ToastProvider>
          <ProgressProvider signedIn={signedIn} authEnabled={authEnabled}>
            <ServiceWorker />
            <Suspense fallback={null}>
              <FlashMessages />
            </Suspense>
            {children}
          </ProgressProvider>
        </ToastProvider>
      </MotionConfig>
      </LazyMotion>
    </ThemeProvider>
  );
}
