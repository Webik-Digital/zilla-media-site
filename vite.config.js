import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const GA_MEASUREMENT_ID = "G-YJ9ZML1XGH";

/**
 * Google Analytics — production builds only.
 *
 * The obvious home for the tag is index.html, but that one file is shared by
 * `npm run dev`, `deploy:staging` and `deploy:prod`, and all three would then
 * report into the same property. Every local reload and every staging review
 * would land in the same numbers as real visitors, and there is no way to
 * separate them afterwards. Vite has no conditionals in HTML, so the tag is
 * injected here instead, only when the mode is production. `vite build --mode
 * staging` gets nothing, and neither does the dev server.
 *
 * If you ever do want staging traffic measured, give it its own property and
 * pick the id by mode here — don't widen this branch.
 */
const googleAnalytics = (mode) => ({
  name: "zilla-google-analytics",
  transformIndexHtml() {
    if (mode !== "production") return [];
    return [
      {
        tag: "script",
        attrs: {
          async: true,
          src: `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`,
        },
        injectTo: "head",
      },
      {
        tag: "script",
        children: [
          "window.dataLayer = window.dataLayer || [];",
          "function gtag(){dataLayer.push(arguments);}",
          "gtag('js', new Date());",
          `gtag('config', '${GA_MEASUREMENT_ID}');`,
        ].join("\n"),
        injectTo: "head",
      },
    ];
  },
});

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss(), googleAnalytics(mode)],
  build: {
    rolldownOptions: {
      output: {
        // Three and GSAP are the bulk of the bundle and change far less often
        // than the site itself — splitting them keeps those chunks cached
        // across deploys instead of being reissued with every copy tweak.
        codeSplitting: {
          groups: [
            { name: "three", test: /node_modules[\\/]three/ },
            { name: "motion", test: /node_modules[\\/](gsap|lenis)/ },
          ],
        },
      },
    },
  },
}));
