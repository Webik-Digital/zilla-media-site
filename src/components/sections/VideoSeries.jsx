import { useCallback, useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "../../lib/gsapSetup";
import { lockScroll, unlockScroll } from "../../hooks/useSmoothScroll";
import { series } from "../../data/site";

/**
 * The Branding Series carousel.
 *
 * Built to be wired, not faked. An episode with a `videoUrl` is fully
 * playable: the card opens a lightbox that handles both a file (<video>) and a
 * YouTube/Vimeo embed, picked by URL shape. An episode without one renders a
 * muted "Coming soon" state instead of a play button that does nothing —
 * dishonest affordances are worse than an obvious gap.
 *
 * Adding a URL in data/site.js is the only change needed to make a card live.
 */

/** Embeds need an iframe; anything else is treated as a direct file. */
function embedSrc(url) {
  const yt = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/
  );
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?autoplay=1&rel=0`;
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1`;
  return null;
}

function Lightbox({ episode, onClose }) {
  const panelRef = useRef(null);

  useEffect(() => {
    lockScroll();
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    if (!prefersReducedMotion() && panelRef.current) {
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, scale: 0.96 },
        { opacity: 1, scale: 1, duration: 0.45, ease: "expo.out" }
      );
    }
    return () => {
      window.removeEventListener("keydown", onKey);
      unlockScroll();
    };
  }, [onClose]);

  const iframe = embedSrc(episode.videoUrl);

  return (
    <div
      className="fixed inset-0 z-[9600] flex items-center justify-center bg-ink/95 p-5 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={episode.title}
      onClick={onClose}
    >
      <button
        onClick={onClose}
        aria-label="Close video"
        data-cursor="true"
        className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-mist-600 text-mist-100 transition-colors duration-300 hover:border-zilla hover:text-zilla md:right-10 md:top-10"
      >
        <span aria-hidden className="relative block h-4 w-4">
          <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 rotate-45 bg-current" />
          <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 rotate-45 bg-current" />
        </span>
      </button>

      <div
        ref={panelRef}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-5xl overflow-hidden rounded-sm bg-black shadow-2xl"
      >
        <div className="relative aspect-video">
          {iframe ? (
            <iframe
              src={iframe}
              title={episode.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          ) : (
            <video
              src={episode.videoUrl}
              poster={episode.poster}
              controls
              autoPlay
              playsInline
              className="absolute inset-0 h-full w-full"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default function VideoSeries() {
  const rootRef = useRef(null);
  const [playing, setPlaying] = useState(null);
  const close = useCallback(() => setPlaying(null), []);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".vs-card",
        { y: 60, opacity: 0, rotateY: -8 },
        {
          y: 0,
          opacity: 1,
          rotateY: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: ".vs-track", start: "top 85%" },
        }
      );
      gsap.fromTo(
        ".vs-title",
        { yPercent: 135 },
        {
          yPercent: 0,
          duration: 1.15,
          ease: "expo.out",
          stagger: 0.09,
          scrollTrigger: { trigger: rootRef.current, start: "top 75%" },
        }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative z-10 overflow-hidden bg-ink px-5 py-24 md:px-10 md:py-36"
    >
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-12 md:mb-20">
          <h2 className="display text-[clamp(2.2rem,7vw,6rem)] uppercase leading-[0.9] text-mist-100">
            <span className="line-clip">
              <span className="vs-title block">{series.titleA}</span>
            </span>
            <span className="line-clip">
              <span className="vs-title block text-zilla">{series.titleB}</span>
            </span>
          </h2>
          <p className="mt-8 max-w-xl text-base leading-relaxed text-mist-300">
            {series.intro}
          </p>
        </div>

        <div
          className="vs-track grid gap-6 md:grid-cols-3 md:gap-8"
          style={{ perspective: "1400px" }}
        >
          {series.episodes.map((ep) => {
            const live = Boolean(ep.videoUrl);
            const Tag = live ? "button" : "div";
            return (
              <Tag
                key={ep.title}
                {...(live
                  ? {
                      onClick: () => setPlaying(ep),
                      "data-cursor": "true",
                      "aria-label": `Play ${ep.title}`,
                    }
                  : {})}
                className={`vs-card group relative block w-full overflow-hidden rounded-sm bg-ink-2 text-left ${
                  live ? "cursor-pointer" : ""
                }`}
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={ep.poster}
                    alt={ep.title}
                    loading="lazy"
                    className={`h-full w-full object-cover transition-all duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      live
                        ? "group-hover:scale-105"
                        : "opacity-70 grayscale-[0.35]"
                    }`}
                  />

                  {/* Play affordance only where it actually plays. */}
                  {live ? (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-zilla text-ink transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110">
                        <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6" aria-hidden>
                          <path d="M8 5v14l11-7z" fill="currentColor" />
                        </svg>
                      </span>
                    </span>
                  ) : (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="flex h-16 w-16 items-center justify-center rounded-full border border-mist-500/60 text-mist-400">
                        <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6" aria-hidden>
                          <path d="M8 5v14l11-7z" fill="currentColor" />
                        </svg>
                      </span>
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between gap-4 border-t border-mist-600 px-5 py-4">
                  <div>
                    <p className="label text-mist-400">{ep.ep}</p>
                    <h3 className="mt-1.5 text-mist-100">{ep.title}</h3>
                  </div>
                  {!live && (
                    <span className="label shrink-0 rounded-sm border border-mist-600 px-2 py-1 text-mist-400">
                      Soon
                    </span>
                  )}
                </div>
              </Tag>
            );
          })}
        </div>
      </div>

      {playing && <Lightbox episode={playing} onClose={close} />}
    </section>
  );
}
