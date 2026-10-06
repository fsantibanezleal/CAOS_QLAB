# 01 · State preparation & entanglement (Bell · GHZ · W): 01 · The problem and its formalization

## The problem

Build canonical multi-qubit states from elementary gates and watch **entanglement** appear, correlation
that cannot be reproduced by any independent description of the individual qubits. The "answer" is the
prepared state itself; the lesson is structural.

## Components & variables

- **Qubit:** a unit vector in ℂ²: a point on the Bloch sphere.
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
one qubit). They are **not** convertible into each other by local operations, the Dür–Vidal–Cirac result.

## References

Nielsen & Chuang, *Quantum Computation and Quantum Information* (2010); Dür, Vidal & Cirac, "Three qubits
can be entangled in two inequivalent ways", Phys. Rev. A 62, 062314 (2000), doi:10.1103/PhysRevA.62.062314.
Engine: [../../frameworks/01_qiskit.md](../../frameworks/01_qiskit.md).

Back to [01 · State preparation & entanglement (Bell · GHZ · W)](../01_state-prep.md).
