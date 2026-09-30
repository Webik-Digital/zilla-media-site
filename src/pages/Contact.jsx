import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "../lib/gsapSetup";
import PageIntro from "../components/PageIntro";
import FooterCTA from "../components/sections/FooterCTA";
import { footer } from "../data/site";
import Button from "../components/Button";

const budgets = ["< $5k", "$5k – $15k", "$15k – $50k", "$50k +"];
const interests = ["Branding", "Content", "Website", "Paid Ads", "AI Automation"];

/**
 * Enquiry form. There's no backend wired up — submitting composes a mailto
 * so nothing silently disappears into a dead endpoint. Point `action` at a
 * real handler when one exists.
 */
export default function Contact() {
  const rootRef = useRef(null);
  const [picked, setPicked] = useState([]);
  const [budget, setBudget] = useState(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".ct-item",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          ease: "power3.out",
          stagger: 0.06,
          scrollTrigger: { trigger: ".ct-body", start: "top 84%" },
        }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const toggle = (v) =>
    setPicked((p) => (p.includes(v) ? p.filter((x) => x !== v) : [...p, v]));

  const onSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const body = [
      `Name: ${data.get("name") || ""}`,
      `Company: ${data.get("company") || ""}`,
      `Interested in: ${picked.join(", ") || "Not specified"}`,
      `Budget: ${budget || "Not specified"}`,
      "",
      data.get("message") || "",
    ].join("\n");
    window.location.href = `mailto:hello@zillamedia.co?subject=${encodeURIComponent(
      "New project enquiry"
    )}&body=${encodeURIComponent(body)}`;
  };

  const field =
    "w-full border-b border-mist-600 bg-transparent py-4 text-mist-100 outline-none transition-colors duration-500 placeholder:text-mist-400 focus:border-zilla";

  return (
    <main ref={rootRef} className="relative bg-ink">
      <PageIntro
        eyebrow="Contact"
        title={"Take the first step\nin market domination."}
        lede="Tell us where you're trying to get to. We'll tell you honestly whether we're the right team to get you there."
      />

      <section className="ct-body grid gap-16 px-5 pb-24 md:px-10 md:pb-36 lg:grid-cols-[1.2fr_0.8fr] lg:gap-24">
        <form onSubmit={onSubmit} className="space-y-10">
          <div className="ct-item grid gap-6 md:grid-cols-2">
            <input name="name" required placeholder="Your name" className={field} />
            <input name="company" placeholder="Company" className={field} />
          </div>
          <div className="ct-item">
            <input
              name="email"
              type="email"
              required
              placeholder="Email address"
              className={field}
            />
          </div>

          <fieldset className="ct-item">
            <legend className="label mb-4 text-mist-400">I'm interested in</legend>
            <div className="flex flex-wrap gap-2">
              {interests.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => toggle(v)}
                  data-cursor="true"
                  aria-pressed={picked.includes(v)}
                  className={`label rounded-full border px-4 py-2.5 transition-colors duration-400 ${
                    picked.includes(v)
                      ? "border-zilla bg-zilla text-ink"
                      : "border-mist-600 text-mist-200 hover:border-mist-400"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="ct-item">
            <legend className="label mb-4 text-mist-400">Budget</legend>
            <div className="flex flex-wrap gap-2">
              {budgets.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setBudget(v)}
                  data-cursor="true"
                  aria-pressed={budget === v}
                  className={`label rounded-full border px-4 py-2.5 transition-colors duration-400 ${
                    budget === v
                      ? "border-zilla bg-zilla text-ink"
                      : "border-mist-600 text-mist-200 hover:border-mist-400"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="ct-item">
            <textarea
              name="message"
              rows={4}
              placeholder="What are you building?"
              className={`${field} resize-none`}
            />
          </div>

          <Button type="submit" surface="dark" className="ct-item">
            Send enquiry
          </Button>
        </form>

        <aside className="space-y-10">
          <div className="ct-item">
            <p className="label mb-3 text-mist-400">Business enquiry</p>
            <a
              href="mailto:hello@zillamedia.co"
              data-cursor="true"
              className="sweep display text-xl text-mist-100"
            >
              hello@zillamedia.co
            </a>
          </div>
          <div className="ct-item">
            <p className="label mb-3 text-mist-400">Social</p>
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
          <div className="ct-item">
            <p className="label mb-3 text-mist-400">Response time</p>
            <p className="text-sm leading-relaxed text-mist-300">
              We reply to every serious enquiry within two business days.
            </p>
          </div>
        </aside>
      </section>

      <FooterCTA />
    </main>
  );
}
