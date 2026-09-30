import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../../lib/gsapSetup";
import { MARK_PATH } from "../../lib/zillaMark";
import { marquee } from "../../data/site";

/**
 * Infinite word band. Base speed runs on a linear tween; scroll velocity is
 * fed into the timeScale so the band surges when you flick the page and
 * even runs backwards when you scroll up — the trick that makes these read
 * as physical rather than looped video.
 */
export default function Marquee() {
  const rootRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const track = rootRef.current.querySelector(".mq-track");
      const half = track.scrollWidth / 2;

      const loop = gsap.to(track, {
        x: -half,
        duration: 26,
        ease: "none",
        repeat: -1,
        modifiers: { x: (v) => `${parseFloat(v) % half}px` },
      });

      const st = ScrollTrigger.create({
        trigger: rootRef.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 380, 5);
          loop.timeScale(self.direction === -1 ? -boost : boost);
          gsap.to(loop, { timeScale: self.direction === -1 ? -1 : 1, duration: 1.1, overwrite: true });
        },
      });

      return () => {
        loop.kill();
        st.kill();
      };
    }, rootRef);

    return () => ctx.revert();
  }, []);

  // One voice per word, fixed by position so a given word always arrives in
  // the same face. The band is the site's claim that Zilla works across very
  // different brands, so it should look like several wordmarks passing rather
  // than one repeated in three fonts.
  const voices = ["voice-anton", "voice-bodoni", "voice-syne"];
  const run = [...marquee, ...marquee, ...marquee];

  return (
    <section
      ref={rootRef}
      className="relative z-10 overflow-hidden border-y border-mist-600 bg-ink py-10 md:py-16"
    >
      <div className="mq-track flex w-max items-center gap-10 md:gap-16">
        {[...run, ...run].map((word, i) => (
          <span key={`${word}-${i}`} className="flex items-center gap-10 md:gap-16">
            {/* Size lives in the voice class, not a utility here: these two
                would collide and the voice wins, which is how the band ended
                up rendering at root size. */}
            <span className={`${voices[i % marquee.length]} text-mist-100`}>
              {word}
            </span>
            <svg viewBox="0 0 100 100" className="h-5 w-5 shrink-0 md:h-8 md:w-8">
              <path d={MARK_PATH} fill="#00ce00" />
            </svg>
          </span>
        ))}
      </div>
    </section>
  );
}
