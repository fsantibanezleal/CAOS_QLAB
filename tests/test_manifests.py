"""Committed-manifest integrity (ADR-0054 anti-mislabeling guarantee).

Every committed manifest records a measured lane verdict. This test re-runs `classify_lane()` on each
manifest's stored measured numbers and fails if the recorded `lane` disagrees — so a mislabeled or stale
`live`/`precompute` manifest CANNOT ship. Runs in the normal `pytest` CI step (no extra workflow needed).
"""

from __future__ import annotations

import glob
import io
import json

import pytest

from qlab.core.gate import classify_lane

MANIFESTS = sorted(glob.glob("manifests/*.json"))
_IDS = [p.replace("\\", "/").split("/")[-1] for p in MANIFESTS]


def test_manifests_present():
    assert len(MANIFESTS) >= 100, f"expected the full committed manifest set, found {len(MANIFESTS)}"


@pytest.mark.parametrize("path", MANIFESTS, ids=_IDS)
def test_manifest_lane_matches_classify_lane(path):
    with io.open(path, encoding="utf-8") as f:
        m = json.load(f)
    measured = m["measured"]
    verdict = classify_lane(
        qubits=m["qubits"],
        run_ms=measured["run_ms"],
        trace_bytes=measured["trace_bytes"],
        unitary_only=measured["unitary_only"],
    )
    assert verdict.lane == m["lane"], (
        f"{path}: stored lane={m['lane']!r} but classify_lane() says {verdict.lane!r} "
        f"on measured {measured} (qubits={m['qubits']}); reasons={verdict.reasons}"
    )
