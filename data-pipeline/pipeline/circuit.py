"""The circuit contract, checked before a trace is written.

Two levels:
- structure (every trace): each op's qubits are integers in range and distinct, its parameters finite. A
  violation is a bug in a solver, so the pipeline refuses to write the trace.
- live (the lane): each op is a gate the in-browser engine runs, with the right qubit and parameter counts,
  on at most `max_qubits` qubits. The engine declares that set in web/src/live/gates.json; the web checks the
  same file before running a circuit, so the two cannot disagree. A circuit outside it is precompute only.
"""

from __future__ import annotations

import json
import math
from pathlib import Path

GATES_FILE = Path(__file__).resolve().parents[2] / "web" / "src" / "live" / "gates.json"
_SPEC = json.loads(GATES_FILE.read_text(encoding="utf-8"))
LIVE_GATES: dict[str, dict] = _SPEC["gates"]
LIVE_MAX_QUBITS: int = _SPEC["max_qubits"]


def structure_violations(ops: list[dict], n: int) -> list[str]:
    out = []
    for i, op in enumerate(ops):
        at = f"op {i} {op['gate']}"
        targets, params = op.get("targets", []), op.get("params") or []
        if any(not isinstance(q, int) or not 0 <= q < n for q in targets):
            out.append(f"{at}: qubit out of range 0..{n - 1}")
        if len(set(targets)) != len(targets):
            out.append(f"{at}: repeated qubit")
        if any(not isinstance(p, (int, float)) or not math.isfinite(p) for p in params):
            out.append(f"{at}: non-finite parameter")
    return out


def state_violations(steps: list[dict]) -> list[str]:
    """A recorded state is physical: each step's probabilities sum to 1 and equal the squared moduli. The
    records round every value to 6 decimals, so the sum of 2^n of them may be off by up to 2^n * 5e-7."""
    out = []
    for i, s in enumerate(steps):
        total = sum(s["probabilities"])
        if abs(total - 1) > 5e-7 * len(s["probabilities"]) + 1e-9:
            out.append(f"step {i}: probabilities sum to {total}")
        sv = s.get("statevector") or []
        if sv and any(abs(a["re"] ** 2 + a["im"] ** 2 - p) > 1e-5 for a, p in zip(sv, s["probabilities"])):
            out.append(f"step {i}: probabilities are not the squared amplitude moduli")
    return out


def live_violations(ops: list[dict], n: int) -> list[str]:
    out = [f"{n} qubits > {LIVE_MAX_QUBITS}"] if n > LIVE_MAX_QUBITS else []
    for i, op in enumerate(ops):
        spec = LIVE_GATES.get(op["gate"].lower())
        at = f"op {i} {op['gate']}"
        if spec is None:
            out.append(f"{at}: not a live gate")
            continue
        lo, hi = spec["qubits"]
        if not lo <= len(op.get("targets", [])) <= hi:
            out.append(f"{at}: {len(op.get('targets', []))} qubits, needs {lo}..{hi}")
        if len(op.get("params") or []) != spec["params"]:
            out.append(f"{at}: {len(op.get('params') or [])} params, needs {spec['params']}")
    return out + structure_violations(ops, n)
