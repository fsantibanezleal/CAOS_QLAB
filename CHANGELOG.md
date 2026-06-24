# Changelog

All notable changes to CAOS_QLAB. Format: newest → oldest. Versions follow `X.XX.XXX`
(major.minor.patch); patch (`.00X`) for fixes. Kept `0.x` while the web SPA and the framework/case matrix
are still landing. Tags from day one.

## [0.33.000] — 2026-06-23 — ⓘ architecture modal (ADR-0058) + shared diagram module (screenshot-verified)

### Added
- **ⓘ "How QLab works" modal** (`web/src/components/ArchModal.tsx`, ADR-0058) — a header ⓘ button opens a
  modal with **five themed-SVG tabs**: Three lanes · The engine · Trace contract · The measured gate ·
  Deploy, each with a bilingual explainer. Esc / backdrop / ✕ close it.
- **Shared diagram module** (`web/src/viz/diagrams.tsx`) — extracted `ThreeLaneDiagram` (from Introduction)
  and `EngineDiagram` (from Implementation) and added three new ones (`TraceContractDiagram`, `GateDiagram`,
  `DeployDiagram`). The doc pages and the modal now render the same single source — no duplicated SVG.
- **Screenshot-verified** (Playwright, no console errors): the modal's lanes/gate/trace tabs render in dark
  and light, tab-switching works, and the refactored Introduction/Implementation pages are unchanged.
- Refreshed the per-case footer note (the live lane + doc pages shipped, so it now points to the Live tab).

### Still to build
- (Optional) migrate to the shared `@fasl-work/caos-app-shell`. Deploy is gated by the "100% first" decision.

## [0.32.000] — 2026-06-23 — Live (in-browser) lane: interactive re-simulation (screenshot-verified)

### Added
- **The live JS lane** — `web/src/live/statevector.ts`, an exact TypeScript state-vector simulator (≤12 q):
  the 1-qubit gates H/X/Y/Z/S/Sdg/T/Tdg/RX/RY/RZ/P and the 2-qubit CX/CZ/SWAP/CP/RZZ, exact reduced-density
  Bloch vectors, and seeded shot sampling. `liveTrace.ts` runs `circuit_ops` (with slider overrides) into the
  committed **Step/Measurements shape**, so the existing renderers (circuit · Bloch · amplitudes · histogram)
  animate the fresh trace verbatim.
- **`LivePanel`** + a **Replay (committed) / Live (browser)** toggle in the workbench, shown only for
  `live`-lane cases whose every op is supported. A slider per rotation gate re-simulates the circuit in real
  time — drag RY and watch the Bloch vector tip, the amplitudes, and the histogram all respond.
- Chosen as a purpose-built engine over the `quantum-circuit` library (same reasoning as the hand-rolled
  Bloch SVG): exact physics, the exact `Trace` output shape (renderers reused), a lighter bundle, and
  deterministic output. Docs node `docs/guides/02_live-lane.md` updated to match the real implementation.
- **Physics-verified** (Playwright, no console errors): with sliders at the committed angles the live result
  reproduces the Qiskit trace bit-for-bit — Bell Φ⁻ shows |00⟩ phase 0 + |11⟩ phase π exactly; RY(π/3) gives
  the 0.75/0.25 split and Bloch (0.866, 0, 0.5); moving the slider re-simulates live. Verified dark + light.

### Still to build
- The ⓘ ADR-0058 architecture modal; migrate to the shared `@fasl-work/caos-app-shell`; Pages deploy.

## [0.31.000] — 2026-06-23 — Web SPA: Benchmark page — the six standard pages COMPLETE (screenshot-verified)

### Added
- **Benchmark page** (`web/src/pages/Benchmark.tsx`) — the sixth and final standard page: the honesty spine
  quantified. An honest scorecard (**0 of 19 cases show a practical, pay-for-it speedup today**, by design) +
  a distribution bar over four honest advantage classes — **genuine edge / not a speedup** (4: CHSH,
  teleportation, superdense, QRNG), **asymptotic query advantage** (4: BV, DJ, Simon, Grover), **error
  correction that scales** (2: repetition, surface), **classical still wins today** (9). Per-case cards link
  to the workbench and pair the quantum method vs the classical baseline (names pulled live from the catalog)
  with the case-level verdict (mirrored from `docs/use-cases.md`). A "why this framing" note keeps the three
  kinds of "advantage" distinct.
- Header nav now shows all **six tabs** — App · Introduction · Methodology · Implementation · Experiments ·
  Benchmark. **The ADR-0016/0017 six-page structure is complete.**
- **Screenshot-verified** (Playwright, no console errors): the scorecard, distribution bar, and all four
  class sections render in dark and light.

### Still to build
- The live JS lane (quantum-circuit ≤12q) + Quirk for live-lane cases; the ⓘ ADR-0058 architecture modal;
  migrate to the shared `@fasl-work/caos-app-shell`; Pages deploy at qlab.fasl-work.com.

## [0.30.000] — 2026-06-23 — Web SPA: Experiments page (protocol · cross-check · live coverage matrix) (screenshot-verified)

### Added
- **Experiments page** (`web/src/pages/Experiments.tsx`) — the fifth standard page, three sub-tabs:
  **Protocol** (reproducible-by-construction: pure fn of (params, seed); the 24×24 (γ,β) grid-search sweep
  as a KaTeX argmax; the leakage-safe train/test split for QML), **Cross-framework check** (the "two engines
  on one problem" discipline — QAOA agrees across Qiskit/PennyLane/Cirq, QFT validated vs analytic DFT, QEC
  below-threshold reproduced), and a **live coverage matrix** computed from the committed catalog (cases ×
  frameworks × variants × lane × classical baseline), grouped by category, with summary stats
  (19 cases · 113 variant traces · 5 frameworks · 10/9 live/precompute · 19/19 vs classical).
- The headline framework count collapses adapter strings to families (qiskit-aer→qiskit, classical:*→
  classical) so it reads 5, consistent with the Introduction; per-case chips stay granular.
- Header nav extended to **App · Introduction · Methodology · Implementation · Experiments** (5 of 6).
- **Screenshot-verified** (Playwright, no console errors): coverage matrix + Protocol (KaTeX argmax) in dark
  and light.

### Still to build
- The final page (Benchmark — quantum-vs-classical head-to-head from the committed bundles); the live JS lane
  (quantum-circuit) + Quirk; the ⓘ ADR-0058 modal; migrate to shared shell; Pages deploy.

## [0.29.000] — 2026-06-23 — Web SPA: Implementation page (engine · contracts · gate · lanes · deploy) (screenshot-verified)

### Added
- **Implementation page** (`web/src/pages/Implementation.tsx`) — the fourth standard page, six sub-tabs:
  **Problem × Solver engine** (a themed engine-flow SVG: Problem + Solver adapters → registry → single
  pipeline → trace bundle + manifest; the real Python adapter snippet; the additive-extensibility table),
  **Data contracts** (qlab-trace/1 + qlab-manifest/1, determinism = pure fn of (params, seed), replay =
  truth), **The measured gate** (the four live-vs-precompute conditions; CI fails on mislabel; worked
  examples), **Three lanes** (live/precompute/real-hardware comparison table + the dormant-hardware note),
  **Adapters & frameworks** (thin guarded adapters, graceful degradation, web never imports a framework),
  **Deploy** (static GitHub Pages, data overlay, deep-link fallback). Sourced from `docs/architecture/*`.
- Header nav extended to **App · Introduction · Methodology · Implementation** (4 of 6).
- **Screenshot-verified** (Playwright, no console errors): the Engine tab (SVG + code + table) and the Three
  lanes table render in dark and light.

### Still to build
- The remaining two pages (Experiments · Benchmark); the live JS lane (quantum-circuit) + Quirk; the ⓘ
  ADR-0058 modal; migrate to shared shell; Pages deploy.

## [0.28.000] — 2026-06-23 — Web SPA: Methodology page (7 method families, KaTeX) (screenshot-verified)

### Added
- **Methodology page** (`web/src/pages/Methodology.tsx`) — the third standard page. A reusable **`Tabs`**
  component (`web/src/components/Tabs.tsx`) drives one sub-tab per method family: Gates & entanglement ·
  Oracle algorithms · QFT & QPE · **QAOA** · **VQE** · **Quantum ML** · Noise & QEC (three flagged
  `learned`). Each tab: the formulation in prose, the core math as **typeset KaTeX** display equations, the
  honest quantum-vs-classical verdict, and DOI-sourced references.
- **KaTeX** (MIT) added as a web dependency; `Eq`/`Tex` helpers render LaTeX to font-based HTML (deterministic
  to screenshot, no canvas). Recorded in `ATTRIBUTION.md`.
- Header nav extended to **App · Introduction · Methodology**.
- **Screenshot-verified** (Playwright, no console errors): the page + the QAOA and VQE learned tabs render
  with correctly typeset Hamiltonians/expectations in dark and light.

### Still to build
- The remaining three pages (Implementation · Experiments · Benchmark); the live JS lane (quantum-circuit) +
  Quirk; the ⓘ ADR-0058 modal; migrate to shared shell; Pages deploy.

## [0.27.000] — 2026-06-23 — Web SPA: Introduction page + 6-tab nav scaffold (screenshot-verified)

### Added
- **Introduction page** (`web/src/pages/Introduction.tsx`) — the first of the six standard product pages
  (ADR-0016/0017). Rich, bilingual, sourced from `docs/state-of-the-art.md` + `docs/README.md`: the honest
  2025–2026 frame (quantum = scientific instruments, not yet useful computers; the reason every case ships a
  classical baseline), a themed **three-lane architecture SVG** (browser-live · local-precompute ·
  dormant real-hardware → the `qlab-trace/1` contract → static SPA, *replay = truth*), the five real
  frameworks consumed, the six case families (live counts from the catalog), an IS / IS-NOT honest-scope
  panel, and DOI-sourced references.
- **6-tab nav scaffold** in the header (`NavLink`, active-tab underline). Tabs appear only once their page is
  built — **App · Introduction** today; Methodology · Implementation · Experiments · Benchmark land next.
- **Screenshot-verified** (Playwright, no console errors): Introduction renders fully in dark and light, the
  architecture diagram legible in both.

### Still to build
- The remaining four pages (Methodology · Implementation · Experiments · Benchmark); the live JS lane
  (quantum-circuit) + Quirk; the ⓘ ADR-0058 modal; migrate to shared shell; Pages deploy.

## [0.26.000] — 2026-06-22 — Web SPA: ZNE extrapolation plot (screenshot-verified)

### Added
- **`ZneExtrapolation`** (`web/src/viz/ZneExtrapolation.tsx`) — the signature view for the noise/mitigation
  case (which previously had **no** viz, since it carries no statevector trace). Plots the noisy `⟨Z₀Z₁⟩`
  measured at amplified noise scales λ=1,3,5, the linear fit extrapolated back to λ=0 (the mitigated
  estimate = the intercept), and the `ideal` reference — so the residual gap (ZNE reduces bias, it does not
  correct errors) reads directly off the chart. Auto-scales to the data band (hover reads each measured
  point). Sourced from the `noise-qiskit` solver's `extra.zne` (`isZne` guard).
- **Screenshot-verified** (Playwright, no console errors): the descending λ-series fits to the mitigated
  intercept just below ideal, in dark and light.

### Still to build
- Live JS lane (quantum-circuit) + Quirk; the six doc pages + ⓘ ADR-0058 modal; migrate to shared shell;
  Pages deploy.

## [0.25.000] — 2026-06-22 — Web SPA: interactive Bloch sphere (screenshot-verified)

### Added
- **`BlochSphere`** (`web/src/viz/BlochSphere.tsx`) — a drag-to-rotate SVG Bloch sphere (pure orthographic
  projection, no WebGL → deterministic to screenshot). Wireframe globe (meridians + parallels + equator),
  the |0⟩/|1⟩/|±⟩/|±i⟩ poles, the state vector as an arrow (length = |r|), the gate trajectory as a dashed
  path with per-step dots + gate labels, and a live read-out of the Bloch coordinates. Rendered in the
  workbench for single-qubit cases (`trajectoryFromSteps` reads each step's reduced Bloch vector).
- **Screenshot-verified** (Playwright, no console errors): H|0⟩ lands on |+⟩ (r=(1,0,0)) with the trajectory
  from the |0⟩ pole, in dark and light.

### Still to build
- Density-matrix heatmap (noise); live JS lane (quantum-circuit) + Quirk; the six doc pages + ⓘ ADR-0058
  modal; migrate to shared shell; Pages deploy.

## [0.24.000] — 2026-06-22 — Web SPA: QAOA (γ,β) landscape heatmap (screenshot-verified)

### Added
- **`LandscapeHeatmap`** (`web/src/viz/LandscapeHeatmap.tsx`) — an interactive SVG heatmap of the cost
  landscape `⟨cut⟩` over the (γ,β) plane, read straight from the committed `trace.extra.landscape` grid
  (24×24). Sequential dark-blue→teal→yellow ramp (readable on both themes), π-fraction axis ticks, a
  colour-bar with min/max, the optimizer's chosen (γ*,β*) ringed in white, and a hover read-out of the local
  γ/β/⟨cut⟩. Rendered in the workbench only for cases that carry a landscape (the QAOA / MaxCut family);
  guarded by an `isLandscape` type-check.
- **Screenshot-verified** (Playwright, no console errors): the MaxCut landscape renders correctly in dark and
  light — periodic p=1 structure, the optimum ring on a bright peak, colour-bar 1.15→3.92.

### Still to build
- Bloch sphere (three.js), density-matrix heatmap; live JS lane (quantum-circuit) + Quirk; the six doc pages
  + ⓘ ADR-0058 modal; migrate to shared shell; Pages deploy.

## [0.23.000] — 2026-06-22 — Web SPA: circuit-diagram renderer (screenshot-verified)

### Added
- **`CircuitDiagram`** (`web/src/viz/CircuitDiagram.tsx`) — a pure-SVG circuit diagram from the committed
  `trace.circuit_ops`: qubit wires + gate boxes, control dots + ⊕ for CX, dots for CZ, ×–× for SWAP, ZZ/P
  boxes for rzz/cp, rotation angles rendered as π-fractions, a labelled fallback for controlled-unitaries;
  horizontally scrollable for wide circuits, themed (light + dark). Wired into the per-case workbench above
  the amplitudes/histogram.
- Fixed the comparison table rendering nested-dict solver values as `[object Object]` → now skips object
  fields (shown in the dedicated viz) and falls back to "(see viz)".
- **Screenshot-verified** (Playwright, no console errors): the Bell circuit (H·•·Z + ⊕) and the 5-qubit
  MaxCut QAOA circuit (H layer · 6 ZZ cost gates · RX mixer) both render correctly.

### Still to build
- Bloch sphere (three.js), QAOA (γ,β) landscape, density-matrix heatmap; live JS lane (quantum-circuit) +
  Quirk; the six doc pages + ⓘ ADR-0058 modal; migrate to shared shell; Pages deploy.

## [0.22.000] — 2026-06-22 — Web SPA: per-case workbench + first viz (screenshot-verified)

### Added
- **Per-case workbench** (`web/src/components/CaseWorkbench.tsx`) — a **variant-bar** (chips per regime +
  lane badge) that lazy-loads the selected variant's full bundle and renders the data-driven viz.
- **Viz renderers** (no 3D yet), driven by the committed trace JSON, with cursor value read-outs
  (interactive-visualization-rubric): **`Histogram`** (measurement counts), **`AmplitudeBars`** (|amp|²
  height + phase colour, ≤5 q), and the signature **`ComparisonPanel`** (every solver's result + cost in a
  table + the honest quantum-vs-classical verdict).
- **Screenshot-verified** with Playwright (light + dark, no console/page errors): the catalog landing and
  case pages (single-qubit amplitudes/histogram; MaxCut's 5-solver comparison; CHSH; Grover) all render the
  real committed data correctly.

### Still to build
- The Bloch sphere (three.js), circuit-diagram SVG, the QAOA (γ,β) landscape + MaxCut graph; the live JS
  tuning lane (quantum-circuit) + Quirk; the six doc pages; the ⓘ ADR-0058 modal; migrate to the shared
  shell; Pages deploy.

## [0.21.000] — 2026-06-22 — Web SPA foundation (Phase D begins)

### Added
- **`web/` React 19 + Vite SPA foundation** — build-verified (not a mockup; renders the real committed data):
  - `copy-data.mjs` overlays `data/artifacts/` + `manifests/` and generates `public/data/catalog.json`
    (one index of all **19 cases · 113 variants** with per-variant comparison verdicts + solver summaries).
  - `src/lib/contract.types.ts` — the **TypeScript mirror** of the Python data contract (ADR-0057).
  - `src/lib/data.ts` (catalog + lazy bundle loaders), `src/lib/ui.tsx` (lang/theme context).
  - `src/App.tsx` — app shell (sticky header, brand, GitHub/site/portfolio links, EN/ES + light/dark
    toggles, footer) + the **catalog landing** (cases grouped by category) + a per-case page listing
    variants, solver chips (color-coded by paradigm) and the real quantum-vs-classical verdicts.
  - Plain-CSS token theme (light + dark), `vite.config.ts`, `tsconfig.json`, `index.html`.
- **Verified:** `npm install` (73 pkgs, 0 vuln) + `npm run build` (copy-data → tsc → vite) succeed; dist
  ~76 KB gzip; catalog generated for all 19 cases.

### Still to build (the ADR-0016/0017 bar — ongoing)
- Shared `@fasl-work/caos-app-shell` + the six pages; per-case workbench (variant-bar + Field/Live/Charts/
  Context); viz renderers (Bloch three.js, amp/phase bars, histograms, Q-sphere, density, circuit SVG, QAOA
  landscape, graph); live JS lane (quantum-circuit) + Quirk; the ⓘ modal; screenshot-verify; Pages deploy.

## [0.20.000] — 2026-06-22 — Superposition & quantum RNG — ~20-case catalog reached

### Added
- **Case `qrng`** (6 variants) — superposition, measurement statistics, and the quantum random-number
  generator: `H^{⊗n}` uniform sampling (entropy n bits for n=1–4) + two biased `RY(θ)` coins. Solvers
  **`qrng-qiskit`** (Shannon entropy + histogram) and **`qrng-classical`** (a PRNG with identical stats).
  Lane=live. Folds in the "superposition & measurement statistics" roadmap item.
- Honest verdict: quantum and classical sampling are statistically indistinguishable here; the quantum edge
  is **certifiable true randomness** (measurement collapse, useful for crypto/random beacons), not better
  numbers. Cast entropy/probabilities to plain floats for clean JSON.
- Pipeline qrng verdict; test `test_qrng_entropy`; docs node `19_qrng.md`.

### Milestone
- **~20-case catalog reached (19 cases)** across all 6 categories; engine + contracts + docs complete for
  the full curriculum. The big remaining piece is the frontend SPA (Phase D).

### Verified
- 24/24 tests, ruff clean. Uniform entropy = n bits; biased = 0.811 bits (= H(0.75)).

## [0.19.000] — 2026-06-22 — Single-qubit gates & Bloch sphere (fundamentals category opens)

### Added
- **Case `single-qubit`** (6 gate sequences) — opens the **fundamentals** category and anchors the Bloch
  renderer. Solvers **`gates-qiskit`** (steps |0⟩ through a gate sequence, reports the per-step + final
  Bloch vector) and **`bit-classical`** (the classical-bit / Holevo reference). Lane=live.
- All Bloch vectors exact: X→(0,0,−1), H→(1,0,0), H·Z→(−1,0,0), H·S→(0,1,0), RY(π/3)→(0.866,0,0.5),
  RX(π/2)→(0,−1,0); all pure states on the unit sphere. Honest verdict: a qubit roams the whole sphere but
  a measurement returns one classical bit (Holevo) — no advantage from one qubit alone; power comes from
  interference across many.
- Pipeline single-qubit verdict; test `test_single_qubit_bloch_vectors`; docs node `18_single-qubit.md`.

### Verified
- 23/23 tests, ruff clean. Bloch vectors match the analytic rotations; |r|=1 throughout.

## [0.18.000] — 2026-06-22 — Superdense coding (2 classical bits in 1 qubit)

### Added
- **Case `superdense`** (4 variants = the complete 2-bit message set, honestly not padded) — send 2
  classical bits by transmitting one qubit, the dual of teleportation. Solvers **`superdense-qiskit`**
  (encode `Z^{b1}X^{b0}` → Bell state → Bob's decode, with trace) and **`superdense-classical`** (the
  Holevo 1-bit/qubit limit). Lane=live.
- All four messages (00/01/10/11) decode exactly — 2 bits per transmitted qubit, beating Holevo's 1 — at
  the cost of a pre-shared Bell pair. Verdict: a real resource trade (entanglement ↔ communication), not
  free bandwidth. Fixed the q0/q1 readout order so 01↔10 decode correctly.
- Pipeline superdense verdict; test `test_superdense_decodes_all_messages`; docs node `17_superdense.md`.

### Verified
- 22/22 tests, ruff clean. decoded == message for all four; classical baseline = 1 bit/qubit.

## [0.17.000] — 2026-06-22 — Quantum teleportation (perfect unknown-qubit transfer)

### Added
- **Case `teleportation`** (6 input states) — move an unknown qubit with a shared Bell pair + 2 classical
  bits, run in the coherent (deferred-measurement) form so the 3-qubit statevector trace shows |ψ⟩'s Bloch
  vector hop Alice→Bob. Solvers **`teleport-qiskit`** (input/output Bloch + state fidelity) and
  **`teleport-classical`** (measure-and-resend bound 2/3). Lane=live.
- Every state teleports with **fidelity 1.000** (input Bloch == output Bloch exactly), vs the classical 2/3
  measure-and-resend bound. Verdict is precise: a genuinely quantum protocol with no classical equivalent,
  but it needs a Bell pair + 2 cbits, destroys the original (no-cloning), and is NOT faster-than-light.
- Pipeline teleportation verdict; test `test_teleportation_perfect_fidelity`; docs node `16_teleportation.md`.

### Verified
- 21/21 tests, ruff clean. Fidelity 1.0 on all 6 states; classical bound 2/3.

## [0.16.000] — 2026-06-22 — CHSH / Bell inequality (where quantum genuinely beats classical)

### Added
- **Case `chsh`** (6 variants) — the CHSH/Bell-inequality test: a Bell pair measured in 4 settings, the
  correlators `E(a,b)=⟨M(a)⊗M(b)⟩` computed from real Qiskit observables, the CHSH value
  `S = E00+E01+E10−E11`. Solvers **`chsh-qiskit`** (with Bell-prep trace) and **`chsh-classical`** (the
  local-hidden-variable bound S≤2). Lane=live.
- The rare honest case where quantum **wins**: optimal angles reach S=2.828 = **2√2** (Tsirelson, violates
  the classical 2); aligned bases hit exactly 2; a **separable state gives only 1.414** (no violation —
  entanglement required). Verdict is precise: a nonlocality result (rules out local realism, 2022 Nobel),
  NOT a computational speedup. A deliberate counterpoint to the "classical still wins" computational cases.
- Pipeline CHSH verdict; test `test_chsh_violates_classical_bound`; docs node `15_chsh.md`.

### Verified
- 20/20 tests, ruff clean. S=2√2 at optimal; separable state never exceeds 2.

## [0.15.000] — 2026-06-22 — QEC surface code (threshold crossover) — QEC arc complete

### Added
- **Case `qec-surface`** (6 variants, distance×p) — the rotated surface code (corrects X **and** Z), the
  fault-tolerance front-runner, via the real Stim + PyMatching pipeline. Generalized the `qec-stim` adapter
  to handle both repetition and surface codes (one solver, `code_task` param); `qec-baseline` extended too.
- Shows the **threshold crossover** cleanly: at p=0.005 (below) distance-5 beats distance-3 (0.0057<0.0080);
  at p=0.01/0.02 (at/above ~1% threshold) distance-5 is WORSE (0.036>0.028; 0.180>0.092) — more qubits hurt
  above threshold. d=3 ≈ 26 qubits, d=5 ≈ 64 qubits. The Willow-2024 regime, honest about scale.
- Pipeline surface verdict; test `test_qec_surface_below_threshold`; docs node `14_qec-surface.md`.
  **Completes the QEC arc** (mitigation → repetition → surface) and the ~20-case roadmap's QEC section.

### Verified
- 19/19 tests, ruff clean. d5 < d3 below threshold; d5 > d3 above.

## [0.14.000] — 2026-06-22 — QEC repetition code + Stim framework (error CORRECTION that scales)

### Added
- **Framework: Stim (+ PyMatching)** — a new stabilizer/QEC simulation paradigm beside the state-vector
  engines, added as one adapter (`qlab/solvers/stim_solvers.py`) + docs node `docs/frameworks/04_stim.md`.
- **Case `qec-repetition`** (6 variants, distance×p) — the real QEC toolchain: `stim.Circuit.generated`
  repetition-code memory → detector sampler → **PyMatching MWPM** decoder → logical error rate. Solvers
  **`qec-stim`** and **`qec-baseline`** (unprotected-qubit classical model). Lane=precompute, 50k shots.
- Shows below-threshold scaling: at p=0.05/0.1 the distance-5 code beats distance-3 (0.0088<0.0266;
  0.056<0.091) and both beat the unprotected qubit; at p=0.2 the distance benefit vanishes (≈ threshold) —
  the honest crossover (Willow 2024 in miniature). Verdict: correction *scales* (unlike mitigation), but
  it's one bit-flip logical qubit, far from useful FT scale.
- Pipeline QEC verdict; test `test_qec_repetition_below_threshold`; docs node `13_qec-repetition.md`;
  pymatching added to requirements-precompute.

### Verified
- 18/18 tests, ruff clean. d5 logical < d3 logical below threshold; both < unprotected.

## [0.13.000] — 2026-06-22 — Noise & error mitigation (ZNE) — noise-and-qec category opens

### Added
- **Case `noise`** (6 variants, p×depth) — opens the **noise-and-qec** category. Real qiskit-aer
  depolarizing noise model on a Bell circuit (exact density-matrix sim), with **zero-noise extrapolation**
  (global gate folding λ=1,3,5 + linear extrapolation). Solvers **`noise-qiskit`** (ideal/noisy/mitigated
  ⟨Z₀Z₁⟩ + the ZNE fit + ideal/noisy histograms) and **`noise-classical`** (exact noiseless statevector).
- ZNE cuts the error **~11×** at low noise, down to **~1.5×** at high noise — the honest degradation. The
  verdict states mitigation is bias-reduction NOT correction, has exponential sampling overhead, and is
  beaten free by classical statevector at simulable scale.
- Engineering: ZNE implemented directly (qiskit-aer + numpy) — Mitiq is the standard tool but GPL-3.0, so
  no GPL dependency is added; Mitiq is documented as the production library. Tracer already handles this
  (no step-trace; value+extra only). Test `test_noise_zne_reduces_error`; docs node `12_noise.md`.

### Verified
- 17/17 tests, ruff clean. Mitigated error < noisy error on every variant.

## [0.12.000] — 2026-06-22 — QML quantum-kernel classifier (second learned method; hype check)

### Added
- **Case `qml`** (6 datasets: linear, linear-hard, circles, moons, xor, blobs) — a **quantum fidelity-kernel
  SVM** (PennyLane 2-qubit angle+ZZ feature map → `SVC(kernel="precomputed")`) vs a classical **RBF-SVM**
  (`qml-classical`, scikit-learn) on identical data. Lane=precompute. The **second learned method** → the
  ≥2-learned-methods product bar (VQE + QML) is met.
- Honest result, emergent from the real computation: the quantum kernel **ties** classical on the
  structured sets and is **worse** on `moons` (0.875 vs 0.938) — no advantage. Verdict cites the contrived
  nature of provable separations + the data-loading bottleneck.
- Added scikit-learn to `requirements-precompute.txt`. Pipeline QML verdict; test
  `test_qml_quantum_kernel_classifies`; docs node `docs/use-cases/11_qml.md`.

### Verified
- 16/16 tests, ruff clean. Quantum test-acc ≤ classical on every dataset.

## [0.11.000] — 2026-06-22 — VQE H₂ (first learned method; real quantum chemistry)

### Added
- **Case `vqe`** (6 bond lengths) — variational ground-state energy of H₂ on the **real** molecular
  Hamiltonian, built by PennyLane's **differentiable Hartree-Fock** (STO-3G, 4 qubits, no external chemistry
  backend). Solvers **`vqe-pennylane`** (HF + DoubleExcitation ansatz, θ grid-search; reports the
  energy-vs-θ landscape) and **`vqe-classical`** (exact diagonalization / FCI). Lane=precompute.
- VQE matches FCI to **chemical accuracy** (< 1.6e-3 Ha) at every bond length along the dissociation curve;
  equilibrium 0.74 Å → −1.1373 Ha (textbook). The **first learned/trained** method in QLab.
- Honest verdict: H₂ minimal-basis is a 4×4 matrix → no advantage, pedagogy; scaling hits barren plateaus.
- Pipeline VQE verdict; test `test_vqe_h2_matches_fci`; docs node `docs/use-cases/10_vqe.md`.

### Verified
- 15/15 tests, ruff clean. Errors vs FCI: 1e-6 … 1.3e-4 Ha across R ∈ {0.5…2.5} Å.

## [0.10.000] — 2026-06-22 — Shor (toy: factor 15) — flagship quartet complete

### Added
- **Case `shor`** (6 bases of N=15) — real QPE **order-finding** on a genuine 16×16 modular-multiplication
  unitary `U_a|y⟩=|a·y mod N⟩` (built as a permutation `UnitaryGate`, controlled powers `U_a^{2^j}`),
  inverse QFT, then **continued fractions → gcd** for the factors. Solvers **`shor-qiskit`** (8 qubits,
  full trace) and **`shor-classical`** (trial division). Every base recovers the order (r=2/4) and factors
  15 → [3,5]; `correct=True` throughout. Lane=precompute.
- The headline honesty verdict: factoring 15 is trivial classically, and RSA-2048 needs ~10⁶ noisy physical
  qubits + full fault tolerance (Gidney 2025) — Shor is NOT a near-term cryptographic threat.
- Robustness: the circuit tracer now safely skips non-scalar gate params (a `UnitaryGate` carries a matrix),
  so custom-unitary cases trace cleanly. Pipeline Shor verdict; test `test_shor_factors_15`; docs node
  `docs/use-cases/09_shor.md`. **Completes the flagship-algorithms quartet (Grover · QFT · QPE · Shor).**

### Verified
- 14/14 tests, ruff clean. All 6 bases → factors [3,5].

## [0.09.000] — 2026-06-22 — Quantum Phase Estimation (the QFT's first payoff)

### Added
- **Case `qpe`** (6 variants, t=3–5) — estimate the eigenphase φ of U=P(2πφ) on |1⟩ via controlled-U^{2^j}
  + inverse QFT. Solvers **`qpe-qiskit`** (real circuit + counting-register trace; exact cases hit φ with
  P=1.0, finite-precision cases land on the nearest 2^{-t} bin with textbook probabilities) and
  **`qpe-classical`** (exact eigendecomposition of the 2×2 U). Lane=live.
- Honest verdict: QPE is finite-precision and, at toy scale, beaten by instant classical diagonalization —
  it earns its keep only when U is too large to diagonalize (e^{iHt} in Shor/chemistry). Builds on the QFT.
- Pipeline QPE verdict; test `test_qpe_estimates_phase`; docs node `docs/use-cases/08_qpe.md`.

### Verified
- 13/13 tests, ruff clean. Exact φ (1/4, 5/8, 3/16) → error 0.0, P(top)=1.0; inexact φ → nearest bin.

## [0.08.000] — 2026-06-22 — Quantum Fourier Transform (flagship subroutine)

### Added
- **Case `qft`** (6 variants, n=3–4) — the QFT as H + a controlled-phase ladder + swaps. Solvers
  **`qft-qiskit`** (real circuit + phase-ramp trace; **self-validated against the analytic DFT**, fidelity
  1.000 on all variants) and **`qft-classical`** (`numpy.fft`, the full readable spectrum). Lane=live.
- The honest lesson encoded in the verdict: QFT applies the transform in O(n²) gates vs classical
  O(n·2ⁿ), but the output is unreadable on measurement → a subroutine (QPE/Shor), not a standalone speedup.
- Pipeline QFT verdict; test `test_qft_matches_analytic_dft`; docs node `docs/use-cases/07_qft.md`.

### Verified
- 12/12 tests, ruff clean. Fidelity vs analytic DFT = 1.000 across all 6 variants.

## [0.07.000] — 2026-06-22 — Grover's search (flagship-algorithms category opens)

### Added
- **Case `grover`** (6 variants: N=4–16, single + multi-marked) — opens the **flagship-algorithms**
  category. Real oracle (phase flip per marked state) + diffuser (inversion about the mean), optimal
  `k=⌊(π/4)√(N/M)⌋` iterations. Solvers **`grover-qiskit`** (real circuit + amplitude-growth trace) and
  **`grover-classical`** (random linear scan). Success probabilities match the textbook Grover values
  (N=4 exact 1.0; N=8 → 0.945; N=16 → 0.961); marked item found on every variant. Lane=live.
- Pipeline Grover verdict (√N vs ~N/2, honest "asymptotic" framing); test `test_grover_finds_marked`;
  docs node `docs/use-cases/06_grover.md` (rotation-angle derivation + over-rotation note + results).

### Verified
- 11/11 tests, ruff clean. P(marked) ≥ 0.94 on all variants; found ∈ marked throughout.

## [0.06.000] — 2026-06-22 — Simon's algorithm (first exponential separation; oracle quartet)

### Added
- **Case `simon`** (6 periods, n=2–3 / 4–6 qubits) — recover a hidden period `s` of a 2-to-1 function in
  **O(n)** quantum queries vs **~2^{n/2}** classical (birthday-collision). The first provably *exponential*
  query separation (Shor's ancestor), honestly framed (oracle model; tiny n still instant classically).
- Solvers: **`simon-qiskit`** (real 2n-qubit circuit + trace; reads the input-register marginal of `y`'s
  with `y·s=0` and solves GF(2) for the unique non-zero `s`) and **`simon-classical`** (collision search
  → `s=x₁⊕x₂`). All 6 periods recovered correctly. Lane=precompute (sampling + classical post-process).
- Pipeline Simon verdict; test `test_simon_recovers_period`; docs node `docs/use-cases/05_simon.md`
  (coset/GF(2) derivation + results). Completes the oracle quartet (DJ · BV · Simon).

### Verified
- 10/10 tests, ruff clean. quantum O(n) queries; recovered s matches the secret on all variants.

## [0.05.000] — 2026-06-22 — Real-hardware lane wired (Phase E, opt-in)

### Added
- **`ibm-hardware` solver** (`qlab/solvers/hardware_solvers.py`, qiskit-ibm-runtime) — submit a case to a
  real IBM Quantum QPU (free Open Plan) and return the counts as a `quantum-hardware` result with `ran_on`
  provenance. Reuses the Qiskit adapters' circuits (single source of physics). **Opt-in:** `requires_opt_in`
  + a registry guard mean it NEVER runs in a default `--all`; only `--solver ibm-hardware` invokes it, and
  it stays dormant until `QISKIT_IBM_TOKEN` is set. The public static site ships no secrets.
- **Connectivity validator** `tools/check_backends.py` (+ `scripts/check-backends.{ps1,sh}`) — reads
  `.env`/env, reports which providers are configured, and live-pings IBM (free) to list devices.
- `.env.example` extended (IBM, Q-CTRL Fire Opal, qBraid, AWS Braket, Azure Quantum) aligned to the
  validator; `requirements-hardware.txt` notes the optional Fire Opal / qBraid / Braket / Azure SDKs.

### Notes
- Credentials live ONLY in the CAOS_MANAGE vault (`credentials/providers/{ibm-quantum,q-ctrl,qbraid,
  aws-braket,azure-quantum}/`); copy a token into QLab `.env` (git-ignored) to exercise the lane locally.
- 9/9 tests, ruff clean. Hardware verified to stay out of the default precompute run.

## [0.04.000] — 2026-06-22 — Deutsch–Jozsa (oracle trio complete)

### Added
- **Case `deutsch-jozsa`** (6 variants: 2 constant + 4 balanced, 3–4 qubits) — decide constant vs balanced
  in **1 quantum query** vs up to **2ⁿ⁻¹+1** classical (the historical first exponential query separation),
  honestly framed (oracle model). Solvers **`dj-qiskit`** (real circuit + trace) and **`dj-classical`**
  (oracle queries, early-exit on balanced). All 6 verdicts correct; all live (≤5 qubits). 6 committed traces.
- Pipeline DJ verdict; test `test_deutsch_jozsa_constant_and_balanced`; docs node
  `docs/use-cases/04_deutsch-jozsa.md` (interference derivation + results). Completes the oracle-algorithms
  trio (Deutsch–Jozsa · Bernstein–Vazirani · [Simon next]).

### Verified
- 9/9 tests, ruff clean. Constant ⇒ all-zeros; balanced ⇒ non-zero; quantum_queries=1 throughout.

## [0.03.000] — 2026-06-21 — Bernstein–Vazirani (Phase C: oracle-algorithms category)

### Added
- **Case `bernstein-vazirani`** (6 hidden strings, 3–6 bits) — a new **oracle-algorithms** category. Recovers
  the hidden string `s` from an oracle `f(x)=s·x` in **1 quantum query** (phase kickback + interference) vs
  **n classical queries**: a real query-complexity advantage, honestly framed (oracle model, not wall-time).
- Solvers: **`bv-qiskit`** (real circuit on n+1 qubits + step trace) and **`bv-classical`** (bit-by-bit
  oracle queries). Both recover s correctly on all 6 variants; all run **live** (≤7 qubits, unitary).
- Pipeline comparison verdict for BV (1 vs n queries); test `test_bernstein_vazirani_recovers_secret…`;
  docs node `docs/use-cases/03_bernstein-vazirani.md` (formalization + phase-kickback derivation + results).
- 6 committed traces + manifests.

### Verified
- 8/8 tests, ruff clean. All 6 secrets recovered with quantum_queries=1.

## [0.02.000] — 2026-06-21 — Cirq adapter (Phase B start) + nested docs wiki

### Added
- **`qaoa-cirq`** solver adapter (`cirq-core==1.6.1`) — a third independent QAOA-MaxCut implementation.
  Qiskit + PennyLane + Cirq now all reproduce the classical optimum on every graph (2/4/4/4/4/7): a genuine
  three-way cross-check, and the extensibility claim proven again (one adapter + one registry line, no core
  change). MaxCut artifacts regenerated with the third solver.
- **Docs nesting** to the SimLab "node = `X.md` index + `X/` folder" convention: `docs/frameworks/03_cirq.md`
  + `03_cirq/{01_installation,02_usage,03_applying}.md` + runnable `example.py`; a new
  **`docs/abstractions.md`** section (`01_problem-solver.md`, `02_extending.md`) documenting the engine as
  classes & contracts and the exact recipe to extend it.
- Synthesized the cost-capability research into the paid-tier decision (Kipu contested + paywalled; OptQC
  stale; Q-CTRL Fire Opal free tier = the real free leverage). *(in the private vault.)*

### Verified
- Cirq `example.py` runs (triangle cut = 2). Three-way QAOA agreement on all 6 graphs. ruff + pytest green.

## [0.01.000] — 2026-06-21 — Engine + pipeline (real, runnable)

The substrate and the proving slice. Everything here runs the real engines and produces committed,
reproducible artifacts — no mockups.

### Added
- **Engine core** (`qlab/core`): seeded RNG (`run = pure fn of (params, seed)`), the JSON **trace schema**
  (`qlab-trace/1` — per-step statevector + per-qubit Bloch vector + probabilities), the measured
  **live/precompute gate** (`LIVE_MAX_QUBITS=12`, unitary-only, run-ms, trace-bytes), the **manifest**
  contract (`qlab-manifest/1`), and the shared Qiskit **circuit→trace** tracer.
- **Problem × Solver abstraction** (`qlab/problems`, `qlab/solvers`): a `Problem` formulation + thin
  `Solver` adapters over real frameworks, self-registering into `qlab/registry.py`. Adding a framework is
  one adapter + one registry line.
- **Solvers (real frameworks):** Qiskit 2.4.2 (+ quantum_info) state-prep + p=1 QAOA; PennyLane 0.45.0
  QAOA (independent cross-check); classical baselines (brute-force optimal + greedy + direct amplitudes).
- **Cases:** `state-prep` (Bell Φ⁺/Φ⁻/Ψ⁺/Ψ⁻, GHZ-3, GHZ-4, W-3) and `maxcut` (triangle, square,
  square+diag, bow-tie, pentagon, 6-node 3-regular).
- **Pipeline CLI** (`python -m qlab.pipeline`): runs all applicable solvers, writes a per-(case,variant)
  trace bundle + comparison verdict + manifest, classifies the lane, prints the head-to-head.
- **13 committed artifacts** (7 state-prep + 6 maxcut) + matching manifests, byte-reproducible from seed 42.
- **Tooling:** `.venv` setup + precompute scripts (PowerShell + bash), CI (ruff + pytest + pipeline smoke
  + public-repo guards), Pages deploy workflow (for the SPA), pinned requirements (core / precompute /
  hardware / dev), MIT license, `.env.example` for the optional real-hardware lane.
- **Docs wiki** (SimLab-style) seeded: architecture, frameworks, problem-types, use-cases, guides, and the
  honest **state-of-the-art** dossier.

### Verified
- 7/7 tests pass against the real engines; ruff clean.
- Physics spot-checks: Bell/GHZ/W amplitudes exact; QAOA (Qiskit **and** PennyLane) reproduce the classical
  optimum on all 6 graphs (cuts 2/4/4/4/4/7) and never beat it — the honest, expected NISQ result.

### Not yet (next phases)
- The React SPA replay viewer (ADR-0016/0017 shell, six pages, per-case workbench, ⓘ modal).
- Framework breadth (Cirq, Stim, pytket, Qulacs, OpenFermion, Mitiq adapters).
- Case breadth (oracle algorithms, Grover, QFT/QPE, Shor-toy, VQE, QML, noise+mitigation, QEC).
- The optional real-hardware lane (IBM Open / Braket / Azure) — gated on the account/tier decision.
