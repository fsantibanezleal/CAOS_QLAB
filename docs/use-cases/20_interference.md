# 20 · Phase & interference — the single-qubit interferometer

**Category:** fundamentals · **Lane:** live · **Solvers:** `interference-qiskit` (Mach–Zehnder circuit),
`interference-classical` (wave intensity) · **Variants:** 6.

## The problem

Why is a quantum computer more than a probabilistic one? Because **amplitudes**, not probabilities, are what
combine — and amplitudes can be negative, so they can **cancel**. The cleanest demonstration is a one-qubit
Mach–Zehnder interferometer: `H · P(φ) · H`. The first `H` splits `|0⟩` into two "paths," the phase gate
`P(φ)` delays one path by a relative phase `φ`, and the second `H` recombines them. The probability of
reading 0 is `cos²(φ/2)` — it **oscillates** as you sweep `φ`. This is the interference fringe, and steering
it is the engine behind every quantum algorithm.

## Components & variables

- **Circuit:** `H · P(φ) · H` on `|0⟩` — a balanced two-path interferometer.
- **Control:** the relative phase `φ ∈ [0, 2π)` (the one knob; in the live lane it is a slider).
- **Observable:** `P(0)`, the probability the two paths recombine constructively into `|0⟩`.

## Formalization

Step by step on `|0⟩`:

1. `H|0⟩ = (|0⟩ + |1⟩)/√2` — two equal-amplitude paths.
2. `P(φ)` multiplies the `|1⟩` path by `e^{iφ}`: `(|0⟩ + e^{iφ}|1⟩)/√2`.
3. `H` recombines: `½[(1 + e^{iφ})|0⟩ + (1 − e^{iφ})|1⟩]`.

So `P(0) = ¼|1 + e^{iφ}|² = (1 + cos φ)/2 = cos²(φ/2)` and `P(1) = sin²(φ/2)`. At `φ = 0` the paths add
(`P0 = 1`, fully constructive); at `φ = π` they cancel (`P0 = 0`, fully destructive).

## What each variant shows

A sweep of the phase, tracing the fringe:

| Variant | φ | P(0) = cos²(φ/2) | fringe |
|---|---|---|---|
| itf-0 | 0 | **1.000** | constructive |
| itf-pi4 | π/4 | 0.854 | mixed |
| itf-pi2 | π/2 | 0.500 | mixed |
| itf-2pi3 | 2π/3 | 0.250 | mixed |
| itf-3pi4 | 3π/4 | 0.146 | mixed |
| itf-pi | π | **0.000** | destructive |

(From the committed traces, seed 42, 2048 shots; the classical wave solver reproduces each value exactly.)

## How to read & use the viz

This is a **live** case: switch to the **Live (browser)** tab and drag the `P` slider. The amplitude bars,
the Bloch vector and the histogram all respond in real time as the fringe sweeps from constructive (all
weight on `|0⟩`) to destructive (all weight on `|1⟩`). That single oscillating knob is the whole idea of
quantum interference.

## Honest verdict

> The qubit's `P(0)` follows `cos²(φ/2)` — and so does the intensity of a **classical** optical Mach–Zehnder.
> Interference is therefore **not, by itself, a quantum advantage**: classical waves interfere too. What is
> uniquely quantum is that this fringe appears in the **probability amplitude of a single particle** (one
> photon, one electron, interfering with itself), and that an algorithm can arrange the amplitudes of an
> exponentially large superposition so the **wrong answers cancel and the right ones add**. That is exactly
> the mechanism of Deutsch–Jozsa, Grover and the QFT. Alone, interference computes nothing special; harnessed
> across many qubits, it is the whole game.

## References

Feynman, Leighton & Sands, *The Feynman Lectures on Physics*, Vol. III, ch. 1 (1965); Nielsen & Chuang
(2010), §1.4. Engine: [../frameworks/01_qiskit.md](../frameworks/01_qiskit.md). Foundation for the oracle and
flagship algorithms ([06_grover.md](./06_grover.md), [07_qft.md](./07_qft.md)); builds on
[18_single-qubit.md](./18_single-qubit.md).
