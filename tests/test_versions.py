"""The version coherence check CI runs (scripts/check_versions.py), and that it fails on a mismatched copy."""

from __future__ import annotations

import importlib.util
import json
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
_spec = importlib.util.spec_from_file_location("check_versions", ROOT / "scripts" / "check_versions.py")
check_versions = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(check_versions)


def _copy(tmp_path: Path) -> Path:
    for name in ("VERSION", "CHANGELOG.md", "README.md"):
        shutil.copy(ROOT / name, tmp_path / name)
    (tmp_path / "web").mkdir()
    shutil.copy(ROOT / "web" / "package.json", tmp_path / "web" / "package.json")
    return tmp_path


def test_the_committed_versions_agree():
    assert check_versions.problems() == []


def test_a_mismatched_package_version_is_caught(tmp_path):
    root = _copy(tmp_path)
    pkg = json.loads((root / "web" / "package.json").read_text(encoding="utf-8"))
    pkg["version"] = "9.9.9"
    (root / "web" / "package.json").write_text(json.dumps(pkg), encoding="utf-8")
    assert any("web/package.json" in e for e in check_versions.problems(root))


def test_a_stale_readme_status_is_caught(tmp_path):
    root = _copy(tmp_path)
    readme = (root / "README.md").read_text(encoding="utf-8")
    version = (root / "VERSION").read_text(encoding="utf-8").strip()
    (root / "README.md").write_text(readme.replace(f"v{version},", "v0.00.001,", 1), encoding="utf-8")
    assert any("README" in e for e in check_versions.problems(root))
