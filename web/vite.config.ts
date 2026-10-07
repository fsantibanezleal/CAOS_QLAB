import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { THEME_BOOT_SCRIPT } from "@fasl-work/caos-app-shell/keys";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const appVersion = readFileSync(fileURLToPath(new URL("../VERSION", import.meta.url)), "utf-8").trim();

// Static SPA for GitHub Pages on the custom domain qlab.fasl-work.com (root). The postbuild step
// (spa-routes.mjs) writes a real <route>.html per route so deep links answer 200.
export default defineConfig({
  base: "/",
  plugins: [
    react(),
    {
      // The shell's pre-paint script: the stored theme and language apply before the first frame (ADR-0011).
      name: "caos-theme-boot",
      transformIndexHtml: (html) => html.replace("<!-- caos-theme-boot -->", `<script>${THEME_BOOT_SCRIPT}</script>`),
    },
  ],
  // One React and one router, or the shell sits outside the router context.
  resolve: { dedupe: ["react", "react-dom", "react-router"] },
  define: { __APP_VERSION__: JSON.stringify(appVersion) },
  build: { outDir: "dist", sourcemap: false },
});
