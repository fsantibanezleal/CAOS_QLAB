# web/ — the replay SPA (Phase D, in progress)

The static **React 19 + Vite** single-page app that reads the committed trace bundles + manifests and
renders them. Build-verified; the visual depth is being filled in case-category by case-category.

## Status

**Foundation built + building (v0.21.000):**
- `copy-data.mjs` — overlays `data/artifacts/` + `manifests/` into `public/` and generates
  `public/data/catalog.json` (one index of all 19 cases · 113 variants, with per-variant verdicts).
- `src/lib/contract.types.ts` — the **TypeScript mirror** of the Python data contract (ADR-0057).
- `src/lib/data.ts` — loads the catalog + lazy-loads full bundles.
- `src/App.tsx` — the app shell (header + theme/lang) + the **catalog landing** (cases grouped by category)
  + a per-case page listing variants, solver chips and the real quantum-vs-classical verdicts.

```bash
npm install
npm run build      # copy-data → tsc → vite build (verified: 19 cases, dist/ ~76 KB gzip)
npm run dev        # local dev server
```

## Still to build (the ADR-0016/0017 bar)

- Migrate the shell to the shared **`@fasl-work/caos-app-shell`** (header/footer/Tabs/SubTabs/Equation/
  Cite/Refs); the six pages (App · Introduction · Methodology · Implementation · Experiments · Benchmark).
- The **per-case workbench**: variant-bar + Field/Simulator · Live · Charts/Comparison · Context sub-tabs.
- **Viz renderers** driven by the trace JSON: Bloch sphere (three.js), amplitude/phase bars, probability
  histograms, Q-sphere, density-matrix heatmaps, circuit SVG, the QAOA (γ,β) landscape, the MaxCut graph.
- The **quantum-vs-classical comparison panel** (QLab's signature view), the **live JS lane**
  (`quantum-circuit`, ≤12 q) + embedded Quirk, and the **ⓘ ADR-0058 architecture modal**.
- Deploy: the Pages workflow (already in the repo) + `404.html` fallback + custom domain `qlab.fasl-work.com`.
- **Screenshot-verify every tab (light + dark) before deploy** (product-quality-bar).

Map: `wip/qlab/simlab-exemplar-map.md` (RotorVitals/SimLab is the structural exemplar).
