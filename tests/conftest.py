"""The precompute tooling is invoked by path (data-pipeline/run.py), so the tests put data-pipeline/ on sys.path
the same way running that file does; QLab installs no package of its own."""

import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / "data-pipeline"))
