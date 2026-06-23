import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Static SPA for GitHub Pages on the custom domain qlab.fasl-work.com (root). The deploy workflow copies
// dist/index.html -> dist/404.html so client-side routes survive a refresh.
export default defineConfig({
  base: "/",
  plugins: [react()],
  build: { outDir: "dist", sourcemap: false },
});
