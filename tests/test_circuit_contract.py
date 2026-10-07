"""The circuit contract (pipeline/circuit.py, the same gates.json the web engine reads) and its effect on the lane."""

from __future__ import annotations

import math

import pytest

from pipeline.circuit import LIVE_GATES, live_violations, state_violations, structure_violations
from pipeline.gate import classify_lane


def op(gate, targets, params=()):
    return {"gate": gate, "targets": list(targets), "params": list(params)}


def test_a_valid_circuit_has_no_violations():
    assert live_violations([op("h", [0]), op("cx", [0, 1]), op("rz", [1], [0.3]), op("mcx", [0, 1, 2])], 3) == []


@pytest.mark.parametrize("ops, n, needle", [
    ([op("prepare_w", [0, 1, 2])], 3, "not a live gate"),
    ([op("cx", [0])], 2, "1 qubits, needs 2..2"),
    ([op("h", [3])], 3, "out of range"),
    ([op("cz", [1, 1])], 2, "repeated qubit"),
    ([op("rx", [0])], 1, "0 params, needs 1"),
    ([op("rx", [0], [math.nan])], 1, "non-finite"),
    ([op("h", [0])], 13, "13 qubits > 12"),
])
def test_each_kind_of_violation_is_named(ops, n, needle):
    assert any(needle in v for v in live_violations(ops, n)), live_violations(ops, n)


def test_structure_is_checked_for_every_trace_even_outside_the_live_set():
    assert structure_violations([op("c-unitary", [0, 1, 2, 3, 4])], 5) == []
    assert structure_violations([op("c-unitary", [0, 5])], 5) == ["op 0 c-unitary: qubit out of range 0..4"]


def test_a_circuit_outside_the_contract_is_precompute_whatever_its_measurements():
    v = classify_lane(qubits=3, run_ms=1.0, trace_bytes=100, unitary_only=True,
                      live_violations=["op 0 prepare_W: not a live gate"])
    assert v.lane == "precompute"
    assert v.reasons == ["circuit outside the live engine's contract: op 0 prepare_W: not a live gate"]


def test_the_contract_covers_every_gate_the_engine_dispatches():
    # web/src/live/statevector.ts applyOp handles exactly these (single-qubit matrices + the multi-qubit cases).
    engine = {"h", "x", "y", "z", "s", "sdg", "t", "tdg", "rx", "ry", "rz", "p", "u1", "cx", "cnot", "ccx",
              "mcx", "cz", "cp", "cu1", "rzz", "swap", "barrier", "id", "i"}
    assert set(LIVE_GATES) == engine


def test_a_physical_state_passes_and_a_broken_one_is_named():
    bell = {"probabilities": [0.5, 0, 0, 0.5], "statevector": [
        {"re": 0.707107, "im": 0}, {"re": 0, "im": 0}, {"re": 0, "im": 0}, {"re": 0.707107, "im": 0}]}
    assert state_violations([bell]) == []
    leaky = {"probabilities": [0.5, 0, 0, 0.4], "statevector": []}
    assert state_violations([bell, leaky]) == ["step 1: probabilities sum to 0.9"]
    wrong = {"probabilities": [0.5, 0, 0, 0.5], "statevector": [
        {"re": 1, "im": 0}, {"re": 0, "im": 0}, {"re": 0, "im": 0}, {"re": 0, "im": 0}]}
    assert state_violations([wrong]) == ["step 0: probabilities are not the squared amplitude moduli"]
