# 02 · Registry, pipeline & extending

## The registry (the plug-in seam) — `qlab/registry.py`

Problems and solvers **self-register** via decorators (`@register_problem`, `@register_solver`) into two
dicts. The registry exposes `get_problem(id)`, `all_problems()`, and `solvers_for(problem, only=…)` (the
instantiated solvers whose `applicable()` is true). It lazily imports `qlab.problems` and `qlab.solvers` on
first use, so registration is automatic and order-independent.

`qlab/solvers/__init__.py` imports each adapter module **guarded** — a missing optional framework (say
PennyLane not installed) disables only *that* adapter and warns, never breaking the others. So the lab
degrades gracefully and a contributor can work on one framework without installing all of them.

## The pipeline (the single execution path) — `qlab/pipeline.py`

`run_case(case_id, instance, seed, shots, only)`:
1. `get_problem` → pick the instance (variant).
2. `solvers_for(problem)` → every applicable adapter (it never names a framework).
3. call each `solver.run(...)` with the uniform signature; collect `SolverResult`s.
4. pick the primary circuit trace, classify the **lane** from measurements, build the **comparison** verdict.
5. write the trace bundle (`data/artifacts/<case>/<variant>.json`) + the manifest
   (`manifests/<case>__<variant>.json`), and print the head-to-head.

One path, every framework — *"no parches que ejecutan todo por separado."*

## Recipe — add a framework / solver (purely additive)

1. Create `qlab/solvers/<framework>_solvers.py`; subclass `Solver`, set `name/label/framework/paradigm`,
   implement `applicable()` + `run()` (the only place that imports the framework, guarded at module top).
2. Decorate the class with `@register_solver`.
3. Add `("qlab.solvers.<framework>_solvers", "<Friendly Name>")` to `_ADAPTER_MODULES` in
   `qlab/solvers/__init__.py`.
4. Pin the framework in `requirements-precompute.txt`; add a `docs/frameworks/NN_<tool>.md` node + its
   `NN_<tool>/` folder (installation/usage/applying + `example.py`).

**That's it.** No change to `core/`, `pipeline.py`, the registry mechanism, the manifest schema, or the web.
The new solver appears in `--list`, runs in the head-to-head, and shows in the app the moment its trace is
committed. (Cirq was added exactly this way — see [../frameworks/03_cirq/03_applying.md](../frameworks/03_cirq/03_applying.md).)

## Recipe — add a problem / case

1. Create `qlab/problems/<name>.py`; subclass `Problem`, implement `instances()` (+ formulation helpers);
   `@register_problem`; add the import to `qlab/problems/__init__.py`.
2. Ensure ≥1 classical baseline solver is `applicable()` to it (add one if the category is new).
3. Add a `docs/use-cases/NN_<case>.md` node + its `NN_<case>/` folder (problem → formalization → variants →
   results → how-to-read).
4. Run `python -m qlab.pipeline <case> --all` → committed traces + manifests.

Applicable solvers attach themselves automatically — a new MaxCut-like problem is immediately attacked by
the QAOA adapters and the classical baselines with no wiring.

## Read next

- Back to [../abstractions.md](../abstractions.md) · the guide [../guides/01_precompute-pipeline.md](../guides/01_precompute-pipeline.md).
