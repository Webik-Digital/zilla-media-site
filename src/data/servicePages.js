/**
 * The four service detail pages, carrying the real copy from zillamedia.co.
 *
 * Every page uses the same optional-section shape so one component renders all
 * four — a page simply omits the blocks it doesn't use:
 *
 *   lede      → masthead paragraph
 *   intro     → single positioning line under the masthead
 *   stats     → big-number band
 *   pains     → "what this costs you" cards
 *   benefits  → short outcome tiles
 *   pillars   → the substance: each with bullets and a deliverables list
 *   advantage → why us
 *   process   → phased timeline
 *   faq       → accordion
 *   close     → closing pitch above the footer
 *
 * Copy is theirs, transcribed as published. Three deliberate departures, all
 * obvious errors on the live pages rather than edits of substance — flagged so
 * they can be checked against what was intended:
 *   1. Branding's second pillar is titled "Brand Strategy & Positioning" on the
 *      live site, duplicating the first. Its content is plainly Visual Identity
 *      Development, so it is titled that here.
 *   2. Branding's final deliverables list is cut off mid-item ("Marketing").
 *      Completed as "Marketing Collateral Suite".
 *   3. Grammar fixed in two sentences ("Our process are engineered to",
 *      "content that monopolize attention").
 *
 * NOT changed, because they are claims rather than slips — see notes in the
 * web-development stats: the "8%" figure is very likely a truncated 88%.
 */

export const servicePages = {
  branding: {
    slug: "branding",
    nav: "Branding",
    eyebrow: "Comprehensive branding",
    title: "Transform your business\ninto an industry icon.",
    lede:
      "Your brand is the foundation of market dominance. At Zilla Media, we don't just create logos. We architect complete brand ecosystems that command premium positioning, inspire unwavering trust, and drive exponential growth.",

    benefits: {
      title: "Why branding is your most powerful investment",
      body:
        "In today's hyper-competitive landscape, a powerful brand is the difference between being a commodity and becoming a category leader. Our process is engineered to:",
      items: [
        { title: "Command premium pricing", body: "Compete on position, not on price." },
        { title: "Build unshakeable trust", body: "Recognition that survives first contact." },
        { title: "Drive market leadership", body: "Set the terms the category is judged by." },
        { title: "Accelerate growth", body: "Every touchpoint compounds the last." },
      ],
    },

    pillars: [
      {
        title: "Brand Strategy & Positioning",
        tagline: "Craft your roadmap to market domination",
        body:
          "We dive deep into your market, competition, and unique value to develop a strategic foundation that:",
        bullets: [
          "Identifies untapped market opportunities",
          "Defines your unique position in the marketplace",
          "Creates a clear differentiation strategy",
          "Aligns your vision with profitable growth paths",
          "Develops a comprehensive brand architecture",
        ],
        deliverables: [
          "Market Analysis & Competitive Audit",
          "Brand Positioning Statement",
          "Target Audience Personas",
          "Brand Architecture Framework",
          "Strategic Roadmap & Implementation Timeline",
        ],
      },
      {
        // Live site repeats the previous title here; the content is clearly this.
        title: "Visual Identity Development",
        tagline: "Create a captivating presence that commands attention",
        body:
          "Your visual identity is your first impression: make it unforgettable. We design cohesive visual systems that:",
        bullets: [
          "Embody your brand's premium positioning",
          "Create instant recognition across all touchpoints",
          "Build emotional connections with your audience",
          "Stand the test of time while staying cutting-edge",
          "Scale seamlessly across digital and physical applications",
        ],
        deliverables: [
          "Logo Design & Variations",
          "Complete Colour Palette System",
          "Typography Guidelines",
          "Visual Style Guide",
          "Brand Pattern & Graphic Elements",
          "Digital & Print Templates",
        ],
      },
      {
        title: "Brand Voice & Messaging",
        tagline: "Speak directly to your market's deepest aspirations",
        body: "Words have power. We craft messaging frameworks that:",
        bullets: [
          "Articulate your unique value with clarity and impact",
          "Connect emotionally with your ideal customers",
          "Differentiate you from every competitor",
          "Drive action and inspire loyalty",
          "Create consistency across all communications",
        ],
        deliverables: [
          "Brand Messaging Framework",
          "Tagline & Core Value Propositions",
          "Brand Story & Narrative",
          "Tone of Voice Guidelines",
          "Key Message Architecture",
          "Content Templates & Examples",
        ],
      },
      {
        title: "Implementation Support",
        tagline: "Turn vision into market reality",
        body:
          "Strategy without execution is just theory. We ensure flawless implementation through:",
        bullets: [
          "Hands-on guidance for your team",
          "Marketing collateral development",
          "Digital asset creation and optimization",
          "Brand launch strategy and support",
          "Ongoing consultation and refinement",
        ],
        deliverables: [
          "Brand Guidelines Manual",
          "Marketing Collateral Suite", // live page truncates mid-item here
        ],
      },
    ],

    close: {
      title: "Ready to become the name your category is measured against?",
      body:
        "Your brand is your most valuable asset. Let's build one that earns the position you're aiming for.",
      cta: "Start your brand build",
    },
  },

  "content-marketing": {
    slug: "content-marketing",
    nav: "Content Marketing",
    eyebrow: "High-volume content marketing",
    title: "Dominate with\ncontent propaganda.",
    lede:
      "Content without strategy is just expensive noise. At Zilla Media, we engineer high-volume content ecosystems that establish unshakeable authority, drive exponential engagement, and transform your brand into the undisputed industry leader.",
    intro:
      "We don't just create content. We architect content that monopolises attention, dominates search results, and converts audiences into loyal communities.",

    pains: {
      title: "What you lose without strategic high-volume content",
      items: [
        {
          title: "Market share erosion",
          bullets: [
            "Competitors publishing more frequently steal your audience",
            "Each piece they publish pushes yours further into obscurity",
          ],
          note: { label: "Cost", text: "10–15% market share loss annually" },
        },
        {
          title: "Authority deficit",
          bullets: [
            "Sporadic posting signals inconsistency and unreliability",
            "Thought leadership requires consistent, valuable insights",
          ],
          note: { label: "Result", text: "Forever playing catch-up to industry leaders" },
        },
        {
          title: "SEO invisibility",
          bullets: [
            "Google rewards fresh, consistent content with higher rankings",
            "Less content means fewer ranking opportunities",
          ],
          note: { label: "Impact", text: "70% less organic traffic than active competitors" },
        },
        {
          title: "Missed revenue opportunities",
          bullets: [
            "Each piece of content is a 24/7 salesperson",
            "100 pieces of content = 100 revenue-generating assets",
          ],
        },
      ],
    },

    pillars: [
      {
        title: "Content Strategy Development",
        tagline: "Your roadmap to content domination",
        body:
          "We don't just plan content: we engineer comprehensive ecosystems designed to achieve premium market positioning.",
        bulletsLabel: "Strategic foundation includes",
        bullets: [
          "Competitive Content Analysis: identify gaps and opportunities to dominate",
          "Audience Psychographic Mapping: understand desires, fears, and triggers",
          "Content Pillar Architecture: build topical authority systematically",
          "Multi-Channel Distribution Strategy: maximise reach and engagement",
          "ROI-Focused KPIs: every piece tied to business outcomes",
          "Editorial Calendar Development: 90-day sprints for momentum",
        ],
        deliverablesLabel: "Formats we produce",
        deliverables: [
          "Thought leadership articles",
          "Industry reports and whitepapers",
          "Case studies and success stories",
          "How-to guides and tutorials",
          "Infographics and data visualisations",
          "Interactive content and tools",
        ],
      },
      {
        title: "Strategic Video Marketing",
        tagline: "Capture attention in the video-first era",
        body:
          "Video content generates 1200% more shares than text and images combined. We create video ecosystems that dominate feeds and drive action.",
        bulletsLabel: "Comprehensive video services",
        bullets: [
          "YouTube Channel Optimization: build subscribership and authority",
          "Short-Form Content: TikTok, Reels, Shorts for viral reach",
          "Educational Series: position you as the go-to expert",
          "Product Demonstrations: show value, drive conversions",
          "Customer Testimonials: build trust at scale",
          "Live Streaming Strategy: real-time engagement and authenticity",
        ],
        deliverablesLabel: "Video production includes",
        deliverables: [
          "Professional scriptwriting",
          "On-location or studio filming",
          "Motion graphics and animation",
          "Professional editing and post-production",
          "Multi-platform optimisation",
          "Performance analytics and optimisation",
        ],
      },
      {
        title: "Paid Ads Content",
        tagline: "Content that converts at scale",
        body:
          "Stop burning ad spend on generic creative. We develop high-converting content specifically engineered for paid campaigns.",
        bulletsLabel: "Ad content arsenal",
        bullets: [
          "Platform-Specific Creative: optimised for each network's best practices",
          "A/B Test Variations: multiple angles to find winners faster",
          "Dynamic Creative Sets: personalised content at scale",
          "Retargeting Sequences: strategic content for each funnel stage",
          "User-Generated Content: authentic content that converts",
          "Influencer Collaborations: leverage authority for instant credibility",
        ],
        deliverablesLabel: "Creative ad formats",
        deliverables: [
          "Static image ads with psychological triggers",
          "Carousel ads for storytelling",
          "Video ads (6s, 15s, 30s variations)",
          "Collection ads for e-commerce",
          "Lead generation focused content",
          "Interactive and AR experiences",
        ],
      },
      {
        title: "Articles & Blog Content",
        tagline: "SEO-powered authority building",
        body:
          "Our article strategies don't just inform: they dominate search results and establish unquestionable expertise.",
        bulletsLabel: "Blog domination strategy",
        bullets: [
          "SEO-First Approach: every piece optimised for search dominance",
          "Topical Clusters: build comprehensive authority on key topics",
          "Long-Form Mastery: 2,000–5,000 word pieces that outrank competitors",
          "Skyscraper Technique: create the definitive resource on every topic",
          "Featured Snippets Optimization: own position zero in search results",
          "Internal Linking Architecture: keep readers engaged longer",
        ],
        deliverablesLabel: "Content production scale",
        deliverables: [
          "20–50 articles monthly",
          "Mix of pillar content and supporting pieces",
          "Guest posting on authority sites",
          "Industry publication features",
          "Thought leadership placements",
          "Wikipedia and resource link building",
        ],
      },
      {
        title: "Email Marketing Mastery",
        tagline: "Turn subscribers into revenue machines",
        body:
          "Email delivers $42 for every $1 spent, when done right. We create email ecosystems that nurture, convert, and retain at scale.",
        bulletsLabel: "Email campaign types",
        bullets: [
          "Welcome Series: convert new subscribers immediately",
          "Nurture Sequences: build trust and move toward purchase",
          "Product Launch Campaigns: generate buzz and drive sales",
          "Re-engagement Series: revive dormant subscribers",
          "VIP Programs: reward your best customers",
          "Automated Behavioral Triggers: right message, perfect timing",
        ],
        deliverablesLabel: "Advanced email strategies",
        deliverables: [
          "Segmentation and personalisation at scale",
          "Dynamic content based on user behaviour",
          "AI-powered send time optimisation",
          "Predictive analytics for content",
          "Multi-variate testing frameworks",
          "Revenue attribution tracking",
        ],
      },
      {
        title: "Performance Optimization",
        tagline: "Continuous improvement at scale",
        body:
          "Creating content is just the beginning. We obsessively optimise every piece for maximum impact.",
        bulletsLabel: "Optimisation framework",
        bullets: [
          "Real-Time Analytics: monitor performance across all channels",
          "Content Refresh Strategy: update top performers for continued growth",
          "Conversion Optimization: test and improve CTAs continuously",
          "Distribution Amplification: find new channels for existing content",
          "Repurposing Systems: transform one piece into 10+ assets",
          "ROI Tracking: attribute revenue to specific content pieces",
        ],
        deliverablesLabel: "Monthly optimisation sprints",
        deliverables: [
          "Performance analysis and reporting",
          "A/B test implementation",
          "Content calendar adjustments",
          "Competitive analysis updates",
          "New opportunity identification",
          "Strategy refinement sessions",
        ],
      },
    ],

    advantage: {
      title: "The Zilla Media content advantage",
      items: [
        {
          title: "Scale without sacrifice",
          body:
            "Our systems and teams deliver 50+ pieces monthly without compromising quality or brand consistency.",
        },
        {
          title: "Multi-channel mastery",
          body:
            "One content piece becomes 10+ assets optimised for every platform where your audience lives.",
        },
        {
          title: "Data-driven creativity",
          body:
            "Every piece backed by keyword research, audience insights, and performance data.",
        },
        {
          title: "Industry expertise",
          body:
            "Specialist writers and creators who understand your market's nuances and speak your audience's language.",
        },
        {
          title: "Integrated amplification",
          body:
            "Content integrates with our paid ads, SEO, and email services for compound results.",
        },
      ],
    },

    process: {
      title: "Our process",
      phases: [
        {
          label: "Month 1: Foundation",
          items: [
            "Content audit and gap analysis",
            "Audience research and personas",
            "Content pillar development",
            "Editorial calendar creation",
            "Team onboarding",
          ],
        },
        {
          label: "Month 2–3: Acceleration",
          items: [
            "Content production ramp-up",
            "Multi-channel distribution",
            "Initial performance analysis",
            "Optimisation implementation",
            "Scale testing",
          ],
        },
        {
          label: "Ongoing: Domination",
          items: [
            "Full-scale content deployment",
            "Continuous optimisation",
            "New channel exploration",
            "Authority building",
            "Revenue optimisation",
          ],
        },
      ],
    },

    faq: [
      {
        q: "How do you maintain quality at high volume?",
        a: "Our network of specialist writers, rigorous quality control, and efficient systems ensure every piece meets premium standards.",
      },
      {
        q: "What makes your content different?",
        a: "We combine SEO expertise, conversion psychology, and industry knowledge to create content that ranks, engages, and converts.",
      },
      {
        q: "How quickly will we see results?",
        a: "Initial traffic improvements within 30 days, significant authority building by month 3, and compound growth accelerating from month 6.",
      },
      {
        q: "Do you work with our team?",
        a: "Yes: we integrate seamlessly with your team, functioning as an extension of your marketing department.",
      },
    ],

    close: {
      title: "Ready to out-publish everyone in your category?",
      body:
        "Authority compounds. The sooner the engine is running, the further ahead it puts you.",
      cta: "Build my content engine",
    },
  },

  "paid-ads": {
    slug: "paid-ads",
    nav: "Paid Ads",
    eyebrow: "Paid ads creation & management",
    title: "Turn attention\ninto money.",
    lede:
      "Stop burning budget on underperforming ads. Zilla Media's precision-engineered paid advertising transforms your marketing spend into a predictable, scalable revenue engine that dominates your competition.",
    intro:
      "In a world where 76% of advertising budgets are wasted on poor targeting and execution, we've perfected the science of profitable advertising.",

    benefits: {
      title: "Our data-driven approach combines",
      items: [
        { title: "Surgical precision", body: "Target only the customers ready to buy." },
        { title: "Predictable scale", body: "Turn profitable campaigns into growth machines." },
        { title: "Guaranteed ROI", body: "Performance-based strategies that deliver results." },
        { title: "Market domination", body: "Outmanoeuvre competitors with superior strategy." },
      ],
    },

    pillars: [
      {
        title: "Comprehensive Paid Ads Services",
        tagline: "Dominate every channel where your customers live",
        body:
          "We don't just run ads: we orchestrate synchronised campaigns across all major platforms to create an inescapable presence for your ideal customers.",
        bulletsLabel: "Platform expertise includes",
        bullets: [
          "Google & YouTube Ads",
          "Meta Advertising",
          "LinkedIn Ads",
          "TikTok Ads",
        ],
        deliverablesLabel: "What you get",
        deliverables: [
          "Cross-platform strategy development",
          "Creative development and testing",
          "Budget allocation optimisation",
          "Real-time performance management",
          "Competitive conquest campaigns",
        ],
      },
      {
        title: "Conversion Rate Optimization",
        tagline: "Transform clicks into customers with scientific precision",
        body:
          "Traffic without conversion is just expensive vanity. Our CRO framework ensures every visitor has the highest probability of becoming a customer.",
        bulletsLabel: "Our CRO process includes",
        bullets: [
          "User Behaviour Analysis",
          "A/B Testing Frameworks",
          "Landing Page Optimization",
          "Sales Funnel Architecture",
          "Dynamic Personalization",
          "Post-Click Experience Optimization",
        ],
        deliverablesLabel: "Advanced analytics & tracking",
        deliverables: [
          "Custom conversion tracking setup",
          "Attribution modelling",
          "Customer lifetime value optimisation",
          "Multi-touch journey analysis",
          "Revenue-focused reporting",
        ],
      },
      {
        title: "ROI Guarantee Programs",
        tagline: "Your success is our only metric",
        body:
          "We're so confident in our ability to deliver results that we offer performance-based partnerships.",
        bulletsLabel: "Performance milestones",
        bullets: [
          "Minimum ROAS (return on ad spend) targets",
          "Cost per acquisition guarantees",
          "Lead quality benchmarks",
          "Revenue growth commitments",
        ],
        deliverablesLabel: "Risk-free growth options",
        deliverables: [
          "Performance-based pricing models",
          "Shared risk partnerships",
          "Success-based bonus structures",
          "30-day performance guarantee",
        ],
      },
      {
        title: "Scaling Strategies",
        tagline: "From profitable to unstoppable",
        body:
          "Finding profitable campaigns is just the beginning. We engineer systematic scaling strategies that maintain efficiency while multiplying results.",
        bulletsLabel: "Our scaling framework",
        bullets: [
          "Vertical Scaling: maximise proven campaigns",
          "Horizontal Scaling: expand to new platforms and audiences",
          "Geographic Scaling: dominate new markets",
          "Creative Scaling: multiply winning angles",
          "Budget Scaling: aggressive growth without efficiency loss",
          "Seasonal Scaling: capitalise on peak opportunities",
        ],
        deliverablesLabel: "Scaling support includes",
        deliverables: [
          "Weekly optimisation sprints",
          "Rapid testing protocols",
          "Budget pacing strategies",
          "Competitive intelligence",
          "Market expansion planning",
          "Automated scaling rules",
        ],
      },
    ],

    advantage: {
      title: "The Zilla Media advantage",
      items: [
        {
          title: "AI-powered optimisation",
          body:
            "Our proprietary algorithms analyse millions of data points to optimise campaigns 24/7, ensuring peak performance around the clock.",
        },
        {
          title: "Creative that converts",
          body:
            "Our in-house creative team develops thumb-stopping ads backed by consumer psychology and performance data.",
        },
        {
          title: "Transparent reporting",
          body:
            "Real-time dashboards give you complete visibility into every metric that matters, from impressions to revenue.",
        },
        {
          title: "Dedicated growth team",
          body:
            "Your success team includes strategists, analysts, creatives, and technicians, all focused on your growth.",
        },
      ],
    },

    process: {
      title: "Our process",
      note: "Understand the framework for unleashing the brand's potential.",
      phases: [
        {
          label: "Week 1: Deep Dive Discovery",
          items: [
            "Comprehensive account audit",
            "Competitor intelligence gathering",
            "Customer research and analysis",
            "Goal setting and KPI alignment",
          ],
        },
        {
          label: "Week 2: Strategy Development",
          items: [
            "Multi-channel media plan",
            "Budget allocation strategy",
            "Creative brief development",
            "Tracking infrastructure setup",
          ],
        },
        {
          label: "Week 3–4: Campaign Launch",
          items: [
            "Creative development and testing",
            "Campaign structure implementation",
            "Pixel and tracking verification",
            "Initial optimisation sprints",
          ],
        },
        {
          label: "Ongoing: Scale & Optimize",
          items: [
            "Daily performance monitoring",
            "Weekly optimisation cycles",
            "Monthly strategy sessions",
            "Quarterly business reviews",
          ],
        },
      ],
    },

    faq: [
      {
        q: "What's your minimum ad spend requirement?",
        a: "We typically work with businesses investing at least $1,500/month in ad spend to ensure meaningful results and optimisation opportunities.",
      },
      {
        q: "How quickly can we see results?",
        a: "Most clients see improved metrics within 2–3 weeks, with significant ROI improvements within 60–90 days.",
      },
      {
        q: "Do you work with our existing creative?",
        a: "We can optimise existing assets while developing new high-performance creative based on data insights.",
      },
      {
        q: "What if we're already working with another agency?",
        a: "Continue to work with your current firm and let's explore other opportunities to enhance what they are already doing.",
      },
    ],

    close: {
      title: "Find out what you're leaving on the table.",
      body:
        "In 30 minutes we'll show you how to double your ROAS in 90 days, cut acquisition costs by half, and scale winning campaigns without losing efficiency. We only partner with three new clients a month.",
      cta: "Schedule your strategy call",
    },
  },

  "web-development": {
    slug: "web-development",
    nav: "Web Development",
    eyebrow: "Website development",
    title: "A website that runs\nas a revenue machine.",
    lede:
      "Your website isn't just a digital brochure: it's your most powerful sales tool. At Zilla Media, we engineer high-performance websites that captivate visitors, drive conversions, and scale your business exponentially.",
    intro:
      "We don't just build websites. We architect digital experiences that transform browsers into buyers and visitors into brand advocates.",

    // Figures as published on zillamedia.co. The first is very likely a
    // truncated 88% — the widely cited stat — but it is their claim to correct,
    // not mine to quietly restate.
    stats: {
      title: "The hidden cost of an underperforming website",
      note: "Every second your website fails to convert is money bleeding from your business.",
      items: [
        { value: "8%", label: "of visitors never return after a bad experience" },
        { value: "53%", label: "abandon sites that take over 3 seconds to load" },
        { value: "75%", label: "judge credibility based on website design alone" },
        { value: "32%", label: "higher conversion rates at companies with optimised sites" },
      ],
    },

    pains: {
      title: "The pain points killing your growth",
      items: [
        {
          title: "Lost revenue from poor conversions",
          bullets: [
            "Average websites convert at 2.35%, while optimised sites achieve 5–10%",
            "A site with 10,000 monthly visitors losing 3% conversion = 300 lost customers monthly",
          ],
          note: { label: "Cost", text: "$60,000 in lost revenue every month at a $200 order value" },
        },
        {
          title: "Invisible to your ideal customers",
          bullets: [
            "75% of users never scroll past the first page of Google",
            "Outdated sites rank lower, making you invisible to searching customers",
          ],
          note: { label: "Cost", text: "Losing 5–10 new customers daily to competitors" },
        },
        {
          title: "Credibility crisis",
          bullets: [
            "94% of first impressions relate to web design",
            "Premium customers choose competitors who look more established",
          ],
          note: { label: "Result", text: "Forced to compete on price instead of value" },
        },
        {
          title: "Mobile money drain",
          bullets: [
            "60% of searches come from mobile devices",
            "Non-responsive sites lose 50%+ of mobile visitors immediately",
          ],
          note: { label: "Reality", text: "Ignoring more than half your potential market" },
        },
        {
          title: "Technical disasters waiting to happen",
          bullets: [
            "Outdated security leaves you vulnerable to attacks",
            "30,000 websites are hacked daily",
          ],
          note: { label: "Risk", text: "One breach could destroy years of reputation" },
        },
      ],
    },

    pillars: [
      {
        title: "High-Converting Design",
        tagline: "Beautiful isn't enough",
        body:
          "We create websites engineered for conversion, combining stunning aesthetics with psychological triggers that drive action.",
        bullets: [
          "Conversion-led layout and hierarchy",
          "Psychological triggers placed with intent",
          "Design systems that scale past launch",
        ],
      },
      {
        title: "Technical Excellence",
        tagline: "A beautiful site that doesn't perform is an expensive failure",
        body:
          "Our technical prowess ensures your website is fast, secure, and built to scale.",
        bullets: [
          "Sub-two-second load targets",
          "Security hardening as standard",
          "Architecture that grows without a rebuild",
        ],
      },
      {
        title: "User Experience Optimization",
        tagline: "We obsess over every interaction",
        body:
          "Your website doesn't just look good: it converts at industry-leading rates.",
        bullets: [
          "Behaviour heatmaps and session review",
          "Funnel instrumentation end to end",
          "Continuous test-and-learn cycles",
        ],
      },
      {
        title: "Ongoing Performance Support",
        tagline: "Launch is just the beginning",
        body:
          "We ensure your website continues to evolve and improve, staying ahead of trends and technology.",
        bullets: [
          "Performance monitoring and alerting",
          "Iterative conversion improvements",
          "Roadmapped platform upgrades",
        ],
      },
    ],

    advantage: {
      title: "The Zilla Media development advantage",
      items: [
        {
          title: "Revenue-focused approach",
          body:
            "Every design decision is backed by data and focused on driving business results, not just winning design awards.",
        },
        {
          title: "Conversion science",
          body:
            "We apply proven psychological principles and data-driven insights to create websites that convert at 2–3x industry averages.",
        },
        {
          title: "Speed obsession",
          body:
            "Our sites load in under two seconds, improving SEO rankings and reducing bounce rates by up to 70%.",
        },
        {
          title: "Future-proof technology",
          body:
            "Built with scalability in mind, your website grows with your business without costly rebuilds.",
        },
        {
          title: "Integrated marketing stack",
          body:
            "Seamless integration with our paid ads, content marketing, and automation services for maximum ROI.",
        },
      ],
    },

    process: {
      title: "Our web development process",
      phases: [
        {
          label: "Phase 1: Discovery & Strategy (Week 1)",
          items: [
            "Comprehensive business analysis",
            "Competitor research and benchmarking",
            "User persona development",
            "Technical requirements gathering",
            "Conversion goal setting",
          ],
        },
        {
          label: "Phase 2: Design & Architecture (Weeks 2–3)",
          items: [
            "Information architecture planning",
            "Wireframe development",
            "Visual design concepts",
            "Content strategy development",
            "Technical infrastructure planning",
          ],
        },
        {
          label: "Phase 3: Development & Testing (Weeks 4–6)",
          items: [
            "Front-end development",
            "Back-end integration",
            "Quality assurance testing",
            "Performance optimisation",
            "Security implementation",
          ],
        },
        {
          label: "Phase 4: Launch & Optimization (Week 7+)",
          items: [
            "Staged deployment process",
            "Performance monitoring setup",
            "Team training and documentation",
            "30-day optimisation sprint",
            "Ongoing support activation",
          ],
        },
      ],
    },

    faq: [
      {
        q: "How long does development take?",
        a: "Most projects complete in 6–8 weeks, though complex enterprise sites may take 10–12 weeks.",
      },
      {
        q: "Do you redesign existing websites?",
        a: "Yes: we specialise in transforming underperforming sites into conversion machines while preserving SEO equity.",
      },
      {
        q: "What about content creation?",
        a: "We offer comprehensive copywriting services, or can work with your provided content.",
      },
      {
        q: "Do you provide hosting?",
        a: "We partner with enterprise-grade hosting providers and can manage your hosting for optimal performance.",
      },
      {
        q: "What if I need changes after launch?",
        a: "All packages include post-launch support, and we offer ongoing maintenance plans for continuous optimisation.",
      },
    ],

    close: {
      title: "Ready to build a website that dominates?",
      body:
        "Stop losing customers to competitors with better websites. Let's create a digital experience that converts visitors into revenue.",
      cta: "Get your free website audit",
    },
  },
};

/** Nav/footer order — matches the live site's Services menu. */
export const serviceOrder = [
  "branding",
  "content-marketing",
  "paid-ads",
  "web-development",
];

export const serviceLinks = serviceOrder.map((slug) => ({
  label: servicePages[slug].nav,
  to: `/services/${slug}`,
}));
