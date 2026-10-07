# 02 · PennyLane (+ Lightning): 01 · Installation

## Installation

```bash
pip install pennylane==0.45.0          # pulls pennylane-lightning (fast default.qubit-class CPU backend)
```
Pure-Python `default.qubit` is autodiff-capable; `lightning.qubit` is the fast C++ backend; `lightning.gpu`
(cuStateVec) and `lightning.tensor` (cuTensorNet) scale up without rewriting circuits. Like Qiskit, it does
**not** run in the browser (Lightning is C++), offline precompute only.

Back to [02 · PennyLane (+ Lightning)](../02_pennylane.md).
