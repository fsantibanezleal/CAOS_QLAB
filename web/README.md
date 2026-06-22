# web/ — the replay SPA (next phase)

This is where the static **React 19 + Vite** single-page app lives: it reads the committed trace bundles +
manifests and renders them — the Bloch sphere (three.js), amplitude/phase bars, probability histograms,
Q-sphere, density-matrix heatmaps, circuit diagrams, the QAOA (γ,β) landscape, and the **classical-vs-quantum
comparison panels** — plus the live JS tuning lane (`quantum-circuit`, ≤12 qubits) and an embedded Quirk
sandbox.

**Status: not yet built.** The engine, the data contracts and the committed artifacts (the hard part) are
done; the SPA is the next phase and will follow the binding house standard:

- **ADR-0016 / ADR-0017** — the shared `@fasl-work/caos-app-shell`, the centered/​capped layout, the six
  pages (App · Introduction · Methodology · Implementation · Experiments · Benchmark), the per-case
  workbench (variant-bar + Field/Live/Charts/Context sub-tabs), per-section `<Refs>` with real DOIs.
- **ADR-0058** — the in-app ⓘ "How it was built" architecture modal (themed SVGs, ≥5 tabs).
- **ADR-0054 / Pages** — static deploy, `404.html = index.html` deep-link fallback, custom domain
  `qlab.fasl-work.com`.

The plan + the SimLab-exemplar map for this SPA are tracked privately in the CAOS_MANAGE vault.
