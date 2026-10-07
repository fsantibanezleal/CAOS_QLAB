# 20 · Phase & interference: 01 · The problem and its formalization

## The problem

Why is a quantum computer more than a probabilistic one? Because **amplitudes**, not probabilities, are what
combine, and amplitudes can be negative, so they can **cancel**. The cleanest demonstration is a one-qubit
Mach–Zehnder interferometer: `H · P(φ) · H`. The first `H` splits `|0⟩` into two "paths," the phase gate
`P(φ)` delays one path by a relative phase `φ`, and the second `H` recombines them. The probability of
reading 0 is `cos²(φ/2)`, it **oscillates** as you sweep `φ`. This is the interference fringe, and steering
it is the engine behind every quantum algorithm.

## Components & variables

- **Circuit:** `H · P(φ) · H` on `|0⟩`: a balanced two-path interferometer.
- **Control:** the relative phase `φ ∈ [0, 2π)` (the one knob; in the live lane it is a slider).
- **Observable:** `P(0)`, the probability the two paths recombine constructively into `|0⟩`.

## Formalization

Step by step on `|0⟩`:

1. `H|0⟩ = (|0⟩ + |1⟩)/√2`: two equal-amplitude paths.
2. `P(φ)` multiplies the `|1⟩` path by `e^{iφ}`: `(|0⟩ + e^{iφ}|1⟩)/√2`.
3. `H` recombines: `½[(1 + e^{iφ})|0⟩ + (1 − e^{iφ})|1⟩]`.

So `P(0) = ¼|1 + e^{iφ}|² = (1 + cos φ)/2 = cos²(φ/2)` and `P(1) = sin²(φ/2)`. At `φ = 0` the paths add
(`P0 = 1`, fully constructive); at `φ = π` they cancel (`P0 = 0`, fully destructive).

## References

Feynman, Leighton & Sands, *The Feynman Lectures on Physics*, Vol. III, ch. 1 (1965); Nielsen & Chuang
(2010), §1.4. Engine: [../../frameworks/01_qiskit.md](../../frameworks/01_qiskit.md). Foundation for the oracle and
flagship algorithms ([06_grover.md](../06_grover.md), [07_qft.md](../07_qft.md)); builds on
[18_single-qubit.md](../18_single-qubit.md).

Back to [20 · Phase & interference](../20_interference.md).
