import { useEffect, useRef } from "react";
import Button from "../Button";
import { gsap, prefersReducedMotion } from "../../lib/gsapSetup";
import { umwad } from "../../data/site";

/**
 * A full-bleed campaign feature. The image is three real portraits pasted on a
 * concrete wall, and it is here because it is the most human thing in the
 * portfolio — the direct answer to the site reading as a cold AI business.
 *
 * The image gets a slow parallax rise rather than any effect of its own: the
 * faces are the point, and anything clever layered over them competes.
 */
export default function UmwadFeature() {
  const rootRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      // Oversized image drifts inside its frame. Scale first so the travel
      // never exposes an edge.
      gsap.fromTo(
        ".um-img",
        { yPercent: -6 },
        {
          yPercent: 6,
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        }
      );

      gsap.fromTo(
        ".um-line",
        { yPercent: 120 },
        {
          yPercent: 0,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.1,
          scrollTrigger: { trigger: rootRef.current, start: "top 70%" },
        }
      );

      gsap.fromTo(
        ".um-fade",
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.09,
          scrollTrigger: { trigger: rootRef.current, start: "top 62%" },
        }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="relative z-10 overflow-hidden bg-ink">
      <div className="relative h-[78svh] min-h-[520px] w-full overflow-hidden">
        <img
          src={umwad.image}
          alt="UMWAD campaign posters on a concrete wall"
          loading="lazy"
          className="um-img absolute inset-0 h-[112%] w-full object-cover"
        />
        {/* Grounds the type without washing the faces out. */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-ink/10" />

        <div className="absolute inset-x-0 bottom-0 px-5 pb-12 md:px-10 md:pb-16">
          <p className="um-fade label mb-5 text-zilla">{umwad.label}</p>
          <h2 className="display max-w-[14ch] text-[clamp(2.2rem,7vw,5.5rem)] leading-[0.95] text-mist-100">
            <span className="line-clip">
              <span className="um-line block">{umwad.title}</span>
            </span>
          </h2>
        </div>
      </div>

      <div className="grid gap-10 px-5 py-16 md:grid-cols-[1.1fr_0.9fr] md:gap-16 md:px-10 md:py-24">
        <p className="um-fade max-w-xl text-base leading-relaxed text-mist-300">
          {umwad.body}
        </p>

        <div className="um-fade">
          <ul className="border-t border-mist-600">
            {umwad.lines.map((l) => (
              <li
                key={l}
                className="border-b border-mist-600 py-4 text-mist-200"
              >
                {l}
              </li>
            ))}
          </ul>
          <Button to={umwad.cta.to} surface="dark" className="mt-8">
            {umwad.cta.label}
          </Button>
        </div>
      </div>
    </section>
  );
}
