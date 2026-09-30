# Zilla Media — studio site

A motion-led marketing site for [zillamedia.co](https://www.zillamedia.co/), built to match
the look and feel of the supplied TRIONN reference recording: WebGL hero, scroll-scrubbed
section choreography, smooth momentum scroll, custom cursor and page transitions.

React 19 · Vite · Tailwind v4 · GSAP (ScrollTrigger + SplitText) · Lenis · Three.js

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # static output in dist/
npm run preview  # serve the build locally
```

## What's where

```
src/
  lib/zillaMark.js      the Z mark as vector geometry (see below)
  lib/gsapSetup.js      plugin registration + the reduced-motion check
  data/site.js          every string on the site, in one file
  hooks/                Lenis smooth scroll (+ lock/unlock for the menu)
  components/
    hero/HeroCanvas     act one: extruded mark, light strings, shatter
    sections/           the seven homepage sections
  pages/                Home, Work, Services, About, Contact
```

## The 3D mark

`src/lib/zillaMark.js` holds the Zilla "Z" as **16 vector points**, traced from the supplied
logo artwork and snapped onto the 45° grid the mark is drawn on — every edge is either
vertical or exactly 45°. That's what keeps the extruded bevels crisp instead of stair-stepped.

Both 3D scenes and every flat SVG on the site (nav, preloader, marquee, page transition)
render from that same source, so the mark can never drift out of sync with itself.

- **Hero** — large and centred, extruded with a bevel in near-black graphite. Colour comes
  from a green Fresnel rim added in the fragment shader (power 6, so it only catches the
  outer ~15% of each face) rather than from iridescence, which was casting a purple/prism
  tint. It shatters triangle-by-triangle as you scroll into the About copy; the shatter
  runs entirely in a vertex shader patched into the standard material via
  `onBeforeCompile`, so there's no per-frame CPU cost.
- **Services** — inlaid into the face of a stone monolith in drifting fog. There's no
  shadow map, so the mark reads by *material* contrast (polished metal against rough
  stone) rather than by relief.

## Things you'll want to change

**Typography.** Zilla's licensed brand face, Stage-Grotesk, isn't distributable, so
Inter Tight stands in. To switch: drop `StageGrotesk-{Regular,Medium,Bold}.woff2` into
`public/fonts/` and uncomment the three `@font-face` rules at the top of `src/index.css`.
`"Stage-Grotesk"` already sits first in the font stack — nothing else needs to change.

**Placeholder content.** Copy, services and project names are lifted from the live site.
These are *not*, and are marked `// [placeholder]` in `src/data/site.js`:

- Key-facts figures (40+, 1.2K+, 4.1x) and the About page stats
- All four client testimonials
- The founding year in the hero badge
- Project summaries — the client names and imagery are real, the descriptions are written

**Contact form.** No backend is wired up. Submitting composes a `mailto:` so nothing
disappears into a dead endpoint — point it at a real handler in `src/pages/Contact.jsx`.

**Deploying.** The build is fully static. Because routing is client-side, the host needs an
SPA fallback rewriting unknown paths to `/index.html`, or `/work` will 404 on a hard load.
Netlify: `/* /index.html 200` in `public/_redirects`. Vercel: a rewrite in `vercel.json`.

## Motion and accessibility

`prefers-reduced-motion: reduce` is honoured throughout, and it isn't just "animations off" —
several sections change layout so no content becomes unreachable:

- Both WebGL scenes are skipped; the hero shows a static mark
- The horizontal work reel becomes an ordinary grid
- The pinned services overlay becomes a stacked list
- The preloader and custom cursor don't render at all

Both scenes pause their render loop via `IntersectionObserver` when off-screen, and the
device pixel ratio is capped so the bloom pass stays affordable on laptop GPUs.

## Reference

Section-for-section, the homepage follows the recording: hero → about → marquee →
key facts → selected work → brand statement → services → client stories →
design in motion → footer.

Deliberate departures:

- **The brand statement is an addition**, not in the reference. It carries Zilla's own
  "disrupting the status quo" artwork plus the innovation-standards copy, and gives the
  long light stretch between the work reel and the services act a dark break.

- **No audio.** The reference has a sound toggle and an audio-reactive footer wordmark;
  here the wordmark reacts to the cursor instead.
- **No hero string field.** The reference's pluckable light-lines and its
  "hold to blast" / "dare to touch the lines" prompts were dropped, along with the
  hold-to-detonate interaction they advertised. The scroll-driven shatter is unaffected.
- **Selected work has a scroll ruler** across the top of the pinned frame — a tick strip
  with a green window that tracks progress, plus a project counter.
