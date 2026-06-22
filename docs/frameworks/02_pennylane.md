# 02 · PennyLane (+ Lightning) — the differentiable / variational pillar

**PennyLane** (Xanadu, Apache-2.0, pinned `0.45.0`) treats quantum circuits as **differentiable functions**
that plug into classical autodiff/ML (PyTorch, JAX, TensorFlow, Autograd) — its defining strength. Its
`lightning.*` performance tier gives fast C++ statevector with adjoint gradients and a clean CPU→GPU→TN
device swap. In QLab it is the home of the variational/QML methods and provides the **independent
second implementation** of QAOA that cross-checks Qiskit.

## Installation

```bash
pip install pennylane==0.45.0          # pulls pennylane-lightning (fast default.qubit-class CPU backend)
```
Pure-Python `default.qubit` is autodiff-capable; `lightning.qubit` is the fast C++ backend; `lightning.gpu`
(cuStateVec) and `lightning.tensor` (cuTensorNet) scale up without rewriting circuits. Like Qiskit, it does
**not** run in the browser (Lightning is C++) — offline precompute only.

## How QLab uses it (applying)

- **`qaoa-pennylane`** ([../use-cases/02_maxcut.md](../use-cases/02_maxcut.md)) — builds the MaxCut cost
  Hamiltonian with `qml.qaoa.maxcut(graph)` (a NetworkX graph), evaluates `⟨H_C⟩` on `default.qubit`, and
  grid-searches the *same* `(γ,β)` lattice as the Qiskit adapter. Key correctness detail: PennyLane's
  maxcut cost Hamiltonian is **minimized** to maximize the cut (a cut edge contributes −1) — QLab searches
  for the *minimum* `⟨H_C⟩`, then reads the cut off the most-probable bitstring. Running two independent
  frameworks that must agree on the cut is the lab's "two engines, one problem" validation discipline.

## Why two QAOA frameworks?

SimLab pairs SimPy (live) with Ciw (analytic) on the same queue; QLab pairs QAOA-Qiskit with
QAOA-PennyLane on the same graph. They use different Hamiltonian conventions and different code paths, so
agreement on the cut value (and disagreement would be a bug) validates both — and teaches that the
*physics*, not the *framework*, is what matters. On every shipped graph both reproduce the classical
optimum (2/4/4/4/4/7) and neither beats it.

## When to use it / when not

- **Use:** QML, variational algorithms (VQE/QAOA), anything needing gradients/hybrid training, or
  device-agnostic code (it can dispatch onto Qiskit/Cirq/Braket devices via plugins). The best autodiff
  story in the ecosystem.
- **Not:** low-level gate/transpiler control or IBM-native flows (→ [Qiskit](./01_qiskit.md)); a rich noise
  zoo (→ Aer); in-browser execution (→ the JS live lane).

## References

PennyLane docs + demos (`pennylane.ai`), the QAOA MaxCut and variational-classifier demos, the
`lightning.qubit` device docs. Used by: [use-cases/02_maxcut.md](../use-cases/02_maxcut.md). Sibling:
[Qiskit](./01_qiskit.md) (the other QAOA engine + the noise lane).
