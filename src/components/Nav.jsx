import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { gsap, ScrollTrigger } from "../lib/gsapSetup";
import { MARK_PATH } from "../lib/zillaMark";
import MenuOverlay from "./MenuOverlay";

/**
 * Small pill button used for both nav actions.
 *
 * Filled to match the site's Button, but kept as its own component: the nav
 * floats over sections of both grounds, so it has to flip on the `light` flag
 * per scroll position rather than take a fixed `surface` prop. Padding is
 * tighter too — these are chrome, not content CTAs.
 */
function Pill({ children, as: As = "button", light, className = "", ...rest }) {
  return (
    <As
      {...rest}
      data-cursor="true"
      className={`label label-btn rounded-full px-4 py-2 transition-colors duration-500 hover:bg-zilla hover:text-ink md:px-5 ${
        light ? "bg-ink text-mist-100" : "label-on-dark bg-mist-100 text-ink"
      } ${className}`}
    >
      {children}
    </As>
  );
}

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [light, setLight] = useState(false);
  const barRef = useRef(null);
  const { pathname } = useLocation();

  // Half the site is on paper, so the bar has to flip to ink or it vanishes.
  // Sections opt in with data-nav-theme="light"; a trigger watches each one
  // cross the bar's own line rather than guessing from scroll position.
  useEffect(() => {
    const triggers = gsap.utils
      .toArray('[data-nav-theme="light"]')
      .map((el) =>
        ScrollTrigger.create({
          trigger: el,
          start: "top 68px",
          end: "bottom 68px",
          onToggle: (self) => setLight(self.isActive),
        })
      );
    return () => triggers.forEach((t) => t.kill());
  }, [pathname]);

  // The overlay is always dark, so the bar goes back to light-on-dark while
  // it's open regardless of what's underneath.
  const isLight = light && !open;

  // Hide on scroll-down, reveal on scroll-up — keeps the huge hero clean
  // while never stranding the visitor without navigation.
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const goingDown = y > last && y > 240;
      gsap.to(barRef.current, {
        yPercent: goingDown && !open ? -140 : 0,
        duration: 0.6,
        ease: "power3.out",
        overwrite: true,
      });
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  return (
    <>
      <header
        ref={barRef}
        className="fixed inset-x-0 top-0 z-[9500] flex items-center justify-between px-5 py-5 md:px-10 md:py-7"
      >
        <Link
          to="/"
          onClick={() => setOpen(false)}
          data-cursor="true"
          className="flex items-center gap-2.5"
          aria-label="Zilla Media home"
        >
          <svg viewBox="0 0 100 100" className="h-6 w-6 md:h-7 md:w-7">
            <path d={MARK_PATH} fill="#00ce00" />
          </svg>
          <span
            className={`display text-[0.95rem] font-semibold uppercase tracking-[0.02em] transition-colors duration-500 md:text-[1.05rem] ${
              isLight ? "text-ink" : "text-mist-100"
            }`}
          >
            Zilla<span className={isLight ? "text-mist-300" : "text-mist-400"}>Media</span>
          </span>
        </Link>

        <div className="flex items-center gap-2 md:gap-3">
          <Pill as={Link} to="/contact" light={isLight} className="hidden sm:inline-block">
            Book a call
          </Pill>
          <Pill light={isLight} onClick={() => setOpen((v) => !v)} aria-expanded={open}>
            <span className="flex items-center gap-2">
              {open ? "Close" : "Menu"}
              <span className="relative inline-flex h-2 w-3.5 flex-col justify-between">
                <span
                  className={`block h-px w-full bg-current transition-transform duration-500 ${
                    open ? "translate-y-[3.5px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`block h-px w-full bg-current transition-transform duration-500 ${
                    open ? "-translate-y-[3.5px] -rotate-45" : ""
                  }`}
                />
              </span>
            </span>
          </Pill>
        </div>
      </header>

      <MenuOverlay open={open} onClose={() => setOpen(false)} />
    </>
  );
}
