"""No em-dash and no emoji in the text of the generated records (ADR-0067).

The archetype's content guard (check_content_standards.py) exempts data/ and manifests/ because records usually
carry text their sources wrote. QLab's records are different: every string in them is written by this
pipeline or the qversus engine and the App displays it, so it is product content. This scans every string
value in data/artifacts/**/*.json and manifests/*.json. Stdlib only.
Usage: python scripts/check_records_text.py
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BANNED = {0x2014, 0x2015}


def _bad(s: str) -> bool:
    return any(ord(c) in BANNED or 0x1F000 <= ord(c) <= 0x1FAFF or ord(c) == 0xFE0F for c in s)


def _strings(x, path=""):
    if isinstance(x, str):
        yield path, x
    elif isinstance(x, dict):
        for k, v in x.items():
            yield from _strings(v, f"{path}.{k}")
    elif isinstance(x, list):
        for i, v in enumerate(x):
            yield from _strings(v, f"{path}[{i}]")


def problems(root: Path = ROOT) -> list[str]:
    errs = []
    files = sorted((root / "data" / "artifacts").rglob("*.json")) + sorted((root / "manifests").glob("*.json"))
    for f in files:
        for where, s in _strings(json.loads(f.read_text(encoding="utf-8"))):
            if _bad(s):
                errs.append(f"{f.relative_to(root).as_posix()}{where}: {s[:80]!r}")
    return errs


def main() -> int:
    errs = problems()
    for e in errs[:50]:
        print(f"::error::{e}")
    if errs:
        print(f"{len(errs)} record text fields carry an em-dash or an emoji")
    else:
        print("records text: OK")
    return 1 if errs else 0


if __name__ == "__main__":
    sys.exit(main())
