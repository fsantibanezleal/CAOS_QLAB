"""Pipeline smoke test — exercises the real engines (Qiskit, and PennyLane if present).

Skipped automatically if Qiskit is not installed (the live-thin env), so `pytest` stays green there;
CI installs requirements-precompute.txt and runs it for real.
"""

from __future__ import annotations

import pytest

qiskit = pytest.importorskip("qiskit")


def test_state_prep_bell_runs_and_traces():
    from qlab.registry import get_problem, solvers_for

    problem = get_problem("state-prep")
    inst = problem.instance("bell-phi-plus")
    solver = next(s for s in solvers_for(problem) if s.name == "state-qiskit")
    res = solver.run(problem, inst, seed=42, shots=512)
    # Bell Φ+ → only |00> and |11> populated, each ~0.5.
    final = res.trace.steps[-1].probabilities
    assert abs(final[0] - 0.5) < 1e-6 and abs(final[-1] - 0.5) < 1e-6
    assert set(res.trace.measurements["counts"]) <= {"00", "11"}


def test_maxcut_classical_optimum_beats_or_matches_qaoa():
    from qlab.problems.maxcut import MaxCut
    from qlab.registry import get_problem, solvers_for

    problem = get_problem("maxcut")
    inst = problem.instance("square")  # C4 → optimum cut = 4
    results = {s.name: s.run(problem, inst, seed=42, shots=512) for s in solvers_for(problem)}
    assert results["maxcut-bruteforce"].value["cut"] == 4
    assert results["maxcut-bruteforce"].optimal is True
    # QAOA cut never exceeds the classical optimum.
    assert results["qaoa-qiskit"].value["cut"] <= results["maxcut-bruteforce"].value["cut"]
    # Triangle is frustrated: optimum is 2, not 3.
    assert MaxCut().cut_value([[0, 1], [1, 2], [0, 2]], "010") == 2
