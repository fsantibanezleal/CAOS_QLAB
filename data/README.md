# Data — policy & contracts

QLab carries **no raw datasets**. Its "data" is the set of **computed artifacts** the offline pipeline
produces: compact JSON **traces** (the replayable recording of a circuit run) and per-case **manifests**.
A run is a pure function of `(params, seed)`, so the committed bytes are reproducible by anyone who clones
the repo and runs the pipeline.

```
data/
  artifacts/<case>/<variant>.json   committed trace bundles (the source of truth the web replays)
  raw/                              git-ignored — any scratch inputs you bring; never committed
```

`*.npy`, `*.npz`, `*.h5`, `*.parquet` are git-ignored (CI rejects them) — commit only the compact JSON.

## Contract 1 — ingestion ("bring your own circuit")

The lab is teachable on your own circuits. The accepted input is **OpenQASM 2** (the portable baseline) or
a Qiskit/Cirq circuit object. The validation gate (not a silent coercion):

| Field / property | Rule | On violation |
|---|---|---|
| qubit count `n` | `n ≤ 12` for the **live** lane; larger → **precompute** only | routed to precompute, never silently truncated |
| gate set | must be supported by the tracer / the live JS engine | **rejected** with the offending gate named |
| classical feed-forward / mid-circuit measure | offline-only | **rejected** from the live lane, routed to precompute |
| parameters | finite, within the declared instance ranges | **rejected** out of range |

"Outliers" in a quantum trace are non-physical states: the tracer asserts `‖ψ‖ = 1` to float tolerance and
probabilities sum to 1; a violation is a bug, not data to coerce.

## Contract 2 — artifact (pipeline → web), schema `qlab-trace/1`

Each `data/artifacts/<case>/<variant>.json` bundle contains:

```jsonc
{
  "schema_version": "qlab-trace/1",
  "case_id": "maxcut", "category": "variational",
  "title": {...}, "concept": {...}, "metric": {...},        // bilingual
  "instance": { "id": "pentagon", "title": {...}, "params": {...}, "note": {...} },
  "qubits": 5, "lane": "precompute", "lane_reasons": [...], "seed": 42, "shots": 2048,
  "primary_solver": "qaoa-qiskit",
  "trace": {                                                 // the animation (primary circuit solver)
    "qubits": 5,
    "steps": [ { "index", "gate", "targets", "label":{...},
                 "statevector":[{ "re","im" }...],           // 2^n amplitudes (little-endian index)
                 "bloch":[[x,y,z]...], "probabilities":[...] } ],
    "measurements": { "counts": { "01010": 512, ... }, "shots": 2048 },
    "circuit_ops": [ { "gate","targets","params" } ],
    "provenance": { "engine","engine_version","seed","lane","ran_on" }
  },
  "solvers": [ { "solver","label","framework","paradigm","value","cost","notes","optimal","extra" } ],
  "comparison": { "optimal_cut": 4, "qaoa_cut": 4, "verdict": {...} },   // the honesty panel
  "references": [ { "label","doi"|"url" } ]
}
```

**Conventions.** Amplitudes are little-endian (basis index `i` ⇒ qubit 0 is the least-significant bit) and
rounded to 6 decimals. Bitstrings in `value` are in **qubit order** (position `u` = qubit `u`). A TypeScript
mirror of this schema lives in the web app (`frontend/src/lib/contract.types.ts`) so any drift fails the
build.

## Contract — manifest, schema `qlab-manifest/1`

`manifests/<case>__<variant>.json` indexes each artifact: the lane verdict + the **measured numbers** behind
it (`run_ms`, `trace_bytes`, `unitary_only`), the seed/shots/params that reproduce it, the **viz bindings**
(which renderers the web mounts), and the engine provenance + version. CI validates that every `live`
manifest actually clears the gate.

## Reproduce

```bash
./scripts/precompute.sh maxcut --all     # regenerates every maxcut artifact + manifest from seed 42
```
