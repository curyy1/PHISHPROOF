"use client";

import { m } from "framer-motion";
import type { ReactNode } from "react";

/** Page transition: a short fade + rise on every navigation (disabled under reduced motion via MotionConfig). */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <m.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </m.div>
  );
}
