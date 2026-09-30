/**
 * Every string on the site lives here. Copy marked `// [placeholder]` is not
 * on zillamedia.co today and is written to be swapped out — numbers,
 * testimonials and case-study results in particular.
 */

import { serviceLinks } from "./servicePages";

export const nav = [
  { label: "Home", to: "/" },
  { label: "Work", to: "/work" },
  { label: "Services", to: "/services" },
  { label: "About Us", to: "/about" },
  { label: "Apply Now", to: "/apply" },
];

/**
 * The live site puts Services and Resources behind nav dropdowns. A dropdown
 * makes no sense inside a full-bleed menu, so the same taxonomy runs as a
 * secondary column beside the primary links.
 */
export const navGroups = [
  { title: "Services", links: serviceLinks },
  {
    title: "Resources",
    links: [
      { label: "Blog", to: "/blog" },
      // Listed as "Coming Soon" on the live site; kept visible, not linked.
      { label: "Videos", note: "Soon" },
      { label: "Freebies", note: "Soon" },
    ],
  },
];

export const hero = {
  eyebrow: "Zilla Media · Unleash Your Brand",
  lead: "Create trust that",
  // The headline swaps this word on a loop, mirroring the reference site.
  cycle: ["inspires", "converts", "compounds", "dominates"],
  tail: "through visual storytelling.",
  cta: { label: "Book discovery call", to: "/contact" },
  blurb:
    "Branding, high-volume content, high-converting websites and paid-ad campaigns, built to position you as the market leader.",
  badge: { left: "Est. 2019", right: "A full-service growth partner" }, // [placeholder] founding year
};

export const about = {
  label: "About",
  // Lifted from the live meta description and set as the scroll-reveal line.
  body:
    "Zilla Media is a full-service growth partner crafting bold brands through strategy, content, and technology.",
  colLeft: "We build for longevity.\nBold strategy, relentless craft,\nbuilt to scale.",
  colRight:
    "Our mission is to turn ambition into market position through branding, AI innovation, powerful content, and next-level web and ad strategy.",
  link: { label: "More about us", to: "/about" },

  // --- /about page only, transcribed from zillamedia.co/about-us -----------
  whoWeAre: {
    label: "Who we are",
    body:
      "Born from the belief that marketing should be more than noise, we created a neo-agency that combines cutting-edge technology, global creative partnerships, and conviction-driven strategies to transform ambitious businesses into unstoppable market leaders.",
    kicker: "This isn't about templates or shortcuts. It's about building legacies.",
  },
  missionVision: [
    {
      title: "Our Mission",
      body:
        "To empower established businesses with premium strategies that drive market domination, elevate authority, and deliver measurable growth.",
    },
    {
      title: "Our Vision",
      body:
        "To redefine what success looks like by creating pathways for ambitious brands to leave an indelible impact on their industries.",
    },
  ],
  // Transcribed from the live About page's Leadership section. Not rendered
  // right now: /about shows the same team reel as the homepage (`team`
  // below), which carries its own heading. Kept so this copy isn't lost if
  // the section ever wants it back.
  leadership: {
    label: "Leadership team",
    title: "Visionaries shaping your success",
    body:
      "Zilla Media is led by a team of seasoned experts who share a vision of transformation and growth. Each brings unique expertise, global insights, and an unrelenting commitment to delivering excellence.",
  },
  principles: [
    {
      title: "Collaboration and transparency",
      body:
        "We believe that success is built on collaboration and transparency. By forming true partnerships, we drive growth that's sustainable, measurable, and impactful.",
    },
    {
      title: "Innovation standards",
      body:
        "The marketing landscape evolves rapidly. At Zilla Media, we don't simply adapt. We innovate. With cutting-edge technologies and forward-thinking strategies, we empower your business to stay ahead.",
    },
    {
      title: "Commitment",
      body:
        "Your success is our commitment. We're not just your marketing agency; we're your dedicated partners in achieving long-term growth and sustained market domination.",
    },
  ],
  close: {
    title: "Are you ready to transform your business?",
    body:
      "At Zilla Media, we don't just help brands grow. We make them dominate. Partner with us and take the first step toward rewriting your success story.",
    cta: { label: "Get started today", to: "/apply" },
  },
};

// Three verbs pulled straight out of the innovation-standards copy below —
// all roughly equal weight, which is what keeps the loop scanning evenly.
export const marquee = ["Innovate", "Collaborate", "Empower"];

export const statement = {
  // Eyebrow label removed from the UI by request; the statement stands alone.
  // Rendered as one centred uppercase block that wraps naturally. `accent`
  // takes brand green and `italic` the emphasis, both matching the supplied
  // brand artwork.
  parts: [
    { text: "Zilla Media", accent: true },
    { text: "is an agency specializing in" },
    { text: "disrupting", italic: true },
    { text: "the status quo" },
  ],
  columns: [
    "The marketing landscape evolves rapidly. At Zilla Media, we don't simply adapt. We innovate. With cutting-edge technologies and forward-thinking strategies, we empower your business to stay ahead.",
    "We believe that success is built on collaboration and transparency. By forming true partnerships, we drive growth that's sustainable, measurable, and impactful.",
  ],
};

export const keyFacts = {
  label: "Key facts",
  intro: "A snapshot of our experience and impact.",
  cards: [
    {
      kind: "media",
      image: "/media/work-cards.png",
      alt: "Zilla Media brand identity collateral",
      stat: "40+",
      statLabel: "Brands launched",
      caption: "Identity systems shipped end-to-end, from strategy to rollout.",
    }, // [placeholder] figure
    {
      kind: "stat",
      stat: "1.2K+",
      statLabel: "Assets shipped a year",
      caption: "High-volume content built to feed every channel that matters.",
    }, // [placeholder] figure
    {
      kind: "media",
      image: "/media/work-mastery.png",
      alt: "Mastery Mindset product branding",
      stat: "4.1x",
      statLabel: "Average return on ad spend",
      caption: "Paid campaigns tuned until the maths works, then scaled.",
    }, // [placeholder] figure
  ],
  partnersLabel: "Channels we've worked with",
  partnersNote:
    "We leverage the reach of top platforms to fuel your brand's growth and market dominance.",
  // Order is the fan order, left to right. Sliced out of the supplied
  // channel artwork, so each card already carries its own rounded frame.
  partners: [
    { name: "Facebook", src: "/media/channels/facebook.png" },
    { name: "Google", src: "/media/channels/google.png" },
    { name: "LinkedIn", src: "/media/channels/linkedin.png" },
    { name: "YouTube", src: "/media/channels/youtube.png" },
    { name: "TikTok", src: "/media/channels/tiktok.png" },
    { name: "Instagram", src: "/media/channels/instagram.png" },
    { name: "Apple Podcasts", src: "/media/channels/apple-podcasts.png" },
    { name: "Spotify", src: "/media/channels/spotify.png" },
  ],
};

export const work = {
  // Eyebrow label removed from the UI by request; the heading carries it.
  title: "Selected work\n& explorations",
  cta: { label: "View all projects", to: "/work" },
  outro:
    "Discover our complete collection of brands, campaigns, and platforms.",
  projects: [
    // People first. The standalone campaign feature was removed, so the human
    // work carries the section instead of sitting in its own block.
    {
      slug: "umwad",
      name: "UMWAD",
      image: "/media/work-umwad.png",
      tag: "Campaign",
      summary:
        "A donation drive run on three portraits and one line each. A child, a schoolboy, an old man on a motorbike, pasted up on concrete.",
    },
    {
      // [placeholder] client name — the mark on the cap is not one we can
      // identify from the supplied deck. Everything else here is visible fact.
      slug: "apparel",
      name: "Merch programme",
      image: "/media/work-cap.png",
      tag: "Identity · Apparel",
      summary: "A five-panel cap in the brand's colourway, photographed worn rather than flat.",
    },
    {
      slug: "stacrz",
      name: "STACRZ",
      image: "/media/work-stacrz.png",
      tag: "Brand identity · Packaging",
      summary:
        "Fragrance packaging: deep green flacon, copper cap, peach serif wordmark.",
    },
    {
      slug: "dfy",
      name: "DFY Commerce",
      image: "/media/work-dfy.png",
      tag: "Product · Mobile",
      summary:
        "App screens for an Amazon FBA service, built on one promise: we manage, you profit.",
    },
    {
      slug: "mercury",
      name: "The Mercury Club",
      image: "/media/work-mercury.png",
      tag: "Identity · Print",
      summary: "Gold on black membership card, set against raw stone.",
    },
    {
      slug: "axiom",
      name: "Axiom Biogenomics",
      image: "/media/work-axiom.png",
      tag: "Brand identity",
      summary: "Brand mark applied to laboratory robotics.",
    },
  ],
};

/**
 * Brands Zilla has worked with, from the client's own list.
 *
 * `logo` is null on every entry because no logo files were supplied. Each cell
 * renders the name as a wordmark in the site's display face instead, which
 * reads as a deliberate treatment rather than a gap. Drop in a path and that
 * cell switches to the image with no other change.
 *
 * These are the client's claims to make, not ours to verify. Note in
 * PLACEHOLDERS.md re: Ferrari's provenance before this goes in front of
 * anyone, and check that logo usage rights are in hand — third-party marks
 * on a vendor site usually need permission.
 */
export const brands = {
  label: "Clients",
  title: "Brands we've\nworked with",
  intro: "A selection of the names behind the work.",
  items: [
    { name: "Riot Games", logo: null },
    { name: "Jacuzzi", logo: null },
    { name: "Ferrari", logo: null },
    { name: "Tescor", logo: null },
  ],
};

export const services = {
  label: "Our services",
  words: ["Branding", "Content", "Web", "Paid Ads"],
  // Tagline removed from the UI by request, on the homepage and /services.
  cta: { label: "View services", to: "/services" },
  items: [
    {
      title: "Comprehensive Branding",
      body: "Brand strategy and positioning, visual identity, voice and messaging, plus implementation support that carries it into every design.",
    },
    {
      title: "AI Automated Solutions",
      body: "Marketing automation, predictive analytics, and personalisation engines that make growth systematic rather than heroic.",
    },
    {
      title: "High Volume Content",
      body: "Content strategy, video marketing, authority-building programmes, and multi-channel creation tuned for performance.",
    },
    {
      title: "Website Development",
      body: "UX/UI and high-converting design, CRO with behaviour heatmaps and tracking, website copywriting, and ongoing performance support.",
    },
    {
      title: "Paid Ads Management",
      body: "Multi-platform campaign management, conversion rate optimisation, data reporting, and scaling strategies built around ROI.",
    },
    {
      title: "Video & Storytelling",
      body: "Promotional campaigns and storytelling pieces that turn ideas into visuals people actually finish watching.",
    },
  ],
};

// [placeholder] — swap for real client quotes before launch.
export const stories = {
  label: "Client stories",
  intro: "Great work is built through partnership. Here's what our clients say.",
  cta: { label: "Become a client", to: "/contact" },
  items: [
    {
      client: "BYLD Network",
      person: "Operations Lead",
      quote:
        "They took a vague ambition and returned a brand system we could actually run the business on. Six months later it still holds up under pressure.",
    },
    {
      client: "STACRZ",
      person: "Founder",
      quote:
        "The team is second to none when it comes to translating a product into a feeling. They took an idea and made it a work of art.",
    },
    {
      client: "Axiom Biogenomics",
      person: "Head of Marketing",
      quote:
        "Our category is dense and technical. Zilla made it legible without dumbing it down, and our pipeline felt the difference.",
    },
    {
      client: "DFY Commerce",
      person: "Managing Director",
      quote:
        "Paid spend used to be a guess. Now it's a system with numbers we trust, reported in language we understand.",
    },
  ],
};

/**
 * Capabilities: the actual output, for actual clients. Replaces the old
 * "Design in Motion" block of abstract explorations — the feedback was that
 * the site read as a cold AI-driven business because it never showed real work
 * or real people. Four of these six panels are full of faces.
 *
 * All landscape: these are 16:9 title cards, so a portrait frame would crop
 * the type straight off them.
 */
export const capabilities = {
  titleA: "What we",
  titleB: "Make",
  label: "Capabilities",
  intro:
    "Identity systems, social content, thumbnails and sites. Work that shipped, for people who paid for it.",
  cta: { label: "See all work", to: "/work" },
  cards: [
    { image: "/media/cap-social.png", caption: "Branded social content" },
    {
      image: "/media/cap-paid-ads.png",
      caption: "Paid ad creative: Onit Outsource, Empire Social Group, Power House",
    },
    {
      image: "/media/cap-products.png",
      caption: "Product and brand collateral: Project Zu, BYLD Network, The Mercury Club",
    },
    { image: "/media/cap-logos.png", caption: "Logo design" },
    {
      image: "/media/collage-web.png",
      caption: "Websites: Goodvisor, Peak Iron Therapy, Mastery Syndicate",
    },
    { image: "/media/work-estate.png", caption: "VLUXE hospitality website" },
  ],
};

/**
 * The team, played as a chapter reel: one member per scroll beat.
 *
 * Names, roles and portraits are the ones supplied for the BLVD profiles, in
 * the same order the profile carousel runs them.
 *
 * The bios are transcribed from those profile cards, which truncate their own
 * copy with an ellipsis. Rather than invent the missing tail, each bio here
 * stops at the last sentence that was fully visible — so every word below is
 * the member's own. They read a little short on purpose; the reel gives each
 * one a full viewport, and a longer paragraph would fight the portrait for
 * attention. Fill them out from the source documents when those arrive.
 *
 * Anthony Lopez's profile bylines them as "Mx. Toni Lopez" and uses they/them.
 * Both are deliberate — don't normalise either against the display name.
 */
export const team = {
  // No eyebrow label: the section heading carries it at full section size,
  // the way KeyFacts and Client Stories do.
  title: "The people\nbehind the work",
  intro:
    "Nearly forty creatives, strategists and technologists. These five set the direction.",
  cta: { label: "Work with us", to: "/contact" },
  members: [
    {
      name: "Michael Siervo",
      role: "Best-selling author, speaker, CEO of BLVD & Zilla Media",
      image: "/media/team/siervo.jpg",
      alt: "Michael Siervo framing a shot with both hands against a dark backdrop",
      bio: "Michael Siervo is the CEO of Zilla Media, one of Asia's fastest-growing creative and AI-driven marketing agencies, where he leads a team of nearly 40 creatives, strategists, and technologists serving clients across North America, Europe, and the Pacific. Before founding Zilla Media, he spent over 20 years in high-performance business leadership across Canada, most notably growing a territory from $19 million in assets under management to more than $2 billion.",
    },
    {
      name: "Jover Nuevaespana",
      role: "Visionary, CEO, AI orchestrator, digital marketing ninja",
      image: "/media/team/nuevaespana.jpg",
      alt: "Jover Nuevaespana seated in a black suit, photographed in black and white",
      bio: "Jover Nuevaespana is a seasoned digital marketer, leader, and strategist with expertise spanning mobile marketing, CRM, operations management, process engineering, UX/product design, sales funnel design, and inbound marketing. He played a central role in helping a multi-million-dollar Canadian company launch seven SaaS products in under a year, leading customer onboarding to ensure every client got the most out of the product.",
    },
    {
      name: "Stalingrad Dollosa",
      role: "Technical product manager, machine learning engineer",
      image: "/media/team/dollosa.jpg",
      alt: "Stalingrad Dollosa standing outdoors on a lawn in a brown t-shirt",
      bio: "Product Manager at Hoversight AI Agency, where he architects and manages full-stack platforms end to end, from EdTech systems with curriculum delivery and mentorship workflows to security remediation work on client platforms. Outside of that role, he builds things solo, including on-device security tooling that combines lightweight pattern matching, custom-trained classifiers, and local LLM inference to catch problems without relying on the cloud.",
    },
    {
      name: "Hsien-Na Kuo",
      role: "Technologist, product strategist, AI builder",
      image: "/media/team/kuo.jpg",
      alt: "Hsien-Na Kuo in a white blazer, looking up, with a curved facade behind her",
      bio: "Hsien-Na Kuo is a Filipino-Taiwanese product manager, AI builder, SaaS strategist, and lecturer based in the Philippines. She designs AI-powered products, builds SaaS platforms for North American companies, and develops e-commerce initiatives for brands across the Asia-Pacific region — bringing a global perspective to product strategy, emerging technologies, and digital innovation.",
    },
    {
      name: "Anthony Lopez",
      role: "Human rights advocate, director of business development",
      image: "/media/team/lopez.jpg",
      alt: "Anthony Lopez at a bouldering gym, clasping hands with the photographer",
      bio: "Mx. Toni Lopez is a communications, advocacy, media, and nonprofit leadership professional working across youth empowerment, sexual and reproductive health and rights, SOGIESC equality, digital storytelling, and community organizing in the Asia-Pacific. They previously served as Executive Director of Youth Voices Count (YVC), Inc., a regional NGO legally registered in Iloilo City that advances the rights, health, and leadership of LGBTIQ+ young people.",
    },
  ],
};

/**
 * The Branding Series: an educational series Zilla filmed and published.
 *
 * `videoUrl` is null until the files or embed links arrive. A card with no URL
 * renders a pending state rather than a play button that does nothing — the
 * moment a URL is filled in, that card becomes playable with no other change.
 * Commercials go in the same list once they're supplied.
 *
 * Deliberately no view counts: the numbers on the supplied mockup ("125k
 * views · 2 days ago") are design dummy text, not reportable metrics.
 */
export const series = {
  label: "Branding Series",
  titleA: "The Branding",
  titleB: "Series",
  intro:
    "We filmed an educational series on how brands actually get built. No gatekeeping, no jargon.",
  cta: { label: "Watch on our channel", to: "/contact" },
  episodes: [
    {
      ep: "EP 02",
      title: "Personal Branding Mistakes",
      poster: "/media/vid-personal-branding.png",
      videoUrl: null,
    },
    {
      ep: "EP 03",
      title: "Branding versus Marketing",
      poster: "/media/vid-branding-marketing.png",
      videoUrl: null,
    },
    {
      ep: "EP 04",
      title: "Don't Post New Ideas to Get Followers",
      poster: "/media/vid-dont-post.png",
      videoUrl: null,
    },
  ],
};

/** A cause campaign, and the most human thing in the portfolio. */
export const umwad = {
  label: "Campaign",
  title: "Everyone matters.",
  body:
    "An out-of-home and social campaign for UMWAD, built on three portraits and one line each. A child, a schoolboy, an old man on a motorbike. No stock photography, no abstraction.",
  lines: ["A small donation matters", "Children are the future", "Everyone matters"],
  image: "/media/work-umwad.png",
  cta: { label: "See the work", to: "/work" },
};

export const footer = {
  kicker: "Let's build work that inspires.",
  title: "Ready to dominate\nyour market?",
  cta: { label: "Book a call", to: "/apply" },
  hint: "Move your cursor across the lines.",
  // Four columns, matching the live site's taxonomy. Web Development sat under
  // Company before, which put a service in the wrong group.
  columns: [
    {
      title: "Company",
      links: [
        { label: "Home", to: "/" },
        { label: "About Us", to: "/about" },
        { label: "Work", to: "/work" },
      ],
    },
    { title: "Services", links: serviceLinks },
    {
      title: "Resources",
      links: [
        { label: "Blog", to: "/blog" },
        { label: "Videos", note: "Soon" },
        { label: "Freebies", note: "Soon" },
      ],
    },
    {
      title: "Connect",
      links: [
        { label: "Contact Us", to: "/contact" },
        { label: "Apply Now", to: "/apply" },
      ],
    },
  ],
  social: ["LinkedIn", "Instagram", "YouTube", "TikTok"],
  legal: "© 2026 Zilla Media Inc. All rights reserved.",
  // Build credit. `to` is left null so it renders as plain text rather than a
  // link to a URL nobody supplied — fill it in to make it clickable.
  credit: { label: "Built by Webik", to: null },
};
