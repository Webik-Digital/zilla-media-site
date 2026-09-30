import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap, prefersReducedMotion } from "../lib/gsapSetup";
import { lockScroll, unlockScroll } from "../hooks/useSmoothScroll";
import { nav, navGroups, footer } from "../data/site";

// Leads with the campaign and the worn cap: the menu is the first thing many
// people open, and it should show people rather than product shots.
const previews = [
  "/media/work-umwad.png",
  "/media/work-cap.png",
  "/media/work-stacrz.png",
  "/media/work-mercury.png",
  "/media/work-dfy.png",
];

/**
 * Full-bleed menu. The panel wipes up on a clip-path, the links stagger in
 * from below their own clip masks, and hovering a link cross-fades a preview
 * plate on the right. Closing plays the whole thing in reverse.
 */
export default function MenuOverlay({ open, onClose }) {
  const rootRef = useRef(null);
  const tlRef = useRef(null);
  const plateRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true });
      tl.set(rootRef.current, { pointerEvents: "auto" })
        .fromTo(
          ".menu-panel",
          { clipPath: "inset(0% 0% 100% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 0.85, ease: "expo.inOut" }
        )
        .fromTo(
          ".menu-link-inner",
          { yPercent: 135, rotate: 3 },
          {
            yPercent: 0,
            rotate: 0,
            duration: 0.75,
            ease: "expo.out",
            stagger: 0.06,
          },
          "-=0.42"
        )
        .fromTo(
          ".menu-meta",
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", stagger: 0.07 },
          "-=0.5"
        )
        .fromTo(
          ".menu-plate",
          { scale: 1.14, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.9, ease: "expo.out" },
          "-=0.8"
        );
      tlRef.current = tl;
    }, rootRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const tl = tlRef.current;
    if (!tl) return;
    if (open) {
      lockScroll();
      tl.timeScale(1).play();
    } else {
      tl.timeScale(1.6).reverse();
      unlockScroll();
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const hoverPreview = (i) => {
    if (!plateRef.current || prefersReducedMotion()) return;
    const img = plateRef.current.querySelector("img");
    gsap.to(img, {
      opacity: 0,
      duration: 0.18,
      onComplete: () => {
        img.src = previews[i % previews.length];
        gsap.to(img, { opacity: 1, duration: 0.4 });
      },
    });
  };

  return (
    <div
      ref={rootRef}
      className={`fixed inset-0 z-[9000] ${open ? "" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      {/* With motion off there's no timeline to drive the wipe, so the panel
          has to open and close from state or the menu is unusable. */}
      <div
        className="menu-panel absolute inset-0 bg-ink-2"
        style={{
          clipPath: prefersReducedMotion()
            ? open
              ? "inset(0% 0% 0% 0%)"
              : "inset(0% 0% 100% 0%)"
            : "inset(0% 0% 100% 0%)",
        }}
      >
        <div className="mx-auto flex h-full max-w-[1600px] flex-col justify-between px-6 pb-8 pt-28 md:px-12 md:pb-12 md:pt-36">
          <div className="grid gap-12 lg:grid-cols-[1fr_0.45fr_0.7fr]">
            <nav>
              <ul>
                {nav.map((item, i) => (
                  // The size class lives on the clipping element itself:
                  // .line-clip sizes its descender allowance in em, which
                  // would otherwise resolve against the 16px list font.
                  <li
                    key={item.to}
                    className="line-clip text-[clamp(2.75rem,8vw,7rem)]"
                  >
                    <Link
                      to={item.to}
                      onClick={onClose}
                      onMouseEnter={() => hoverPreview(i)}
                      data-cursor="true"
                      className="menu-link-inner group block py-1"
                    >
                      <span className="display flex items-baseline gap-4 text-mist-100 transition-colors duration-500 hover:text-zilla">
                        <span className="label translate-y-[-0.9em] text-mist-400 text-[0.55rem]">
                          0{i + 1}
                        </span>
                        {item.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Secondary taxonomy — the live site's Services and Resources
                dropdowns, which have nowhere to drop inside a full-bleed
                menu. */}
            <div className="flex flex-col gap-10 self-center">
              {navGroups.map((group) => (
                <div key={group.title} className="menu-meta">
                  <p className="label mb-4 text-mist-400">{group.title}</p>
                  <ul className="space-y-2.5">
                    {group.links.map((l) => (
                      <li key={l.label}>
                        {l.to ? (
                          <Link
                            to={l.to}
                            onClick={onClose}
                            data-cursor="true"
                            className="sweep text-mist-200"
                          >
                            {l.label}
                          </Link>
                        ) : (
                          <span className="flex items-center gap-2 text-mist-400">
                            {l.label}
                            {l.note && (
                              <span className="label rounded-sm border border-mist-600 px-1.5 py-0.5 text-[0.5rem]">
                                {l.note}
                              </span>
                            )}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div
              ref={plateRef}
              className="menu-plate relative hidden aspect-[4/5] w-full self-center overflow-hidden bg-ink-3 lg:block"
            >
              <img
                src={previews[0]}
                alt=""
                className="h-full w-full object-cover opacity-90 grayscale transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
            </div>
          </div>

          <div className="grid gap-8 border-t border-mist-600 pt-8 md:grid-cols-3">
            <div className="menu-meta">
              <p className="label mb-3 text-mist-400">Business enquiry</p>
              <a
                href="mailto:hello@zillamedia.co"
                data-cursor="true"
                className="sweep text-mist-100"
              >
                hello@zillamedia.co
              </a>
            </div>
            <div className="menu-meta">
              <p className="label mb-3 text-mist-400">Social</p>
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {footer.social.map((s) => (
                  <span key={s} data-cursor="true" className="sweep text-mist-200">
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div className="menu-meta">
              <p className="label mb-3 text-mist-400">Studio</p>
              <p className="max-w-xs text-sm text-mist-300">
                Building bold brands with high-impact web, content and paid ads.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
