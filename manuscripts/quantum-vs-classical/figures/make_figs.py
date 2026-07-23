#!/usr/bin/env python3
"""Regenerate the figures for the QLab quantum-vs-classical report from the COMMITTED benchmark artifact
(produced by aggregate.py over the 119 committed traces). Two figures:

  fig-walltime.pdf   - per-problem wall-time, classical vs the best quantum framework (a dumbbell on a log
                       axis): classical is faster on all 20 problems at lab scale.
  fig-phenomena.pdf  - the genuine quantum phenomena that are real but do not yet beat classical wall-time:
                       (a) the CHSH value across its variants against the classical and Tsirelson bounds;
                       (b) Grover query counts, quantum vs classical (the asymptotic quadratic advantage).

Run:  python make_figs.py
Deps: matplotlib, numpy.
"""
from __future__ import annotations

import json
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np

HERE = Path(__file__).resolve().parent
DATA = HERE.parent / "data"

INK = "#1a1a2e"
GRID = "#d8d8e0"
CLA = "#3fa34d"
QUA = "#1b6ca8"

plt.rcParams.update({
    "font.family": "serif", "font.size": 9.4, "axes.edgecolor": INK,
    "axes.labelcolor": INK, "text.color": INK, "xtick.color": INK, "ytick.color": INK,
    "axes.linewidth": 0.8, "figure.dpi": 200,
})

FLOOR = 5e-4    # ms floor for the log axis (some classical wall-times record 0.0)


def fig_walltime():
    d = json.loads((DATA / "bench_summary.json").read_text(encoding="utf-8"))
    cases = [c for c in d["cases"] if c["classical_wall_ms"] is not None and c["quantum_wall_ms"] is not None]
    cases.sort(key=lambda c: c["quantum_wall_ms"])
    labels = [c["case"] for c in cases]
    cw = [max(c["classical_wall_ms"], FLOOR) for c in cases]
    qw = [max(c["quantum_wall_ms"], FLOOR) for c in cases]
    y = np.arange(len(cases))
    fig, ax = plt.subplots(figsize=(6.6, 5.0))
    for yi, a, b in zip(y, cw, qw):
        ax.plot([a, b], [yi, yi], color="#b9b9c6", linewidth=1.3, zorder=1)
    ax.scatter(cw, y, s=34, color=CLA, edgecolor=INK, linewidth=0.5, zorder=3, label="classical baseline")
    ax.scatter(qw, y, s=34, color=QUA, edgecolor=INK, linewidth=0.5, zorder=3, label="best quantum framework")
    ax.set_xscale("log")
    ax.set_yticks(y)
    ax.set_yticklabels(labels, fontsize=8.0)
    ax.set_xlabel("wall-time per solve (ms, log scale)")
    ax.set_title("classical wins wall-time on all 20 problems (lab scale)", fontsize=9.6)
    ax.grid(axis="x", color=GRID, linewidth=0.7, zorder=0)
    ax.set_axisbelow(True)
    ax.legend(fontsize=8.0, frameon=True, facecolor="white", edgecolor=GRID, loc="lower right")
    for s in ("top", "right"):
        ax.spines[s].set_visible(False)
    fig.tight_layout()
    fig.savefig(HERE / "fig-walltime.pdf", bbox_inches="tight")
    plt.close(fig)


def fig_phenomena():
    d = json.loads((DATA / "bench_summary.json").read_text(encoding="utf-8"))
    chsh = d["chsh"]
    grover = d["grover"]
    fig, (axa, axb) = plt.subplots(1, 2, figsize=(7.0, 3.1))

    # (a) CHSH S across variants
    names = [c["variant"] for c in chsh]
    S = [c["S"] for c in chsh]
    cols = ["#1b6ca8" if c["exceeds"] else "#c7c7c7" for c in chsh]
    x = np.arange(len(names))
    axa.bar(x, S, color=cols, edgecolor=INK, linewidth=0.6, width=0.66, zorder=3)
    axa.axhline(2.0, color="#b23a48", linewidth=1.3, linestyle="--", label="classical bound = 2")
    axa.axhline(2 * np.sqrt(2), color="#2f7d3a", linewidth=1.2, linestyle=":", label="Tsirelson = 2$\\sqrt{2}$")
    axa.set_xticks(x); axa.set_xticklabels(names, rotation=30, ha="right", fontsize=7.4)
    axa.set_ylabel("CHSH value $S$")
    axa.set_ylim(0, 3.1)
    axa.set_title("(a) CHSH: quantum genuinely\nviolates the classical bound", fontsize=8.4)
    axa.grid(axis="y", color=GRID, linewidth=0.7, zorder=0)
    axa.set_axisbelow(True)
    axa.legend(fontsize=7.0, frameon=True, facecolor="white", edgecolor=GRID, loc="lower left")
    for s in ("top", "right"):
        axa.spines[s].set_visible(False)

    # (b) Grover query counts
    gv = [g["variant"] for g in grover]
    qq = [g["quantum_queries"] for g in grover]
    cq = [g["classical_queries"] for g in grover]
    x = np.arange(len(gv)); w = 0.38
    axb.bar(x - w / 2, cq, w, color=CLA, edgecolor=INK, linewidth=0.6, label="classical queries (~N/2)")
    axb.bar(x + w / 2, qq, w, color=QUA, edgecolor=INK, linewidth=0.6, label="quantum queries (~$\\sqrt{N}$)")
    axb.set_xticks(x); axb.set_xticklabels(gv, rotation=30, ha="right", fontsize=7.4)
    axb.set_ylabel("oracle queries")
    axb.set_title("(b) Grover: fewer queries\n(asymptotic, not wall-time)", fontsize=8.4)
    axb.grid(axis="y", color=GRID, linewidth=0.7, zorder=0)
    axb.set_axisbelow(True)
    axb.legend(fontsize=7.0, frameon=True, facecolor="white", edgecolor=GRID, loc="upper left")
    for s in ("top", "right"):
        axb.spines[s].set_visible(False)

    fig.tight_layout()
    fig.savefig(HERE / "fig-phenomena.pdf", bbox_inches="tight")
    plt.close(fig)


def main():
    fig_walltime()
    fig_phenomena()
    print("wrote fig-walltime.pdf, fig-phenomena.pdf")


if __name__ == "__main__":
    main()
