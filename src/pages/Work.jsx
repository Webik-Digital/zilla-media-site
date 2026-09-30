import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "../lib/gsapSetup";
import PageIntro from "../components/PageIntro";
import FooterCTA from "../components/sections/FooterCTA";
import { work } from "../data/site";

export default function Work() {
  const rootRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".wk-card").forEach((card) => {
        gsap.fromTo(
          card,
          { yPercent: 14, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 88%" },
          }
        );
        // Slow counter-drift on the image inside its frame.
        gsap.fromTo(
          card.querySelector("img"),
          { yPercent: -7 },
          {
            yPercent: 7,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          }
        );
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <main ref={rootRef} className="relative bg-ink">
      <PageIntro
        /* Eyebrow removed by request, same as the homepage section. */
        title={"Brands built\nto be chosen."}
        lede="Identity systems, campaigns, platforms and product work: a cross-section of what happens when strategy and craft are handled by the same team."
      />

      <section className="grid gap-5 px-5 pb-24 md:grid-cols-2 md:gap-8 md:px-10 md:pb-36">
        {work.projects.map((p, i) => (
          <article
            key={p.slug}
            className={`wk-card group ${i % 3 === 0 ? "md:col-span-2" : ""}`}
          >
            <div
              className={`relative overflow-hidden bg-ink-3 ${
                i % 3 === 0 ? "aspect-[16/9]" : "aspect-[4/3]"
              }`}
              data-cursor="true"
            >
              <img
                src={p.image}
                alt={p.name}
                loading="lazy"
                className="absolute inset-0 h-[114%] w-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-ink/20 opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
            </div>
            <div className="mt-4 flex items-start justify-between gap-6">
              <div>
                <h2 className="display text-xl text-mist-100 md:text-2xl">{p.name}</h2>
                <p className="label mt-1.5 text-mist-400">{p.tag}</p>
              </div>
              <p className="hidden max-w-[36ch] text-right text-xs leading-relaxed text-mist-400 sm:block">
                {p.summary}
              </p>
            </div>
          </article>
        ))}
      </section>

      <FooterCTA />
    </main>
  );
}
