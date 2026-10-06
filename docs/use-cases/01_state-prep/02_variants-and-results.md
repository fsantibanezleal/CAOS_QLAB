# 01 · State preparation & entanglement (Bell · GHZ · W): 02 · Variants and results

## What each variant shows

`bell-phi-plus/minus`, `bell-psi-plus/minus` (the relative phase / bit-flip structure), `ghz-3`, `ghz-4`
(the cat state scaling), `w-3` (the robust species). Selecting a variant updates the statevector bars, the
per-qubit Bloch vectors, the measurement histogram, and the circuit diagram.

## Solvers & results (from the committed traces, seed 42)

- **`state-qiskit`**: builds the circuit, replays it step by step (statevector + Bloch + probabilities per
  gate), samples 2048 shots. Verified: `Φ⁺` → only `00`/`11` at 0.5 each; `Ψ⁺` → only `01`/`10`; `GHZ-3` →
  `000`/`111`; `W-3` → `001`/`010`/`100` at 1/3 each. Runtime ~0.6–2.3 ms, depth 1–4, trace ~9 KB.
- **`state-classical`**: writes the 2ⁿ target amplitudes directly in NumPy (~0.01 ms).

Back to [01 · State preparation & entanglement (Bell · GHZ · W)](../01_state-prep.md).
