# 02 · PennyLane (+ Lightning): the differentiable / variational pillar

**PennyLane** (Xanadu, Apache-2.0, pinned `0.45.0`) treats quantum circuits as **differentiable functions**
that plug into classical autodiff/ML (PyTorch, JAX, TensorFlow, Autograd), its defining strength. Its
`lightning.*` performance tier gives fast C++ statevector with adjoint gradients and a clean CPU→GPU→TN
device swap. In QLab it is the home of the variational/QML methods and provides the **independent
second implementation** of QAOA that cross-checks Qiskit.

## Read in order

1. [01 · Installation](./02_pennylane/01_installation.md).
2. [02 · How QLab uses it (applying)](./02_pennylane/02_how-qlab-uses-it.md).
3. [03 · Why two QAOA frameworks?](./02_pennylane/03_why-two-qaoa-frameworks.md).
4. [04 · When to use it / when not](./02_pennylane/04_when-to-use-it-when-not.md).

## References

PennyLane docs + demos (`pennylane.ai`), the QAOA MaxCut and variational-classifier demos, the
`lightning.qubit` device docs. Used by: [use-cases/02_maxcut.md](../use-cases/02_maxcut.md). Sibling:
[Qiskit](./01_qiskit.md) (the other QAOA engine + the noise lane).
