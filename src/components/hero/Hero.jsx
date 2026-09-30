import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "../../lib/gsapSetup";
import Button from "../Button";
import { hero } from "../../data/site";

/**
 * Hero copy layer. Sits above the WebGL canvas; every element rides in from
 * its own clip mask once the preloader hands over, and the headline's middle
 * word rolls through the cycle list on a loop.
 */
export default function Hero({ ready }) {
  const rootRef = useRef(null);
  const wordsRef = useRef([]);
  const wrapRef = useRef(null);

  // Entrance
  useEffect(() => {
    if (!ready || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "expo.out" } })
        .fromTo(
          // 135 rather than 118: the clip mask now extends below the line box
          // to protect descenders, so the line has further to travel before
          // it's genuinely out of sight.
          ".hero-line-inner",
          { yPercent: 135 },
          { yPercent: 0, duration: 1.25, stagger: 0.09 }
        )
        .fromTo(
          ".hero-fade",
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, stagger: 0.08 },
          "-=0.75"
        );
    }, rootRef);
    return () => ctx.revert();
  }, [ready]);

  // Word cycle. The words are absolutely stacked inside a masked wrapper and
  // the wrapper's width is tweened to each word's measured width — so the
  // rest of the line slides across rather than jumping, and there's never a
  // dead gap left by the longest option.
  useEffect(() => {
    if (!ready || prefersReducedMotion()) return;
    const els = wordsRef.current.filter(Boolean);
    const wrap = wrapRef.current;
    if (els.length < 2 || !wrap) return;

    const ctx = gsap.context(() => {
      // getBoundingClientRect, not offsetWidth: the latter rounds down to a
      // whole pixel, and that lost fraction is enough for the mask to shave
      // the right edge off the final letter. The 2px buffer covers glyph ink
      // that antialiases past its layout box — the roll only moves
      // vertically, so extra horizontal room can't leak anything.
      const widths = els.map((el) => el.getBoundingClientRect().width + 2);
      gsap.set(wrap, { width: widths[0] });
      // Everything parks below the mask; only the active word is in frame.
      // No opacity fade and no offset between the two halves of the swap —
      // outgoing and incoming stay exact complements, so mid-roll you see
      // the bottom of one and the top of the next, never a blurred overlap.
      // opacity:1 hands control back from the markup's first-paint guard —
      // once they're parked below the mask, the mask alone hides them.
      gsap.set(els, { yPercent: 135, opacity: 1 });
      gsap.set(els[0], { yPercent: 0 });

      let i = 0;
      const swap = () => {
        const current = els[i];
        i = (i + 1) % els.length;
        const next = els[i];
        gsap
          .timeline({ defaults: { duration: 0.72, ease: "power4.inOut" } })
          .to(current, { yPercent: -135 }, 0)
          .fromTo(next, { yPercent: 135 }, { yPercent: 0 }, 0)
          .to(wrap, { width: widths[i] }, 0);
      };
      const id = window.setInterval(swap, 2800);
      return () => window.clearInterval(id);
    }, rootRef);

    return () => ctx.revert();
  }, [ready]);

  const reduced = prefersReducedMotion();

  return (
    <section
      ref={rootRef}
      className="relative z-10 flex h-[100svh] min-h-[640px] flex-col justify-between px-5 pb-8 pt-28 md:px-10 md:pb-10 md:pt-32"
    >
      <div>
        <h1 className="display text-[clamp(2.2rem,5.6vw,5.2rem)] text-mist-100">
          <span className="line-clip">
            <span className="hero-line-inner block whitespace-nowrap">{hero.lead}</span>
          </span>
          <span className="line-clip">
            <span className="hero-line-inner flex items-baseline whitespace-nowrap">
              {reduced ? (
                // Without the roll driving them, the stacked words would all
                // sit on top of each other — show one and be done.
                <span className="text-zilla">{hero.cycle[0]}</span>
              ) : (
                <span
                  ref={wrapRef}
                  className="roll-clip relative inline-block align-baseline text-zilla"
                >
                  {hero.cycle.map((w, i) => (
                    <span
                      key={w}
                      ref={(el) => (wordsRef.current[i] = el)}
                      className="absolute left-0 top-0 whitespace-nowrap"
                      aria-hidden={i > 0}
                      // The resting state has to exist in the markup. GSAP
                      // parks these below the mask, but it does so in an
                      // effect — which runs after the first paint, so without
                      // this every word renders stacked on the lead one for a
                      // frame. Invisible while the splash covered the page;
                      // plainly visible now it's skipped on repeat visits.
                      //
                      // Opacity rather than a transform, deliberately: GSAP
                      // parses any inline transform into its own `y`, and `y`
                      // and `yPercent` are *additive*. An inline
                      // translateY(135%) here comes back as
                      // `translate(0%,135%) translate(0px,69.5px)` — double
                      // the offset — and the words the roll parks at -135%
                      // land back in the middle of the mask instead of above
                      // it. Opacity is overwritten, not accumulated.
                      style={i === 0 ? undefined : { opacity: 0 }}
                    >
                      {w}
                    </span>
                  ))}
                  {/* In-flow copy of the *lead* word: gives the mask its
                      height, and its width before GSAP takes that over. Using
                      the longest word here instead made the line start too
                      wide and snap narrower once the script ran. */}
                  <span className="invisible block whitespace-nowrap">
                    {hero.cycle[0]}
                  </span>
                </span>
              )}
              <span>&nbsp;through</span>
            </span>
          </span>
          <span className="line-clip">
            <span className="hero-line-inner block whitespace-nowrap">
              visual storytelling.
            </span>
          </span>
        </h1>

        <div className="hero-fade mt-8 md:mt-10">
          <Button to={hero.cta.to} surface="dark">
            {hero.cta.label}
          </Button>
        </div>
      </div>

      {/* Single column now the scroll prompt is gone: the blurb keeps its
          right-hand position rather than drifting into the middle. */}
      <div className="grid items-end gap-8">
        <div className="hero-fade md:justify-self-end md:text-right">
          <div className="mb-4 inline-flex items-center divide-x divide-mist-600 rounded-sm border border-mist-600 text-mist-300">
            <span className="label px-3 py-2">{hero.badge.left}</span>
            <span className="label px-3 py-2">{hero.badge.right}</span>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-mist-200 md:ml-auto">
            {hero.blurb}
          </p>
        </div>
      </div>
    </section>
  );
}
