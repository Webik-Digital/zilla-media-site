import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "../../lib/gsapSetup";
import Placeholder from "../Placeholder";
import { brands } from "../../data/site";

/**
 * A logo wall, currently set in type.
 *
 * No logo files were supplied, so each cell renders the brand name as a
 * wordmark rather than leaving an empty box or reaching for a scraped image.
 * Every cell already branches on `logo`, so supplying files later is a data
 * change only.
 *
 * The grid is deliberately quiet: a logo wall earns its weight from the names,
 * and animating each cell would undercut them.
 */
export default function Brands() {
  const rootRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".br-cell",
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.07,
          scrollTrigger: { trigger: ".br-grid", start: "top 86%" },
        }
      );
      gsap.fromTo(
        ".br-line",
        { yPercent: 130 },
        {
          yPercent: 0,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.09,
          scrollTrigger: { trigger: rootRef.current, start: "top 78%" },
        }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      data-nav-theme="light"
      className="relative z-10 bg-paper-2 px-5 py-24 text-ink md:px-10 md:py-36"
    >
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6 md:mb-16">
          <h2 className="display max-w-[14ch] text-[clamp(1.9rem,5vw,4rem)] leading-[0.95]">
            {brands.title.split("\n").map((line) => (
              <span key={line} className="line-clip">
                <span className="br-line block">{line}</span>
              </span>
            ))}
          </h2>
          <p className="label max-w-xs text-mist-400">{brands.intro}</p>
        </div>

        <Placeholder note="Brand logos not supplied — names are set in type, and Ferrari's provenance is unconfirmed">
          <div className="br-grid grid grid-cols-2 gap-px border border-ink/10 bg-ink/10 md:grid-cols-4">
            {brands.items.map((b) => (
              <div
                key={b.name}
                className="br-cell group flex min-h-[7.5rem] items-center justify-center bg-paper-2 px-5 py-8 transition-colors duration-500 md:min-h-[10rem]"
              >
                {b.logo ? (
                  <img
                    src={b.logo}
                    alt={b.name}
                    loading="lazy"
                    className="max-h-10 w-auto max-w-[70%] opacity-60 grayscale transition-all duration-500 group-hover:opacity-100 group-hover:grayscale-0 md:max-h-14"
                  />
                ) : (
                  <span className="display text-center text-[clamp(1.05rem,2.1vw,1.7rem)] text-ink/45 transition-colors duration-500 group-hover:text-zilla">
                    {b.name}
                  </span>
                )}
              </div>
            ))}
          </div>
        </Placeholder>
      </div>
    </section>
  );
}
