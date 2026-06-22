"""Qiskit adapters — real Qiskit 2.x + quantum_info. Two solvers:

- `state-qiskit`  : builds the entanglement targets gate-by-gate and emits a full step trace.
- `qaoa-qiskit`   : p=1 QAOA for MaxCut, optimized by an exact statevector grid-search over (γ, β)
                    (deterministic → reproducible; no removed qiskit-algorithms dependency). Emits the
                    optimal-parameter circuit trace + the (γ, β) energy landscape for the viz.
"""

from __future__ import annotations

import time

import numpy as np
from qiskit import QuantumCircuit
from qiskit.quantum_info import SparsePauliOp, Statevector

from qlab.core.circuit_trace import circuit_ops, evolve, measure_counts, step_of
from qlab.problems.base import Instance, Problem
from qlab.registry import register_solver
from qlab.solvers.base import QUANTUM_SIM, Solver, SolverResult

try:
    import qiskit

    QISKIT_VERSION = qiskit.__version__
except Exception:  # pragma: no cover
    QISKIT_VERSION = "unknown"


def _state_circuit(kind: str, variant: str, n: int) -> QuantumCircuit:
    qc = QuantumCircuit(n)
    if kind == "bell":
        qc.h(0)
        qc.cx(0, 1)
        if variant in ("phi_minus", "psi_minus"):
            qc.z(0)
        if variant in ("psi_plus", "psi_minus"):
            qc.x(1)
    elif kind == "ghz":
        qc.h(0)
        for q in range(n - 1):
            qc.cx(q, q + 1)
    else:  # pragma: no cover — W handled via the exact-prepare path below
        raise ValueError(kind)
    return qc


@register_solver
class QiskitStatePrep(Solver):
    name = "state-qiskit"
    label = {"en": "Gate circuit · Qiskit", "es": "Circuito de compuertas · Qiskit"}
    framework = "qiskit"
    paradigm = QUANTUM_SIM

    def applicable(self, problem: Problem) -> bool:
        return problem.id == "state-prep"

    def run(self, problem, instance: Instance, seed: int, shots: int) -> SolverResult:
        from qlab.core.trace import Trace
        from qlab.solvers.classical_solvers import target_state

        p = instance.params
        kind, n = p["kind"], p["n"]
        t0 = time.perf_counter()
        if kind == "w":
            # W has no short clean gate form; prepare the exact target and show it as one labeled step.
            sv0 = Statevector.from_int(0, 2**n)
            svW = Statevector(target_state("w", n))
            steps = [
                step_of(0, "init", [], {"en": "Initial |0…0⟩", "es": "Inicial |0…0⟩"}, sv0, n),
                step_of(1, "PREP-W", list(range(n)),
                        {"en": "Prepare W (cascade of controlled rotations)",
                         "es": "Preparar W (cascada de rotaciones controladas)"}, svW, n),
            ]
            ops = [{"gate": "prepare_W", "targets": list(range(n)), "params": []}]
            probs = np.asarray(svW.probabilities())
            from qlab.core.rng import sample_counts

            meas = {"counts": sample_counts(probs, shots, seed), "shots": shots}
        else:
            qc = _state_circuit(kind, p.get("variant", ""), n)
            steps = evolve(qc)
            ops = circuit_ops(qc)
            meas = measure_counts(qc, shots, seed)
        wall = (time.perf_counter() - t0) * 1e3
        trace = Trace(
            case_id=problem.id,
            title=problem.title,
            concept=problem.concept,
            qubits=n,
            steps=steps,
            measurements=meas,
            circuit_ops=ops,
            provenance={"engine": "qiskit", "engine_version": QISKIT_VERSION, "seed": seed,
                        "lane": "tbd", "ran_on": "simulator"},
            references=problem.references,
        )
        return SolverResult(
            solver=self.name, label=self.label, framework=self.framework, paradigm=self.paradigm,
            value={"fidelity": 1.0, "shots": shots},
            cost={"wall_ms": round(wall, 3), "qubits": n, "depth": len(steps) - 1},
            notes={"en": "Exact statevector simulation of the gate circuit (Qiskit quantum_info).",
                   "es": "Simulación exacta del vector de estado del circuito (Qiskit quantum_info)."},
            trace=trace,
        )


@register_solver
class QiskitBV(Solver):
    name = "bv-qiskit"
    label = {"en": "BV circuit · Qiskit", "es": "Circuito BV · Qiskit"}
    framework = "qiskit"
    paradigm = QUANTUM_SIM

    def applicable(self, problem: Problem) -> bool:
        return problem.id == "bernstein-vazirani"

    def run(self, problem, instance: Instance, seed: int, shots: int) -> SolverResult:
        from qlab.core.trace import Trace

        n, secret = instance.params["n"], instance.params["secret"]
        total = n + 1  # input qubits 0..n-1 + answer ancilla = qubit n
        qc = QuantumCircuit(total)
        qc.x(n)
        qc.h(range(total))            # input → uniform superposition; ancilla → |−⟩
        for i in range(n):            # oracle f(x)=s·x via phase kickback
            if secret[i] == "1":
                qc.cx(i, n)
        qc.h(range(n))                # interfere → input register becomes |s⟩
        t0 = time.perf_counter()
        steps = evolve(qc)
        probs = np.asarray(Statevector(qc).probabilities())
        idx = int(np.argmax(probs))
        recovered = format(idx, f"0{total}b")[::-1][:n]   # qubit-order; input bits = qubits 0..n-1
        wall = (time.perf_counter() - t0) * 1e3
        trace = Trace(
            case_id=problem.id, title=problem.title, concept=problem.concept, qubits=total,
            steps=steps, measurements=measure_counts(qc, shots, seed), circuit_ops=circuit_ops(qc),
            provenance={"engine": "qiskit", "engine_version": QISKIT_VERSION, "seed": seed,
                        "lane": "tbd", "ran_on": "simulator"},
            references=problem.references,
        )
        return SolverResult(
            solver=self.name, label=self.label, framework=self.framework, paradigm=self.paradigm,
            value={"recovered": recovered, "correct": recovered == secret, "quantum_queries": 1},
            cost={"wall_ms": round(wall, 3), "qubits": total, "depth": steps[-1].index, "oracle_queries": 1},
            notes={"en": f"One oracle query recovers s={recovered} via phase kickback + interference.",
                   "es": f"Una consulta al oráculo recupera s={recovered} vía phase kickback + interferencia."},
            trace=trace,
        )


@register_solver
class QiskitDJ(Solver):
    name = "dj-qiskit"
    label = {"en": "DJ circuit · Qiskit", "es": "Circuito DJ · Qiskit"}
    framework = "qiskit"
    paradigm = QUANTUM_SIM

    def applicable(self, problem: Problem) -> bool:
        return problem.id == "deutsch-jozsa"

    def run(self, problem, instance: Instance, seed: int, shots: int) -> SolverResult:
        from qlab.core.trace import Trace

        p = instance.params
        n = p["n"]
        total = n + 1
        expected = "constant" if p["kind"] == "constant" else "balanced"
        qc = QuantumCircuit(total)
        qc.x(n)
        qc.h(range(total))
        if p["kind"] == "constant":
            if p["value"] == 1:
                qc.x(n)               # f≡1 → global (−1) phase via the |−⟩ ancilla; verdict still constant
        else:
            for i in range(n):        # balanced f(x)=s·x → phase kickback (−1)^{s·x}
                if p["secret"][i] == "1":
                    qc.cx(i, n)
        qc.h(range(n))
        t0 = time.perf_counter()
        steps = evolve(qc)
        probs = np.asarray(Statevector(qc).probabilities())
        idx = int(np.argmax(probs))
        input_bits = format(idx, f"0{total}b")[::-1][:n]
        verdict = "constant" if set(input_bits) == {"0"} else "balanced"
        wall = (time.perf_counter() - t0) * 1e3
        trace = Trace(
            case_id=problem.id, title=problem.title, concept=problem.concept, qubits=total,
            steps=steps, measurements=measure_counts(qc, shots, seed), circuit_ops=circuit_ops(qc),
            provenance={"engine": "qiskit", "engine_version": QISKIT_VERSION, "seed": seed,
                        "lane": "tbd", "ran_on": "simulator"},
            references=problem.references,
        )
        return SolverResult(
            solver=self.name, label=self.label, framework=self.framework, paradigm=self.paradigm,
            value={"verdict": verdict, "correct": verdict == expected, "quantum_queries": 1},
            cost={"wall_ms": round(wall, 3), "qubits": total, "depth": steps[-1].index, "oracle_queries": 1},
            notes={"en": f"One oracle query decides f is {verdict} (all-zeros ⇒ constant, else balanced).",
                   "es": f"Una consulta al oráculo decide que f es {verdict} (todo-ceros ⇒ constante)."},
            trace=trace,
        )


def _maxcut_cost_op(n: int, edges: list[list[int]]) -> SparsePauliOp:
    """C = Σ_(u,v)∈E 0.5 (I − Z_u Z_v) — expectation = expected cut value."""
    sparse = []
    for u, v in edges:
        sparse.append(("ZZ", [u, v], -0.5))
    op = SparsePauliOp.from_sparse_list(sparse, num_qubits=n) + SparsePauliOp(["I" * n], coeffs=[0.5 * len(edges)])
    return op.simplify()


def _qaoa_circuit(n: int, edges: list[list[int]], gamma: float, beta: float) -> QuantumCircuit:
    qc = QuantumCircuit(n)
    qc.h(range(n))
    for u, v in edges:           # cost layer exp(-iγ C)
        qc.rzz(2.0 * gamma, u, v)
    for q in range(n):           # mixer layer exp(-iβ ΣX)
        qc.rx(2.0 * beta, q)
    return qc


@register_solver
class QiskitQAOA(Solver):
    name = "qaoa-qiskit"
    label = {"en": "QAOA (p=1) · Qiskit", "es": "QAOA (p=1) · Qiskit"}
    framework = "qiskit"
    paradigm = QUANTUM_SIM
    GRID = 24

    def applicable(self, problem: Problem) -> bool:
        return problem.id == "maxcut"

    def run(self, problem, instance: Instance, seed: int, shots: int) -> SolverResult:
        from qlab.core.trace import Trace

        n, edges = instance.params["n"], instance.params["edges"]
        cost = _maxcut_cost_op(n, edges)
        t0 = time.perf_counter()
        gammas = np.linspace(0, np.pi, self.GRID)
        betas = np.linspace(0, np.pi, self.GRID)
        landscape, best = [], (-1.0, 0.0, 0.0)
        for g in gammas:
            row = []
            for b in betas:
                sv = Statevector(_qaoa_circuit(n, edges, g, b))
                e = float(sv.expectation_value(cost).real)
                row.append(round(e, 4))
                if e > best[0]:
                    best = (e, g, b)
            landscape.append(row)
        exp_best, g_best, b_best = best
        qc_best = _qaoa_circuit(n, edges, g_best, b_best)
        probs = np.asarray(Statevector(qc_best).probabilities())
        idx = int(np.argmax(probs))
        bits = format(idx, f"0{n}b")[::-1]  # → vertex u = position u (qubit order)
        cut = problem.cut_value(edges, bits)
        wall = (time.perf_counter() - t0) * 1e3
        trace = Trace(
            case_id=problem.id, title=problem.title, concept=problem.concept, qubits=n,
            steps=evolve(qc_best), measurements=measure_counts(qc_best, shots, seed),
            circuit_ops=circuit_ops(qc_best),
            provenance={"engine": "qiskit", "engine_version": QISKIT_VERSION, "seed": seed,
                        "lane": "tbd", "ran_on": "simulator"},
            references=problem.references,
            extra={"landscape": {"gammas": [round(float(x), 4) for x in gammas],
                                 "betas": [round(float(x), 4) for x in betas], "expectation": landscape},
                   "gamma": round(g_best, 4), "beta": round(b_best, 4)},
        )
        return SolverResult(
            solver=self.name, label=self.label, framework=self.framework, paradigm=self.paradigm,
            value={"cut": cut, "bitstring": bits, "expectation": round(exp_best, 4)},
            cost={"wall_ms": round(wall, 1), "qubits": n, "depth": trace.steps[-1].index,
                  "evaluations": self.GRID ** 2},
            notes={"en": f"p=1 QAOA, exact-statevector grid-search over (γ,β). Best ⟨C⟩={exp_best:.3f}; "
                         f"most-probable bitstring cuts {cut} edges.",
                   "es": f"QAOA p=1, búsqueda en malla (γ,β) con vector de estado exacto. Mejor ⟨C⟩="
                         f"{exp_best:.3f}; la cadena más probable corta {cut} aristas."},
            trace=trace,
            extra={"landscape": trace.extra["landscape"]},
        )
