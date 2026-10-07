# 01 · Qiskit (+ qiskit-aer): 04 · When to use it / when not

## When to use it / when not

- **Use:** default for teaching, broadest ecosystem, IBM hardware, and **noise simulation** (Aer is the
  reason the noise/mitigation cases are precompute-only). If you teach one framework, this is it.
- **Not:** autodiff/QML ergonomics (→ [PennyLane](../02_pennylane.md)); the fastest small-circuit CPU loops
  (Qulacs can beat Aer); anything in-browser (→ the JS live lane).

Back to [01 · Qiskit (+ qiskit-aer)](../01_qiskit.md).
