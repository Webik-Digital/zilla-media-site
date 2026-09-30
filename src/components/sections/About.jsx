import { useEffect, useRef } from "react";
import Button from "../Button";
import { gsap, ScrollTrigger, SplitText, prefersReducedMotion } from "../../lib/gsapSetup";
import { about } from "../../data/site";

/**
 * The statement. Words are split and scrubbed from near-black to white as the
 * section crosses the viewport, so the sentence appears to be written by the
 * scroll itself — meanwhile the shattered mark drifts behind it.
 */
export default function About() {
  const rootRef = useRef(null);
  const copyRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const split = new SplitText(copyRef.current, { type: "words" });

      gsap.fromTo(
        split.words,
        { color: "#26262400" },
        {
          color: "#f2f2f0",
          ease: "none",
          stagger: 1,
          scrollTrigger: {
            trigger: copyRef.current,
            start: "top 78%",
            end: "bottom 52%",
            scrub: 0.6,
          },
        }
      );

      gsap.fromTo(
        ".about-meta",
        { y: 32, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: ".about-meta-row", start: "top 88%" },
        }
      );

      return () => split.revert();
    }, rootRef);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative z-10 flex min-h-[110svh] flex-col justify-center px-5 py-32 md:px-10"
    >
      <p className="label mb-12 text-mist-400 md:mb-20">{about.label}</p>

      <p
        ref={copyRef}
        className="display max-w-[22ch] text-[clamp(1.9rem,5.1vw,4.4rem)] text-mist-500 md:max-w-[24ch]"
      >
        {about.body}
      </p>

      <div className="about-meta-row mt-20 grid gap-10 border-t border-mist-600 pt-8 md:mt-32 md:grid-cols-2">
        <p className="about-meta label whitespace-pre-line leading-loose text-mist-200">
          {about.colLeft}
        </p>
        <div className="about-meta md:justify-self-end md:text-right">
          <p className="max-w-md text-sm leading-relaxed text-mist-300">
            {about.colRight}
          </p>
          <Button to={about.link.to} surface="dark" className="mt-6">
            {about.link.label}
          </Button>
        </div>
      </div>
    </section>
  );
}
