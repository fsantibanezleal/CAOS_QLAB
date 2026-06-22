"""PennyLane adapter — real PennyLane, an independent second implementation of QAOA for MaxCut.

This is the SimLab "two engines on one problem" discipline (SimPy live + Ciw analytic cross-check), here
as QAOA-Qiskit vs QAOA-PennyLane: two real frameworks must agree on ⟨C⟩ and the cut, which validates
both. PennyLane builds the cost Hamiltonian with `qml.qaoa`, evaluates ⟨C⟩ on `default.qubit`, and uses
the same deterministic (γ, β) grid as the Qiskit adapter so the head-to-head is apples-to-apples.
"""

from __future__ import annotations

import time

import numpy as np

from qlab.problems.base import Instance, Problem
from qlab.registry import register_solver
from qlab.solvers.base import QUANTUM_SIM, Solver, SolverResult

try:
    import pennylane as qml

    PENNYLANE_VERSION = qml.__version__
except Exception:  # pragma: no cover
    qml = None
    PENNYLANE_VERSION = "unknown"


@register_solver
class PennyLaneQAOA(Solver):
    name = "qaoa-pennylane"
    label = {"en": "QAOA (p=1) · PennyLane", "es": "QAOA (p=1) · PennyLane"}
    framework = "pennylane"
    paradigm = QUANTUM_SIM
    GRID = 24

    def applicable(self, problem: Problem) -> bool:
        return problem.id == "maxcut" and qml is not None

    def run(self, problem, instance: Instance, seed: int, shots: int) -> SolverResult:
        import networkx as nx

        n, edges = instance.params["n"], instance.params["edges"]
        graph = nx.Graph()
        graph.add_nodes_from(range(n))
        graph.add_edges_from((int(u), int(v)) for u, v in edges)
        cost_h, mixer_h = qml.qaoa.maxcut(graph)
        dev = qml.device("default.qubit", wires=n)

        def layer(gamma, beta):
            qml.qaoa.cost_layer(gamma, cost_h)
            qml.qaoa.mixer_layer(beta, mixer_h)

        @qml.qnode(dev)
        def expval(gamma, beta):
            for w in range(n):
                qml.Hadamard(wires=w)
            layer(gamma, beta)
            return qml.expval(cost_h)

        @qml.qnode(dev)
        def probs(gamma, beta):
            for w in range(n):
                qml.Hadamard(wires=w)
            layer(gamma, beta)
            return qml.probs(wires=range(n))

        t0 = time.perf_counter()
        gammas = np.linspace(0, np.pi, self.GRID)
        betas = np.linspace(0, np.pi, self.GRID)
        # PennyLane's qaoa.maxcut cost Hamiltonian H_C = 0.5 Σ_(i,j)∈E (Z_iZ_j − I) is MINIMIZED to
        # maximize the cut (a cut edge contributes −1). So we grid-search for the MINIMUM ⟨H_C⟩, then read
        # the cut off the most-probable bitstring (exact) — which is why this cross-checks the Qiskit adapter.
        best = (gammas[0], betas[0], np.inf)
        for g in gammas:
            for b in betas:
                e = float(expval(g, b))
                if e < best[2]:
                    best = (g, b, e)
        g_best, b_best = best[0], best[1]
        pr = np.asarray(probs(g_best, b_best))
        idx = int(np.argmax(pr))
        bits = format(idx, f"0{n}b")[::-1]
        cut = problem.cut_value(edges, bits)
        wall = (time.perf_counter() - t0) * 1e3
        return SolverResult(
            solver=self.name, label=self.label, framework=self.framework, paradigm=self.paradigm,
            value={"cut": cut, "bitstring": bits},
            cost={"wall_ms": round(wall, 1), "qubits": n, "evaluations": self.GRID ** 2},
            notes={"en": "Independent QAOA on PennyLane default.qubit (same (γ,β) grid as the Qiskit "
                         f"adapter); most-probable bitstring cuts {cut} edges — cross-checks Qiskit.",
                   "es": "QAOA independiente en PennyLane default.qubit (misma malla (γ,β) que el adaptador "
                         f"de Qiskit); la cadena más probable corta {cut} aristas — verifica a Qiskit."},
        )
