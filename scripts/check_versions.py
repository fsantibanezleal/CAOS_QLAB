"""Version coherence: VERSION is the single source; every other place that states the version must agree.

Checks VERSION (display form X.XX.XXX), web/package.json (its semver form, e.g. 0.34.002 -> 0.34.2), the newest
CHANGELOG heading, and the README status line. The footer reads VERSION at build time, so it is not a copy.
Stdlib only. Usage: python scripts/check_versions.py [repo_dir]
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DISPLAY = re.compile(r"^\d+\.\d{2}\.\d{3}$")


def problems(root: Path = ROOT) -> list[str]:
    version = (root / "VERSION").read_text(encoding="utf-8").strip()
    if not DISPLAY.match(version):
        return [f"VERSION {version!r} is not in the X.XX.XXX display form"]
    semver = ".".join(str(int(p)) for p in version.split("."))
    errs = []

    pkg = json.loads((root / "web" / "package.json").read_text(encoding="utf-8"))["version"]
    if pkg != semver:
        errs.append(f"web/package.json version {pkg} != {semver} (VERSION {version})")

    head = re.search(r"^## \[([^\]]+)\]", (root / "CHANGELOG.md").read_text(encoding="utf-8"), re.M)
    if not head or head.group(1) != version:
        errs.append(f"newest CHANGELOG heading {head.group(1) if head else None!r} != VERSION {version}")

    status = re.search(r"^> \*\*Status:\*\* v(\S+?),", (root / "README.md").read_text(encoding="utf-8"), re.M)
    if not status or status.group(1) != version:
        errs.append(f"README status line {status.group(1) if status else None!r} != VERSION {version}")
    return errs


def main() -> int:
    errs = problems(Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else ROOT)
    for e in errs:
        print(f"::error::{e}")
    if not errs:
        print("versions: OK")
    return 1 if errs else 0


if __name__ == "__main__":
    sys.exit(main())
