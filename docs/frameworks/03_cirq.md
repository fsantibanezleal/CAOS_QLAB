# 03 · Cirq (+ qsim) — the topology-aware circuit SDK & the third QAOA cross-check

**Cirq** (Google, Apache-2.0, pinned `cirq-core==1.6.1`) is a Python framework for NISQ circuits with
explicit qubit-topology and moment-level control; its fast simulator is **qsim/qsimcirq**. In QLab it is
the **third independent QAOA implementation** — running the same MaxCut graph on Qiskit, PennyLane *and*
Cirq turns agreement on the cut into a strong three-way cross-check, and proves the engine's extensibility
claim once more: the Cirq adapter is one file + one registry line, with no change to core/pipeline/web.

## Read in order

1. [01 · Installation](./03_cirq/01_installation.md) — the pip line, why `cirq-core` (not the full
   metapackage), and platform notes.
2. [02 · Usage](./03_cirq/02_usage.md) — the five concepts (`LineQubit`, `Circuit`, moments, gates,
   `Simulator`), the big-endian index convention, and the determinism note.
3. [03 · Applying](./03_cirq/03_applying.md) — how QLab's `qaoa-cirq` adapter is built and why the cut
   expectation is read straight off the statevector.

## Example

- [`example.py`](./03_cirq/example.py) — a complete, runnable p=1 QAOA-MaxCut on the triangle graph in pure
  Cirq, printing ⟨C⟩ and the best cut. Run it from the repo root:
  ```bash
  .venv/Scripts/python.exe docs/frameworks/03_cirq/example.py
  ```

## In QLab

- **`qaoa-cirq`** ([../use-cases/02_maxcut.md](../use-cases/02_maxcut.md)) — p=1 QAOA on `cirq.Simulator`,
  same `(γ,β)` grid as the Qiskit/PennyLane adapters; reports the cut + ⟨C⟩. On every shipped graph the
  three frameworks agree (2/4/4/4/4/7) and none beats the classical optimum.

## When to use it / when not

- **Use:** explicit hardware topology / moment scheduling, Google-style device modeling; pairs with
  OpenFermion (chemistry) and qsim (speed).
- **Not:** broad vendor/hardware coverage (smaller than Qiskit; `cirq-rigetti` was removed in 1.6.0); rich
  noise tooling (→ Aer); in-browser (→ the JS live lane).

## Related

- Sibling QAOA engines: [Qiskit](./01_qiskit.md) · [PennyLane](./02_pennylane.md). The frameworks index:
  [../frameworks.md](../frameworks.md). The abstraction that makes adding it free: [../abstractions.md](../abstractions.md).
