import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../lib/gsapSetup";
import PageIntro from "../components/PageIntro";
import Button from "../components/Button";
import FooterCTA from "../components/sections/FooterCTA";
import { servicePages, serviceOrder } from "../data/servicePages";

/** Section heading used throughout — eyebrow rule plus oversized title. */
function SectionHead({ label, title, body }) {
  return (
    <div className="sd-reveal mb-12 md:mb-16">
      {label && (
        <p className="label mb-5 text-mist-400">{label}</p>
      )}
      <h2 className="display max-w-[18ch] text-[clamp(1.75rem,4.2vw,3.4rem)] text-mist-100">
        {title}
      </h2>
      {body && (
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-mist-300">{body}</p>
      )}
    </div>
  );
}

export default function ServiceDetail() {
  const { slug } = useParams();
  const page = servicePages[slug];
  const rootRef = useRef(null);
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    if (!page || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      // One batched trigger rather than one per element — these pages are long
      // and a trigger per row gets expensive to refresh.
      ScrollTrigger.batch(".sd-reveal", {
        start: "top 88%",
        onEnter: (batch) =>
          gsap.fromTo(
            batch,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.85, ease: "power3.out", stagger: 0.08 }
          ),
      });
    }, rootRef);
    return () => ctx.revert();
  }, [page, slug]);

  if (!page) return <Navigate to="/services" replace />;

  const idx = serviceOrder.indexOf(slug);
  const next = servicePages[serviceOrder[(idx + 1) % serviceOrder.length]];

  return (
    <main ref={rootRef} className="relative bg-ink">
      <PageIntro eyebrow={page.eyebrow} title={page.title} lede={page.lede} />

      {page.intro && (
        <section className="px-5 pb-20 md:px-10 md:pb-28">
          <p className="sd-reveal display max-w-4xl text-[clamp(1.3rem,2.8vw,2.2rem)] leading-[1.3] text-mist-100">
            {page.intro}
          </p>
        </section>
      )}

      {/* Big-number band ---------------------------------------------------- */}
      {page.stats && (
        <section className="border-y border-mist-600 px-5 py-20 md:px-10 md:py-28">
          <SectionHead label="The cost of standing still" title={page.stats.title} body={page.stats.note} />
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {page.stats.items.map((s) => (
              <div key={s.label} className="sd-reveal">
                <p className="display text-[clamp(2.6rem,6vw,4.5rem)] leading-none text-zilla">
                  {s.value}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-mist-300">{s.label}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Outcome tiles ------------------------------------------------------ */}
      {page.benefits && (
        <section className="px-5 py-20 md:px-10 md:py-28">
          <SectionHead title={page.benefits.title} body={page.benefits.body} />
          <div className="grid gap-px overflow-hidden rounded-sm bg-mist-600 sm:grid-cols-2 lg:grid-cols-4">
            {page.benefits.items.map((b) => (
              <div key={b.title} className="sd-reveal bg-ink p-8">
                <h3 className="display text-xl text-mist-100">{b.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-mist-300">{b.body}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Pain cards --------------------------------------------------------- */}
      {page.pains && (
        <section className="border-t border-mist-600 px-5 py-20 md:px-10 md:py-28">
          <SectionHead label="What it's costing you" title={page.pains.title} />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {page.pains.items.map((p) => (
              <div
                key={p.title}
                className="sd-reveal flex flex-col border border-mist-600 p-8 transition-colors duration-500 hover:border-zilla/40"
              >
                <h3 className="display text-xl text-mist-100">{p.title}</h3>
                <ul className="mt-5 flex-1 space-y-3">
                  {p.bullets.map((b) => (
                    <li key={b} className="flex gap-3 text-sm leading-relaxed text-mist-300">
                      <span aria-hidden className="mt-[0.55em] h-px w-3 shrink-0 bg-mist-400" />
                      {b}
                    </li>
                  ))}
                </ul>
                {p.note && (
                  <p className="mt-6 border-t border-mist-600 pt-4 text-sm text-zilla">
                    <span className="label mr-2 text-mist-400">{p.note.label}</span>
                    {p.note.text}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Pillars — the substance -------------------------------------------- */}
      <section className="border-t border-mist-600 px-5 py-20 md:px-10 md:py-28">
        <SectionHead label="What we do" title={`How ${page.nav.toLowerCase()} works with us`} />
        <div className="space-y-px bg-mist-600">
          {page.pillars.map((p, i) => (
            <article key={p.title} className="sd-reveal bg-ink py-12 md:py-16">
              <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
                <div>
                  <p className="label mb-4 text-mist-400">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="display text-[clamp(1.5rem,3vw,2.4rem)] text-mist-100">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-base text-zilla">{p.tagline}</p>
                  <p className="mt-5 max-w-md text-sm leading-relaxed text-mist-300">{p.body}</p>
                </div>

                <div className="grid gap-10 sm:grid-cols-2">
                  <div>
                    <p className="label mb-4 text-mist-400">
                      {p.bulletsLabel || "What it covers"}
                    </p>
                    <ul className="space-y-3">
                      {p.bullets.map((b) => (
                        <li key={b} className="flex gap-3 text-sm leading-relaxed text-mist-200">
                          <span aria-hidden className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-zilla" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {p.deliverables && (
                    <div>
                      <p className="label mb-4 text-mist-400">
                        {p.deliverablesLabel || "Deliverables include"}
                      </p>
                      <ul className="space-y-3">
                        {p.deliverables.map((d) => (
                          <li
                            key={d}
                            className="border-b border-mist-600 pb-3 text-sm leading-relaxed text-mist-300"
                          >
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Why us ------------------------------------------------------------- */}
      {page.advantage && (
        <section className="border-t border-mist-600 px-5 py-20 md:px-10 md:py-28">
          <SectionHead label="Why us" title={page.advantage.title} />
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {page.advantage.items.map((a) => (
              <div key={a.title} className="sd-reveal">
                <h3 className="display text-lg text-zilla">{a.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-mist-300">{a.body}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Process ------------------------------------------------------------ */}
      {page.process && (
        <section className="border-t border-mist-600 px-5 py-20 md:px-10 md:py-28">
          <SectionHead label="Process" title={page.process.title} body={page.process.note} />
          <div className="grid gap-px bg-mist-600 md:grid-cols-2 xl:grid-cols-4">
            {page.process.phases.map((ph) => (
              <div key={ph.label} className="sd-reveal bg-ink p-8">
                <h3 className="display mb-6 border-b border-mist-600 pb-4 text-base text-mist-100">
                  {ph.label}
                </h3>
                <ul className="space-y-3">
                  {ph.items.map((it) => (
                    <li key={it} className="text-sm leading-relaxed text-mist-300">
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FAQ ---------------------------------------------------------------- */}
      {page.faq && (
        <section className="border-t border-mist-600 px-5 py-20 md:px-10 md:py-28">
          <SectionHead label="Have more questions?" title="Frequently asked questions" />
          <div className="border-t border-mist-600">
            {page.faq.map((f, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={f.q} className="sd-reveal border-b border-mist-600">
                  <button
                    onClick={() => setOpenFaq(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    data-cursor="true"
                    className="group flex w-full items-center gap-6 py-6 text-left"
                  >
                    <span
                      className={`flex-1 text-base transition-colors duration-500 md:text-lg ${
                        isOpen ? "text-zilla" : "text-mist-100 group-hover:text-zilla"
                      }`}
                    >
                      {f.q}
                    </span>
                    <span
                      className={`relative h-3.5 w-3.5 shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        isOpen ? "rotate-45" : ""
                      }`}
                    >
                      <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current" />
                      <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
                    </span>
                  </button>
                  <div
                    className="grid transition-[grid-template-rows] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-2xl pb-7 text-sm leading-relaxed text-mist-300">
                        {f.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Close + next service ------------------------------------------------ */}
      <section className="border-t border-mist-600 px-5 py-20 md:px-10 md:py-28">
        <div className="sd-reveal max-w-3xl">
          <h2 className="display text-[clamp(1.9rem,5vw,3.6rem)] text-mist-100">
            {page.close.title}
          </h2>
          <p className="mt-6 text-base leading-relaxed text-mist-300">{page.close.body}</p>
          <Button to="/apply" surface="dark" className="mt-10">
            {page.close.cta}
          </Button>
        </div>

        <Link
          to={`/services/${next.slug}`}
          data-cursor="true"
          className="sd-reveal group mt-20 flex items-end justify-between border-t border-mist-600 pt-8"
        >
          <span className="label text-mist-400">Next service</span>
          <span className="display text-[clamp(1.3rem,3.4vw,2.6rem)] text-mist-100 transition-colors duration-500 group-hover:text-zilla">
            {next.nav} →
          </span>
        </Link>
      </section>

      <FooterCTA />
    </main>
  );
}
