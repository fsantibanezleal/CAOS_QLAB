"""The per-case manifest, the second data contract (pipeline -> web index).

One manifest per (case, variant) records the lane VERDICT and the measured numbers behind it, the seed and
params that reproduce the trace, the viz bindings the web app uses to pick renderers, the framework that
authored the trace, and the engine package and app version that produced it. The web app reads the set of
manifests as its catalog; CI validates that every "live" manifest actually clears the gate.
"""

from __future__ import annotations

from dataclasses import asdict, dataclass, field

MANIFEST_VERSION = "qlab-manifest/2"


@dataclass
class Manifest:
    case_id: str
    title: dict[str, str]          # bilingual
    category: str
    lane: str                      # "live" | "precompute"
    lane_reasons: list[str]        # why not live (empty when live)
    qubits: int
    seed: int
    shots: int
    params: dict
    measured: dict                 # {run_ms, trace_bytes, unitary_only}
    viz: list[str]                 # renderer keys: bloch | amp_phase | histogram | qsphere | density | circuit | curve | graph
    engine: str                    # the framework that authored the trace: "qiskit-aer" | "pennylane" | "stim" | ...
    engine_version: str            # that framework's version
    engine_package: dict           # {"package": "qversus", "version": "<X.XX.XXX>"}
    app_version: str               # QLab's VERSION at bake time
    trace_path: str                # relative to data/artifacts/
    references: list[dict] = field(default_factory=list)
    manifest_version: str = MANIFEST_VERSION

    def to_dict(self) -> dict:
        return asdict(self)
