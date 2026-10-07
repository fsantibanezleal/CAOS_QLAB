# 16 · Quantum teleportation: 01 · The problem and its formalization

## The problem

Send an *unknown* qubit state `|ψ⟩` from Alice to Bob. They can't just copy it (no-cloning) and Alice
doesn't know what it is. Teleportation does it with one shared **Bell pair** + **2 classical bits**: a real
protocol with no classical equivalent, and a good lesson in what it does *not* do (it is not
faster-than-light, and it destroys the original).

## Components & variables

- **Qubits:** `q0` = the unknown `|ψ⟩`; `q1`,`q2` = a shared Bell pair (`q2` is Bob's).
- **Protocol:** Alice does `CX(0,1)`, `H(0)` and a Bell-basis measurement; Bob applies a Pauli `I/X/Z/XZ`
  set by the 2 measured bits. QLab runs the **coherent (deferred-measurement)** form, the corrections are
  controlled gates (`CX(1,2)`, `CZ(0,2)`), so the whole thing is a 3-qubit unitary and the statevector
  trace is exact.

## Formalization

After the deferred-measurement corrections, the joint state factorizes and Bob's qubit equals the original:
```
fidelity = ⟨ψ| ρ_Bob |ψ⟩ = 1
```
The deferred-measurement principle guarantees this equals the measure-and-feed-forward protocol. Alice's
qubit no longer holds `|ψ⟩` (no-cloning), and Bob needs the 2 classical bits to know which correction to
apply, so no information travels faster than light.

## References

Bennett et al., PRL 70, 1895 (1993), doi:10.1103/PhysRevLett.70.1895; Nielsen & Chuang (2010). Engine:
[../../frameworks/01_qiskit.md](../../frameworks/01_qiskit.md). Foundation: [01_state-prep.md](../01_state-prep.md)
(Bell pairs).

Back to [16 · Quantum teleportation](../16_teleportation.md).
