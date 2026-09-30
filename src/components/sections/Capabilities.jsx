import { useEffect, useRef } from "react";
import Button from "../Button";
import { gsap, prefersReducedMotion } from "../../lib/gsapSetup";
import { capabilities } from "../../data/site";

/**
 * The cards' resting state is an ordinary CSS grid. Everything dramatic is
 * expressed as a transform offset *from* that grid: a swept 3D arc that the
 * scroll unwinds until each card lands in its cell. Because the destination
 * is real layout, it stays correct at every breakpoint with no maths.
 *
 * Was "Design in Motion", showing abstract explorations. Now it carries the
 * real client output, because the site was reading as a cold AI-driven
 * business with no proof of actual work behind it.
 */
export default function Capabilities() {
  const rootRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray(".cp-card");
      const n = cards.length;

      gsap.fromTo(
        cards,
        {
          // Parametric position along the arc, centred on the middle card.
          xPercent: (i) => (i / (n - 1) - 0.5) * 420,
          yPercent: (i) => -Math.sin((i / (n - 1)) * Math.PI) * 90 + 40,
          z: (i) => -900 + Math.sin((i / (n - 1)) * Math.PI) * 520,
          rotateY: (i) => (i / (n - 1) - 0.5) * 96,
          rotateX: -16,
          rotateZ: (i) => (i / (n - 1) - 0.5) * -22,
          opacity: 0,
        },
        {
          xPercent: 0,
          yPercent: 0,
          z: 0,
          rotateY: 0,
          rotateX: 0,
          rotateZ: 0,
          opacity: 1,
          ease: "power1.inOut",
          stagger: 0.035,
          scrollTrigger: {
            trigger: ".cp-grid",
            start: "top 95%",
            end: "top 18%",
            scrub: 0.75,
            invalidateOnRefresh: true,
          },
        }
      );

      gsap.fromTo(
        ".cp-title",
        { yPercent: 135 },
        {
          yPercent: 0,
          duration: 1.2,
          ease: "expo.out",
          stagger: 0.1,
          scrollTrigger: { trigger: rootRef.current, start: "top 72%" },
        }
      );

      // The two halves of the title drift apart as you pass. They start
      // pulled *inward* and end just past their resting position, so the
      // words stay inside the frame at both ends of the scroll.
      const drift = {
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      };
      gsap.fromTo(".cp-title-a", { xPercent: 9 }, { xPercent: -5, ...drift });
      gsap.fromTo(".cp-title-b", { xPercent: -9 }, { xPercent: 5, ...drift });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      data-nav-theme="light"
      className="relative z-10 overflow-hidden bg-paper-2 px-5 py-24 text-ink md:px-10 md:py-36"
    >
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-10 md:mb-16">
          <h2 className="display text-[clamp(2.6rem,10vw,9rem)] uppercase leading-[0.88]">
            <span className="line-clip">
              <span className="cp-title cp-title-a block">{capabilities.titleA}</span>
            </span>
            <span className="line-clip text-right">
              <span className="cp-title cp-title-b block">{capabilities.titleB}</span>
            </span>
          </h2>

          <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
            <p className="label max-w-xs text-mist-400">{capabilities.label}</p>
            <p className="max-w-md text-sm leading-relaxed text-mist-400">
              {capabilities.intro}
            </p>
            <Button to={capabilities.cta.to}>{capabilities.cta.label}</Button>
          </div>
        </div>

        <div
          className="cp-grid grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 md:gap-5"
          style={{ perspective: "1500px", perspectiveOrigin: "50% 45%" }}
        >
          {capabilities.cards.map((card) => (
            <figure
              key={card.image}
              className="cp-card group relative aspect-video overflow-hidden bg-paper"
              style={{ transformStyle: "preserve-3d" }}
            >
              <img
                src={card.image}
                alt={card.caption}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[1.3s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
              />
              <figcaption className="label absolute inset-x-0 bottom-0 translate-y-full bg-ink/80 px-3 py-2.5 text-mist-100 backdrop-blur transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0">
                {card.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
