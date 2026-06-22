# 03 · Trace, manifest & the measured gate

Two data contracts decouple the engine from the web app, and a **measured** gate decides which lane a case
runs in. Full field-by-field schemas are in [../../data/README.md](../../data/README.md); this page is the
*why*.

## The trace (artifact contract), schema `qlab-trace/1`

A trace is a **replayable recording** of one circuit run. For every step (a gate, a barrier, a prepared
state) it stores the full **statevector** (2ⁿ complex amplitudes), the per-qubit reduced **Bloch vector**
`[⟨X⟩,⟨Y⟩,⟨Z⟩]`, and the basis-state **probabilities**, plus the final measurement **histogram**. It is
JSON-first, compact (amplitudes rounded to 6 decimals), and contains **no Qiskit type** — so the browser
never depends on a Python library. A TypeScript mirror keeps the web in lockstep; drift fails the build.

Determinism is the contract: a run is a pure function of `(params, seed)`. The only stochastic step is
measurement sampling, routed through one seeded NumPy generator, so the committed counts reproduce exactly.
Everything else (statevector evolution) is exact. **Replay = truth.**

## The manifest (index contract), schema `qlab-manifest/1`

One manifest per (case, variant) records the **lane verdict** and the measured numbers behind it, the
seed/shots/params that reproduce the trace, the **viz bindings** (which renderers the web mounts:
`bloch`, `amp_phase`, `histogram`, `qsphere`, `density`, `circuit`, `landscape`, `graph`), and the engine
provenance + version. The web app reads the set of manifests as its catalog.

## The measured gate — live vs precompute (not a matter of taste)

`qlab/core/gate.py::classify_lane` decides the lane from **measurements**. A case runs **live** only if all
hold:

1. `qubits ≤ LIVE_MAX_QUBITS` (12) — 2ⁿ amplitudes must stay interactive in JS (~12 q ≈ 64 MB).
2. **unitary-only** — no realistic noise (needs Aer), no mid-circuit measurement + feed-forward
   (teleportation/QEC), no optimization loop (VQE/QAOA training).
3. `run_ms ≤ LIVE_RUN_MS` (1500) — the offline build time, a proxy for browser responsiveness.
4. `trace_bytes ≤ LIVE_TRACE_BYTES` (~1 MB).

Otherwise the case is **precompute**. The verdict and the numbers behind it are written into the manifest,
and CI fails the build if a `live`-tagged case breaches a gate — *mislabeling cannot ship*. Both lanes
render through one code path.

**Worked examples (from the shipped cases):** `state-prep` (≤4 qubits, pure unitary, ~1–2 ms, ~9 KB) → 
**live**. `maxcut` (≤6 qubits, but a p=1 QAOA carries an offline `(γ,β)` grid-search optimization loop) → 
**precompute** (`unitary_only=False`); the committed trace still replays the optimal-parameter circuit.

## Read next

- [04_lanes.md](./04_lanes.md) — what concretely runs in each lane.
- [../../data/README.md](../../data/README.md) — the schemas field by field + the ingestion contract.
