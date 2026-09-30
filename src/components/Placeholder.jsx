/**
 * Marks content that is invented rather than sourced from Zilla Media.
 *
 * Case studies, testimonials and the headline figures were written to carry
 * the design while the real material is gathered — none of it is verified, and
 * none of it appears on zillamedia.co. That needs to be obvious to anyone
 * reviewing the site without putting scaffolding in front of visitors, so:
 *
 *   - `data-placeholder` is always in the DOM, making every instance greppable
 *     in the source and selectable in devtools
 *       document.querySelectorAll('[data-placeholder]')
 *   - the badge renders in dev only, so a reviewer running the site sees it
 *   - production paints nothing extra
 *
 * Remove the wrapper — not just the flag — once real content lands.
 */
export default function Placeholder({ children, note, className = "" }) {
  return (
    <div data-placeholder={note || true} className={`relative ${className}`}>
      {import.meta.env.DEV && (
        <span
          aria-hidden
          title={note || "Invented content — not from zillamedia.co"}
          className="pointer-events-none absolute -top-2 left-0 z-50 rounded-sm bg-zilla px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-ink"
        >
          Placeholder
        </span>
      )}
      {children}
    </div>
  );
}
