import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "../lib/gsapSetup";

/** Above this speed (px/frame) the ring reaches its full stretch. */
const MAX_SPEED = 42;
/** How far the ring is pulled toward the centre of what it's over. */
const MAGNET = 0.32;

/**
 * Two-part cursor: a hard dot that tracks 1:1 and a soft ring that lags
 * behind it.
 *
 * The ring is not a rigid shape. It deforms with velocity — stretching along
 * the direction of travel and pinching across it, like something with mass
 * being dragged — and it's magnetically drawn toward the centre of whatever
 * interactive element it enters. Those two behaviours are the whole
 * personality; without them a trailing ring is just a circle with lag.
 *
 * Pointer-coarse devices and reduced-motion get nothing at all.
 */
export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine || prefersReducedMotion()) return;

    const dot = dotRef.current;
    const ring = ringRef.current;

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, opacity: 0 });

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ringPos = { ...pos };
    const vel = { x: 0, y: 0 };
    let hovered = null;
    let angle = 0;
    // Press is tweened into a value the ticker multiplies in, because the
    // ticker owns scaleX/scaleY — a plain `scale` tween would be overwritten
    // on the very next frame.
    const press = { v: 1 };

    // The system cursor is only hidden while our replacement is actually on
    // screen. Tying the two together means every failure mode — no pointer
    // yet, pointer left the window, a thrown error — falls back to the real
    // cursor instead of leaving the visitor with nothing to aim.
    let visible = false;
    const show = () => {
      if (visible) return;
      visible = true;
      document.body.classList.add("has-cursor");
      gsap.to([dot, ring], { opacity: 1, duration: 0.3, overwrite: true });
    };
    const hide = () => {
      if (!visible) return;
      visible = false;
      document.body.classList.remove("has-cursor");
      gsap.to([dot, ring], { opacity: 0, duration: 0.25, overwrite: true });
    };

    const onMove = (e) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      show();
      gsap.set(dot, { x: pos.x, y: pos.y });
    };

    const tick = () => {
      // Magnetism: while over something interactive, the ring's target drifts
      // toward that element's centre rather than sitting under the pointer.
      let tx = pos.x;
      let ty = pos.y;
      if (hovered) {
        const r = hovered.getBoundingClientRect();
        tx += (r.left + r.width / 2 - pos.x) * MAGNET;
        ty += (r.top + r.height / 2 - pos.y) * MAGNET;
      }

      const px = ringPos.x;
      const py = ringPos.y;
      ringPos.x += (tx - ringPos.x) * 0.16;
      ringPos.y += (ty - ringPos.y) * 0.16;

      // Velocity is measured from the ring's own movement, not the pointer's,
      // so the deformation stays in sync with the lag rather than leading it.
      vel.x = ringPos.x - px;
      vel.y = ringPos.y - py;
      const speed = Math.hypot(vel.x, vel.y);
      const stretch = Math.min(speed / MAX_SPEED, 1) * 0.5;

      // Only re-take the angle when actually moving; at a standstill atan2 of
      // near-zero noise makes the ring spin on the spot.
      if (speed > 0.4) angle = (Math.atan2(vel.y, vel.x) * 180) / Math.PI;

      gsap.set(ring, {
        x: ringPos.x,
        y: ringPos.y,
        rotation: angle,
        scaleX: (1 + stretch) * press.v,
        scaleY: (1 - stretch * 0.62) * press.v,
      });
    };

    const enter = (e) => {
      const el = e.target.closest?.("[data-cursor]");
      if (!el) return;
      hovered = el;
      gsap.to(ring, {
        width: 54,
        height: 54,
        borderColor: "rgba(0,206,0,0.9)",
        backgroundColor: "rgba(0,206,0,0.10)",
        duration: 0.45,
        ease: "power3.out",
      });
      gsap.to(dot, { scale: 0, duration: 0.3, ease: "power3.out" });
    };

    const leave = (e) => {
      if (!e.target.closest?.("[data-cursor]")) return;
      hovered = null;
      gsap.to(ring, {
        width: 30,
        height: 30,
        borderColor: "rgba(242,242,240,0.45)",
        backgroundColor: "rgba(0,0,0,0)",
        duration: 0.45,
        ease: "power3.out",
      });
      gsap.to(dot, { scale: 1, duration: 0.3, ease: "power3.out" });
    };

    const onDown = () => gsap.to(press, { v: 0.72, duration: 0.25, overwrite: true });
    const onUp = () => gsap.to(press, { v: 1, duration: 0.35, overwrite: true });
    // A null relatedTarget means the pointer left the window entirely.
    const onOut = (e) => {
      if (e.relatedTarget === null) hide();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", enter);
    window.addEventListener("pointerout", leave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.addEventListener("pointerout", onOut);
    // Switching tabs or apps can swallow the pointerout, which would leave
    // the system cursor hidden with nothing drawn in its place.
    window.addEventListener("blur", hide);
    gsap.ticker.add(tick);

    return () => {
      document.body.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", enter);
      window.removeEventListener("pointerout", leave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerout", onOut);
      window.removeEventListener("blur", hide);
      gsap.ticker.remove(tick);
    };
  }, []);

  // Nothing to render at all on touch/reduced-motion — the effect bails
  // early there, which would otherwise strand both elements at 0,0.
  const enabled =
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !prefersReducedMotion();
  if (!enabled) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[9999] hidden md:block">
      <div
        ref={ringRef}
        style={{ opacity: 0 }}
        className="absolute h-[30px] w-[30px] rounded-full border border-mist-100/45"
      />
      <div
        ref={dotRef}
        style={{ opacity: 0 }}
        className="absolute h-[5px] w-[5px] rounded-full bg-mist-100"
      />
    </div>
  );
}
