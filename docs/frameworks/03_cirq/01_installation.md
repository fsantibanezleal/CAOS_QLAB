# 03 · Cirq — 01 · Installation

```bash
pip install cirq-core==1.6.1        # in requirements-precompute.txt; the .venv only
# optional fast simulator:
pip install qsimcirq                 # qsim backend (Schrödinger / Schrödinger-Feynman); not required for QLab's small circuits
```

## Why `cirq-core` and not `cirq`

`cirq` is a metapackage that also pulls vendor integrations (`cirq-google`, `cirq-ionq`, `cirq-aqt`, …)
QLab does not use. `cirq-core` is the framework itself — `Circuit`, qubits, gates, `Simulator`,
`quantum_info`-style tools — and keeps the precompute `.venv` lean. The lab's circuits are small (≤ 6
qubits for MaxCut), so the built-in `cirq.Simulator` is plenty; qsimcirq is optional and only pays off at
larger widths.

## Platform notes

- Pure-Python wheels for `cirq-core`; works on Windows/macOS/Linux. No CUDA needed.
- **Not browser-loadable** (it is a precompute-lane engine): no Pyodide build, and QLab's live lane is the
  JavaScript `quantum-circuit` simulator regardless.
- Pinned for reproducibility — a QAOA run is a pure function of `(graph, grid, seed)`.

## Read next

- [02 · Usage](./02_usage.md) — the API in five concepts + the index convention.
