# 02 · The Problem × Solver engine (the adapter abstraction)

QLab is **not** a folder of one-off scripts that each run a framework their own way. It is a small engine
with one execution path and a clean, extensible abstraction. The design goal, stated plainly: **adding a
new framework or method is one adapter layer — never a rewrite, never duplicated plumbing.**

## The three pieces

### `Problem` — a formulation (solver-agnostic)
A `Problem` declares *what to compute*, independent of method: its bilingual identity (title/concept/
category), its **variant instances** (the regimes the App's variant-bar exposes), the metric the solvers
report, and a `live_capable` hint. It imports no quantum framework. Examples: `state-prep`, `maxcut`. A new
problem is one subclass + `@register_problem`; existing solvers that declare they handle it pick it up
automatically.

```python
@register_problem
class MaxCut(Problem):
    id, category, title, concept, metric, references, live_capable = ...
    def instances(self) -> list[Instance]: ...      # the variant regimes
    @staticmethod
    def cut_value(edges, bitstring) -> int: ...      # the formulation's scoring
```

### `Solver` — a thin adapter over ONE real framework
A `Solver` wraps a real framework to attack a problem and returns a **uniform `SolverResult`** (the answer
`value` + its `cost` + an optional replay `trace` + bilingual `notes`). Solvers come in three paradigms:

- **`quantum-sim`** — exact/noisy simulation of a quantum method (Qiskit-Aer, PennyLane, Cirq/qsim, Qulacs).
- **`quantum-hardware`** — a real QPU run (committed result + provenance).
- **`classical`** — the honest **"still more practical"** baseline (brute force, Goemans–Williamson, exact
  diagonalization, FFT, sklearn).

```python
@register_solver
class QiskitQAOA(Solver):
    name, label, framework, paradigm = "qaoa-qiskit", {...}, "qiskit", QUANTUM_SIM
    def applicable(self, problem) -> bool: return problem.id == "maxcut"
    def run(self, problem, instance, seed, shots) -> SolverResult: ...   # the only method that touches Qiskit
```

### `registry` + `pipeline` — the plug-in seam and the single execution path
Problems and solvers **self-register** via decorators. The pipeline asks the registry for the solvers
`applicable()` to a case and calls `solver.run(...)` with a **uniform signature** — it never names a
framework. It then writes the uniform trace bundle + manifest and the comparison verdict. There is exactly
one execution path; *"no parches que ejecutan todo por separado."*

## Why this matters: a complex case, many solvers

A *complex case is attacked by many solvers at once* and compared head-to-head. MaxCut on one graph runs
**QAOA-Qiskit + QAOA-PennyLane + brute-force + greedy** in one pass; the pipeline emits all four results
side by side and a verdict ("exact classical optimum = 4 in 0.013 ms; QAOA reached 4 but did not win"). The
two independent QAOA frameworks also **cross-check** each other (they must agree on the cut) — the SimLab
"two engines on one problem" discipline.

## The extensibility contract (the whole point)

| To add… | You write… | You touch… |
|---|---|---|
| a new framework / method | one `Solver` subclass + `@register_solver` | nothing in core/pipeline/registry/web |
| a new problem | one `Problem` subclass + `@register_problem` | nothing — applicable solvers attach themselves |
| a real-hardware backend | one `Solver` with `paradigm="quantum-hardware"` | nothing — same trace shape, `ran_on` badge |

The adapter boundary is deliberately thin and uniform (`run(...) -> SolverResult`), and the **web never
imports a framework** — it renders the generic JSON trace. So a new solver appears in the app the moment its
trace is committed, with zero frontend change. Missing optional frameworks degrade gracefully: a solver
module whose framework isn't installed disables only *that* adapter (see `qlab/solvers/__init__.py`).

## Map

```
qlab/
  problems/base.py      Problem ABC + Instance
  problems/<name>.py     one formulation each (+ @register_problem)
  solvers/base.py        Solver ABC + SolverResult + paradigms
  solvers/<framework>_solvers.py   the adapters (+ @register_solver), guarded import
  registry.py            register_* decorators + solvers_for(problem)
  pipeline.py            the single orchestrator (run applicable solvers → bundle + manifest)
  core/circuit_trace.py  shared circuit→trace tracer (every circuit solver funnels through it)
```

## Read next

- [03_trace-and-gate.md](./03_trace-and-gate.md) — the uniform artifact the adapters produce.
- [../frameworks.md](../frameworks.md) — the real engines behind each adapter.
- [../problem-types.md](../problem-types.md) — the classical-baseline doctrine.
