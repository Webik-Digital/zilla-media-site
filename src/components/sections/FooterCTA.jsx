import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap, prefersReducedMotion } from "../../lib/gsapSetup";
import { footer } from "../../data/site";
import Button from "../Button";

const STEP = 7; // px between bars
const REACH = 165; // px of cursor influence — tight enough to read as a spot, not a wash

/**
 * Closing wordmark. The word is rasterised once into an offscreen mask, then
 * every column of that mask is redrawn as a vertical bar. The cursor stretches
 * whatever it passes over and pulls it green, so the type behaves like a
 * level meter rather than a picture of one.
 */
function BarWordmark({ text }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let columns = [];
    let w = 0;
    let h = 0;
    let rafId = 0;
    const pointer = { x: -9999, y: -9999 };

    /** Rasterise the word and slice it into per-column vertical runs. */
    const build = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      if (!w || !h) return;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const off = document.createElement("canvas");
      off.width = w;
      off.height = h;
      const octx = off.getContext("2d");

      // Grow the type until it just fits the available width.
      let fontSize = h * 1.15;
      octx.textBaseline = "middle";
      octx.textAlign = "center";
      for (let i = 0; i < 24; i++) {
        octx.font = `700 ${fontSize}px "Inter Tight", system-ui, sans-serif`;
        const measured = octx.measureText(text).width;
        if (measured <= w * 0.98) break;
        fontSize *= (w * 0.98) / measured;
      }
      octx.fillStyle = "#fff";
      octx.fillText(text, w / 2, h / 2);

      const data = octx.getImageData(0, 0, w, h).data;
      columns = [];
      for (let x = 0; x < w; x += STEP) {
        const runs = [];
        let start = -1;
        for (let y = 0; y < h; y++) {
          const on = data[(y * w + x) * 4 + 3] > 128;
          if (on && start < 0) start = y;
          if ((!on || y === h - 1) && start >= 0) {
            if (y - start > 2) runs.push([start, y]);
            start = -1;
          }
        }
        if (runs.length) columns.push({ x, runs });
      }
    };

    const draw = () => {
      rafId = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, w, h);
      ctx.lineCap = "round";

      for (const col of columns) {
        const dx = pointer.x - col.x;
        const near = Math.exp(-(dx * dx) / (REACH * REACH));
        // Bars stay inside the letterform. Stretching them under the cursor
        // pushed ink past the glyph's own edges, which is what read as the
        // wordmark bleeding; the constant idle breathing on top of it was the
        // "moving text". The highlight is carried by colour alone now, with
        // barely enough lift to keep it from feeling dead.
        const stretch = 1 + near * 0.06;

        // Continuous lerp from the resting grey to brand green. The previous
        // version branched at a threshold into a murky dark green, which left
        // a wide dim halo around the cursor and a visible seam where the
        // branch flipped. Squaring `near` keeps the lit pool tight.
        const heat = near * near;
        const r = Math.round(150 + (24 - 150) * heat);
        const g = Math.round(150 + (255 - 150) * heat);
        const b = Math.round(148 + (74 - 148) * heat);
        ctx.strokeStyle = `rgba(${r},${g},${b},${0.28 + heat * 0.72})`;
        ctx.lineWidth = 2.4 + heat * 1.6;

        for (const [y0, y1] of col.runs) {
          const mid = (y0 + y1) / 2;
          const half = ((y1 - y0) / 2) * stretch;
          ctx.beginPath();
          ctx.moveTo(col.x, Math.max(0, mid - half));
          ctx.lineTo(col.x, Math.min(h, mid + half));
          ctx.stroke();
        }
      }
    };

    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
    };
    const onLeave = () => {
      pointer.x = -9999;
    };
    const onResize = () => build();

    // Web fonts land after first paint; rebuilding on ready avoids slicing
    // the fallback face.
    build();
    if (document.fonts?.ready) document.fonts.ready.then(build);
    draw();

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", onResize);
    canvas.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, [text]);

  return (
    <canvas
      ref={canvasRef}
      aria-label={text}
      role="img"
      className="h-[18vh] max-h-[220px] min-h-[90px] w-full"
    />
  );
}

export default function FooterCTA() {
  const rootRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".ft-line-inner",
        { yPercent: 135 },
        {
          yPercent: 0,
          duration: 1.15,
          ease: "expo.out",
          stagger: 0.08,
          scrollTrigger: { trigger: rootRef.current, start: "top 74%" },
        }
      );
      gsap.fromTo(
        ".ft-fade",
        { y: 26, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.07,
          scrollTrigger: { trigger: rootRef.current, start: "top 66%" },
        }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={rootRef}
      className="relative z-10 overflow-hidden bg-ink px-5 pt-24 md:px-10 md:pt-36"
    >
      {/* No ambient green wash here. An `ellipse_at_bottom` gradient pools its
          brightest point on the very bottom edge, which read as a drip running
          out from under the wordmark. The only green in this footer now comes
          from the bars themselves, under the cursor. */}

      <div className="relative mx-auto max-w-[1600px]">
        <p className="ft-fade label mb-8 text-mist-400">{footer.kicker}</p>

        <h2 className="display max-w-[16ch] text-[clamp(2.4rem,7vw,6rem)] text-mist-100">
          {footer.title.split("\n").map((line) => (
            <span key={line} className="line-clip">
              <span className="ft-line-inner block">{line}</span>
            </span>
          ))}
        </h2>

        <Button to={footer.cta.to} surface="dark" className="ft-fade mt-10">
          {footer.cta.label}
        </Button>

        {/* Four columns plus Social — matches the live site's taxonomy. */}
        {/* Two columns from the smallest screen up: five groups stacked in a
            single column made the mobile footer an endless scroll. */}
        <div className="mt-20 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-mist-600 pt-10 md:mt-28 md:gap-x-10 lg:grid-cols-5">
          {footer.columns.map((col) => (
            <div key={col.title} className="ft-fade">
              <p className="label mb-4 text-mist-400">{col.title}</p>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.to ? (
                      <Link
                        to={l.to}
                        data-cursor="true"
                        className="sweep text-sm text-mist-200"
                      >
                        {l.label}
                      </Link>
                    ) : (
                      // Unlinked on the live site too — listed but not shipped.
                      <span className="flex items-center gap-2 text-sm text-mist-400">
                        {l.label}
                        {l.note && (
                          <span className="label rounded-sm border border-mist-600 px-1.5 py-0.5 text-[0.5rem] text-mist-400">
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

          <div className="ft-fade">
            <p className="label mb-4 text-mist-400">Social</p>
            <ul className="space-y-2">
              {footer.social.map((s) => (
                <li key={s}>
                  <span data-cursor="true" className="sweep text-sm text-mist-200">
                    {s}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="ft-fade">
            <p className="label mb-4 text-mist-400">Business enquiry</p>
            <a
              href="mailto:hello@zillamedia.co"
              data-cursor="true"
              className="sweep text-sm text-mist-100"
            >
              hello@zillamedia.co
            </a>
            {/* Touch devices have no cursor to move, so the invitation is
                nonsense there — the wordmark still breathes on its own. */}
            <p className="label mt-6 hidden text-mist-400 md:block">{footer.hint}</p>
          </div>
        </div>
      </div>

      <div className="relative mt-14 md:mt-20">
        <BarWordmark text="ZILLA MEDIA" />
      </div>

      <div className="relative flex flex-wrap items-center justify-between gap-3 border-t border-mist-600 py-6">
        <p className="label text-mist-400">{footer.legal}</p>
        {/* Replaces the old "Built for market domination." flourish: two lines
            opening with "Built" read as a stumble, and the credit is the one
            that has to be here. */}
        {footer.credit.to ? (
          <a
            href={footer.credit.to}
            target="_blank"
            rel="noreferrer"
            data-cursor="true"
            className="label text-mist-400 transition-colors duration-500 hover:text-zilla"
          >
            {footer.credit.label}
          </a>
        ) : (
          <p className="label text-mist-400">{footer.credit.label}</p>
        )}
      </div>
    </footer>
  );
}
