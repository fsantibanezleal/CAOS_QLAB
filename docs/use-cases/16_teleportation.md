# 16 · Quantum teleportation — moving an unknown qubit

**Category:** entanglement · **Lane:** live · **Solvers:** `teleport-qiskit` (coherent teleportation),
`teleport-classical` (measure-and-resend bound) · **Variants:** 6 input states.

## The problem

Send an *unknown* qubit state `|ψ⟩` from Alice to Bob. They can't just copy it (no-cloning) and Alice
doesn't know what it is. Teleportation does it with one shared **Bell pair** + **2 classical bits**: a real
protocol with no classical equivalent — and a good lesson in what it does *not* do (it is not
faster-than-light, and it destroys the original).

## Components & variables

- **Qubits:** `q0` = the unknown `|ψ⟩`; `q1`,`q2` = a shared Bell pair (`q2` is Bob's).
- **Protocol:** Alice does `CX(0,1)`, `H(0)` and a Bell-basis measurement; Bob applies a Pauli `I/X/Z/XZ`
  set by the 2 measured bits. QLab runs the **coherent (deferred-measurement)** form — the corrections are
  controlled gates (`CX(1,2)`, `CZ(0,2)`) — so the whole thing is a 3-qubit unitary and the statevector
  trace is exact.

## Formalization

After the deferred-measurement corrections, the joint state factorizes and Bob's qubit equals the original:
```
fidelity = ⟨ψ| ρ_Bob |ψ⟩ = 1
```
The deferred-measurement principle guarantees this equals the measure-and-feed-forward protocol. Alice's
qubit no longer holds `|ψ⟩` (no-cloning), and Bob needs the 2 classical bits to know which correction to
apply — so no information travels faster than light.

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

The output Bloch vector equals the input exactly for every state — the unknown qubit is transferred
perfectly. The classical baseline (best measure-and-resend) tops out at fidelity **2/3**.

## How to read & use the viz

Watch two Bloch spheres: Alice's `q0` starts at `|ψ⟩` and Bob's `q2` starts at the origin (maximally
mixed, half of a Bell pair). Step through — after the corrections, `q2`'s vector *becomes* `|ψ⟩` while
`q0`'s collapses away. The state hops across, it isn't copied.

## Honest verdict

> Teleportation transfers an unknown qubit with **fidelity 1**, which no classical strategy can match (the
> best measure-and-resend is **2/3**). It is a genuine, uniquely-quantum protocol — but the honest caveats
> matter: it consumes a pre-shared Bell pair *and* 2 classical bits, it **destroys** the original
> (no-cloning is preserved), and it is **not** faster-than-light communication. Real, foundational, and
> frequently mis-described in pop-science.

## References

Bennett et al., PRL 70, 1895 (1993), doi:10.1103/PhysRevLett.70.1895; Nielsen & Chuang (2010). Engine:
[../frameworks/01_qiskit.md](../frameworks/01_qiskit.md). Foundation: [01_state-prep.md](./01_state-prep.md)
(Bell pairs).
