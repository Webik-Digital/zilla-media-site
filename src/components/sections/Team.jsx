import { useEffect, useRef, useState } from "react";
import Button from "../Button";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../../lib/gsapSetup";
import { team } from "../../data/site";

/**
 * The team, as a chapter reel — one member per scroll beat.
 *
 * Built from the supplied reference recording. Three columns: name on the
 * left, portrait in the centre, bio on the right, all held in a pinned
 * viewport while scroll walks the reel.
 *
 * The portrait is the piece that carries the effect, so it is a real
 * filmstrip rather than a crossfade: every portrait is stacked in one tall
 * column, and the outgoing member leaves upward while the next arrives from
 * below, both on screen at once through the middle of the move.
 *
 * The strip is stepped, not scrubbed. Scrubbing it was the first build and it
 * left the reel parked between two members whenever a scroll gesture ended
 * mid-beat — ScrollTrigger's own `snap` is the cure for that, but it loses to
 * Lenis: snap tweens the window scroll while Lenis is writing that same value
 * from its RAF loop every frame, so the correction is undone before it lands.
 * Scroll therefore only chooses *which* member is current, and the strip
 * animates itself there. Every rest state is exact by construction, with no
 * second system to fight, and the glide between them is what the reference
 * shows anyway.
 *
 * The neighbours are never masked or clipped — checked against a still from
 * the reference, where the frame above the active one is fully visible with a
 * hard edge and a clear gap. What separates them is tone: only the centred
 * portrait is lit, the rest sit back in greyscale at a third of their weight.
 * A viewport scrim was the wrong read of it and cost the active portrait its
 * own top and bottom to the gradient.
 *
 * The two text columns wipe on the index instead of scrubbing. A filmstrip
 * needs a fixed cell height, and these names run from "Michael Siervo" to
 * "Stalingrad Dollosa" — a cell tall enough for the long ones would strand
 * the short ones, and bios of different lengths would clip. The wipe reads
 * identically because the reference's own text change is a fast mask, not a
 * scrub.
 *
 * Reference chrome deliberately not carried over: its yellow skip pill and
 * "1/5" counter are replaced by the site's own Button and the `01 / 05`
 * numbering ClientStories already uses.
 */

const COUNT = team.members.length;

/* 3:4 portraits — the reference frames square, but these are headshots and a
   square crops them badly. Height leads so the frame scales with the pinned
   viewport, with a vw ceiling so it can't crowd the text columns on short,
   wide screens. Shared by the strip and by the grid spacer that reserves its
   column, so the two can't drift apart. */
// Width stated rather than left to aspect-ratio: the grid spacers that
// reserve the middle column have no content to give them a height, so they
// need the width outright. The heading row reuses the width on its own.
const FRAME_W = "w-[min(39svh,30vw)]";
const FRAME = `${FRAME_W} h-[min(52svh,40vw)]`;

/* Section headings across the homepage — KeyFacts, Client Stories — all run
   this clamp. */
const HEADING = "text-[clamp(2.1rem,5vw,4rem)]";

/* Gap between frames on the strip, as a fraction of one frame. Measured off
   the reference (113px of black against a 408px frame). It has to stay under
   the margin the frame leaves at the top of the viewport, or the neighbours
   are pushed off screen and the strip stops reading as a strip. */
const GAP = 0.26;
const PITCH = 1 + GAP;

export default function Team() {
  const rootRef = useRef(null);
  const stripRef = useRef(null);
  const nameRef = useRef(null);
  const bioRef = useRef(null);
  const [active, setActive] = useState(0);
  const [compact, setCompact] = useState(false);

  // A pinned three-column reel has nowhere to go on a phone, and with the
  // wipes disabled reduced motion would leave the text columns frozen on
  // member one while the strip sat still. Both take the stacked layout.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const apply = () => setCompact(mq.matches || prefersReducedMotion());
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // ---- The reel ----------------------------------------------------------
  useEffect(() => {
    if (compact) return;

    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: rootRef.current,
        start: "top top",
        // Three quarters of a viewport per member. A full one is the obvious
        // number and it makes the reel feel stuck — most of a wheel gesture
        // buys you nothing.
        end: () => "+=" + COUNT * window.innerHeight * 0.75,
        pin: ".tm-frame",
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          // floor, not round: round would hand the first and last member half
          // a beat each and everyone in between a whole one.
          const next = Math.min(COUNT - 1, Math.floor(self.progress * COUNT));
          setActive((v) => (v === next ? v : next));
        },
      });

      return () => st.kill();
    }, rootRef);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, [compact]);

  // ---- Strip ------------------------------------------------------------
  // Every cell is one pitch tall, so a member is 100/COUNT of the strip's own
  // height however wide the gap between frames is.
  useEffect(() => {
    if (compact || !stripRef.current) return;

    // Killed rather than reverted on cleanup, and deliberately not wrapped in
    // a gsap.context: this effect re-runs on every change of member, and a
    // context revert would put the strip back where the *previous* tween
    // started, undoing the move it had just made.
    const tween = gsap.to(stripRef.current, {
      yPercent: (-active * 100) / COUNT,
      duration: 0.9,
      ease: "power3.inOut",
      overwrite: true,
    });
    return () => tween.kill();
  }, [active, compact]);

  // ---- Text wipe ---------------------------------------------------------
  useEffect(() => {
    if (compact) return;

    // Role, then name, then bio: the eyebrow leads so the eye is already in
    // the left column when the name lands. Killed, not reverted, for the same
    // reason as the strip — a revert here would leave the copy parked at the
    // start of its own reveal, which is off screen.
    const tweens = [
      gsap.fromTo(
        nameRef.current.querySelectorAll(".tm-wipe"),
        { yPercent: 105 },
        {
          yPercent: 0,
          duration: 0.72,
          ease: "expo.out",
          stagger: 0.07,
          overwrite: true,
        }
      ),
      gsap.fromTo(
        bioRef.current,
        { yPercent: 26, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.8,
          ease: "expo.out",
          delay: 0.09,
          overwrite: true,
        }
      ),
    ];

    return () => tweens.forEach((t) => t.kill());
  }, [active, compact]);

  const member = team.members[active];

  const counter = (
    <div className="flex items-center gap-5">
      <div className="flex items-center gap-1.5" aria-hidden>
        {team.members.map((m, i) => (
          <span
            key={m.name}
            className={`h-px transition-all duration-500 ${
              i === active ? "w-10 bg-zilla" : "w-4 bg-mist-500"
            }`}
          />
        ))}
      </div>
      <span className="label tabular-nums text-mist-400">
        {String(active + 1).padStart(2, "0")} /{" "}
        {String(COUNT).padStart(2, "0")}
      </span>
    </div>
  );

  // ---- Stacked fallback --------------------------------------------------
  if (compact) {
    return (
      <section
        ref={rootRef}
        className="relative z-10 bg-ink px-5 py-24 md:px-10 md:py-32"
      >
        <div className="mx-auto max-w-[1600px]">
          <h2 className={`display whitespace-pre-line ${HEADING} text-mist-100`}>
            {team.title}
          </h2>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-mist-300">
            {team.intro}
          </p>

          <ul className="mt-14 flex flex-col gap-16">
            {team.members.map((m, i) => (
              <li key={m.name}>
                <div className="flex items-center gap-5">
                  <span className="label tabular-nums text-mist-400">
                    {String(i + 1).padStart(2, "0")} /{" "}
                    {String(COUNT).padStart(2, "0")}
                  </span>
                  <span className="h-px w-10 bg-zilla" />
                </div>

                <img
                  src={m.image}
                  alt={m.alt}
                  loading="lazy"
                  className="mt-6 aspect-[3/4] w-full max-w-sm object-cover"
                />

                <p className="label mt-6 text-zilla">{m.role}</p>
                <h3 className="display mt-3 text-[clamp(1.8rem,6vw,2.6rem)] text-mist-100">
                  {m.name}
                </h3>
                <p className="mt-4 max-w-prose text-sm leading-relaxed text-mist-300">
                  {m.bio}
                </p>
              </li>
            ))}
          </ul>

          <Button to={team.cta.to} surface="dark" className="mt-16">
            {team.cta.label}
          </Button>
        </div>
      </section>
    );
  }

  // ---- The reel ----------------------------------------------------------
  return (
    <section ref={rootRef} className="relative z-10 bg-ink">
      <div className="tm-frame relative h-[100svh] w-full overflow-hidden">
        {/* Portrait filmstrip. Centred in the viewport by the same symmetric
            padding the grid below uses, so it lands exactly in the grid's
            middle column without either layer knowing about the other. */}
        <div className="absolute inset-0 z-0 flex items-center justify-center">
          <div className={`relative ${FRAME}`}>
            <div
              ref={stripRef}
              className="absolute left-0 top-0 w-full will-change-transform"
              style={{ height: `${COUNT * PITCH * 100}%` }}
            >
              {team.members.map((m, i) => (
                <div
                  key={m.name}
                  className="w-full"
                  style={{ height: `${100 / COUNT}%` }}
                >
                  {/* The image takes one frame off the top of its cell; the
                      rest of the cell is the gap. */}
                  <img
                    src={m.image}
                    alt={m.alt}
                    // The first two are on screen inside the opening beat;
                    // the rest can wait for the scroll.
                    loading={i < 2 ? "eager" : "lazy"}
                    style={{ height: `${100 / PITCH}%` }}
                    className={`w-full object-cover transition-[opacity,filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      i === active
                        ? "opacity-100 grayscale-0"
                        : "opacity-30 grayscale"
                    }`}
                  />
                </div>
              ))}
            </div>

            {/* The CTA lives in the strip's own gap rather than at the foot
                of the viewport: the reference puts its control in that band
                of black under the portrait, and anchoring it to the frame is
                the only way it stays there at every viewport height instead
                of landing on the next portrait. */}
            <div
              className="absolute inset-x-0 top-full z-20 flex items-center justify-center"
              style={{ height: `${GAP * 100}%` }}
            >
              <Button to={team.cta.to} surface="dark">
                {team.cta.label}
              </Button>
            </div>
          </div>
        </div>

        {/* Type only — nothing here is interactive, and letting clicks
            through is what keeps the CTA underneath reachable. */}
        <div className="pointer-events-none absolute inset-0 z-30 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-8 px-5 md:px-10 xl:gap-14">
          {/* Name */}
          <div ref={nameRef}>
            {/* line-clip gives the mask room under the baseline so descenders
                aren't sheared at rest — see the note beside it in index.css.
                Both need the display size on the clip itself, since its em
                is what sizes that room. */}
            <span className="line-clip block text-[clamp(0.64rem,1vw,0.7rem)]">
              <span className="tm-wipe label block text-zilla">
                {member.role}
              </span>
            </span>
            <h3 className="line-clip mt-4 block text-[clamp(2rem,4vw,4.2rem)]">
              <span className="tm-wipe display block text-mist-100">
                {member.name}
              </span>
            </h3>
          </div>

          {/* Reserves the strip's column. Same class, so the column can only
              ever be exactly as wide as the portrait. */}
          <div className={`${FRAME} invisible`} aria-hidden />

          {/* Bio */}
          <p
            ref={bioRef}
            className="max-w-[38ch] text-sm leading-relaxed text-mist-300"
          >
            {member.bio}
          </p>
        </div>

        {/* Bottom row: section heading left, count right. The CTA belongs to
            neither — it is anchored to the strip's own gap further up, so the
            middle column here is just the spacer that keeps the count and the
            heading in the same columns as the content above.

            The heading sits at the foot rather than the head of the frame.
            Top-left is where it belongs and where it started, but at full
            section size it stacks directly on the member's name — at 1280 the
            two are twenty pixels apart and the reel reads as two headings
            arguing. Down here it has the whole corner to itself at every
            width, and mist-300 keeps the name the loudest thing in the left
            column. The top of the frame is left to the nav, which is what the
            reference does too. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-10 z-30 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-end gap-8 px-5 md:bottom-12 md:px-10 xl:gap-14">
          <h2
            className={`display whitespace-pre-line ${HEADING} text-mist-300`}
          >
            {team.title}
          </h2>
          <div className={`${FRAME_W} h-0`} aria-hidden />
          <div className="flex justify-end">{counter}</div>
        </div>
      </div>
    </section>
  );
}
