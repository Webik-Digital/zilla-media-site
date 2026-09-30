import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap, prefersReducedMotion } from "../lib/gsapSetup";
import PageIntro from "../components/PageIntro";
import FooterCTA from "../components/sections/FooterCTA";
import { blogIndex, posts } from "../data/blog";
import Button from "../components/Button";

/**
 * Resources index. Rows rather than cards: these are long reads, and a row
 * gives the headline the width it needs to stay on two lines.
 */
export default function Blog() {
  const rootRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".bl-row",
        { y: 34, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.09,
          scrollTrigger: { trigger: ".bl-list", start: "top 85%" },
        }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <main ref={rootRef} className="relative bg-ink">
      <PageIntro eyebrow={blogIndex.label} title={blogIndex.title} lede={blogIndex.lede} />

      <section className="bl-list px-5 pb-24 md:px-10 md:pb-36">
        <div className="border-t border-mist-600">
          {posts.map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              data-cursor="true"
              className="bl-row group block border-b border-mist-600 py-10 md:py-14"
            >
              <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
                <div>
                  <h2 className="display max-w-[22ch] text-[clamp(1.4rem,3.2vw,2.6rem)] leading-[1.15] text-mist-100 transition-colors duration-500 group-hover:text-zilla">
                    {post.title}
                  </h2>
                  <p className="label mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-mist-400">
                    <span>{post.date}</span>
                    <span aria-hidden className="inline-block h-1 w-1 rounded-full bg-mist-400" />
                    <span>{post.readTime}</span>
                    <span aria-hidden className="inline-block h-1 w-1 rounded-full bg-mist-400" />
                    <span>{post.author}</span>
                  </p>
                </div>

                <div className="flex flex-col justify-between gap-6">
                  <p className="max-w-md text-sm leading-relaxed text-mist-300">
                    {post.excerpt}
                  </p>
                  {/* as="span": this sits inside the row's own <Link>, and an
                      anchor nested in an anchor is invalid markup. */}
                  <Button as="span" surface="dark" className="w-fit">
                    Read blog
                  </Button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <p className="label mt-14 text-mist-400">Videos and freebies coming soon.</p>
      </section>

      <FooterCTA />
    </main>
  );
}
