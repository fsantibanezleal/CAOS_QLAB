"""Committed-manifest integrity (ADR-0054): the same check CI runs (scripts/check_manifests.py), plus a negative
case so the check is known to fail when a manifest is mislabeled."""

from __future__ import annotations

import importlib.util
import json
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
_spec = importlib.util.spec_from_file_location("check_manifests", ROOT / "scripts" / "check_manifests.py")
check_manifests = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(check_manifests)


def test_every_committed_manifest_clears_the_gate_and_matches_its_artifact():
    assert check_manifests.problems() == []


def test_a_mislabeled_manifest_is_caught(tmp_path):
    shutil.copytree(ROOT / "manifests", tmp_path / "manifests")
    shutil.copytree(ROOT / "data" / "artifacts", tmp_path / "data" / "artifacts")
    victim = tmp_path / "manifests" / "maxcut__square.json"
    m = json.loads(victim.read_text(encoding="utf-8"))
    m["lane"] = "live" if m["lane"] == "precompute" else "precompute"
    victim.write_text(json.dumps(m), encoding="utf-8")
    errs = check_manifests.problems(tmp_path)
    assert any("maxcut__square.json" in e and "gate says" in e for e in errs), errs
