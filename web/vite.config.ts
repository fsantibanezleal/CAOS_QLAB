import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const appVersion = readFileSync(fileURLToPath(new URL("../VERSION", import.meta.url)), "utf-8").trim();

// Static SPA for GitHub Pages on the custom domain qlab.fasl-work.com (root). The deploy workflow copies
// dist/index.html -> dist/404.html so client-side routes survive a refresh.
export default defineConfig({
  base: "/",
  plugins: [react()],
  define: { __APP_VERSION__: JSON.stringify(appVersion) },
  build: { outDir: "dist", sourcemap: false },
});
