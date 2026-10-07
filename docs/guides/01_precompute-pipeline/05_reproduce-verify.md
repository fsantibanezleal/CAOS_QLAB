# 01 · The precompute pipeline: 05 · Reproduce / verify

## Reproduce / verify

A run is a pure function of `(params, seed)`; re-running regenerates byte-identical artifacts. CI runs
`ruff` + `pytest` + a pipeline smoke (regenerate one case) and rejects committed `.env`/raw-data/leaked
paths. Add a new case = a `Problem` subclass + a `Solver` adapter (see
[../../architecture/02_problem-solver-engine.md](../../architecture/02_problem-solver-engine.md)); it appears in
`--list` automatically.

Back to [01 · The precompute pipeline](../01_precompute-pipeline.md).
