# 02 · PennyLane (+ Lightning): 04 · When to use it / when not

## When to use it / when not

- **Use:** QML, variational algorithms (VQE/QAOA), anything needing gradients/hybrid training, or
  device-agnostic code (it can dispatch onto Qiskit/Cirq/Braket devices via plugins). The best autodiff
  story in the ecosystem.
- **Not:** low-level gate/transpiler control or IBM-native flows (→ [Qiskit](../01_qiskit.md)); a rich noise
  zoo (→ Aer); in-browser execution (→ the JS live lane).

Back to [02 · PennyLane (+ Lightning)](../02_pennylane.md).
