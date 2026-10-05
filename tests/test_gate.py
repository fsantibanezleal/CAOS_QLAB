"""The measured live-vs-precompute gate (product tooling, pure Python)."""

from __future__ import annotations

from pipeline.gate import LIVE_MAX_QUBITS, LIVE_RUN_MS, LIVE_TRACE_BYTES, classify_lane


def test_gate_live_for_small_unitary():
    v = classify_lane(qubits=2, run_ms=5.0, trace_bytes=10_000, unitary_only=True)
    assert v.lane == "live" and v.reasons == []


def test_gate_precompute_when_too_many_qubits_or_noisy():
    assert classify_lane(qubits=LIVE_MAX_QUBITS + 1, run_ms=1, trace_bytes=1, unitary_only=True).lane == "precompute"
    assert classify_lane(qubits=2, run_ms=1, trace_bytes=1, unitary_only=False).lane == "precompute"


def test_gate_names_every_breached_limit():
    v = classify_lane(qubits=LIVE_MAX_QUBITS + 1, run_ms=LIVE_RUN_MS + 1, trace_bytes=LIVE_TRACE_BYTES + 1,
                      unitary_only=False)
    assert v.lane == "precompute" and len(v.reasons) == 4


def test_gate_limits_are_inclusive():
    v = classify_lane(qubits=LIVE_MAX_QUBITS, run_ms=LIVE_RUN_MS, trace_bytes=LIVE_TRACE_BYTES, unitary_only=True)
    assert v.lane == "live"
