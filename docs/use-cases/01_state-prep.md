# 01 · State preparation & entanglement (Bell · GHZ · W)

**Category:** entanglement · **Lane:** live · **Solvers:** `state-qiskit` (gate circuit), `state-classical`
(direct amplitudes) · **Variants:** 7.

## The problem

Build canonical multi-qubit states from elementary gates and watch **entanglement** appear — correlation
that cannot be reproduced by any independent description of the individual qubits. The "answer" is the
prepared state itself; the lesson is structural.

## Components & variables

- **Qubit:** a unit vector in ℂ² — a point on the Bloch sphere.
- **Gates used:** `H` (Hadamard, creates superposition), `CX` (CNOT, creates correlation), `Z`/`X`
  (phase/bit flips that select the Bell variant).
- **Entanglement:** a state is entangled if it cannot be written as a tensor product `|ψ⟩ = |a⟩ ⊗ |b⟩`.

## Formalization

The four **Bell states** (a maximally-entangled two-qubit basis):

```
|Φ±⟩ = (|00⟩ ± |11⟩)/√2        |Ψ±⟩ = (|01⟩ ± |10⟩)/√2
```

Construction from |00⟩: `H` on qubit 0, then `CX(0→1)` gives `|Φ⁺⟩`; a `Z` on qubit 0 flips to `|Φ⁻⟩`; an
`X` on qubit 1 maps Φ→Ψ. The two inequivalent **three-qubit** entangled species:

```
|GHZ⟩ = (|000⟩ + |111⟩)/√2        |W⟩ = (|001⟩ + |010⟩ + |100⟩)/√3
```

GHZ is maximal but fragile (measuring one qubit destroys all entanglement); W is robust (it survives losing
one qubit). They are **not** convertible into each other by local operations — the Dür–Vidal–Cirac result.

## What each variant shows

`bell-phi-plus/minus`, `bell-psi-plus/minus` (the relative phase / bit-flip structure), `ghz-3`, `ghz-4`
(the cat state scaling), `w-3` (the robust species). Selecting a variant updates the statevector bars, the
per-qubit Bloch vectors, the measurement histogram, and the circuit diagram.

## Solvers & results (from the committed traces, seed 42)

- **`state-qiskit`** — builds the circuit, replays it step by step (statevector + Bloch + probabilities per
  gate), samples 2048 shots. Verified: `Φ⁺` → only `00`/`11` at 0.5 each; `Ψ⁺` → only `01`/`10`; `GHZ-3` →
  `000`/`111`; `W-3` → `001`/`010`/`100` at 1/3 each. Runtime ~0.6–2.3 ms, depth 1–4, trace ~9 KB.
- **`state-classical`** — writes the 2ⁿ target amplitudes directly in NumPy (~0.01 ms).

## How to read & use the viz

Watch the Bloch vectors: after `H`, qubit 0 sits on the equator (superposition); after `CX`, the per-qubit
Bloch vectors **shrink toward the origin** — the hallmark of entanglement (the individual qubits become
maximally mixed even though the global state is pure). The histogram shows the perfect correlations.

## Honest verdict

A classical computer stores all 2ⁿ amplitudes directly and instantly at 2–4 qubits — **there is no
advantage here**. Entanglement is the *concept* the case teaches, the foundation everything else builds on,
not a speedup. (The advantage question only becomes interesting when the state is too large to store
classically — see [../state-of-the-art.md](../state-of-the-art.md) §3.)

## References

Nielsen & Chuang, *Quantum Computation and Quantum Information* (2010); Dür, Vidal & Cirac, "Three qubits
can be entangled in two inequivalent ways", Phys. Rev. A 62, 062314 (2000), doi:10.1103/PhysRevA.62.062314.
Engine: [../frameworks/01_qiskit.md](../frameworks/01_qiskit.md).
