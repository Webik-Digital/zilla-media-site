import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../lib/gsapSetup";

/**
 * Module-level handle so anything (the menu overlay, route changes) can lock
 * or jump the scroll without threading a ref through the whole tree.
 */
let lenisInstance = null;

export const lockScroll = () => lenisInstance?.stop();
export const unlockScroll = () => lenisInstance?.start();
export const scrollToTop = () => {
  if (lenisInstance) lenisInstance.scrollTo(0, { immediate: true });
  else window.scrollTo(0, 0);
};

/**
 * Wires Lenis (smooth momentum scroll) into GSAP's ticker so ScrollTrigger
 * stays in sync with the smoothed scroll position. Skipped entirely under
 * prefers-reduced-motion — native scroll behaves normally.
 */
export default function useSmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });
    lenisInstance = lenis;
    // Handy when debugging scroll-driven scenes from the console.
    if (import.meta.env.DEV) window.__lenis = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);
}
