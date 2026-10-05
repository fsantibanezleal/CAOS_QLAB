# 02 · Registry, pipeline & extending

The engine is the **`qversus`** package (PyPI, repository `fsantibanezleal/CAOS_QVersus`), pinned in
`requirements.txt` and `requirements-precompute.txt`. QLab declares no package of its own: what lives here is
the product tooling under `data-pipeline/`, invoked by path.

## The registry (the plug-in seam): `qversus.registry`

Problems and solvers **self-register** via decorators (`@register_problem`, `@register_solver`) into two
dicts. The registry exposes `get_problem(id)`, `all_problems()`, and `solvers_for(problem, only=…)` (the
instantiated solvers whose `applicable()` is true). It lazily imports `qversus.problems` and `qversus.solvers`
on first use, so registration is automatic and order-independent.

`qversus.solvers` imports each adapter module **guarded**: each adapter imports its framework at module top,
so a missing optional framework (say PennyLane not installed) disables only *that* adapter and warns, never
breaking the others. The lab degrades gracefully, and the core install (NumPy only) still runs every case's
classical baseline.

## The pipeline (the single execution path): `data-pipeline/pipeline/build.py`

`run_case(case_id, instance, seed, shots, only)`:
1. `get_problem` → pick the instance (variant).
2. `solvers_for(problem)` → every applicable adapter (it never names a framework).
3. call each `solver.run(...)` with the uniform signature; collect `SolverResult`s.
4. pick the primary circuit trace, classify the **lane** from measurements (`pipeline/gate.py`), build the
   **comparison** verdict (`pipeline/verdicts.py`).
5. write the trace bundle (`data/artifacts/<case>/<variant>.json`) + the manifest
   (`manifests/<case>__<variant>.json`, `pipeline/manifest.py`), both recording the engine package and
   version and the app version, and print the head-to-head.

Run it by path: `python data-pipeline/run.py <case> --all` (or `scripts/precompute.{sh,ps1}`).

## Recipe: add a framework / solver

Adapters live in the engine. Add the adapter in the qversus repository (its guide "add a solver": one module
under `qversus/solvers/`, one line in the adapter list, a test), release qversus, then in QLab:

1. Bump the `qversus` pin (and pin the new framework exactly) in `requirements-precompute.txt`.
2. Add a `docs/frameworks/NN_<tool>.md` node + its `NN_<tool>/` folder (installation/usage/applying +
   `example.py`).
3. Re-bake the cases it applies to: `python data-pipeline/run.py <case> --all`.

No change to the pipeline, the manifest schema or the web: the new solver appears in `--list`, runs in the
head-to-head, and shows in the app the moment its trace is committed. (Cirq was added exactly this way, see
[../frameworks/03_cirq/03_applying.md](../frameworks/03_cirq/03_applying.md).)

## Recipe: add a problem / case

1. Add the problem in the qversus repository (its guide "add a problem": a `Problem` subclass with
   `instances()`, `@register_problem`, at least one classical baseline applicable to it, physics tests),
   release qversus, and bump the pin here.
2. If the case needs a verdict, add its block to `data-pipeline/pipeline/verdicts.py`.
3. Add a `docs/use-cases/NN_<case>.md` node + its `NN_<case>/` folder (problem → formalization → variants →
   results → how-to-read).
4. Run `python data-pipeline/run.py <case> --all` → committed traces + manifests.

Applicable solvers attach themselves automatically: a new MaxCut-like problem is immediately attacked by the
QAOA adapters and the classical baselines with no wiring.

## Read next

- Back to [../abstractions.md](../abstractions.md) · the guide [../guides/01_precompute-pipeline.md](../guides/01_precompute-pipeline.md).
