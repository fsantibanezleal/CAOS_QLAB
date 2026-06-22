# Changelog

All notable changes to CAOS_QLAB. Format: newest → oldest. Versions follow `X.XX.XXX`
(major.minor.patch); patch (`.00X`) for fixes. Kept `0.x` while the web SPA and the framework/case matrix
are still landing. Tags from day one.

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
