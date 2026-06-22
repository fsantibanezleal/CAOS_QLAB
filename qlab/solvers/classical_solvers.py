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
class ClassicalBV(Solver):
    name = "bv-classical"
    label = {"en": "Oracle queries · classical", "es": "Consultas al oráculo · clásico"}
    framework = "classical:numpy"
    paradigm = CLASSICAL

    def applicable(self, problem: Problem) -> bool:
        return problem.id == "bernstein-vazirani"

    def run(self, problem, instance: Instance, seed: int, shots: int) -> SolverResult:
        from qlab.problems.bernstein_vazirani import BernsteinVazirani

        n, secret = instance.params["n"], instance.params["secret"]
        t0 = time.perf_counter()
        # Query the oracle on each basis vector e_i (only bit i set): f(e_i) = s_i. n queries.
        recovered = "".join(str(BernsteinVazirani.oracle(secret, 1 << i)) for i in range(n))
        wall = (time.perf_counter() - t0) * 1e3
        return SolverResult(
            solver=self.name, label=self.label, framework=self.framework, paradigm=self.paradigm,
            value={"recovered": recovered, "correct": recovered == secret, "classical_queries": n},
            cost={"wall_ms": round(wall, 4), "oracle_queries": n},
            notes={"en": f"Recovered s={recovered} bit-by-bit in {n} oracle queries (one per bit) — instant "
                         "at this scale; the quantum win is in query COUNT, not wall-time.",
                   "es": f"Recuperó s={recovered} bit a bit en {n} consultas al oráculo (una por bit) — "
                         "instantáneo a esta escala; la ventaja cuántica es en NÚMERO de consultas, no en tiempo."},
            optimal=True,
        )


@register_solver
class ClassicalDJ(Solver):
    name = "dj-classical"
    label = {"en": "Oracle queries · classical", "es": "Consultas al oráculo · clásico"}
    framework = "classical:numpy"
    paradigm = CLASSICAL

    def applicable(self, problem: Problem) -> bool:
        return problem.id == "deutsch-jozsa"

    def run(self, problem, instance: Instance, seed: int, shots: int) -> SolverResult:
        from qlab.problems.deutsch_jozsa import DeutschJozsa

        n = instance.params["n"]
        expected = "constant" if instance.params["kind"] == "constant" else "balanced"
        half = 2 ** (n - 1)
        t0 = time.perf_counter()
        seen: set[int] = set()
        verdict, queries = None, 0
        for x in range(2**n):
            queries += 1
            seen.add(DeutschJozsa.evaluate(instance.params, x))
            if len(seen) > 1:                 # two different outputs ⇒ balanced (stop early)
                verdict = "balanced"
                break
            if queries > half:                # queried just over half, all equal ⇒ must be constant
                verdict = "constant"
                break
        wall = (time.perf_counter() - t0) * 1e3
        return SolverResult(
            solver=self.name, label=self.label, framework=self.framework, paradigm=self.paradigm,
            value={"verdict": verdict, "correct": verdict == expected, "classical_queries": queries},
            cost={"wall_ms": round(wall, 4), "oracle_queries": queries},
            notes={"en": f"Decided f is {verdict} after {queries} oracle queries (worst case "
                         f"{half + 1}); the quantum win is in query COUNT, not wall-time.",
                   "es": f"Decidió que f es {verdict} tras {queries} consultas (peor caso {half + 1}); "
                         "la ventaja cuántica es en NÚMERO de consultas, no en tiempo."},
            optimal=True,
        )


@register_solver
class ClassicalSimon(Solver):
    name = "simon-classical"
    label = {"en": "Collision search · classical", "es": "Búsqueda de colisión · clásico"}
    framework = "classical:numpy"
    paradigm = CLASSICAL

    def applicable(self, problem: Problem) -> bool:
        return problem.id == "simon"

    def run(self, problem, instance: Instance, seed: int, shots: int) -> SolverResult:
        from qlab.problems.simon import Simon

        n, secret = instance.params["n"], instance.params["secret"]
        t0 = time.perf_counter()
        # Query f on inputs until two inputs collide (f 2-to-1) ⇒ s = x1 ⊕ x2. Expected ~2^{n/2} (birthday).
        seen: dict[int, int] = {}
        recovered_val, queries = None, 0
        for x in range(2**n):
            queries += 1
            fx = Simon.evaluate(instance.params, x)
            if fx in seen:
                recovered_val = x ^ seen[fx]
                break
            seen[fx] = x
        recovered = "".join(str((recovered_val >> i) & 1) for i in range(n)) if recovered_val else "0" * n
        wall = (time.perf_counter() - t0) * 1e3
        return SolverResult(
            solver=self.name, label=self.label, framework=self.framework, paradigm=self.paradigm,
            value={"recovered": recovered, "correct": recovered == secret, "classical_queries": queries},
            cost={"wall_ms": round(wall, 4), "oracle_queries": queries},
            notes={"en": f"Found a collision after {queries} queries ⇒ s={recovered} (expected ~2^(n/2) = "
                         f"{round(2 ** (n / 2), 1)}); the quantum advantage is exponential in query count.",
                   "es": f"Halló una colisión tras {queries} consultas ⇒ s={recovered} (esperado ~2^(n/2) = "
                         f"{round(2 ** (n / 2), 1)}); la ventaja cuántica es exponencial en consultas."},
            optimal=True,
        )


@register_solver
class ClassicalEig(Solver):
    name = "qpe-classical"
    label = {"en": "Eigendecomposition · classical", "es": "Diagonalización · clásico"}
    framework = "classical:numpy"
    paradigm = CLASSICAL

    def applicable(self, problem: Problem) -> bool:
        return problem.id == "qpe"

    def run(self, problem, instance: Instance, seed: int, shots: int) -> SolverResult:
        phi = instance.params["phi"]
        t0 = time.perf_counter()
        # U = P(2πφ) = diag(1, e^{2πiφ}); eigenstate |1⟩ → eigenvalue e^{2πiφ}. Diagonalize exactly.
        U = np.diag([1.0, np.exp(2j * np.pi * phi)])
        eigvals = np.linalg.eigvals(U)
        phi_exact = float(np.angle(eigvals[1]) / (2 * np.pi)) % 1.0
        wall = (time.perf_counter() - t0) * 1e3
        return SolverResult(
            solver=self.name, label=self.label, framework=self.framework, paradigm=self.paradigm,
            value={"phi_exact": round(phi_exact, 6), "ops": 8, "exact": True},
            cost={"wall_ms": round(wall, 4), "ops": 8, "gate_complexity": "O(d^3)"},
            notes={"en": f"Diagonalized the 2×2 U → φ={phi_exact:.4f} exactly in microseconds. For a tiny U "
                         "this is trivial; QPE matters only when U is exponentially large (e^{iHt}).",
                   "es": f"Diagonalizó la U 2×2 → φ={phi_exact:.4f} exacto en microsegundos. Para una U "
                         "minúscula es trivial; QPE importa solo cuando U es exponencialmente grande."},
            optimal=True,
        )


@register_solver
class ClassicalDFT(Solver):
    name = "qft-classical"
    label = {"en": "Discrete Fourier transform · classical", "es": "Transformada discreta de Fourier · clásico"}
    framework = "classical:numpy"
    paradigm = CLASSICAL

    def applicable(self, problem: Problem) -> bool:
        return problem.id == "qft"

    def run(self, problem, instance: Instance, seed: int, shots: int) -> SolverResult:
        n, k = instance.params["n"], instance.params["k"]
        N = 2**n
        t0 = time.perf_counter()
        v = np.zeros(N, dtype=complex)
        v[k] = 1.0
        u = np.fft.fft(v) / np.sqrt(N)            # the full, READABLE Fourier spectrum
        wall = (time.perf_counter() - t0) * 1e3
        ops = int(N * max(1, n))                  # FFT ≈ O(N log N) = O(n·2ⁿ)
        return SolverResult(
            solver=self.name, label=self.label, framework=self.framework, paradigm=self.paradigm,
            value={"spectrum_uniform_prob": round(1.0 / N, 6), "ops": ops, "readable": True,
                   "amp0_phase_deg": round(float(np.angle(u[0], deg=True)), 3)},
            cost={"wall_ms": round(wall, 4), "ops": ops, "gate_complexity": "O(N log N)"},
            notes={"en": f"Classical FFT computes ALL {N} Fourier amplitudes (readable) in ~{ops} ops. The "
                         "QFT is cheaper to apply but its output cannot be read out — that's the trade.",
                   "es": f"La FFT clásica calcula TODAS las {N} amplitudes (legibles) en ~{ops} ops. La QFT "
                         "es más barata de aplicar pero su salida no se puede leer — ese es el trade-off."},
            optimal=True,
        )


@register_solver
class ClassicalSearch(Solver):
    name = "grover-classical"
    label = {"en": "Linear scan · classical", "es": "Barrido lineal · clásico"}
    framework = "classical:numpy"
    paradigm = CLASSICAL

    def applicable(self, problem: Problem) -> bool:
        return problem.id == "grover"

    def run(self, problem, instance: Instance, seed: int, shots: int) -> SolverResult:
        n, marked = instance.params["n"], set(instance.params["marked"])
        rng = np.random.default_rng(seed)
        N = 2**n
        order = rng.permutation(N)            # query items in a random order until a marked one is hit
        t0 = time.perf_counter()
        queries, found_idx = 0, None
        for x in order:
            queries += 1
            if int(x) in marked:
                found_idx = int(x)
                break
        found = format(found_idx, f"0{n}b")[::-1] if found_idx is not None else "?"
        wall = (time.perf_counter() - t0) * 1e3
        avg = (N + 1) / (len(marked) + 1)
        return SolverResult(
            solver=self.name, label=self.label, framework=self.framework, paradigm=self.paradigm,
            value={"found": found, "correct": found_idx in marked, "classical_queries": queries},
            cost={"wall_ms": round(wall, 4), "oracle_queries": queries},
            notes={"en": f"Found a marked item after {queries} queries (worst case {N}, average ≈ "
                         f"{avg:.1f}); the quantum advantage is the quadratic ~√N.",
                   "es": f"Halló un ítem marcado tras {queries} consultas (peor caso {N}, promedio ≈ "
                         f"{avg:.1f}); la ventaja cuántica es el ~√N cuadrático."},
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
