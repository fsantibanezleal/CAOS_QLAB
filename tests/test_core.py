"""Core engine tests — pure-Python, no quantum SDK (so they run even in the live-thin env)."""

from __future__ import annotations

import numpy as np

from qlab.core.gate import LIVE_MAX_QUBITS, classify_lane
from qlab.core.rng import sample_counts
from qlab.core.trace import SCHEMA_VERSION, Step, Trace, amp


def test_amp_rounds_complex():
    a = amp(0.7071067811 + 0j)
    assert a == {"re": 0.707107, "im": 0.0}


def test_sample_counts_is_seed_deterministic():
    probs = np.array([0.5, 0.0, 0.0, 0.5])  # Bell Φ+: only 00 and 11
    c1 = sample_counts(probs, shots=1000, seed=42)
    c2 = sample_counts(probs, shots=1000, seed=42)
    assert c1 == c2
    assert set(c1) <= {"00", "11"}
    assert sum(c1.values()) == 1000


def test_gate_live_for_small_unitary():
    v = classify_lane(qubits=2, run_ms=5.0, trace_bytes=10_000, unitary_only=True)
    assert v.lane == "live" and v.reasons == []


def test_gate_precompute_when_too_many_qubits_or_noisy():
    assert classify_lane(qubits=LIVE_MAX_QUBITS + 1, run_ms=1, trace_bytes=1, unitary_only=True).lane == "precompute"
    assert classify_lane(qubits=2, run_ms=1, trace_bytes=1, unitary_only=False).lane == "precompute"


def test_trace_roundtrip_and_bytes():
    step = Step(0, "init", [], {"en": "x", "es": "x"}, [amp(1 + 0j)], [[0.0, 0.0, 1.0]], [1.0])
    tr = Trace(case_id="t", title={"en": "T", "es": "T"}, concept={"en": "", "es": ""}, qubits=1,
               steps=[step], measurements={"counts": {"0": 10}, "shots": 10}, circuit_ops=[],
               provenance={"engine": "x", "engine_version": "0", "seed": 42, "lane": "live", "ran_on": "sim"})
    d = tr.to_dict()
    assert d["schema_version"] == SCHEMA_VERSION
    assert tr.nbytes() > 0
