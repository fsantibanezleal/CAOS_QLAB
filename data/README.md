# Data: policy & contracts

QLab carries **no raw datasets**. Its "data" is the set of **computed artifacts** the offline pipeline
produces: compact JSON **traces** (the replayable recording of a circuit run) and per-case **manifests**.
A run is a pure function of `(params, seed)`, so the committed bytes are reproducible by anyone who clones
the repo and runs the pipeline.

```
data/
  artifacts/<case>/<variant>.json   committed trace bundles (the source of truth the web replays)
  raw/                              git-ignored: any scratch inputs you bring; never committed
```

`*.npy`, `*.npz`, `*.h5`, `*.parquet` are git-ignored (CI rejects them); commit only the compact JSON.

## Contract 1: the circuit

The input of a case is its circuit, `trace.circuit_ops` (gate, qubits with controls first and the target
last, parameters). QLab takes no user-supplied circuit file; the circuits come from the engine's problems.
The contract is checked in two places and at three levels:

| Level | Rule | Where | On violation |
|---|---|---|---|
| structure (every trace) | qubits are integers in `0..n-1` and distinct; parameters finite | `pipeline/circuit.py` before a trace is written; CI (`scripts/check_manifests.py`) on every record | the pipeline refuses to write the trace |
| physical state (every trace) | each step's probabilities sum to 1 and equal the squared amplitude moduli | same | the pipeline refuses to write the trace |
| live | every op is a gate in `web/src/live/gates.json` with its qubit and parameter counts; `n ≤ 12` | the lane gate in the pipeline, and the web before the live engine runs | the case is **precompute** (the reason names the op); the web keeps it replay-only |

Feed-forward, noise and optimisation loops are kept out of the live lane by the gate's `unitary_only`
criterion (the problem's `live_capable`). `gates.json` is the live engine's own declaration of what it runs,
so the pipeline and the browser cannot disagree about it.

## Contract 2: artifact (pipeline → web), trace schema `qversus-trace/1`

The trace schema belongs to the engine, `qversus` (PyPI). Each `data/artifacts/<case>/<variant>.json` bundle
wraps the primary trace with every solver's result and QLab's verdict:

```jsonc
{
  "schema_version": "qversus-trace/1",
  "case_id": "maxcut", "category": "variational",
  "title": {...}, "concept": {...}, "metric": {...},        // bilingual
  "instance": { "id": "pentagon", "title": {...}, "params": {...}, "note": {...} },
  "qubits": 5, "lane": "precompute", "lane_reasons": [...], "seed": 42, "shots": 2048,
  "app_version": "0.35.000", "engine_package": { "package": "qversus", "version": "0.01.000" },
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
rounded to 6 decimals. Count keys are the basis index in binary, highest qubit leftmost. Answers that are
items (Grover's `found`, `extra.marked`) use that same order, so they are the key holding the item's shots;
answers that are strings indexed by position (a Bernstein-Vazirani secret, a MaxCut partition) are in
**qubit order** (position `u` = qubit `u`). A TypeScript mirror of this schema lives in the web app
(`web/src/lib/contract.types.ts`).

## Contract: manifest, schema `qlab-manifest/2`

`manifests/<case>__<variant>.json` indexes each artifact: the lane verdict + the **measured numbers** behind
it (`run_ms`, `trace_bytes`, `unitary_only`), the seed/shots/params that reproduce it, the **viz bindings**
(which renderers the web mounts), the framework that authored the trace (`engine`, `engine_version`), and the
engine package and app version that produced it (`engine_package`, `app_version`). CI validates that every
`live` manifest actually clears the gate.

## Reproduce

```bash
./scripts/precompute.sh maxcut --all     # regenerates every maxcut artifact + manifest from seed 42
```
