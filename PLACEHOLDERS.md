# Placeholder content — read before this site goes anywhere near a client

Some content on this site was **invented to carry the design** while real
material is gathered. None of it appears on zillamedia.co, none of it is
verified, and none of it should be published as fact.

This file is the full inventory. Everything listed carries a `data-placeholder`
attribute in the DOM, so you can also find it live:

```bash
rg "data-placeholder|\[placeholder\]" src/
```

In the browser, a dev build logs a grouped warning listing every placeholder on
the current page, and each block gets a small green badge in the corner. Both
disappear in production builds.

---

## Invented — must be replaced or removed

| What | Where | Notes |
|---|---|---|
| **All 4 client testimonials** | `src/data/site.js` → `stories.items`, shown in `sections/ClientStories.jsx` | Quotes and the roles attached to them are invented. The live site publishes no testimonials. |
| **Headline figures** — `40+` brands, `1.2K+` assets/year, `4.1x` ROAS | `src/data/site.js` → `keyFacts.cards`, shown in `sections/KeyFacts.jsx` | Zilla Media publishes no performance numbers anywhere. |
| **About page stats** — `40+`, `1.2K+`, `4.1x`, `8 channels` | `src/pages/About.jsx` → `stats` | Same as above. |
| **`Est. 2019`** | `src/data/site.js` → `hero.badge.left` | Founding year is a guess. |
| **"What happens next" descriptions** | `src/data/apply.js` → `apply.next.items[].body` | The live page lists the five step *titles* only. The one-line descriptions are ours. |
| **Brand logos** (Riot Games, Jacuzzi, Ferrari, Tescor) | `src/data/site.js` → `brands.items[].logo`, shown in `sections/Brands.jsx` | All `null`. Each cell renders the name set in type instead. Add a path and it switches to the image. **Also confirm usage rights** — third-party marks on a vendor's own site normally need permission. |
| **Ferrari as a Zilla client** | same | Flagged, not fabricated: the client asked for it directly. But the only Ferrari mark anywhere in the supplied assets is inside the **Goodvisor** website mockup, in Goodvisor's *own* client strip — i.e. Ferrari is plausibly Goodvisor's client, and Zilla's link is to the site that displays them. Worth confirming a direct relationship before this is published as "brands we've worked with". |
| **"Merch programme"** client name | `src/data/site.js` → `work.projects`, slug `apparel` | The cap photo is real work, but the mark on it isn't identifiable from the supplied deck, so the entry runs under a generic name. Everything in its summary is visible fact. **Give me the client and it becomes a proper credit.** |

## Correction — the case studies are real

An earlier version of this file listed all six projects as fabricated, on the
grounds that zillamedia.co has no portfolio section. **That was wrong.** The
design deck supplied on 21 Aug 2026 confirms BYLD Network, STACRZ, Axiom
Biogenomics, The Mercury Club, UMWAD and DFY Commerce as genuine Zilla Media
clients, alongside VLUXE, Goodvisor, Peak Iron Therapy, Mastery Syndicate,
unrthdx, SKORJWEAR, Prestige and NeoFuel. The project images were already in
`public/media` from the original hand-off.

What *was* invented was the descriptive copy. Every summary in `work.projects`
has since been rewritten to describe only what is visibly in its image, with no
claims about brief, scope or results — so Selected Work no longer carries a
placeholder flag. If you want them to become real case studies (the problem
solved, what shipped, what happened), that detail has to come from Michael.

## Incomplete, not invented — the team reel

`src/data/site.js` → `team`, shown in `sections/Team.jsx` on both the homepage
and `/about` (the About page's old Leadership placeholder, which named only
Michael Siervo, was replaced by it on 28 Sep 2026). Names, roles and
photographs are the real supplied ones. Two things still need a hand:

1. **The bios are cut short.** They were transcribed from the BLVD profile
   cards, which truncate their own copy with an ellipsis mid-sentence. Each
   bio here stops at the last sentence that was fully visible rather than
   guessing at the tail, so every word is the member's own — but Michael,
   Jover, Stalingrad, Hsien-Na and Anthony each lose roughly a paragraph.
   Paste the full text over `team.members[].bio` when it arrives; the reel
   has room for about half again as much before the column needs a scroll.

2. **Hsien-Na Kuo's portrait is 300×400** — the source file was a 400px
   avatar, which is the only one of the five that can't fill the frame
   sharply. It renders around 350px wide on a laptop, so it is soft next to
   the other four rather than broken. A photo at 900×1200 or better replaces
   it with no code change: same path, `public/media/team/kuo.jpg`.

## Real — sourced from zillamedia.co

Do not treat these as placeholder; they are transcribed from the live site.

- All four service detail pages (`src/data/servicePages.js`) — pillars,
  deliverables, process phases, FAQs
- All three blog posts in full (`src/data/blog.js`)
- About page: Who We Are, Mission, Vision, the three principles, closing CTA
- Apply Now: the three steps, the analysis promise, discovery-call details
- Channel logos in Key Facts
- Homepage services, statement and marquee copy

## Known issues on the live site, carried across deliberately

These are their errors, left intact rather than silently "fixed", so they can be
decided on:

1. **`8%` of visitors never return after a bad experience** (`servicePages.js`,
   web-development stats). Almost certainly a truncated **88%** — the commonly
   cited figure. Their claim to correct, not ours to restate.
2. **Branding page's second pillar** is titled "Brand Strategy & Positioning" on
   the live site, duplicating the first. Its content is plainly Visual Identity
   Development, so it is titled that here.
3. **Branding page's last deliverables list is cut off mid-item** ("Marketing").
   Completed here as "Marketing Collateral Suite".
4. **Hero typo**: the live site reads "visual store*y*telling". Spelled
   correctly here.
5. **Blog read-times disagree** between the live index and the article pages for
   two posts. The article-page values are used.

## Not yet wired

- **Booking.** The live site's discovery-call scheduler is built into their own
  site, not a Calendly/Cal.com embed, so there is no third-party URL to reuse.
  `src/data/apply.js` → `booking.url` currently points at their live Apply Now
  page. Set it to a real scheduler URL to make it native.

- **Three sections are built but not mounted.** `sections/UmwadFeature.jsx` (the
  "Everyone matters" campaign feature), `sections/VideoSeries.jsx` (the
  Branding Series carousel) and `sections/Brands.jsx` ("Brands we've worked
  with") were pulled from the homepage at the client's request. All components
  and their data are intact — re-adding any of them is one import plus one line
  in `pages/Home.jsx`.

  Brands is waiting on logo files. When they arrive, drop them in
  `public/media/` and set `brands.items[].logo` in `src/data/site.js`; each
  cell already switches from the type treatment to the image on its own. Read
  the Ferrari note in the table above before remounting it.

- **The Branding Series videos** (relevant only if that carousel goes back in).
  `src/data/site.js` → `series.episodes[].videoUrl`
  is `null` on all three. A card with no URL deliberately renders a muted
  "Soon" state rather than a play button that does nothing. Fill in a URL and
  that card becomes playable immediately — the lightbox handles a direct file
  (`.mp4`) or a YouTube/Vimeo link, detected by URL shape. Commercials drop
  into the same list.

  Also worth knowing: the supplied mockup shows view counts ("125k views ·
  2 days ago"). Those are design dummy text, so they are **not** reproduced on
  the site. Give me real numbers if you want them shown.

- **Episode 01.** "Your Brand is the Best Investment" appears in the fanned
  mockup but there is no individual full-resolution thumbnail for it, so the
  carousel currently runs EP 02–04. Supply the thumbnail to complete the set.
