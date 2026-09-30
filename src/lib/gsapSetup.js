import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Handy for inspecting or slowing timelines from the console while tuning
// motion — `__gsap.globalTimeline.timeScale(0.2)`.
if (import.meta.env.DEV) window.__gsap = gsap;

export { gsap, ScrollTrigger, SplitText };
