/**
 * Static server for `dist/`, used to capture real footage of the built site.
 *
 * Why this exists rather than `npm run preview`: `.claude/launch.json` is read
 * from the session's working directory, and a config entry there runs from
 * that directory too — so an `npm run preview` entry would look for the wrong
 * package.json. A node script taking an absolute path sidesteps that, which is
 * the same reason every other entry in that file is shaped this way.
 *
 *   node serve-dist.js 4173
 */
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { join, extname, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(fileURLToPath(new URL(".", import.meta.url)), "dist");
const PORT = Number(process.argv[2]) || 4173;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".mp4": "video/mp4",
  ".woff2": "font/woff2",
};

createServer(async (req, res) => {
  const url = decodeURIComponent(req.url.split("?")[0]);
  // normalize collapses any ../ before it can climb out of dist.
  const rel = normalize(url).replace(/^(\.\.[/\\])+/, "").replace(/^[/\\]+/, "");
  let file = join(ROOT, rel || "index.html");

  try {
    const body = await readFile(file);
    res.writeHead(200, {
      "Content-Type": TYPES[extname(file).toLowerCase()] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    res.end(body);
  } catch {
    // SPA fallback — the site is client-routed, so unknown paths are routes.
    try {
      const body = await readFile(join(ROOT, "index.html"));
      res.writeHead(200, { "Content-Type": TYPES[".html"], "Cache-Control": "no-store" });
      res.end(body);
    } catch {
      res.writeHead(404).end("not found");
    }
  }
}).listen(PORT, () => console.log(`serving dist on http://localhost:${PORT}`));
