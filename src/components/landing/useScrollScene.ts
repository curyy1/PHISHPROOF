"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Builds a scrubbed GSAP timeline for a "pinned" scroll scene.
 * The section is tall (e.g. 300vh) and contains a CSS `position: sticky` stage,
 * so scroll progress 0→1 through the section drives the timeline.
 *
 * - Only transform/opacity are animated by the scene builders.
 * - With prefers-reduced-motion the timeline is never created, so the content
 *   stays in its final, fully visible state (no hidden-until-scrolled content).
 */
export function useScrollScene(
  sectionRef: RefObject<HTMLElement | null>,
  build: (tl: gsap.core.Timeline, q: (sel: string) => Element[]) => void,
) {
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const q = gsap.utils.selector(section);
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: section, start: "top top", end: "bottom bottom", scrub: 0.6 },
      });
      build(tl, q);
    });
    return () => mm.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- build is static per scene
  }, [sectionRef]);
}
