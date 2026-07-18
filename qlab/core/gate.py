"""The measured live-vs-precompute gate (the QLab analogue of SimLab's 4-gate rule).

A case runs in the browser LIVE lane only if the in-browser exact state-vector simulator (a purpose-built
TypeScript engine, web/src/live/statevector.ts) can reproduce it responsively and honestly:

  1. qubits  <= LIVE_MAX_QUBITS   — 2**n amplitudes must stay interactive (~12 q ≈ 64 MB)
  2. unitary-only                 — no realistic NOISE model (needs Aer), no mid-circuit measurement +
                                    classical feed-forward (teleportation/QEC), no optimization loop
  3. run_ms  <= LIVE_RUN_MS       — measured offline as a proxy for browser responsiveness
  4. trace_bytes <= LIVE_TRACE_BYTES

Otherwise the case is PRECOMPUTED: authored offline with the real engine (Qiskit + Aer / PennyLane /
Stim) and the committed trace is replayed. The verdict + the measured numbers are recorded in the
manifest, and CI fails the build if a "live"-tagged case breaches a gate — so mislabeling cannot ship.
Both lanes render through ONE web code path; "live" means slider-responsiveness, not a different model.
"""

from __future__ import annotations

from dataclasses import dataclass

LIVE_MAX_QUBITS = 12            # 2**12 = 4096 amplitudes — instant in JS; >12 q → precompute
LIVE_RUN_MS = 1500             # offline build time proxy for browser responsiveness
LIVE_TRACE_BYTES = 1_000_000   # ~1 MB committed trace ceiling for the live lane


@dataclass
class LaneVerdict:
    lane: str                  # "live" | "precompute"
    reasons: list[str]         # why it is NOT live (empty when live)
    qubits: int
    run_ms: float
    trace_bytes: int
    unitary_only: bool


def classify_lane(
    *,
    qubits: int,
    run_ms: float,
    trace_bytes: int,
    unitary_only: bool,
) -> LaneVerdict:
    """Decide the lane from MEASUREMENTS, not from taste."""
    reasons: list[str] = []
    if qubits > LIVE_MAX_QUBITS:
        reasons.append(f"{qubits} qubits > {LIVE_MAX_QUBITS} (statevector too large for responsive JS)")
    if not unitary_only:
        reasons.append("needs noise / mid-circuit feed-forward / optimization loop (offline engine only)")
    if run_ms > LIVE_RUN_MS:
        reasons.append(f"run {run_ms:.0f} ms > {LIVE_RUN_MS} ms")
    if trace_bytes > LIVE_TRACE_BYTES:
        reasons.append(f"trace {trace_bytes} B > {LIVE_TRACE_BYTES} B")
    lane = "live" if not reasons else "precompute"
    return LaneVerdict(
        lane=lane,
        reasons=reasons,
        qubits=qubits,
        run_ms=run_ms,
        trace_bytes=trace_bytes,
        unitary_only=unitary_only,
    )
