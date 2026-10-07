"""Trace-schema drift: the Python trace (qversus.core.trace) and its TypeScript mirror (web/src/lib/contract.types.ts)
must declare the same fields. The web's own test checks the committed records against the TS types; this one
checks the producer's schema, so a field renamed in the engine fails before any record is baked."""

from __future__ import annotations

import dataclasses
import re
from pathlib import Path

from qversus.core.trace import Step, Trace

TS = (Path(__file__).resolve().parents[1] / "web" / "src" / "lib" / "contract.types.ts").read_text(encoding="utf-8")


def ts_fields(name: str, source: str = TS) -> set[str]:
    m = re.search(rf"export interface {name} \{{(.*?)\n\}}", source, re.S)
    assert m, f"interface {name} not in contract.types.ts"
    return set(re.findall(r"^\s{2}(\w+)\??:", m.group(1), re.M))


def drift(source: str = TS) -> list[str]:
    out = []
    for cls in (Trace, Step):
        py = {f.name for f in dataclasses.fields(cls)}
        ts = ts_fields(cls.__name__, source)
        if py != ts:
            out.append(f"{cls.__name__}: only in Python {sorted(py - ts)}, only in TS {sorted(ts - py)}")
    return out


def test_the_python_trace_and_the_typescript_mirror_agree():
    assert drift() == []


def test_a_renamed_field_is_caught():
    renamed = TS.replace("  probabilities: number[];", "  probs: number[];", 1)
    assert renamed != TS
    assert drift(renamed) == ["Step: only in Python ['probabilities'], only in TS ['probs']"]
