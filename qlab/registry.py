"""The catalog + the plug-in seam.

Problems and solvers self-register here via decorators. The pipeline asks the registry for the solvers
applicable to a problem and runs them uniformly — it never names a framework. Adding a problem or a solver
is purely additive: drop a module under qlab/problems or qlab/solvers, decorate it, done.
"""

from __future__ import annotations

_PROBLEMS: dict[str, type] = {}
_SOLVERS: dict[str, type] = {}
_LOADED = False


def register_problem(cls):
    _PROBLEMS[cls.id] = cls
    return cls


def register_solver(cls):
    _SOLVERS[cls.name] = cls
    return cls


def _ensure_loaded() -> None:
    """Import the concrete problem/solver modules so their decorators run (idempotent)."""
    global _LOADED
    if _LOADED:
        return
    import qlab.problems  # noqa: F401  (its __init__ imports every problem module)
    import qlab.solvers   # noqa: F401  (its __init__ imports every solver adapter, tolerating missing deps)
    _LOADED = True


def all_problems() -> dict[str, type]:
    _ensure_loaded()
    return dict(_PROBLEMS)


def get_problem(problem_id: str):
    _ensure_loaded()
    if problem_id not in _PROBLEMS:
        raise KeyError(f"unknown case {problem_id!r}; known: {sorted(_PROBLEMS)}")
    return _PROBLEMS[problem_id]()


def all_solvers() -> dict[str, type]:
    _ensure_loaded()
    return dict(_SOLVERS)


def solvers_for(problem, only: str | None = None) -> list:
    """Instantiated solvers applicable to `problem` (optionally filtered to one solver name)."""
    _ensure_loaded()
    out = []
    for name, cls in _SOLVERS.items():
        if only and name != only:
            continue
        solver = cls()
        if solver.applicable(problem):
            out.append(solver)
    return out
