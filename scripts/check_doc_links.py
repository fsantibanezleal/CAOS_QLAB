"""Every relative link in the repository's Markdown resolves to a file or folder that exists.

Scans the Markdown files under the repository (not node_modules, not dist) for `](target)` links that are not
absolute URLs or pure anchors, and checks the target (without its #anchor) exists relative to the file.
Stdlib only. Usage: python scripts/check_doc_links.py
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SKIP = {"node_modules", "dist", ".venv", ".git", "manuscripts"}
LINK = re.compile(r"\]\(([^)\s]+)\)")


def problems(root: Path = ROOT) -> list[str]:
    errs = []
    for md in sorted(root.rglob("*.md")):
        if SKIP & set(md.relative_to(root).parts):
            continue
        text = md.read_text(encoding="utf-8")
        for m in LINK.finditer(re.sub(r"```.*?```", "", text, flags=re.S)):
            target = m.group(1)
            if re.match(r"^([a-z]+:|#)", target):
                continue
            path = target.split("#", 1)[0]
            if path and not (md.parent / path).exists():
                errs.append(f"{md.relative_to(root).as_posix()}: broken link {target}")
    return errs


def main() -> int:
    errs = problems()
    for e in errs:
        print(f"::error::{e}")
    if not errs:
        print("doc links: OK")
    return 1 if errs else 0


if __name__ == "__main__":
    sys.exit(main())
