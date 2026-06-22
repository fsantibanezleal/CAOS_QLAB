"""The per-case manifest — the second data contract (pipeline → web index).

One manifest per case records the lane VERDICT and the measured numbers behind it, the seed + params
that reproduce the trace, the viz bindings the web app uses to pick renderers, and the engine
provenance. The web app reads the set of manifests as its catalog; CI validates that every "live"
manifest actually clears the gate.
"""

from __future__ import annotations

import json
from dataclasses import asdict, dataclass, field
from pathlib import Path

MANIFEST_VERSION = "qlab-manifest/1"


@dataclass
class Manifest:
    case_id: str
    title: dict[str, str]          # bilingual
    category: str                  # see qlab.cases.registry CATEGORIES
    lane: str                      # "live" | "precompute"
    lane_reasons: list[str]        # why not live (empty when live)
    qubits: int
    seed: int
    shots: int
    params: dict
    measured: dict                 # {run_ms, trace_bytes, unitary_only}
    viz: list[str]                 # renderer keys: bloch | amp_phase | histogram | qsphere | density | circuit | curve | graph
    engine: str                    # "qiskit-aer" | "pennylane" | "stim" | "ibm-hardware:<backend>"
    engine_version: str
    trace_path: str                # relative to data/artifacts/
    references: list[dict] = field(default_factory=list)
    manifest_version: str = MANIFEST_VERSION

    def to_dict(self) -> dict:
        return asdict(self)

    def write_json(self, path: str | Path) -> Path:
        path = Path(path)
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps(self.to_dict(), indent=1, ensure_ascii=False), encoding="utf-8")
        return path
