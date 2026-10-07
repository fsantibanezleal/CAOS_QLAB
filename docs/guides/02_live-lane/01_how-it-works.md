# 02 · The live (JS) lane: 01 · How it works

## How it works

For a case that clears the [gate](../../architecture/03_trace-and-gate.md) (`live`), the web app runs a
**TypeScript state-vector simulator** (`web/src/live/statevector.ts`) directly from the committed
`circuit_ops`. Moving a slider (a rotation angle) re-simulates the circuit and redraws the Bloch sphere /
amplitude bars / histogram instantly. For Grover, whose circuit is the Hadamard layer followed by one
identical oracle + diffuser block per iteration, the iteration count is a knob too: the panel rebuilds the
circuit with k blocks and shows P(marked) next to the closed form sin²((2k+1)θ), so the over-rotation past
the optimum is visible. The output is a `Trace` of the same shape the offline pipeline produces, so the
renderers are identical, *"live" is slider-responsiveness, not a different model.*

The engine is **exact**, not an approximation: amplitudes evolve under the true gate matrices (the standard
1-qubit set H/X/Y/Z/S/T/RX/RY/RZ/P, the 2-qubit CX/CZ/SWAP/CP/RZZ, and multi-controlled X: CCX and MCX), the
per-qubit Bloch vector is the
exact reduced density matrix, and the only stochastic step is shot sampling through a seeded PRNG. It is
verified by test, not by construction: `npm test` (in `web/`) runs every committed Qiskit trace whose ops the
engine supports through it and requires the same amplitudes (complex, so the relative phases too) and the
same Bloch vectors at every step, to the 6-decimal rounding of the records. That test found the RZZ gate
applied with the opposite sign (exp(+iθ/2 Z⊗Z) instead of Qiskit's exp(−iθ/2 Z⊗Z)), fixed in 0.35.000; it had
no visible effect because the only RZZ circuits, MaxCut's, are precompute-only. A case is only offered live
if its circuit satisfies the live contract, `web/src/live/gates.json` (each gate with its qubit and parameter
counts, at most 12 qubits); the pipeline reads the same file when it decides the lane, so a case labelled
`live` is one the browser can run. Otherwise it stays replay-only.

> **Design note.** An earlier plan named the `quantum-circuit` (MIT) JS library. We use a small purpose-built
> engine instead, same reasoning as the hand-rolled SVG Bloch sphere (vs three.js): full control of the
> output shape (it emits the exact `Trace` contract, so the renderers are reused verbatim), exact physics, a
> lighter bundle, and deterministic output that screenshot-verification can trust.

Back to [02 · The live (JS) lane](../02_live-lane.md).
