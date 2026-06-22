# Architecture — the section index

QLab is a **static** product with a small, extensible **engine** behind it. There is no application server,
no request-time database, no backend that simulates on demand. Every case either runs **live in the
browser** (a JavaScript simulator, small circuits) or is **precomputed offline and replayed** (the real
engines), with an optional **real-hardware** lane that commits a result from a real QPU. The engine is a
clean **Problem × Solver** abstraction so adding a framework is one adapter, never a rewrite.

## Read in order

1. [**01 · Overview**](./architecture/01_overview.md) — the static, three-lane design and why no backend.
2. [**02 · The Problem × Solver engine**](./architecture/02_problem-solver-engine.md) — the adapter
   abstraction, the registry/plug-in seam, and how a complex case is attacked by many solvers at once.
3. [**03 · Trace, manifest & the measured gate**](./architecture/03_trace-and-gate.md) — the artifact
   contracts and how live-vs-precompute is *measured*, not guessed.
4. [**04 · The three lanes**](./architecture/04_lanes.md) — live (JS) · precompute (`.venv`) ·
   real-hardware (IBM/Braket/Azure), and exactly what runs where.
5. [**05 · Deploy**](./architecture/05_deploy.md) — GitHub Pages, the data overlay, the deep-link fallback.

## See also

- [frameworks.md](./frameworks.md) — the real engines each solver wraps.
- [problem-types.md](./problem-types.md) — the formulation taxonomy + the classical-baseline doctrine.
- [../data/README.md](../data/README.md) — the trace + manifest contracts in full.
