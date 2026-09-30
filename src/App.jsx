import { useCallback, useEffect, useRef, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { gsap, ScrollTrigger, prefersReducedMotion } from "./lib/gsapSetup";
import useSmoothScroll, { scrollToTop } from "./hooks/useSmoothScroll";
import Cursor from "./components/Cursor";
import Preloader from "./components/Preloader";
import Nav from "./components/Nav";
import Home from "./pages/Home";
import Work from "./pages/Work";
import ServicesPage from "./pages/ServicesPage";
import ServiceDetail from "./pages/ServiceDetail";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import ApplyNow from "./pages/ApplyNow";
import About from "./pages/About";
import Contact from "./pages/Contact";

/**
 * Routes with a curtain transition. The panel is driven off a clip-path so
 * the outgoing page stays put underneath it — the swap happens while the
 * screen is fully covered, then the panel lifts off the incoming page.
 */
// Curtain timings. The swap lands ~0.82s in and the timeline finishes ~1.9s
// in, so the two failsafes sit just past each of those: late enough never to
// cut a healthy transition short, early enough that a stalled one is invisible.
const COMMIT_FAILSAFE_MS = 1200;
const PANEL_FAILSAFE_MS = 2600;

function AnimatedRoutes({ ready }) {
  const location = useLocation();
  const [shown, setShown] = useState(location);
  const panelRef = useRef(null);
  const markRef = useRef(null);

  // Read the current page through a ref so committing a swap doesn't feed back
  // into this effect's dependencies. With `shown.pathname` in the array, the
  // commit re-ran the effect and tore down the timeline that was still playing.
  const shownRef = useRef(shown);
  useEffect(() => {
    shownRef.current = shown;
  }, [shown]);

  useEffect(() => {
    if (location.pathname === shownRef.current.pathname) return;

    // The swap must never be owned solely by an animation callback. A stalled
    // or interrupted timeline used to mean the route never changed and the
    // curtain stayed over the page — which reads as "the page didn't load".
    // rAF stops entirely in a backgrounded tab, so this is routine, not rare.
    let committed = false;
    const commit = () => {
      if (committed) return;
      committed = true;
      setShown(location);
      scrollToTop();
    };

    /** Put the curtain back out of the way, whatever state it stopped in. */
    const clearPanel = () => {
      // Null on unmount — and a throw in here would be the very failure this
      // whole guard exists to prevent.
      if (panelRef.current) {
        gsap.set(panelRef.current, {
          clipPath: "inset(100% 0% 0% 0%)",
          pointerEvents: "none",
        });
      }
      if (markRef.current) gsap.set(markRef.current, { opacity: 0 });
    };

    if (prefersReducedMotion()) {
      commit();
      return;
    }

    const tl = gsap.timeline();
    tl.set(panelRef.current, { pointerEvents: "auto" })
      .fromTo(
        panelRef.current,
        { clipPath: "inset(100% 0% 0% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 0.62, ease: "expo.inOut" }
      )
      .fromTo(
        markRef.current,
        { opacity: 0, scale: 0.8, rotate: -12 },
        { opacity: 1, scale: 1, rotate: 0, duration: 0.5, ease: "expo.out" },
        "-=0.3"
      )
      .add(commit)
      .to(markRef.current, { opacity: 0, duration: 0.25 }, "+=0.08")
      .to(panelRef.current, {
        clipPath: "inset(0% 0% 100% 0%)",
        duration: 0.75,
        ease: "expo.inOut",
      })
      .set(panelRef.current, { pointerEvents: "none" })
      .add(() => ScrollTrigger.refresh());

    // Timers keep running when rAF doesn't, so these still fire in a
    // backgrounded tab and the navigation lands either way.
    const commitTimer = setTimeout(commit, COMMIT_FAILSAFE_MS);
    const panelTimer = setTimeout(() => {
      // Not finished by now means it never will — rAF isn't running. Drop the
      // animation rather than leave a black curtain over a page that has in
      // fact loaded.
      if (tl.progress() < 1) {
        tl.kill();
        clearPanel();
      }
    }, PANEL_FAILSAFE_MS);

    return () => {
      clearTimeout(commitTimer);
      clearTimeout(panelTimer);
      tl.kill();
      // Superseded by a newer navigation, or unmounting: commit anyway so no
      // route change is ever dropped, and never leave the curtain covering the
      // page. The incoming navigation draws its own.
      commit();
      clearPanel();
    };
  }, [location]);

  return (
    <>
      <Routes location={shown} key={shown.pathname}>
        <Route path="/" element={<Home ready={ready} />} />
        <Route path="/work" element={<Work />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:slug" element={<ServiceDetail />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/apply" element={<ApplyNow />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<Home ready={ready} />} />
      </Routes>

      <div
        ref={panelRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[9700] flex items-center justify-center bg-ink"
        style={{ clipPath: "inset(100% 0% 0% 0%)" }}
      >
        <svg ref={markRef} viewBox="0 0 100 100" className="h-16 w-16 opacity-0">
          <path
            d="M55.22 0 L55.22 37.58 L74.07 18.58 L74.07 33.78 L55.22 52.36 L55.22 74.66 L92.65 37.58 L92.65 52.36 L44.81 100 L44.81 62.67 L26.32 81.08 L26.32 66.22 L44.81 47.8 L44.81 25.34 L7.35 62.67 L7.35 47.8Z"
            fill="#00ce00"
          />
        </svg>
      </div>
    </>
  );
}

const SEEN_KEY = "zm.sting.seen";

/** The sting is a first-impression, not a toll booth on every page load. */
function stingAlreadySeen() {
  try {
    return sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    // Private modes can throw on storage access; just play it.
    return false;
  }
}

export default function App() {
  const [ready, setReady] = useState(
    () => prefersReducedMotion() || stingAlreadySeen()
  );
  useSmoothScroll();

  const onStingDone = useCallback(() => {
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      // Nothing to do — it just replays next load.
    }
    setReady(true);
  }, []);

  // Nothing invented should ever reach a client review unnoticed. Every
  // fabricated block carries data-placeholder; this surfaces the running total
  // in dev so it cannot quietly survive to launch. See PLACEHOLDERS.md.
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const id = setTimeout(() => {
      const found = document.querySelectorAll("[data-placeholder]");
      if (!found.length) return;
      console.groupCollapsed(
        `%c⚠ ${found.length} placeholder block(s) on this page — not real Zilla Media content`,
        "color:#00ce00;font-weight:bold"
      );
      found.forEach((el) => console.log("•", el.dataset.placeholder, el));
      console.info("Full inventory: PLACEHOLDERS.md");
      console.groupEnd();
    }, 800);
    return () => clearTimeout(id);
  });

  // Pinned sections, late-loading images and web fonts all change document
  // height after the triggers are built, which leaves scrubbed animations
  // stuck at progress 0. Re-measure once everything has actually landed.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    const timers = [setTimeout(refresh, 300), setTimeout(refresh, 1200)];
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh);
    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("load", refresh);
    };
  }, [ready]);

  return (
    <>
      {/* Staging marker. Built only by `npm run deploy:staging`, which runs
          vite with --mode staging; the production build strips this branch
          entirely. It exists because staging and production render the same
          site at two URLs, and the whole point of the split is lost if someone
          reviews one thinking it's the other. */}
      {import.meta.env.MODE === "staging" && (
        <div
          aria-hidden
          className="pointer-events-none fixed bottom-3 left-3 z-[9999] rounded-sm bg-zilla px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-ink"
        >
          Staging
        </div>
      )}
      <Cursor />
      {!ready && <Preloader onDone={onStingDone} />}
      <Nav />
      <AnimatedRoutes ready={ready} />
    </>
  );
}
