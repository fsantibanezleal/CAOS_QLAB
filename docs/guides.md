# Guides — the runtime how-tos

How to actually run QLab: the offline precompute pipeline, the in-browser live lane, and the optional
real-hardware lane.

1. [**01 · The precompute pipeline**](./guides/01_precompute-pipeline.md) — set up the `.venv`, run a case
   across all solvers, read the output, and reproduce the committed traces.
2. [**02 · The live (JS) lane**](./guides/02_live-lane.md) — how small circuits re-simulate in the browser,
   the ≤12-qubit limit, and why it is JavaScript, not Pyodide.
3. [**03 · The real-hardware lane**](./guides/03_real-hardware-lane.md) — submit a case to IBM Quantum Open
   / Braket / Azure and commit the result, plus the honest cost reality.

## See also

- [architecture.md](./architecture.md) — the design these guides operate. [../data/README.md](../data/README.md)
  — the contracts. [state-of-the-art.md](./state-of-the-art.md) §5 — the cost table.
