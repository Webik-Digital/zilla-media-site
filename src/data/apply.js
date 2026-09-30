/**
 * The Apply Now flow, transcribed from zillamedia.co/apply-now.
 *
 * The live page runs a staged funnel rather than a contact form: apply, book a
 * discovery call, confirm. The booking step there is a scheduler built into
 * their own site — not a Calendly/Cal.com embed — so there is no third-party
 * URL to reuse. `booking` below carries the real copy and details from that
 * widget; wiring it to an actual scheduler needs the provider or endpoint.
 */

export const apply = {
  label: "Apply now",
  title: "Your journey starts\nwith a conversation.",
  lede:
    "Whether you're ready to scale or simply exploring possibilities, we're here to craft the perfect strategy for your success.",

  steps: [
    {
      n: "01",
      title: "Apply Now",
      body: "Tell us where the business is today and what you're aiming at.",
    },
    {
      n: "02",
      title: "Book Discovery Call",
      body: "Pick a time that works. Thirty minutes, decision makers in the room.",
    },
    {
      n: "03",
      title: "Final Confirmation",
      body: "We confirm scope, fit and the plan before anything begins.",
    },
  ],

  analysis: {
    title: "Comprehensive analysis of your current position",
    body:
      "Before we ever talk price, you get a clear read on where you stand and what's actually available to you.",
    items: [
      "Competitor benchmarking report",
      "Quick-win opportunities",
      "ROI improvement projections",
      "Custom growth roadmap",
    ],
  },

  booking: {
    host: "Zilla Media Founders",
    title: "Choose a time to schedule a Discovery Call",
    duration: "30 min",
    timezone: "Asia/Taipei (GMT+8)",
    body:
      "We will diagnose marketing gaps and explore growth opportunities for your firm. Please include the necessary decision makers in this call.",
    cta: "Book your discovery call",
    // Set this to the scheduler URL to make the button live. Until then the
    // page shows the booking panel with the CTA pointing at the live site's
    // own booker rather than silently dead-ending.
    url: "https://zillamedia.co/apply-now",
    external: true,
  },

  // The live page lists these five as titles only, with no supporting copy.
  // The one-liners here are ours — swap or drop them if they overstate.
  next: {
    title: "What happens next?",
    items: [
      { title: "Immediate Confirmation", body: "You'll know we have it straight away." }, // [placeholder] body
      { title: "Expert Review", body: "A strategist reads your application properly." }, // [placeholder] body
      { title: "Personal Connection", body: "We talk. No script, no junior sales call." }, // [placeholder] body
      { title: "Custom Proposal", body: "Scope and numbers built for your situation." }, // [placeholder] body
      { title: "Clear Next Steps", body: "You leave knowing exactly what happens, and when." }, // [placeholder] body
    ],
  },
};
