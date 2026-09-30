import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../lib/gsapSetup";
import PageIntro from "../components/PageIntro";
import Button from "../components/Button";
import FooterCTA from "../components/sections/FooterCTA";
import { apply } from "../data/apply";

/**
 * The staged application flow, mirroring zillamedia.co/apply-now: apply, book,
 * confirm. The booking panel carries the real discovery-call details; its CTA
 * points at the live site's own scheduler until we have a provider to embed
 * (see the note in data/apply.js).
 */
export default function ApplyNow() {
  const rootRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.batch(".ap-reveal", {
        start: "top 88%",
        onEnter: (batch) =>
          gsap.fromTo(
            batch,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.85, ease: "power3.out", stagger: 0.09 }
          ),
      });

      // The rule connecting the three steps draws itself as they arrive.
      gsap.fromTo(
        ".ap-track",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.4,
          ease: "expo.out",
          transformOrigin: "left center",
          scrollTrigger: { trigger: ".ap-steps", start: "top 78%" },
        }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <main ref={rootRef} className="relative bg-ink">
      <PageIntro eyebrow={apply.label} title={apply.title} lede={apply.lede} />

      {/* Three steps -------------------------------------------------------- */}
      <section className="ap-steps px-5 pb-20 md:px-10 md:pb-28">
        <div className="relative">
          <div
            aria-hidden
            className="ap-track absolute left-0 right-0 top-[1.1rem] hidden h-px origin-left bg-mist-600 md:block"
          />
          <div className="grid gap-10 md:grid-cols-3 md:gap-8">
            {apply.steps.map((s) => (
              <div key={s.n} className="ap-reveal relative">
                <span className="relative z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-zilla bg-ink text-zilla">
                  <span className="label">{s.n}</span>
                </span>
                <h2 className="display mt-6 text-xl text-mist-100">{s.title}</h2>
                <p className="mt-3 max-w-xs text-sm leading-relaxed text-mist-300">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What the call gets you --------------------------------------------- */}
      <section className="border-y border-mist-600 px-5 py-20 md:px-10 md:py-28">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div className="ap-reveal">
            <p className="label mb-5 text-mist-400">No cost, no obligation</p>
            <h2 className="display max-w-[16ch] text-[clamp(1.75rem,4.2vw,3.2rem)] text-mist-100">
              {apply.analysis.title}
            </h2>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-mist-300">
              {apply.analysis.body}
            </p>
          </div>

          <ul className="ap-reveal self-center border-t border-mist-600">
            {apply.analysis.items.map((it) => (
              <li
                key={it}
                className="flex items-center gap-4 border-b border-mist-600 py-5 text-mist-200"
              >
                <span
                  aria-hidden
                  className="h-1.5 w-1.5 shrink-0 rounded-full bg-zilla"
                />
                {it}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Booking ------------------------------------------------------------ */}
      <section className="px-5 py-20 md:px-10 md:py-28">
        <div className="ap-reveal mx-auto max-w-3xl border border-mist-600 p-8 md:p-14">
          <p className="label text-mist-400">{apply.booking.host}</p>
          <h2 className="display mt-5 text-[clamp(1.6rem,3.6vw,2.6rem)] text-mist-100">
            {apply.booking.title}
          </h2>

          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 border-y border-mist-600 py-5">
            <p className="label flex items-center gap-2 text-mist-200">
              <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-zilla" />
              {apply.booking.duration}
            </p>
            <p className="label text-mist-400">{apply.booking.timezone}</p>
          </div>

          <p className="mt-6 text-sm leading-relaxed text-mist-300">{apply.booking.body}</p>

          <Button
            href={apply.booking.url}
            surface="dark"
            className="mt-10"
            target={apply.booking.external ? "_blank" : undefined}
            rel={apply.booking.external ? "noreferrer" : undefined}
          >
            {apply.booking.cta}
          </Button>
        </div>
      </section>

      {/* What happens next --------------------------------------------------- */}
      <section className="border-t border-mist-600 px-5 py-20 md:px-10 md:py-28">
        <h2 className="ap-reveal display mb-14 text-[clamp(1.75rem,4.2vw,3.2rem)] text-mist-100">
          {apply.next.title}
        </h2>
        <ol className="grid gap-px bg-mist-600 md:grid-cols-2 xl:grid-cols-5">
          {apply.next.items.map((it, i) => (
            <li key={it.title} className="ap-reveal bg-ink p-8">
              <span className="label text-zilla">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="display mt-4 text-base text-mist-100">{it.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-mist-300">{it.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <FooterCTA />
    </main>
  );
}
