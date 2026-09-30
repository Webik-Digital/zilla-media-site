import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap, prefersReducedMotion } from "../../lib/gsapSetup";
import { work } from "../../data/site";
import Button from "../Button";

/**
 * Horizontal case-study reel. The section is tall, its inner frame is
 * sticky, and vertical scroll is remapped onto the track's x — so the panels
 * sweep past while the heading holds its place. Each image counter-moves
 * inside its frame for depth.
 */
/** Width of the lit window on the ruler, as a percentage of its full width. */
const RULER_WINDOW = 3.4;

export default function SelectedWork() {
  const rootRef = useRef(null);
  const trackRef = useRef(null);
  const rulerRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const track = trackRef.current;

      const distance = () => track.scrollWidth - window.innerWidth + 80;

      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: () => `+=${distance()}`,
          scrub: 0.8,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          // The ruler is written straight to the DOM rather than through
          // state: this fires every frame of the scrub, and a React render
          // per frame would be wasteful.
          onUpdate: (self) => {
            const left = self.progress * (100 - RULER_WINDOW);
            if (rulerRef.current) {
              rulerRef.current.style.clipPath = `inset(0 ${
                100 - left - RULER_WINDOW
              }% 0 ${left}%)`;
            }
          },
        },
      });

      // Counter-parallax on the imagery, driven by the same scroll.
      //
      // `x: 0` is load-bearing, not decoration. GSAP keeps `x` (px) and
      // `xPercent` (%) as separate additive components of one transform, and
      // invalidateOnRefresh re-initialises this tween on every refresh — which
      // an image finishing loading triggers. On re-init GSAP parses the
      // element's current computed matrix back into `x`, so the offset
      // accumulated: `translate(-8%) translate(-252px)`. The image walked out
      // of its frame and left bare background down one side, but only on cards
      // that had been through a refresh, which is why it looked intermittent.
      // Pinning x to 0 at both ends keeps xPercent the only thing moving.
      gsap.utils.toArray(".sw-img").forEach((img) => {
        gsap.fromTo(
          img,
          { xPercent: -8, x: 0 },
          {
            xPercent: 8,
            x: 0,
            ease: "none",
            scrollTrigger: {
              trigger: rootRef.current,
              start: "top top",
              end: () => `+=${distance()}`,
              scrub: 1,
              invalidateOnRefresh: true,
            },
          }
        );
      });

      gsap.fromTo(
        ".sw-head",
        { y: 44, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: rootRef.current, start: "top 62%" },
        }
      );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  // With scrubbing off, a horizontal track would strand every project past
  // the first — fall back to an ordinary grid.
  const reduced = prefersReducedMotion();

  return (
    // Wrapper carries the nav theme: ScrollTrigger replaces the section with
    // a pin-spacer while it's pinned, so the flag has to live outside it.
    // No longer flagged as placeholder: these are real Zilla Media clients,
    // confirmed against the supplied design deck, and each summary now
    // describes only what is visible in its image. No claimed results.
    <div data-nav-theme="light">
      <section
        ref={rootRef}
        className={`relative z-10 overflow-hidden bg-paper text-ink ${
          reduced ? "" : "h-[100svh]"
        }`}
      >
        <div className={reduced ? "" : "flex h-full flex-col"}>
          {/* Scroll ruler. Two full-width tick strips drawn as repeating
              gradients: a short dim one always visible, and a taller green
              one revealed through a clip-path window that tracks progress.
              One style write per frame instead of one per tick. */}
          {!reduced && (
            <div className="relative h-7 w-full shrink-0" aria-hidden>
              <div
                className="absolute inset-x-0 top-0 h-2"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(to right, rgba(28,28,26,0.45) 0 1px, transparent 1px 7px)",
                }}
              />
              <div
                ref={rulerRef}
                className="absolute inset-x-0 top-0 h-7"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(to right, #00ce00 0 1px, transparent 1px 7px)",
                  clipPath: `inset(0 ${100 - RULER_WINDOW}% 0 0%)`,
                }}
              />
            </div>
          )}

          <div className="flex items-end justify-between px-5 pb-6 pt-16 md:px-10 md:pb-10 md:pt-20">
            <div>
              <h2 className="sw-head display whitespace-pre-line text-[clamp(2.1rem,5.4vw,4.4rem)]">
                {work.title}
              </h2>
            </div>
            <div className="flex items-center gap-8">
              <Button to={work.cta.to} className="sw-head hidden md:inline-flex">
                {work.cta.label}
              </Button>
            </div>
          </div>

        <div
          ref={trackRef}
          className={
            reduced
              ? "grid gap-8 px-5 pb-16 md:grid-cols-2 md:px-10"
              : "flex h-full w-max items-center gap-5 px-5 pb-16 md:gap-8 md:px-10"
          }
        >
          {work.projects.map((p, i) => (
            <article
              key={p.slug}
              className={
                reduced
                  ? "group relative flex flex-col"
                  : "group relative flex h-[54vh] w-[78vw] shrink-0 flex-col sm:w-[54vw] lg:w-[38vw]"
              }
              style={reduced ? undefined : { marginTop: i % 2 ? "5vh" : "-3vh" }}
            >
              <Link
                to="/work"
                data-cursor="true"
                // The grid fallback has no fixed row height, so h-full would
                // collapse the frame to zero and hide the image entirely.
                className={`relative block w-full overflow-hidden bg-paper-2 ${
                  reduced ? "aspect-[4/3]" : "h-full"
                }`}
              >
                {/* The counter-parallax below slides this horizontally, so it
                    has to be wider than its frame or the travel drags bare
                    background into view. It was `inset-0 w-[118%]`, which
                    over-constrains the box — with left and right both pinned
                    the width was ignored and the image sat exactly frame-wide,
                    so every pixel of parallax showed as a gap down one side.

                    inset-y-0 pins only the vertical axis; the explicit width
                    and negative left centre a 130%-wide image, leaving 15% of
                    overhang each way for a ±8% travel to move into. */}
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  style={{ width: "130%", left: "-15%" }}
                  className="sw-img absolute inset-y-0 h-full max-w-none object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
                />
              </Link>

              <div className="mt-4 flex items-start justify-between gap-6">
                <div>
                  <h3 className="display text-xl md:text-2xl">{p.name}</h3>
                  <p className="label mt-1.5 text-mist-400">{p.tag}</p>
                </div>
                <p className="hidden max-w-[26ch] text-right text-xs leading-relaxed text-mist-400 lg:block">
                  {p.summary}
                </p>
              </div>
            </article>
          ))}

          <div
            className={
              reduced
                ? "flex flex-col justify-center py-8"
                : "flex h-[54vh] w-[70vw] shrink-0 flex-col justify-center sm:w-[40vw]"
            }
          >
            <p className="display max-w-[16ch] text-[clamp(1.5rem,2.6vw,2.4rem)]">
              {work.outro}
            </p>
            <Button to={work.cta.to} className="mt-8 w-fit">
              {work.cta.label}
            </Button>
          </div>
          </div>
        </div>
      </section>
    </div>
  );
}
