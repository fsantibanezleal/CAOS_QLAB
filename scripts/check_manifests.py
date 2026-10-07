"""ADR-0054 anti-mislabel gate: every committed manifest's lane is what the measured gate says, and it points at
its artifact.

For each manifests/<case>__<variant>.json: re-run classify_lane() on the stored measured numbers and fail if
the recorded lane disagrees; check that trace_path exists under data/artifacts/ and that the artifact is the
same case, variant and lane. A mislabeled or stale manifest cannot ship. No engine needed (the gate is pure
Python), so CI runs it after a plain install.
Usage: python scripts/check_manifests.py
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "data-pipeline"))

from pipeline.gate import classify_lane  # noqa: E402

MIN_MANIFESTS = 100


def problems(root: Path = ROOT) -> list[str]:
    paths = sorted((root / "manifests").glob("*.json"))
    errs = [] if len(paths) >= MIN_MANIFESTS else [f"expected the full manifest set, found {len(paths)}"]
    for path in paths:
        m = json.loads(path.read_text(encoding="utf-8"))
        name = path.name
        measured = m["measured"]
        verdict = classify_lane(qubits=m["qubits"], run_ms=measured["run_ms"],
                                trace_bytes=measured["trace_bytes"], unitary_only=measured["unitary_only"])
        if verdict.lane != m["lane"]:
            errs.append(f"{name}: lane {m['lane']!r} but the gate says {verdict.lane!r} on {measured} "
                        f"(qubits={m['qubits']}); reasons={verdict.reasons}")
        art = root / "data" / "artifacts" / m["trace_path"]
        if not art.is_file():
            errs.append(f"{name}: trace_path {m['trace_path']} does not exist")
            continue
        b = json.loads(art.read_text(encoding="utf-8"))
        variant = name.removesuffix(".json").split("__", 1)[1]
        if (b["case_id"], b["instance"]["id"], b["lane"]) != (m["case_id"], variant, m["lane"]):
            errs.append(f"{name}: artifact says {(b['case_id'], b['instance']['id'], b['lane'])}")
    return errs


def main() -> int:
    errs = problems()
    for e in errs:
        print(f"::error::{e}")
    if not errs:
        print(f"manifests: OK ({len(list((ROOT / 'manifests').glob('*.json')))} clear the gate and match their artifacts)")
    return 1 if errs else 0


if __name__ == "__main__":
    sys.exit(main())
