# web/: the replay SPA

The static **React 19 + Vite** single-page app, published to GitHub Pages at `qlab.fasl-work.com`. It reads
the committed trace bundles and manifests and renders them; nothing is computed on a server.

## What is here

- The chrome is the shared CAOS shell, [`@fasl-work/caos-app-shell`](https://www.npmjs.com/package/@fasl-work/caos-app-shell)
  (`AppShell` in `src/App.tsx`): header and route nav, footer, the theme and language toggles (stored as
  `caos.theme` and `caos.lang`, so a choice carries across CAOS apps), and the architecture modal, whose five
  tabs `src/components/architecture.tsx` renders from the diagrams in both languages. The documentation
  primitives in `src/components/Tabs.tsx` and `src/lib/citations.tsx` are thin wrappers over the shell's `Tabs`
  and `TabGroups`, `Equation`, `InlineMath`, `Callout`, `CitationsProvider`, `Cite` and `Refs`. `src/index.css`
  holds only QLab's own components; its colour names are aliases of the shell's tokens.
- `copy-data.mjs` (runs before `dev` and `build`): overlays `data/artifacts/` and `manifests/` into `public/`
  and generates `public/data/catalog.json`, one index of every case and variant with its verdict.
- `src/lib/contract.types.ts`: the TypeScript mirror of the data contracts (the qversus trace, QLab's bundle
  and catalog). `src/lib/data.ts` loads the catalog and lazy-loads full bundles.
- `src/pages/`: the six pages (App with the per-case workbench, Introduction, Methodology, Implementation,
  Experiments, Benchmark); the App route is `src/components/Workbench.tsx`, the shell's `CaseWorkbench`: the case, variant and live
  controls in the rail, the question groups (circuit and state, Bloch sphere, measurement, quantum vs classical,
  landscape, energy scan, mitigation, context) as views that fill the panel.
- `src/viz/`: hand-rolled SVG renderers driven by the trace JSON (Bloch sphere, amplitude/phase bars,
  histogram, circuit diagram, the QAOA landscape, ZNE extrapolation, the quantum-vs-classical comparison
  panel). No third-party chart or 3D library.
- `src/live/statevector.ts`: the live lane, QLab's own exact state-vector simulator in TypeScript (at most 12
  qubits). With the sliders at the committed angles it reproduces the committed Qiskit trace. No third-party
  quantum library and no Python run in the browser.

```bash
npm ci
npm run dev        # copy-data, then the Vite dev server
npm run build      # copy-data, tsc, vite build -> dist/
```

Deploy: `.github/workflows/deploy-pages.yml` builds on a push to `main` and publishes `dist/` to Pages.
