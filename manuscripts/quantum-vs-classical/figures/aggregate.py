#!/usr/bin/env python3
"""Aggregate the committed QLab traces into the benchmark artifact for the quantum-vs-classical report.

Walks data/artifacts/*/*.json (the 119 committed, reproducible traces over 20 problems and 5 real quantum
frameworks) and extracts, per problem: the representative instance's classical and quantum wall-times, the
quantum framework(s), and the honest quantum-vs-classical outcome. Also pulls the CHSH S-value across its
variants (the one genuine quantum-beats-classical result) and the Grover query counts (the asymptotic
quadratic advantage that does not yet beat wall-time). Writes ../data/bench_summary.json.

Run:  python aggregate.py     (run from the repo root; reads data/artifacts/)
Deps: stdlib only.
"""
from __future__ import annotations

import glob
import io
import json
import os
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]        # repo root (figures/../../../ = repo)
ART = ROOT / "data" / "artifacts"
OUT = Path(__file__).resolve().parent.parent / "data"
OUT.mkdir(exist_ok=True)


def load(f):
    return json.load(io.open(f, encoding="utf-8"))


def _classical(sv):
    xs = [s["cost"].get("wall_ms", None) for s in sv if str(s.get("framework", "")).startswith("classical")]
    xs = [x for x in xs if x is not None]
    return min(xs) if xs else None


def _quantum(sv):
    qs = [s for s in sv if not str(s.get("framework", "")).startswith("classical")]
    xs = [s["cost"].get("wall_ms", None) for s in qs if s["cost"].get("wall_ms") is not None]
    frames = sorted({s.get("framework", "") for s in qs})
    return (min(xs) if xs else None), frames


def main():
    cases = []
    total_traces = 0
    for d in sorted(glob.glob(str(ART / "*"))):
        case = os.path.basename(d)
        files = sorted(glob.glob(os.path.join(d, "*.json")))
        total_traces += len(files)
        pick = None
        for f in files:
            t = load(f)
            if "comparison" in t and "solvers" in t:
                pick = t
                break
        if not pick:
            continue
        sv = pick["solvers"]
        cw = _classical(sv)
        qw, frames = _quantum(sv)
        cases.append({"case": case, "category": pick.get("category", ""), "qubits": pick.get("qubits"),
                      "n_variants": len(files), "classical_wall_ms": round(cw, 4) if cw is not None else None,
                      "quantum_wall_ms": round(qw, 3) if qw is not None else None, "q_frameworks": frames})

    # CHSH S across variants
    chsh = []
    for f in sorted(glob.glob(str(ART / "chsh" / "*.json"))):
        t = load(f)
        c = t.get("comparison", {})
        if "S" in c:
            chsh.append({"variant": os.path.basename(f).replace("chsh-", "").replace(".json", ""),
                         "S": round(c["S"], 4), "exceeds": bool(c.get("exceeds_classical", False))})

    # Grover query complexity across variants
    grover = []
    for f in sorted(glob.glob(str(ART / "grover" / "*.json"))):
        t = load(f)
        c = t.get("comparison", {})
        if "quantum_queries" in c and "classical_queries" in c:
            grover.append({"variant": os.path.basename(f).replace("grover-", "").replace(".json", ""),
                           "qubits": t.get("qubits"), "quantum_queries": c["quantum_queries"],
                           "classical_queries": c["classical_queries"], "success_prob": c.get("success_prob")})

    frames_all = sorted({fr for c in cases for fr in c["q_frameworks"]})
    faster_classical = sum(1 for c in cases if c["classical_wall_ms"] is not None
                           and c["quantum_wall_ms"] is not None
                           and c["classical_wall_ms"] < c["quantum_wall_ms"])
    out = {"meta": {"n_cases": len(cases), "total_traces": total_traces, "frameworks": frames_all,
                    "classical_faster_walltime": faster_classical,
                    "note": "QLab honest quantum-vs-classical benchmark; classical wins wall-time at lab scale"},
           "cases": cases, "chsh": chsh, "grover": grover}
    (OUT / "bench_summary.json").write_text(json.dumps(out, indent=1), encoding="utf-8")
    print(f"{len(cases)} cases, {total_traces} traces, frameworks {frames_all}; "
          f"classical faster {faster_classical}/{len(cases)}")
    print("CHSH:", [(c['variant'], c['S'], c['exceeds']) for c in chsh])
    print("Grover:", [(g['variant'], g['quantum_queries'], g['classical_queries']) for g in grover])


if __name__ == "__main__":
    main()
