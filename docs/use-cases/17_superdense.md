# 17 · Superdense coding — 2 classical bits in 1 qubit

**Category:** entanglement · **Lane:** live · **Solvers:** `superdense-qiskit` (encode/decode),
`superdense-classical` (Holevo limit) · **Variants:** 4 (the complete message set).

## The problem

Send Bob two classical bits while physically transmitting **one** qubit. With a pre-shared Bell pair, Alice
can — by encoding the 2 bits into her half with a Pauli and sending it. It is the exact dual of
[teleportation](./16_teleportation.md) (which spends entanglement + 2 cbits to move 1 qubit), and a clean
illustration of how entanglement trades against communication.

## Components & variables

- **Shared state:** a Bell pair `|Φ⁺⟩` (Alice holds `q0`, Bob `q1`).
- **Encoding:** Alice applies `Z^{b1} X^{b0}` to `q0` — `00→I, 01→X, 10→Z, 11→ZX` — mapping `|Φ⁺⟩` to one of
  the four orthogonal Bell states. She sends `q0` to Bob.
- **Decoding:** Bob applies `CX(0,1)`, `H(0)` (a Bell measurement) and reads both bits.

## Formalization

The four encodings produce the four Bell states, which are perfectly distinguishable by Bob's
measurement — so the channel is error-free and carries **2 bits per transmitted qubit**, double the Holevo
bound of 1 bit/qubit. The cost is the pre-shared Bell pair (one ebit).

## What each variant shows

The four 2-bit messages `00, 01, 10, 11` — the **complete** set (not padded). Selecting one shows the
encoding gate, the Bell-state the pair becomes, and Bob's exact decode.

## Solvers & results (from the committed traces, seed 42)

| Message | encode | Bell state | Bob decodes | correct |
|---|---|---|---|---|
| 00 | I | Φ⁺ | 00 | ✓ |
| 01 | X | Ψ⁺ | 01 | ✓ |
| 10 | Z | Φ⁻ | 10 | ✓ |
| 11 | ZX | Ψ⁻ | 11 | ✓ |

Every message is recovered exactly: **2 classical bits from 1 transmitted qubit**.

## How to read & use the viz

Step through: the shared `|Φ⁺⟩`, Alice's Pauli rotating it to a different Bell state, and Bob's decode
collapsing it to the basis state whose bits are the message. The histogram is a single peak at the message.

## Honest verdict

> Superdense coding really does send 2 classical bits per qubit — beating the classical/Holevo limit of
> 1 — but only by **consuming a pre-shared Bell pair** (one ebit). Counting the entanglement that had to be
> distributed beforehand, it is a **resource trade**, not free bandwidth: the dual of teleportation, and a
> precise demonstration of entanglement as a communication resource. Real and useful as a primitive; not a
> way to magically double a channel.

## References

Bennett & Wiesner, PRL 69, 2881 (1992), doi:10.1103/PhysRevLett.69.2881; Nielsen & Chuang (2010). Engine:
[../frameworks/01_qiskit.md](../frameworks/01_qiskit.md). Dual protocol: [16_teleportation.md](./16_teleportation.md).
