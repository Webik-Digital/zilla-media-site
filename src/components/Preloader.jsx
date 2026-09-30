import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "../lib/gsapSetup";
import { MARK_PATH } from "../lib/zillaMark";
import { lockScroll, unlockScroll } from "../hooks/useSmoothScroll";

/** Beat to rest on the finished lockup before lifting away. */
const HOLD = 0.7;
/** Safety net: if the clip never reports ending, move on anyway. */
const MAX_WAIT = 6000;

/**
 * Opening sting — the supplied claw animation, played as video.
 *
 * The clip is pre-processed rather than used raw (public/media/sting.mp4):
 * its audio track is stripped, the trailing static hold is trimmed, and the
 * white background behind the claw is keyed to black for the first 1.15s
 * only. That time limit matters — the closing wordmark is white text, so
 * keying white across the whole clip would erase it along with the
 * background. Its blacks are also crushed from rgb(16,16,16) to true zero,
 * or the video would read as a lighter rectangle sitting on the page.
 *
 * Beyond the theatre it buys the hero's WebGL scene a beat to compile its
 * shaders before anyone sees it.
 */
export default function Preloader({ onDone }) {
  const rootRef = useRef(null);
  const videoRef = useRef(null);
  const doneRef = useRef(false);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      onDone?.();
      return;
    }

    lockScroll();
    // Captured up front: reading refs in the cleanup would read whatever
    // they point at by then, not what this effect set up.
    const root = rootRef.current;
    const video = videoRef.current;

    const lift = (delay = HOLD) => {
      if (doneRef.current) return;
      doneRef.current = true;
      gsap.to(root, {
        yPercent: -100,
        duration: 0.95,
        ease: "expo.inOut",
        delay,
        onComplete: () => {
          unlockScroll();
          onDone?.();
        },
      });
    };

    const onEnded = () => lift();
    const onError = () => setVideoFailed(true);

    if (video) {
      video.addEventListener("ended", onEnded, { once: true });
      video.addEventListener("error", onError, { once: true });
      // Autoplay can still be refused when muted — some mobile low-power
      // modes block it outright — so fall back rather than hanging.
      const played = video.play();
      if (played?.catch) played.catch(() => setVideoFailed(true));
    }

    // Covers a stalled download, or a decode that never fires `ended`.
    const timeoutId = window.setTimeout(() => lift(0), MAX_WAIT);

    return () => {
      window.clearTimeout(timeoutId);
      video?.removeEventListener("ended", onEnded);
      video?.removeEventListener("error", onError);
      gsap.killTweensOf(root);
      unlockScroll();
    };
  }, [onDone]);

  // With the video out of play, the static fallback still has to hand over.
  useEffect(() => {
    if (!videoFailed || prefersReducedMotion()) return;
    const id = window.setTimeout(() => {
      if (doneRef.current) return;
      doneRef.current = true;
      gsap.to(rootRef.current, {
        yPercent: -100,
        duration: 0.95,
        ease: "expo.inOut",
        onComplete: () => {
          unlockScroll();
          onDone?.();
        },
      });
    }, 900);
    return () => window.clearTimeout(id);
  }, [videoFailed, onDone]);

  if (prefersReducedMotion()) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[9998] flex items-center justify-center overflow-hidden bg-ink"
    >
      {videoFailed ? (
        // Static lockup: no motion, nothing that can fail to start.
        <div className="flex items-center gap-[2.4vmin]">
          <svg viewBox="0 0 100 100" className="h-[16vmin] w-[16vmin]" aria-hidden>
            <path d={MARK_PATH} fill="#00ce00" />
          </svg>
          <span className="display whitespace-nowrap text-[5.6vmin] font-semibold uppercase tracking-[-0.02em] text-mist-100">
            Zilla Media
          </span>
        </div>
      ) : (
        // Capped at its native 848px: upscaling this clip only softens it.
        <video
          ref={videoRef}
          className="h-auto max-h-[76vh] w-[min(88vw,848px)]"
          src="/media/sting.mp4"
          muted
          playsInline
          preload="auto"
          aria-label="Zilla Media"
        />
      )}
    </div>
  );
}
