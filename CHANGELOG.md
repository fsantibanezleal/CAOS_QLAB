# Changelog

All notable changes to CAOS_QLAB. Format: newest → oldest. Versions follow `X.XX.XXX`
(major.minor.patch); patch (`.00X`) for fixes. Kept `0.x` while the web SPA and the framework/case matrix
are still landing. Tags from day one.

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
