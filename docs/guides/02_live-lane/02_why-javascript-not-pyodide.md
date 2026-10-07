# 02 · The live (JS) lane: 02 · Why JavaScript, not Pyodide

## Why JavaScript, not Pyodide

Qiskit and PennyLane **cannot run in the browser**: Qiskit's core (`rustworkx`, `symengine`) and
`qiskit-aer` (C++) have no Pyodide wheels, and PennyLane's Lightning is C++ too. A pure-NumPy sim under
Pyodide would bloat the download (~6–10 MB) for no benefit over a purpose-built JS engine. So the live lane
is a few hundred lines of TypeScript; the real Python engines stay in the offline precompute lane.

Back to [02 · The live (JS) lane](../02_live-lane.md).
