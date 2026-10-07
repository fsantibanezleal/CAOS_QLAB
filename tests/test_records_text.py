"""The records-text check CI runs (scripts/check_records_text.py), and that it catches an em-dash."""

from __future__ import annotations

import importlib.util
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
_spec = importlib.util.spec_from_file_location("check_records_text", ROOT / "scripts" / "check_records_text.py")
check_records_text = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(check_records_text)


def test_the_committed_records_carry_no_em_dash_or_emoji():
    assert check_records_text.problems() == []


def test_an_em_dash_in_a_nested_text_field_is_caught(tmp_path):
    (tmp_path / "data" / "artifacts" / "x").mkdir(parents=True)
    (tmp_path / "manifests").mkdir()
    record = {"title": {"en": "fine", "es": "bien"}, "solvers": [{"notes": {"en": "a \u2014 b"}}]}
    (tmp_path / "data" / "artifacts" / "x" / "v.json").write_text(json.dumps(record), encoding="utf-8")
    errs = check_records_text.problems(tmp_path)
    assert len(errs) == 1 and ".solvers[0].notes.en" in errs[0]
