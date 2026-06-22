# 01 · Problem × Solver

The two core abstractions. They are deliberately small and orthogonal: a `Problem` knows *what* to compute;
a `Solver` knows *how* (via one real framework). Neither knows about the other's internals.

## `Problem` (formulation) — `qlab/problems/base.py`

A solver-agnostic formulation. Concrete problems set class attributes and implement `instances()`:

| Member | Meaning |
|---|---|
| `id`, `title`, `concept`, `category` | identity (bilingual title/concept; category picks viz + a docs node) |
| `metric` | bilingual name of the quantity solvers report (energy, cut, …) |
| `references` | shared `[{label, doi\|url}]` for the case |
| `live_capable` | honest hint: can the circuit replay run in the browser live lane? |
| `instances() -> list[Instance]` | the **variant regimes** (the App's variant-bar; ≥6 where a parametric family exists, a single honest benchmark otherwise) |

An `Instance` is `{id, title, params, note}` — a full parameter vector the App can select. A problem may
add formulation helpers (e.g. `MaxCut.cut_value(edges, bitstring)`); it imports **no** quantum framework.

## `Solver` (adapter) — `qlab/solvers/base.py`

A thin adapter over **one** real framework. Concrete solvers set `name/label/framework/paradigm` and
implement two methods:

- `applicable(problem) -> bool` — which problems this adapter handles (usually by `id`/`category`).
- `run(problem, instance, seed, shots) -> SolverResult` — the **only** method that touches the framework.

### `SolverResult` — the uniform output (the adapter boundary)

```
solver   : unique key (e.g. "qaoa-cirq")        value    : the answer ({"cut":4,"bitstring":...} / {"energy":...})
label    : bilingual tab label                  cost     : {wall_ms, qubits?, shots?, gates?, evaluations?}
framework: "qiskit" | "pennylane" | "cirq" | …  notes    : bilingual one-liner
paradigm : quantum-sim | quantum-hardware |      trace    : optional step trace (circuit solvers) — same schema for all
           classical                            optimal  : True for an exact classical baseline
                                                 extra    : curves / landscapes / kernel matrices
```

### The three paradigms (and why `classical` is mandatory)

- **`quantum-sim`** — exact/noisy simulation of a quantum method (Qiskit-Aer, PennyLane, Cirq, Qulacs).
- **`quantum-hardware`** — a real QPU run (committed result + `ran_on` provenance).
- **`classical`** — the honest **"still more practical"** baseline. Every complex case ships at least one;
  the pipeline emits a quantum-vs-classical verdict. This is the lab's spine (see
  [../problem-types.md](../problem-types.md)).

## Why this split scales

Because the boundary is uniform, the comparison panel, the lane gate, and the manifest treat every
framework identically — and a *complex case is attacked by many solvers at once* (MaxCut runs QAOA on
Qiskit, PennyLane and Cirq plus two classical baselines, side by side, from one `run_case` call). There is
exactly one execution path.

## Read next

- [02 · Registry, pipeline & extending](./02_extending.md).
