import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "../lib/gsapSetup";

/**
 * Shared masthead for the inner pages: eyebrow, oversized title that rolls up
 * out of a clip mask, and an optional lede. Keeps every route opening on the
 * same beat as the homepage hero.
 */
export default function PageIntro({ eyebrow, title, lede, children }) {
  const rootRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "expo.out" }, delay: 0.15 })
        .fromTo(
          ".pi-line-inner",
          { yPercent: 135 },
          { yPercent: 0, duration: 1.15, stagger: 0.08 }
        )
        .fromTo(
          ".pi-fade",
          { y: 22, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.85, stagger: 0.07 },
          "-=0.7"
        );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <header
      ref={rootRef}
      className="relative px-5 pb-16 pt-36 md:px-10 md:pb-24 md:pt-48"
    >
      {eyebrow && <p className="pi-fade label mb-8 text-mist-400">{eyebrow}</p>}
      <h1 className="display max-w-[14ch] text-[clamp(2.6rem,9vw,7.5rem)] text-mist-100">
        {title.split("\n").map((line) => (
          <span key={line} className="line-clip">
            <span className="pi-line-inner block">{line}</span>
          </span>
        ))}
      </h1>
      {lede && (
        <p className="pi-fade mt-10 max-w-2xl text-base leading-relaxed text-mist-300 md:text-lg">
          {lede}
        </p>
      )}
      {children}
    </header>
  );
}
