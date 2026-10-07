"""The documentation link check CI runs (scripts/check_doc_links.py), and that it catches a broken link."""

from __future__ import annotations

import importlib.util
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
_spec = importlib.util.spec_from_file_location("check_doc_links", ROOT / "scripts" / "check_doc_links.py")
check_doc_links = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(check_doc_links)


def test_every_relative_link_in_the_docs_resolves():
    assert check_doc_links.problems() == []


def test_a_broken_link_is_caught_and_urls_and_anchors_are_not(tmp_path):
    (tmp_path / "docs").mkdir()
    (tmp_path / "docs" / "a.md").write_text("[ok](./b.md) [anchor](#x) [web](https://example.org) [bad](./missing.md)\n",
                                            encoding="utf-8")
    (tmp_path / "docs" / "b.md").write_text("# b\n", encoding="utf-8")
    assert check_doc_links.problems(tmp_path) == ["docs/a.md: broken link ./missing.md"]
