# 03 · Cirq — 02 · Usage

Cirq in five concepts:

1. **Qubits** — `cirq.LineQubit.range(n)` gives `n` line qubits (also `GridQubit` for 2-D topology).
2. **Circuit** — `cirq.Circuit()`; append gates with `circuit.append(...)`. Gates: `cirq.H`, `cirq.X`,
   `cirq.rx(theta)`, two-qubit `cirq.CNOT`, `cirq.ZZ` (a `ZZPowGate`), and `gate ** exponent` for powers.
   `cirq.H.on_each(*qubits)` applies a gate to many qubits at once.
3. **Moments** — a circuit is a sequence of *moments* (time slices of simultaneous gates); this explicit
   scheduling is Cirq's distinguishing feature for hardware-topology work.
4. **Simulator** — `cirq.Simulator().simulate(circuit).final_state_vector` returns the exact statevector
   (`complex64`). `.run(circuit, repetitions=k)` samples measurements.
5. **Index convention** — Cirq is **big-endian**: basis index `i` has qubit 0 as its *most-significant*
   bit. So `format(i, f"0{n}b")` gives a bitstring whose position `u` is qubit `u` directly (the opposite
   of Qiskit's little-endian — QLab handles each correctly per adapter).

## Determinism

Statevector simulation is exact and deterministic; only `.run()` sampling is stochastic (seed it). QLab's
`qaoa-cirq` reads the cut off the exact statevector probabilities, so its result is fully reproducible.

## Verified output

See the runnable [`example.py`](./example.py) — on the triangle graph it prints the optimal cut = 2 and
⟨C⟩ ≈ 1.99, matching the Qiskit and PennyLane adapters and the classical brute-force optimum.

## Read next

- [03 · Applying](./03_applying.md) — how the `qaoa-cirq` adapter is built.
