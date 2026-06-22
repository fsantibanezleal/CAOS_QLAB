# Abstractions — the engine, as classes & contracts

QLab is an **engine**, not a pile of scripts. This section documents the abstractions that make it modular
and scalable — so adding a framework, a solver, a problem, or a case is a thin **adapter layer**, never a
rewrite. If you read one thing before extending the lab, read this.

## Read in order

1. [**01 · Problem × Solver**](./abstractions/01_problem-solver.md) — the two core abstractions (a
   formulation and an adapter over a real framework), their uniform contract, and the three solver
   paradigms.
2. [**02 · Registry, pipeline & extending**](./abstractions/02_extending.md) — the self-registering
   plug-in seam, the single execution path, and the exact recipe to add a framework / solver / problem /
   case with zero changes to the core or the web.

## The one invariant

> A new framework or method = **one adapter + one registry line.** Zero edits to `core/`, `pipeline.py`,
> the registry mechanism, or any web code.

This is enforced by keeping the adapter boundary thin and uniform: every solver returns the same
`SolverResult` (answer + cost + optional replay trace + bilingual notes), the pipeline calls every solver
through one signature, and the web renders only the generic JSON trace — it never imports a framework.

## See also

- [architecture/02_problem-solver-engine.md](./architecture/02_problem-solver-engine.md) — the same engine
  from the architecture angle. [../data/README.md](../data/README.md) — the two data contracts.
  [problem-types.md](./problem-types.md) — the classical-baseline doctrine the abstraction enforces.
