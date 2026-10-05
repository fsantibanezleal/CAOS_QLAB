"""Product pipeline smoke: the orchestrator, the bundle and manifest it writes, and that re-running a committed
record with its recorded seed and shots reproduces it. The engine's own physics (every problem against its
closed form) is tested in the qversus repository.

The classical-only bake runs on the core install CI uses (qversus with NumPy only); the framework bakes skip
there and run where requirements-precompute.txt is installed.
"""

from __future__ import annotations

import json

import pytest
import qversus

from pipeline.build import ROOT, app_version, run_case
from pipeline.manifest import MANIFEST_VERSION

TIMING = {"wall_ms", "run_ms"}


def _strip(x):
    if isinstance(x, dict):
        return {k: _strip(v) for k, v in x.items() if k not in TIMING}
    if isinstance(x, list):
        return [_strip(v) for v in x]
    return x


def _committed(case: str, inst: str) -> dict:
    return json.loads((ROOT / "data" / "artifacts" / case / f"{inst}.json").read_text(encoding="utf-8"))


def _bake(tmp_path, case: str, inst: str, only: str | None = None):
    old = _committed(case, inst)
    bundle = run_case(case, inst, seed=old["seed"], shots=old["shots"], only=only,
                      artifacts=tmp_path / "artifacts", manifests=tmp_path / "manifests", quiet=True)
    return old, bundle


def test_classical_bake_writes_the_bundle_and_the_manifest(tmp_path):
    old, bundle = _bake(tmp_path, "deutsch-jozsa", "dj-bal-101", only="dj-classical")

    raw = (tmp_path / "artifacts" / "deutsch-jozsa" / "dj-bal-101.json").read_bytes()
    assert b"\r" not in raw
    assert json.loads(raw.decode("utf-8")) == bundle
    assert bundle["engine_package"] == {"package": "qversus", "version": qversus.__version__}
    assert bundle["app_version"] == app_version() == (ROOT / "VERSION").read_text(encoding="utf-8").strip()

    manifest = json.loads((tmp_path / "manifests" / "deutsch-jozsa__dj-bal-101.json").read_text(encoding="utf-8"))
    assert manifest["manifest_version"] == MANIFEST_VERSION
    assert manifest["engine_package"] == bundle["engine_package"]
    assert manifest["app_version"] == bundle["app_version"]
    assert manifest["trace_path"] == "deutsch-jozsa/dj-bal-101.json"
    assert manifest["lane"] == bundle["lane"]

    want = next(s for s in old["solvers"] if s["solver"] == "dj-classical")
    (got,) = bundle["solvers"]
    assert _strip(got["value"]) == _strip(want["value"])
    assert bundle["comparison"]["verdict"]["en"] and bundle["comparison"]["verdict"]["es"]


@pytest.mark.parametrize("case, inst", [
    ("state-prep", "bell-phi-plus"),
    ("bernstein-vazirani", "bv-101"),
    ("interference", "itf-pi2"),
    ("chsh", "chsh-optimal"),
])
def test_rebake_reproduces_the_committed_record(tmp_path, case, inst):
    pytest.importorskip("qiskit")
    old, new = _bake(tmp_path, case, inst)
    assert [s["solver"] for s in new["solvers"]] == [s["solver"] for s in old["solvers"]]
    for got, want in zip(new["solvers"], old["solvers"]):
        for key in ("value", "extra", "optimal", "framework", "paradigm"):
            assert _strip(got[key]) == _strip(want[key]), (got["solver"], key)
    for key in ("steps", "measurements", "circuit_ops"):
        assert new["trace"][key] == old["trace"][key], key
    assert new["lane"] == old["lane"]
