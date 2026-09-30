import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "../lib/gsapSetup";
import PageIntro from "../components/PageIntro";
import FooterCTA from "../components/sections/FooterCTA";
import { services } from "../data/site";

const shots = [
  "/media/collage-content.png",
  "/media/mood-robot.jpg",
  "/media/collage-ads.png",
  "/media/collage-web.png",
  "/media/work-dfy.png",
  "/media/vid-series.png",
];

/**
 * Accordion service index. Rows expand on click; the hovered row also drives
 * a floating plate that follows the cursor, so scanning the list previews the
 * work without leaving the page.
 */
export default function ServicesPage() {
  const rootRef = useRef(null);
  const plateRef = useRef(null);
  const [open, setOpen] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".sp-row",
        { y: 34, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.07,
          scrollTrigger: { trigger: ".sp-list", start: "top 82%" },
        }
      );

      const plate = plateRef.current;
      const xTo = gsap.quickTo(plate, "x", { duration: 0.5, ease: "power3" });
      const yTo = gsap.quickTo(plate, "y", { duration: 0.5, ease: "power3" });
      const onMove = (e) => {
        xTo(e.clientX + 28);
        yTo(e.clientY - 110);
      };
      window.addEventListener("pointermove", onMove, { passive: true });
      return () => window.removeEventListener("pointermove", onMove);
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const showPlate = (i) => {
    if (prefersReducedMotion() || !plateRef.current) return;
    plateRef.current.querySelector("img").src = shots[i % shots.length];
    gsap.to(plateRef.current, { opacity: 1, scale: 1, duration: 0.45, ease: "expo.out" });
  };
  const hidePlate = () => {
    if (!plateRef.current) return;
    gsap.to(plateRef.current, { opacity: 0, scale: 0.94, duration: 0.35 });
  };

  return (
    <main ref={rootRef} className="relative bg-ink">
      <PageIntro
        /* "Our services" eyebrow removed by request, same as the homepage. */
        title={"Market domination\nthrough innovation."}
        lede="Bold strategies, cutting-edge technology, and proven frameworks, built to take businesses to premium positioning and unstoppable growth."
      />

      <section className="sp-list px-5 pb-24 md:px-10 md:pb-36">
        <div className="border-t border-mist-600">
          {services.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.title} className="sp-row border-b border-mist-600">
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  onMouseEnter={() => showPlate(i)}
                  onMouseLeave={hidePlate}
                  data-cursor="true"
                  aria-expanded={isOpen}
                  className="group flex w-full items-center gap-6 py-7 text-left md:py-9"
                >
                  <span className="label w-10 shrink-0 text-mist-400">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`display flex-1 text-[clamp(1.5rem,3.6vw,3rem)] transition-colors duration-500 ${
                      isOpen ? "text-zilla" : "text-mist-100 group-hover:text-zilla"
                    }`}
                  >
                    {item.title}
                  </span>
                  <span
                    className={`relative h-4 w-4 shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
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
                    <p className="max-w-2xl pb-9 pl-16 text-sm leading-relaxed text-mist-300 md:text-base">
                      {item.body}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </section>

      {/* Cursor-following preview plate. */}
      <div
        ref={plateRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[8000] hidden h-56 w-44 scale-90 overflow-hidden opacity-0 md:block"
      >
        <img src={shots[0]} alt="" className="h-full w-full object-cover" />
      </div>

      <FooterCTA />
    </main>
  );
}
