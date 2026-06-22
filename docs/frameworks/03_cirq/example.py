"""Runnable example — p=1 QAOA for MaxCut on the triangle graph, in pure Cirq.

    .venv/Scripts/python.exe docs/frameworks/03_cirq/example.py

Mirrors QLab's `qaoa-cirq` adapter: build the ansatz, grid-search (γ, β), read the cut off the exact
statevector. The triangle K3 is frustrated — its optimum cut is 2 of 3 edges. Output is deterministic.
"""

import cirq
import numpy as np

EDGES = [(0, 1), (1, 2), (0, 2)]
N = 3
GRID = 24


def cut_value(bitstring: str) -> int:
    return sum(1 for (u, v) in EDGES if bitstring[u] != bitstring[v])


def main() -> None:
    qubits = cirq.LineQubit.range(N)
    sim = cirq.Simulator()
    cuts = np.array([cut_value(format(i, f"0{N}b")) for i in range(2**N)], dtype=float)

    def ansatz(gamma: float, beta: float) -> cirq.Circuit:
        c = cirq.Circuit()
        c.append(cirq.H.on_each(*qubits))
        for u, v in EDGES:
            c.append(cirq.ZZ(qubits[u], qubits[v]) ** gamma)
        c.append(cirq.rx(2.0 * beta).on_each(*qubits))
        return c

    def probs(gamma: float, beta: float) -> np.ndarray:
        sv = sim.simulate(ansatz(gamma, beta)).final_state_vector
        return np.abs(np.asarray(sv)) ** 2

    gammas = betas = np.linspace(0, np.pi, GRID)
    best = (0.0, 0.0, -np.inf)
    for g in gammas:
        for b in betas:
            e = float(np.dot(probs(g, b), cuts))
            if e > best[2]:
                best = (g, b, e)
    g, b, exp = best
    idx = int(np.argmax(probs(g, b)))
    bits = format(idx, f"0{N}b")
    print(f"triangle K3 — best <C> = {exp:.4f} at (gamma={g:.3f}, beta={b:.3f})")
    print(f"most-probable bitstring = {bits}  ->  cut = {cut_value(bits)}  (classical optimum = 2)")


if __name__ == "__main__":
    main()
