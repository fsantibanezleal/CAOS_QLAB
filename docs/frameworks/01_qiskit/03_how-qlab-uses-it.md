# 01 · Qiskit (+ qiskit-aer): 03 · How QLab uses it (applying)

## How QLab uses it (applying)

`qversus.core.circuit_trace` replays a `QuantumCircuit` one instruction at a time on a `Statevector`,
recording, per step, the amplitudes, the per-qubit reduced Bloch vector (`partial_trace` →
`expectation_value(Pauli)`), and the probabilities. The solvers:

- **`state-qiskit`** ([../../use-cases/01_state-prep.md](../../use-cases/01_state-prep.md)): builds Bell/GHZ
  circuits (`H`, `CX`, `Z`, `X`), traces them, samples a deterministic histogram.
- **`qaoa-qiskit`** ([../../use-cases/02_maxcut.md](../../use-cases/02_maxcut.md)): builds the p=1 QAOA ansatz
  (`H` layer → `rzz(2γ)` per edge → `rx(2β)` mixer), grid-searches `(γ,β)` by **exact** `⟨C⟩` from the
  statevector (deterministic, no removed `qiskit-algorithms` dependency), and emits the optimal-parameter
  trace + the `(γ,β)` energy landscape.

Back to [01 · Qiskit (+ qiskit-aer)](../01_qiskit.md).
