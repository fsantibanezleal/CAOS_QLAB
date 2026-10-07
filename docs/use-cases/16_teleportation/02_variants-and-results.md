# 16 · Quantum teleportation: 02 · Variants and results

## What each variant shows

Six input states across the Bloch sphere: `|0⟩, |1⟩, |+⟩, |−⟩, |i⟩`, and a generic `(θ=π/3, φ=π/4)`.
Selecting one shows the input vs output Bloch vectors (identical) and the per-step trace.

## Solvers & results (from the committed traces, seed 42)

| Variant | input Bloch | output Bloch | fidelity |
|---|---|---|---|
| \|0⟩ | (0,0,1) | (0,0,1) | **1.000** |
| \|1⟩ | (0,0,−1) | (0,0,−1) | **1.000** |
| \|+⟩ | (1,0,0) | (1,0,0) | **1.000** |
| \|−⟩ | (−1,0,0) | (−1,0,0) | **1.000** |
| \|i⟩ | (0,1,0) | (0,1,0) | **1.000** |
| generic | (0.612,0.612,0.5) | (0.612,0.612,0.5) | **1.000** |

The output Bloch vector equals the input exactly for every state, the unknown qubit is transferred
perfectly. The classical baseline (best measure-and-resend) tops out at fidelity **2/3**.

Back to [16 · Quantum teleportation](../16_teleportation.md).
