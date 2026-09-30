import { useEffect, useRef } from "react";
import { gsap, SplitText, prefersReducedMotion } from "../../lib/gsapSetup";
import { MARK_PATH } from "../../lib/zillaMark";
import { statement } from "../../data/site";

/**
 * Brand statement, lifted from Zilla's own artwork. A dark interstitial that
 * resets the eye between the light work reel and the services act.
 *
 * The reveal deliberately doesn't use the site's clip masks: the line wraps
 * naturally at every width, so there's nothing to pre-split, and "STATUS QUO"
 * carries a Q whose tail would be sheared by a mask sized to the line box.
 * Words rise and sharpen out of a blur instead — no clipping involved.
 */
export default function Statement() {
  const rootRef = useRef(null);
  const copyRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const split = new SplitText(copyRef.current, { type: "words" });

      gsap.from(split.words, {
        yPercent: 45,
        opacity: 0,
        filter: "blur(9px)",
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.028,
        scrollTrigger: { trigger: copyRef.current, start: "top 78%" },
      });

      gsap.fromTo(
        ".st-meta",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: ".st-columns", start: "top 88%" },
        }
      );

      gsap.to(".st-mark", {
        yPercent: -18,
        rotate: 24,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
      });

      return () => split.revert();
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative z-10 overflow-hidden bg-ink px-5 py-28 md:px-10 md:py-40"
    >
      <svg
        viewBox="0 0 100 100"
        aria-hidden
        className="st-mark pointer-events-none absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 opacity-[0.035]"
      >
        <path d={MARK_PATH} fill="#00ce00" />
      </svg>

      <div className="relative mx-auto max-w-[1200px] text-center">
        <p
          ref={copyRef}
          className="display text-[clamp(1.9rem,5.6vw,4.6rem)] uppercase leading-[1.02] text-mist-100"
        >
          {statement.parts.map((part) => (
            <span
              key={part.text}
              className={
                part.accent
                  ? "text-zilla"
                  : part.italic
                    ? "italic text-mist-200"
                    : undefined
              }
            >
              {part.text}{" "}
            </span>
          ))}
        </p>

        <div className="st-columns mx-auto mt-16 grid max-w-4xl gap-8 text-left md:mt-24 md:grid-cols-2 md:gap-14">
          {statement.columns.map((col) => (
            <p
              key={col}
              className="st-meta text-sm leading-relaxed text-mist-300 md:text-base"
            >
              {col}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
