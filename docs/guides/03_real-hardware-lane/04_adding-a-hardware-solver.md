# 03 · The real-hardware lane (optional, opt-in): 04 · Adding a hardware solver

## Adding a hardware solver

A real-hardware backend is just another adapter: a `Solver` with `paradigm="quantum-hardware"` whose
`run(...)` submits the circuit and returns the same `Trace` shape with the `ran_on` badge. Nothing else in
the engine or web changes (see [../../architecture/02_problem-solver-engine.md](../../architecture/02_problem-solver-engine.md)).

Back to [03 · The real-hardware lane (optional, opt-in)](../03_real-hardware-lane.md).
