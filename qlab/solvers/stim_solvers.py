"""Stim adapter (Phase-B framework) — the stabilizer/QEC engine.

Stim simulates Clifford circuits with thousands of qubits (Gottesman-Knill), which is exactly what error
correction needs: sample the noisy syndrome history of a code, then decode. QLab pairs Stim with PyMatching
(minimum-weight perfect matching) to run the real QEC decoding pipeline for the repetition code. This is
the standard toolchain that scales up to surface codes — a genuinely new simulation paradigm beside the
state-vector solvers (Qiskit/PennyLane/Cirq), added as one more adapter.
"""

from __future__ import annotations

import time

from qlab.problems.base import Instance, Problem
from qlab.registry import register_solver
from qlab.solvers.base import QUANTUM_SIM, Solver, SolverResult

try:
    import stim

    STIM_VERSION = stim.__version__
except Exception:  # pragma: no cover
    stim = None
    STIM_VERSION = "unknown"


@register_solver
class StimRepetition(Solver):
    name = "qec-stim"
    label = {"en": "Repetition code (Stim + MWPM)", "es": "Código de repetición (Stim + MWPM)"}
    framework = "stim"
    paradigm = QUANTUM_SIM
    SHOTS = 50_000

    def applicable(self, problem: Problem) -> bool:
        return problem.id == "qec-repetition" and stim is not None

    def run(self, problem, instance: Instance, seed: int, shots: int) -> SolverResult:
        import pymatching

        d, p, rounds = instance.params["distance"], instance.params["p"], instance.params["rounds"]
        t0 = time.perf_counter()
        circuit = stim.Circuit.generated(
            "repetition_code:memory", rounds=rounds, distance=d,
            before_round_data_depolarization=p,
            before_measure_flip_probability=p / 2,
        )
        sampler = circuit.compile_detector_sampler(seed=seed)
        det, obs = sampler.sample(self.SHOTS, separate_observables=True)
        matcher = pymatching.Matching.from_detector_error_model(
            circuit.detector_error_model(decompose_errors=True))
        pred = matcher.decode_batch(det)
        logical_err = float((pred != obs).any(axis=1).mean())
        wall = (time.perf_counter() - t0) * 1e3
        return SolverResult(
            solver=self.name, label=self.label, framework=self.framework, paradigm=self.paradigm,
            value={"logical_error_rate": round(logical_err, 5), "distance": d, "rounds": rounds,
                   "physical_p": p, "physical_qubits": 2 * d - 1},
            cost={"wall_ms": round(wall, 1), "shots": self.SHOTS, "physical_qubits": 2 * d - 1},
            notes={"en": f"Stim+PyMatching: distance-{d} repetition code at p={p} → logical error "
                         f"{logical_err:.4f} over {rounds} rounds ({2 * d - 1} physical qubits).",
                   "es": f"Stim+PyMatching: código de repetición distancia-{d} a p={p} → error lógico "
                         f"{logical_err:.4f} en {rounds} rondas ({2 * d - 1} qubits físicos)."},
            extra={"shots": self.SHOTS},
        )
