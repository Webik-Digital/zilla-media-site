import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "../../lib/gsapSetup";
import { keyFacts } from "../../data/site";

/**
 * Hard cut from black to paper. Three cards fly in as a fanned deck in real
 * CSS 3D and are scrubbed flat as the section crosses the viewport; the
 * channel row underneath fades up once they land.
 */
export default function KeyFacts() {
  const rootRef = useRef(null);
  const fanRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray(".kf-card");

      gsap.fromTo(
        cards,
        {
          rotateY: (i) => -34 + i * 5,
          rotateX: 9,
          z: -420,
          y: (i) => 90 + i * 34,
          xPercent: (i) => (i - 1) * 22,
          opacity: 0.25,
        },
        {
          rotateY: 0,
          rotateX: 0,
          z: 0,
          y: 0,
          xPercent: 0,
          opacity: 1,
          ease: "none",
          stagger: 0.06,
          scrollTrigger: {
            trigger: ".kf-deck",
            start: "top 92%",
            end: "top 32%",
            scrub: 0.7,
          },
        }
      );

      gsap.fromTo(
        ".kf-head",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: rootRef.current, start: "top 72%" },
        }
      );

      gsap.fromTo(
        ".kf-partner",
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.06,
          scrollTrigger: { trigger: ".kf-partners", start: "top 88%" },
        }
      );

      // ---- Channel fan --------------------------------------------------
      // Cards live stacked on the centre point; the spread is expressed as a
      // transform offset from there, so the resting layout needs no maths and
      // the whole thing re-measures itself on resize.
      const fanCards = gsap.utils.toArray(".ch-card");
      const n = fanCards.length;
      const t = (i) => i / (n - 1) - 0.5; // -0.5 .. 0.5
      // Narrow screens get a tighter, more overlapped deck — a full spread
      // would run the outer cards off the page.
      //
      // GSAP calls this lazily, and calls it again on every refresh because of
      // invalidateOnRefresh below. A route change fires a refresh, which can
      // land after this section has unmounted — so the ref has to be checked.
      // Without the guard it threw, and an uncaught error inside a GSAP render
      // tears down the whole React tree: the next page came up blank.
      const spread = () => {
        const el = fanRef.current;
        if (!el) return 0;
        return el.offsetWidth * (window.innerWidth < 768 ? 0.66 : 0.86);
      };

      gsap.set(fanCards, { xPercent: -50, yPercent: -50 });

      gsap.fromTo(
        fanCards,
        { x: 0, y: 0, rotate: 0, scale: 0.72, opacity: 0 },
        {
          x: (i) => t(i) * spread(),
          y: (i) => t(i) * t(i) * 54,
          rotate: (i) => t(i) * 24,
          scale: 1,
          opacity: 1,
          ease: "power2.out",
          stagger: 0.04,
          scrollTrigger: {
            trigger: ".ch-fan",
            start: "top 92%",
            end: "top 38%",
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        }
      );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      data-nav-theme="light"
      className="relative z-10 bg-paper px-5 py-24 text-ink md:px-10 md:py-36"
    >
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-16 text-center md:mb-24">
          <h2 className="kf-head display text-[clamp(2.1rem,5vw,4rem)]">
            {keyFacts.label}
          </h2>
          <p className="kf-head label mx-auto mt-4 max-w-sm text-mist-400">
            {keyFacts.intro}
          </p>
        </div>

        <div
          className="kf-deck grid gap-5 md:grid-cols-3 md:gap-7"
          style={{ perspective: "1400px", perspectiveOrigin: "50% 40%" }}
          // The figures on these cards are invented; the channel logos below
          // them are real.
          data-placeholder="Stat figures are invented — Zilla Media publishes no numbers"
        >
          {keyFacts.cards.map((card) => (
            <article
              key={card.statLabel}
              className={`kf-card group relative flex min-h-[380px] flex-col justify-between overflow-hidden p-6 md:min-h-[460px] md:p-8 ${
                card.kind === "media" ? "text-mist-100" : "bg-white text-ink"
              }`}
              style={{ transformStyle: "preserve-3d" }}
            >
              {card.kind === "media" && (
                <>
                  <img
                    src={card.image}
                    alt={card.alt}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent" />
                  {/* Second scrim so the top label stays legible over the
                      lighter part of a photograph. */}
                  <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ink/70 to-transparent" />
                </>
              )}

              <p className="label relative z-10 opacity-70">{card.statLabel}</p>

              <div className="relative z-10">
                <p className="display text-[clamp(3rem,7vw,5.5rem)] leading-none">
                  {card.stat}
                </p>
                <p className="mt-3 max-w-[26ch] text-sm leading-relaxed opacity-80">
                  {card.caption}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="kf-partners mt-20 border-t border-ink/10 pt-14 md:mt-28">
          <div className="text-center">
            <h3 className="kf-partner display text-[clamp(1.9rem,4.4vw,3.4rem)]">
              {keyFacts.partnersLabel}
            </h3>
            <p className="kf-partner mx-auto mt-4 max-w-xl text-sm text-mist-400">
              {keyFacts.partnersNote}
            </p>
          </div>

          {/* Fanned deck: the cards begin stacked in the centre and spread
              into an overlapping arc as the section is scrolled through. */}
          <div
            ref={fanRef}
            className="ch-fan relative mx-auto mt-12 h-[clamp(150px,22vw,260px)] w-full max-w-[1120px] md:mt-16"
          >
            {keyFacts.partners.map((p) => (
              // The card is drawn in CSS rather than baked into the artwork,
              // so its edge can be a whisper instead of the hard dark stroke
              // the source sheet came with.
              <figure
                key={p.name}
                className="ch-card group absolute left-1/2 top-1/2 w-[clamp(96px,12.5vw,172px)]"
              >
                <div className="flex aspect-[3/2] items-center justify-center rounded-2xl border border-ink/[0.06] bg-white px-[12%] shadow-[0_6px_18px_-6px_rgba(28,28,26,0.18)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-3 group-hover:scale-[1.06]">
                  <img
                    src={p.src}
                    alt={p.name}
                    loading="lazy"
                    draggable="false"
                    className="w-full"
                  />
                </div>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
