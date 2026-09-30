import { useEffect, useRef } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../lib/gsapSetup";
import FooterCTA from "../components/sections/FooterCTA";
import { posts } from "../data/blog";

/** Renders one parsed block. Types come from the blog data module. */
function Block({ block }) {
  if (block.type === "h") {
    return (
      <h2 className="display mt-16 text-[clamp(1.35rem,2.6vw,2rem)] leading-tight text-mist-100">
        {block.text}
      </h2>
    );
  }
  if (block.type === "lead") {
    return <p className="mt-8 font-medium text-mist-100">{block.text}</p>;
  }
  if (block.type === "ul") {
    return (
      <ul className="mt-5 space-y-3">
        {block.items.map((it, i) => (
          <li key={`${it}-${i}`} className="flex gap-4 text-mist-300">
            <span aria-hidden className="mt-[0.7em] h-1 w-1 shrink-0 rounded-full bg-zilla" />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    );
  }
  return <p className="mt-6 text-mist-300">{block.text}</p>;
}

export default function BlogPost() {
  const { slug } = useParams();
  const post = posts.find((p) => p.slug === slug);
  const rootRef = useRef(null);
  const barRef = useRef(null);

  useEffect(() => {
    if (!post || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "expo.out" }, delay: 0.1 })
        .fromTo(
          ".bp-line-inner",
          { yPercent: 135 },
          { yPercent: 0, duration: 1.1, stagger: 0.07 }
        )
        .fromTo(
          ".bp-fade",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.06 },
          "-=0.65"
        );

      // Reading progress. Scrubbed off the article itself rather than the page
      // so the footer doesn't count toward "read".
      gsap.fromTo(
        barRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          transformOrigin: "left center",
          scrollTrigger: {
            trigger: ".bp-article",
            start: "top 80%",
            end: "bottom bottom",
            scrub: 0.3,
          },
        }
      );
    }, rootRef);
    return () => ctx.revert();
  }, [post, slug]);

  useEffect(() => {
    ScrollTrigger.refresh();
  }, [slug]);

  if (!post) return <Navigate to="/blog" replace />;

  const others = posts.filter((p) => p.slug !== slug);

  return (
    <main ref={rootRef} className="relative bg-ink">
      {/* Progress rule pinned under the nav. */}
      <div className="fixed left-0 right-0 top-0 z-[8500] h-px bg-transparent">
        <div ref={barRef} className="h-full origin-left scale-x-0 bg-zilla" />
      </div>

      <header className="px-5 pb-14 pt-36 md:px-10 md:pb-20 md:pt-48">
        <Link
          to="/blog"
          data-cursor="true"
          className="bp-fade label mb-10 inline-flex items-center gap-2 text-mist-400 transition-colors duration-500 hover:text-zilla"
        >
          ← Back to blog
        </Link>

        <h1 className="display max-w-[20ch] text-[clamp(2rem,5.4vw,4.4rem)] leading-[1.08] text-mist-100">
          {post.title.split(": ").map((part, i, arr) => (
            <span key={part} className="line-clip">
              <span className="bp-line-inner block">
                {part}
                {i < arr.length - 1 ? ":" : ""}
              </span>
            </span>
          ))}
        </h1>

        <p className="bp-fade label mt-10 flex flex-wrap items-center gap-x-4 gap-y-2 text-mist-400">
          <span>{post.date}</span>
          <span aria-hidden className="inline-block h-1 w-1 rounded-full bg-mist-400" />
          <span>{post.readTime}</span>
          <span aria-hidden className="inline-block h-1 w-1 rounded-full bg-mist-400" />
          <span className="text-mist-200">{post.author}</span>
        </p>

        {post.tags?.length > 0 && (
          <div className="bp-fade mt-6 flex flex-wrap gap-2">
            {post.tags.map((t) => (
              <span
                key={t}
                className="label rounded-sm border border-mist-600 px-3 py-1.5 text-mist-400"
              >
                {t.replace(/-/g, " ")}
              </span>
            ))}
          </div>
        )}
      </header>

      <article className="bp-article px-5 pb-24 md:px-10 md:pb-36">
        <div className="max-w-[68ch] text-base leading-[1.75] md:text-[1.0625rem]">
          {post.blocks.map((b, i) => (
            <Block key={i} block={b} />
          ))}
        </div>
      </article>

      <section className="border-t border-mist-600 px-5 py-16 md:px-10 md:py-24">
        <p className="label mb-10 text-mist-400">Keep reading</p>
        <div className="grid gap-px bg-mist-600 md:grid-cols-2">
          {others.map((p) => (
            <Link
              key={p.slug}
              to={`/blog/${p.slug}`}
              data-cursor="true"
              className="group bg-ink p-8 md:p-10"
            >
              <h3 className="display max-w-[24ch] text-lg leading-snug text-mist-100 transition-colors duration-500 group-hover:text-zilla md:text-xl">
                {p.title}
              </h3>
              <p className="label mt-5 text-mist-400">
                {p.date} · {p.readTime}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <FooterCTA />
    </main>
  );
}
