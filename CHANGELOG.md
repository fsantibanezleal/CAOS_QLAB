# Changelog

All notable changes to CAOS_QLAB. Format: newest → oldest. Versions follow `X.XX.XXX`
(major.minor.patch); patch (`.00X`) for fixes. Kept `0.x` while the web SPA and the framework/case matrix
are still landing. Tags from day one.

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
