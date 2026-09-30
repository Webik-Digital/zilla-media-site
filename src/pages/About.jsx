import { useEffect, useRef } from "react";
import Button from "../components/Button";
import { gsap, SplitText, prefersReducedMotion } from "../lib/gsapSetup";
import PageIntro from "../components/PageIntro";
import FooterCTA from "../components/sections/FooterCTA";
import Team from "../components/sections/Team";
import Placeholder from "../components/Placeholder";
import { MARK_PATH } from "../lib/zillaMark";
import { about } from "../data/site";

// [placeholder] figures — invented to carry the layout. Nothing on
// zillamedia.co publishes numbers, so none of these are verified.
const stats = [
  { v: "40+", l: "Brands launched" },
  { v: "1.2K+", l: "Assets shipped a year" },
  { v: "4.1x", l: "Average return on ad spend" },
  { v: "8", l: "Channels covered" },
];

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
            start: "top 80%",
            end: "bottom 55%",
            scrub: 0.6,
          },
        }
      );

      gsap.fromTo(
        ".ab-item",
        { y: 34, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: ".ab-grid", start: "top 82%" },
        }
      );

      gsap.fromTo(
        ".ab-reveal",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: ".ab-reveal", start: "top 86%" },
        }
      );

      gsap.to(".ab-mark", {
        rotate: 180,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.2,
        },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <main ref={rootRef} className="relative bg-ink">
      <PageIntro
        eyebrow="About us"
        title={"An agency built\nto disrupt the\nstatus quo."}
      />

      <section className="relative px-5 py-24 md:px-10 md:py-36">
        <svg
          viewBox="0 0 100 100"
          aria-hidden
          className="ab-mark pointer-events-none absolute right-[-8vw] top-10 h-[52vw] w-[52vw] opacity-[0.045]"
        >
          <path d={MARK_PATH} fill="#00ce00" />
        </svg>

        <p
          ref={copyRef}
          className="display relative max-w-[20ch] text-[clamp(1.8rem,4.6vw,3.8rem)] text-mist-500"
        >
          Zilla Media is your partner in transformation. Bold branding, AI
          innovation, powerful content, and next-level web and ad strategy,
          aligned with your ambition.
        </p>
      </section>

      {/* Who we are ---------------------------------------------------------- */}
      <section className="border-t border-mist-600 px-5 py-20 md:px-10 md:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
          <p className="ab-reveal label text-mist-400">{about.whoWeAre.label}</p>
          <div>
            <p className="ab-reveal display max-w-[26ch] text-[clamp(1.3rem,2.7vw,2.1rem)] leading-[1.35] text-mist-100">
              {about.whoWeAre.body}
            </p>
            <p className="ab-reveal mt-8 text-base text-zilla">{about.whoWeAre.kicker}</p>
          </div>
        </div>
      </section>

      {/* Mission / Vision ---------------------------------------------------- */}
      <section className="grid gap-px border-t border-mist-600 bg-mist-600 md:grid-cols-2">
        {about.missionVision.map((m) => (
          <div key={m.title} className="ab-reveal bg-ink px-5 py-16 md:px-10 md:py-24">
            <h2 className="display text-2xl text-zilla md:text-3xl">{m.title}</h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-mist-300">{m.body}</p>
          </div>
        ))}
      </section>

      {/* Principles — real copy from the live About page --------------------- */}
      <section className="ab-grid grid gap-x-10 gap-y-12 border-t border-mist-600 px-5 py-20 md:grid-cols-3 md:px-10 md:py-28">
        {about.principles.map((p, i) => (
          <div key={p.title} className="ab-item border-t border-mist-600 pt-6">
            <p className="label mb-4 text-mist-400">{String(i + 1).padStart(2, "0")}</p>
            <h2 className="display text-2xl text-mist-100 md:text-3xl">{p.title}</h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-mist-300">{p.body}</p>
          </div>
        ))}
      </section>

      {/* Team — the same reel as the homepage, one component for both, so
          the people can't drift apart between the two pages. This replaced
          a placeholder that named only Michael Siervo. */}
      <div className="border-t border-mist-600">
        <Team />
      </div>

      <Placeholder note="Unverified figures — none of these are published by Zilla Media">
        <section className="grid gap-8 border-t border-mist-600 px-5 py-16 md:grid-cols-4 md:px-10 md:py-24">
          {stats.map((s) => (
            <div key={s.l} className="ab-item">
              <p className="display text-[clamp(2.4rem,5vw,4rem)] text-mist-100">{s.v}</p>
              <p className="label mt-2 text-mist-400">{s.l}</p>
            </div>
          ))}
        </section>
      </Placeholder>

      {/* Close ---------------------------------------------------------------- */}
      <section className="border-t border-mist-600 px-5 py-20 md:px-10 md:py-28">
        <div className="ab-reveal max-w-3xl">
          <h2 className="display text-[clamp(1.9rem,5vw,3.6rem)] text-mist-100">
            {about.close.title}
          </h2>
          <p className="mt-6 text-base leading-relaxed text-mist-300">{about.close.body}</p>
          <Button to={about.close.cta.to} surface="dark" className="mt-10">
            {about.close.cta.label}
          </Button>
        </div>
      </section>

      <FooterCTA />
    </main>
  );
}
