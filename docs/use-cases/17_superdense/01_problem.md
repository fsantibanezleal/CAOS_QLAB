# 17 · Superdense coding: 01 · The problem and its formalization

## The problem

Send Bob two classical bits while physically transmitting **one** qubit. With a pre-shared Bell pair, Alice
can, by encoding the 2 bits into her half with a Pauli and sending it. It is the exact dual of
[teleportation](../16_teleportation.md) (which spends entanglement + 2 cbits to move 1 qubit), and a clean
illustration of how entanglement trades against communication.

## Components & variables

- **Shared state:** a Bell pair `|Φ⁺⟩` (Alice holds `q0`, Bob `q1`).
- **Encoding:** Alice applies `Z^{b1} X^{b0}` to `q0`: `00→I, 01→X, 10→Z, 11→ZX`, mapping `|Φ⁺⟩` to one of
  the four orthogonal Bell states. She sends `q0` to Bob.
- **Decoding:** Bob applies `CX(0,1)`, `H(0)` (a Bell measurement) and reads both bits.

## Formalization

The four encodings produce the four Bell states, which are perfectly distinguishable by Bob's
measurement, so the channel is error-free and carries **2 bits per transmitted qubit**, double the Holevo
bound of 1 bit/qubit. The cost is the pre-shared Bell pair (one ebit).

## References

Bennett & Wiesner, PRL 69, 2881 (1992), doi:10.1103/PhysRevLett.69.2881; Nielsen & Chuang (2010). Engine:
[../../frameworks/01_qiskit.md](../../frameworks/01_qiskit.md). Dual protocol: [16_teleportation.md](../16_teleportation.md).

Back to [17 · Superdense coding](../17_superdense.md).
