"""The precompute pipeline. Framework-agnostic orchestrator over the `qversus` engine: it asks the registry for
the solvers applicable to a case, runs them uniformly, bundles their results into one committed JSON artifact
per (case, instance), classifies the live/precompute lane from measurements, and writes a manifest.

Invoked by path (QLab declares no package of its own):
    python data-pipeline/run.py --list
    python data-pipeline/run.py maxcut                      # default (first) instance, all applicable solvers
    python data-pipeline/run.py maxcut --instance pentagon --seed 7
    python data-pipeline/run.py maxcut --all                # every instance
    python data-pipeline/run.py state-prep --solver state-qiskit
"""

from __future__ import annotations

import argparse
import json
import sys
import time
from pathlib import Path

import qversus
from qversus.core.trace import SCHEMA_VERSION
from qversus.registry import all_problems, get_problem, solvers_for

from pipeline.circuit import live_violations, state_violations, structure_violations
from pipeline.gate import classify_lane
from pipeline.manifest import Manifest
from pipeline.verdicts import comparison

ROOT = Path(__file__).resolve().parents[2]
ARTIFACTS = ROOT / "data" / "artifacts"
MANIFESTS = ROOT / "manifests"

# Which renderers the web app should mount for a category (viz bindings: the manifest's `viz`).
VIZ_BY_CATEGORY = {
    "fundamentals": ["bloch", "amp_phase", "histogram", "circuit"],
    "entanglement": ["amp_phase", "histogram", "qsphere", "circuit"],
    "oracle-algorithms": ["amp_phase", "histogram", "circuit"],
    "flagship-algorithms": ["amp_phase", "histogram", "circuit"],
    "variational": ["graph", "landscape", "histogram", "circuit"],
    "noise-and-qec": ["histogram", "density", "circuit"],
    "compilation": ["circuit"],
}


def app_version() -> str:
    return (ROOT / "VERSION").read_text(encoding="utf-8").strip()


def write_json(obj: dict, path: Path) -> Path:
    # Bytes, not text: write_text turns "\n" into CRLF on Windows, so a bake's bytes would depend on the OS.
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(json.dumps(obj, indent=1, ensure_ascii=False).encode("utf-8"))
    return path


def run_case(problem_id: str, instance_id: str | None, seed: int, shots: int, only: str | None,
             artifacts: Path = ARTIFACTS, manifests: Path = MANIFESTS, quiet: bool = False) -> dict:
    problem = get_problem(problem_id)
    inst = problem.instance(instance_id)
    solvers = solvers_for(problem, only=only)
    if not solvers:
        raise SystemExit(f"no applicable solvers for {problem_id} (only={only!r})")

    results = []
    primary_trace = None
    for solver in solvers:
        t0 = time.perf_counter()
        res = solver.run(problem, inst, seed=seed, shots=shots)
        res.cost.setdefault("wall_ms", round((time.perf_counter() - t0) * 1e3, 3))
        if primary_trace is None and res.trace is not None:
            primary_trace = res.trace
            primary_solver = res.solver
        results.append(res)

    # The circuit contract, then the lane verdict from the primary (circuit) trace.
    if primary_trace is not None:
        broken = structure_violations(primary_trace.circuit_ops, primary_trace.qubits)
        broken += state_violations(primary_trace.to_dict()["steps"])
        if broken:
            raise SystemExit(f"{problem.id}/{inst.id}: refusing to write a malformed trace: {broken}")
        run_ms = max((r.cost.get("wall_ms", 0) for r in results), default=0.0)
        verdict = classify_lane(qubits=inst.params.get("n", primary_trace.qubits),
                                run_ms=run_ms, trace_bytes=primary_trace.nbytes(),
                                unitary_only=problem.live_capable,
                                live_violations=live_violations(primary_trace.circuit_ops, primary_trace.qubits))
    else:  # pragma: no cover
        primary_solver = results[0].solver
        verdict = classify_lane(qubits=inst.params.get("n", 1), run_ms=0, trace_bytes=0,
                                unitary_only=problem.live_capable)

    engine_block = {"package": "qversus", "version": qversus.__version__}
    bundle = {
        "schema_version": SCHEMA_VERSION,
        "case_id": problem.id,
        "category": problem.category,
        "title": problem.title,
        "concept": problem.concept,
        "metric": problem.metric,
        "instance": {"id": inst.id, "title": inst.title, "params": inst.params, "note": inst.note},
        "qubits": inst.params.get("n", primary_trace.qubits if primary_trace else 1),
        "lane": verdict.lane,
        "lane_reasons": verdict.reasons,
        "seed": seed,
        "shots": shots,
        "app_version": app_version(),
        "engine_package": engine_block,
        "primary_solver": primary_solver,
        "trace": primary_trace.to_dict() if primary_trace else None,
        "solvers": [
            {"solver": r.solver, "label": r.label, "framework": r.framework, "paradigm": r.paradigm,
             "value": r.value, "cost": r.cost, "notes": r.notes, "optimal": r.optimal, "extra": r.extra}
            for r in results
        ],
        "comparison": comparison(problem, results),
        "references": problem.references,
    }

    out = write_json(bundle, artifacts / problem.id / f"{inst.id}.json")

    manifest = Manifest(
        case_id=problem.id, title=problem.title, category=problem.category,
        lane=verdict.lane, lane_reasons=verdict.reasons, qubits=bundle["qubits"], seed=seed, shots=shots,
        params=inst.params,
        measured={"run_ms": round(verdict.run_ms, 3), "trace_bytes": verdict.trace_bytes,
                  "unitary_only": verdict.unitary_only},
        viz=VIZ_BY_CATEGORY.get(problem.category, ["circuit", "histogram"]),
        engine=primary_trace.provenance["engine"] if primary_trace else results[0].framework,
        engine_version=primary_trace.provenance["engine_version"] if primary_trace else "-",
        engine_package=engine_block,
        app_version=bundle["app_version"],
        trace_path=out.relative_to(artifacts).as_posix(),
        references=problem.references,
    )
    write_json(manifest.to_dict(), manifests / f"{problem.id}__{inst.id}.json")

    if not quiet:
        _print_summary(problem, inst, results, verdict, out, bundle["comparison"])
    return bundle


def _print_summary(problem, inst, results, verdict, out, comp) -> None:
    print(f"\n=== {problem.id} / {inst.id} === lane={verdict.lane}  ({out})")
    if verdict.reasons:
        print("    not-live:", "; ".join(verdict.reasons))
    for r in results:
        print(f"  [{r.paradigm:16}] {r.solver:20} {r.framework:18} "
              f"value={r.value}  cost={r.cost}")
    text = comp.get("verdict", {}).get("en")
    if text:
        print("  ->", text)


def main(argv=None) -> None:
    # Windows consoles default to cp1252; the bilingual summaries contain UTF-8.
    for stream in (sys.stdout, sys.stderr):
        try:
            stream.reconfigure(encoding="utf-8")
        except Exception:  # noqa: BLE001
            pass
    ap = argparse.ArgumentParser(prog="data-pipeline/run.py", description="QLab precompute pipeline")
    ap.add_argument("case", nargs="?", help="case id (omit with --list)")
    ap.add_argument("--instance", help="instance/variant id (default: first)")
    ap.add_argument("--all", action="store_true", help="run every instance of the case")
    ap.add_argument("--solver", help="run only this solver name")
    ap.add_argument("--seed", type=int, default=42)
    ap.add_argument("--shots", type=int, default=2048)
    ap.add_argument("--list", action="store_true", help="list cases and exit")
    args = ap.parse_args(argv)

    if args.list or not args.case:
        print(f"QLab cases (engine qversus {qversus.__version__}):")
        for pid, cls in sorted(all_problems().items()):
            p = cls()
            print(f"  {pid:18} [{p.category:19}] {p.title['en']}  ({len(p.instances())} variants)")
        return

    problem = get_problem(args.case)
    targets = [i.id for i in problem.instances()] if args.all else [args.instance]
    for iid in targets:
        run_case(args.case, iid, seed=args.seed, shots=args.shots, only=args.solver)
