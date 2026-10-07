// GitHub Pages and client-side routing, two problems:
//
// 1. Rendering: Pages serves 404.html for any path that is not a file, so 404.html must BE the app.
// 2. The status: that fallback still answers HTTP 404, so every deep link (/benchmark, /case/grover) was an
//    error to crawlers, link previews and monitoring while rendering fine in a browser.
//
// The fix for (2) is a real file per route, in both forms Pages resolves: `<route>.html` (Pages answers an
// extensionless path from it with a direct 200; measured: `/404` answers 200 from 404.html) and
// `<route>/index.html` (the trailing-slash form `/route/`; a directory without the slash answers a 301 to it, the
// model the shell's gate serves). Case routes come from the built catalog, so a case added or removed cannot
// leave a stale or missing route. Unknown paths still get 404.html (status 404).

import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dist = join(dirname(fileURLToPath(import.meta.url)), "dist");
const indexHtml = join(dist, "index.html");
if (!existsSync(indexHtml)) {
  console.error("[spa-routes] dist/index.html missing: run vite build first");
  process.exit(1);
}

copyFileSync(indexHtml, join(dist, "404.html"));

// Keep in sync with the <Route> list in src/App.tsx; `/` is dist/index.html itself.
const routes = ["/cases", "/introduction", "/methodology", "/implementation", "/experiments", "/benchmark"];
const catalog = JSON.parse(readFileSync(join(dist, "data", "catalog.json"), "utf-8"));
for (const c of catalog.cases) routes.push(`/case/${c.id}`);

for (const route of routes) {
  const base = join(dist, ...route.split("/").filter(Boolean));
  mkdirSync(base, { recursive: true });
  copyFileSync(indexHtml, `${base}.html`);
  copyFileSync(indexHtml, join(base, "index.html"));
}
console.log(`[spa-routes] 404.html + ${routes.length} routes as <route>.html and <route>/index.html`);
