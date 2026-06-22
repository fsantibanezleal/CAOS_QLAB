"""Classical baselines — the honest "still more practical" foil (pure NumPy, no quantum SDK).

These exist to make the dossier's verdict concrete and on-screen: for MaxCut at lab sizes, exact brute
force returns the provably-optimal cut in microseconds; for state prep, a classical computer writes the
2^n amplitudes directly. Every quantum solver is shown next to one of these.
"""

from __future__ import annotations

import time

import numpy as np

from qlab.problems.base import Instance, Problem
from qlab.registry import register_solver
from qlab.solvers.base import CLASSICAL, Solver, SolverResult


def target_state(kind: str, n: int, variant: str = "") -> np.ndarray:
    """The exact target statevector for a state-prep instance (little-endian basis index)."""
    psi = np.zeros(2**n, dtype=complex)
    if kind == "bell":
        s = 1 / np.sqrt(2)
        table = {
            "phi_plus": [(0b00, s), (0b11, s)],
            "phi_minus": [(0b00, s), (0b11, -s)],
            "psi_plus": [(0b01, s), (0b10, s)],
            "psi_minus": [(0b01, s), (0b10, -s)],
        }
        for idx, a in table[variant]:
            psi[idx] = a
    elif kind == "ghz":
        psi[0] = psi[2**n - 1] = 1 / np.sqrt(2)
    elif kind == "w":
        for q in range(n):
            psi[1 << q] = 1 / np.sqrt(n)
    else:  # pragma: no cover
        raise ValueError(f"unknown state kind {kind!r}")
    return psi


@register_solver
class ClassicalStatePrep(Solver):
    name = "state-classical"
    label = {"en": "Direct amplitudes · classical", "es": "Amplitudes directas · clásico"}
    framework = "classical:numpy"
    paradigm = CLASSICAL

    def applicable(self, problem: Problem) -> bool:
        return problem.id == "state-prep"

    def run(self, problem: Problem, instance: Instance, seed: int, shots: int) -> SolverResult:
        p = instance.params
        t0 = time.perf_counter()
        psi = target_state(p["kind"], p["n"], p.get("variant", ""))
        wall = (time.perf_counter() - t0) * 1e3
        nz = {format(i, f"0{p['n']}b"): round(float(abs(psi[i]) ** 2), 6) for i in np.nonzero(psi)[0]}
        return SolverResult(
            solver=self.name,
            label=self.label,
            framework=self.framework,
            paradigm=self.paradigm,
            value={"nonzero_probabilities": nz},
            cost={"wall_ms": round(wall, 4), "qubits": p["n"]},
            notes={
                "en": "A classical computer stores all 2^n amplitudes directly — instant at this scale. "
                      "The entanglement is the concept; there is no advantage here.",
                "es": "Un computador clásico guarda las 2^n amplitudes directamente — instantáneo a esta "
                      "escala. El entrelazamiento es el concepto; aquí no hay ventaja.",
            },
            optimal=True,
        )


@register_solver
class BruteForceMaxCut(Solver):
    name = "maxcut-bruteforce"
    label = {"en": "Brute force (optimal) · classical", "es": "Fuerza bruta (óptimo) · clásico"}
    framework = "classical:numpy"
    paradigm = CLASSICAL

    def applicable(self, problem: Problem) -> bool:
        return problem.id == "maxcut"

    def run(self, problem, instance: Instance, seed: int, shots: int) -> SolverResult:
        n, edges = instance.params["n"], instance.params["edges"]
        t0 = time.perf_counter()
        best_cut, best_bits = -1, None
        for x in range(2**n):
            bits = format(x, f"0{n}b")
            c = sum(1 for (u, v) in edges if bits[u] != bits[v])
            if c > best_cut:
                best_cut, best_bits = c, bits
        wall = (time.perf_counter() - t0) * 1e3
        return SolverResult(
            solver=self.name,
            label=self.label,
            framework=self.framework,
            paradigm=self.paradigm,
            value={"cut": best_cut, "bitstring": best_bits},
            cost={"wall_ms": round(wall, 4), "evaluated": 2**n},
            notes={
                "en": f"Enumerated all {2**n} partitions; the optimum ({best_cut}) is exact and found in "
                      f"{wall:.3f} ms. This is the bar QAOA must beat — and does not, at this scale.",
                "es": f"Enumeró las {2**n} particiones; el óptimo ({best_cut}) es exacto y se encontró en "
                      f"{wall:.3f} ms. Este es el listón que QAOA debe superar — y no lo hace, a esta escala.",
            },
            optimal=True,
        )


@register_solver
class GreedyMaxCut(Solver):
    name = "maxcut-greedy"
    label = {"en": "Greedy local search · classical", "es": "Búsqueda voraz local · clásico"}
    framework = "classical:numpy"
    paradigm = CLASSICAL

    def applicable(self, problem: Problem) -> bool:
        return problem.id == "maxcut"

    def run(self, problem, instance: Instance, seed: int, shots: int) -> SolverResult:
        n, edges = instance.params["n"], instance.params["edges"]
        rng = np.random.default_rng(seed)
        t0 = time.perf_counter()
        bits = list(rng.integers(0, 2, size=n).astype(str))

        def cut(b):
            return sum(1 for (u, v) in edges if b[u] != b[v])

        improved = True
        while improved:
            improved = False
            for q in range(n):
                flipped = bits.copy()
                flipped[q] = "1" if bits[q] == "0" else "0"
                if cut(flipped) > cut(bits):
                    bits, improved = flipped, True
        wall = (time.perf_counter() - t0) * 1e3
        return SolverResult(
            solver=self.name,
            label=self.label,
            framework=self.framework,
            paradigm=self.paradigm,
            value={"cut": cut(bits), "bitstring": "".join(bits)},
            cost={"wall_ms": round(wall, 4)},
            notes={
                "en": "Single-flip local search from a random start — a trivial classical heuristic that "
                      "already reaches (or nearly reaches) the optimum on these graphs.",
                "es": "Búsqueda local de un solo flip desde un inicio aleatorio — una heurística clásica "
                      "trivial que ya alcanza (o casi) el óptimo en estos grafos.",
            },
        )
