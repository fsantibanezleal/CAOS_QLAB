"""qlab.core — the pure-Python engine substrate (no quantum SDK imported here).

- rng:      seeded RNG so a run is a pure function of (params, seed).
- trace:    the quantum trace schema (the artifact contract the web app replays).
- gate:     the measured live-vs-precompute classifier.
- manifest: the per-case manifest schema.
"""

from qlab.core.rng import make_rng
from qlab.core.trace import SCHEMA_VERSION, Step, Trace, amp
from qlab.core.gate import LIVE_MAX_QUBITS, LIVE_RUN_MS, LIVE_TRACE_BYTES, classify_lane
from qlab.core.manifest import Manifest

__all__ = [
    "make_rng",
    "SCHEMA_VERSION",
    "Step",
    "Trace",
    "amp",
    "LIVE_MAX_QUBITS",
    "LIVE_RUN_MS",
    "LIVE_TRACE_BYTES",
    "classify_lane",
    "Manifest",
]
