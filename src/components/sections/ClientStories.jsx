import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "../../lib/gsapSetup";
import { stories } from "../../data/site";
import Button from "../Button";

/**
 * Testimonials as a switchboard: the client list on the left drives the quote
 * on the right. Changing client wipes the old quote out on a clip mask and
 * rolls the new one up word-first, so it never feels like a tab swap.
 */
export default function ClientStories() {
  const rootRef = useRef(null);
  const quoteRef = useRef(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".cs-in",
        { y: 42, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          stagger: 0.09,
          scrollTrigger: { trigger: rootRef.current, start: "top 68%" },
        }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (prefersReducedMotion() || !quoteRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        quoteRef.current.children,
        { yPercent: 60, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.8,
          ease: "expo.out",
          stagger: 0.07,
        }
      );
    }, quoteRef);
    return () => ctx.revert();
  }, [active]);

  const item = stories.items[active];
  const go = (dir) =>
    setActive((v) => (v + dir + stories.items.length) % stories.items.length);

  return (
    <section
      ref={rootRef}
      data-nav-theme="light"
      data-placeholder="Testimonials are invented — no client quotes exist on zillamedia.co"
      className="relative z-10 bg-paper px-5 py-24 text-ink md:px-10 md:py-36"
    >
      <div className="mx-auto max-w-[1600px]">
        <div className="cs-in mb-14 flex flex-wrap items-end justify-between gap-6 md:mb-20">
          <h2 className="display text-[clamp(2.1rem,5vw,4rem)]">{stories.label}</h2>
          <p className="max-w-sm text-sm text-mist-400">{stories.intro}</p>
        </div>

        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
          <ul className="cs-in border-t border-ink/10">
            {stories.items.map((s, i) => (
              <li key={s.client}>
                <button
                  onClick={() => setActive(i)}
                  data-cursor="true"
                  className="group flex w-full items-center justify-between border-b border-ink/10 py-5 text-left"
                >
                  <span
                    className={`display text-xl transition-colors duration-500 md:text-2xl ${
                      i === active ? "text-ink" : "text-mist-300 group-hover:text-ink"
                    }`}
                  >
                    {s.client}
                  </span>
                  <span
                    className={`h-px transition-all duration-500 ${
                      i === active ? "w-14 bg-zilla" : "w-6 bg-mist-300 group-hover:w-10"
                    }`}
                  />
                </button>
              </li>
            ))}
          </ul>

          <div className="cs-in flex flex-col justify-between">
            <blockquote
              ref={quoteRef}
              className="display text-[clamp(1.35rem,2.7vw,2.35rem)] leading-[1.18]"
            >
              {/* Split into two blocks so the reveal staggers rather than
                  flipping the whole paragraph at once. */}
              <span className="line-clip">
                <span className="block">“{item.quote.split(". ")[0]}.</span>
              </span>
              <span className="line-clip">
                <span className="block text-mist-400">
                  {item.quote.split(". ").slice(1).join(". ")}”
                </span>
              </span>
            </blockquote>

            <div className="mt-12 flex flex-wrap items-center justify-between gap-6 border-t border-ink/10 pt-6">
              <div>
                <p className="display text-base">{item.client}</p>
                <p className="label mt-1 text-mist-400">{item.person}</p>
              </div>

              <div className="flex items-center gap-6">
                <span className="label tabular-nums text-mist-400">
                  {String(active + 1).padStart(2, "0")} /{" "}
                  {String(stories.items.length).padStart(2, "0")}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => go(-1)}
                    aria-label="Previous story"
                    data-cursor="true"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/20 transition-colors duration-400 hover:border-zilla hover:text-zilla"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => go(1)}
                    aria-label="Next story"
                    data-cursor="true"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/20 transition-colors duration-400 hover:border-zilla hover:text-zilla"
                  >
                    →
                  </button>
                </div>
                {/* The button every other CTA on the site was matched to. */}
                <Button to={stories.cta.to}>{stories.cta.label}</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
