"""The precompute pipeline (CLI). Framework-agnostic orchestrator: it asks the registry for the solvers
applicable to a case, runs them uniformly, bundles their results into one committed JSON artifact per
(case, instance), classifies the live/precompute lane from measurements, and writes a manifest.

Usage:
    python -m qlab.pipeline --list
    python -m qlab.pipeline maxcut                      # default (first) instance, all applicable solvers
    python -m qlab.pipeline maxcut --instance pentagon --seed 7
    python -m qlab.pipeline maxcut --all                # every instance (the full variant-bar)
    python -m qlab.pipeline state-prep --solver state-qiskit
"""

from __future__ import annotations

import argparse
import json
import time
from pathlib import Path

from qlab.core.gate import classify_lane
from qlab.core.manifest import Manifest
from qlab.core.trace import SCHEMA_VERSION
from qlab.registry import all_problems, get_problem, solvers_for

ROOT = Path(__file__).resolve().parent.parent
ARTIFACTS = ROOT / "data" / "artifacts"
MANIFESTS = ROOT / "manifests"

# Which renderers the web app should mount for a category (viz bindings — the manifest's `viz`).
VIZ_BY_CATEGORY = {
    "fundamentals": ["bloch", "amp_phase", "histogram", "circuit"],
    "entanglement": ["amp_phase", "histogram", "qsphere", "circuit"],
    "oracle-algorithms": ["amp_phase", "histogram", "circuit"],
    "flagship-algorithms": ["amp_phase", "histogram", "circuit"],
    "variational": ["graph", "landscape", "histogram", "circuit"],
    "noise-and-qec": ["histogram", "density", "circuit"],
    "compilation": ["circuit"],
}


def _comparison(problem, results: list) -> dict:
    """Best classical vs best quantum + the honest verdict (bilingual)."""
    if problem.id == "maxcut":
        cls = [r for r in results if r.paradigm == "classical"]
        qnt = [r for r in results if r.paradigm != "classical"]
        best_cls = max(cls, key=lambda r: r.value["cut"]) if cls else None
        best_qnt = max(qnt, key=lambda r: r.value["cut"]) if qnt else None
        opt = best_cls.value["cut"] if best_cls else None
        q = best_qnt.value["cut"] if best_qnt else None
        ms_cls = best_cls.cost.get("wall_ms") if best_cls else None
        verdict_en = (
            f"Exact classical brute force found the optimum cut = {opt} in {ms_cls} ms. "
            f"QAOA (p=1) reached cut = {q}. At this scale the classical optimum is instant and QAOA does "
            f"not win — the honest, expected result."
        )
        verdict_es = (
            f"La fuerza bruta clásica exacta halló el corte óptimo = {opt} en {ms_cls} ms. "
            f"QAOA (p=1) alcanzó corte = {q}. A esta escala el óptimo clásico es instantáneo y QAOA no "
            f"gana — el resultado honesto y esperado."
        )
        return {"optimal_cut": opt, "qaoa_cut": q, "verdict": {"en": verdict_en, "es": verdict_es}}
    if problem.id == "teleportation":
        q = next((r for r in results if r.paradigm != "classical"), None)
        cls = next((r for r in results if r.paradigm == "classical"), None)
        f = q.value.get("fidelity") if q else None
        cf = cls.value.get("best_fidelity") if cls else None
        return {"quantum_fidelity": f, "classical_fidelity": cf, "verdict": {
            "en": f"Teleportation transfers the unknown qubit with fidelity {f} (perfect), vs the best "
                  f"classical measure-and-resend fidelity {cf} (2/3). A genuine quantum protocol with no "
                  f"classical equivalent — but it needs a pre-shared Bell pair AND 2 classical bits, it "
                  f"destroys the original (no-cloning), and it is NOT faster-than-light.",
            "es": f"La teletransportación transfiere el qubit desconocido con fidelidad {f} (perfecta), vs la "
                  f"mejor fidelidad clásica de medir-y-reenviar {cf} (2/3). Un protocolo cuántico genuino sin "
                  f"equivalente clásico — pero necesita un par de Bell compartido Y 2 bits clásicos, destruye "
                  f"el original (no-clonación), y NO es más rápido que la luz."}}
    if problem.id == "chsh":
        q = next((r for r in results if r.paradigm != "classical"), None)
        S = q.value.get("S") if q else None
        exceeds = q.value.get("exceeds_classical") if q else None
        tsi = q.value.get("tsirelson_bound") if q else None
        viol_en = "Quantum VIOLATES the classical bound" if exceeds else "No violation here"
        viol_es = "Lo cuántico VIOLA la cota clásica" if exceeds else "Sin violación aquí"
        return {"S": S, "classical_bound": 2.0, "tsirelson_bound": tsi, "exceeds_classical": exceeds,
                "verdict": {
            "en": f"Quantum CHSH value S = {S} vs the classical local-hidden-variable bound 2 (Tsirelson "
                  f"max {tsi}). {viol_en} — and this is one of the FEW places quantum genuinely beats "
                  f"classical: it rules out local realism (2022 Nobel). But it is a nonlocality result, not "
                  f"a faster computation; and a separable state never violates it (entanglement is required).",
            "es": f"Valor CHSH cuántico S = {S} vs la cota clásica de variables ocultas locales 2 (máx de "
                  f"Tsirelson {tsi}). {viol_es} — y este es uno de los POCOS casos donde lo cuántico gana de "
                  f"verdad: descarta el realismo local (Nobel 2022). Pero es un resultado de no-localidad, "
                  f"no un cálculo más rápido; y un estado separable nunca la viola (se requiere entrelazamiento)."}}
    if problem.id == "qec-surface":
        q = next((r for r in results if r.paradigm != "classical"), None)
        ler = q.value.get("logical_error_rate") if q else None
        d = q.value.get("distance") if q else None
        nq = q.value.get("physical_qubits") if q else None
        p = q.value.get("physical_p") if q else None
        return {"logical_error_rate": ler, "distance": d, "physical_qubits": nq, "physical_p": p,
                "verdict": {
            "en": f"Rotated surface code distance-{d} ({nq} qubits) at p={p}: logical error {ler}. The honest "
                  f"lesson is in the variant-bar — BELOW the ~1% threshold the distance-5 code beats "
                  f"distance-3 (adding qubits helps), ABOVE it the distance-5 code is worse (more qubits = "
                  f"more failure modes). This is the regime Willow entered in 2024; a useful logical qubit is "
                  f"still ~1000 physical, and a useful machine needs thousands.",
            "es": f"Código de superficie rotado distancia-{d} ({nq} qubits) a p={p}: error lógico {ler}. La "
                  f"lección honesta está en la barra de variantes — BAJO el umbral del ~1% el código "
                  f"distancia-5 supera al distancia-3 (agregar qubits ayuda), SOBRE el umbral el distancia-5 "
                  f"es peor (más qubits = más modos de fallo). Es el régimen al que entró Willow en 2024; un "
                  f"qubit lógico útil son ~1000 físicos, y una máquina útil necesita miles."}}
    if problem.id == "qec-repetition":
        base = next((r for r in results if r.paradigm == "classical"), None)
        q = next((r for r in results if r.paradigm != "classical"), None)
        ler = q.value.get("logical_error_rate") if q else None
        d = q.value.get("distance") if q else None
        phys = base.value.get("physical_error_rate") if base else None
        wins = ler is not None and phys is not None and ler < phys
        return {"logical_error_rate": ler, "physical_error_rate": phys, "distance": d,
                "below_threshold": wins, "verdict": {
            "en": f"Distance-{d} repetition code: logical error {ler} vs an unprotected qubit's {phys}. "
                  f"{'Encoding WINS' if wins else 'Encoding does NOT help'} here — this is error CORRECTION "
                  f"(it scales: below threshold, more distance is better), unlike mitigation. Honest caveat: "
                  f"one logical qubit; useful fault tolerance needs ~1000s of logical qubits.",
            "es": f"Código de repetición distancia-{d}: error lógico {ler} vs {phys} de un qubit sin "
                  f"proteger. {'La codificación GANA' if wins else 'La codificación NO ayuda'} aquí — esto es "
                  f"CORRECCIÓN de errores (escala: bajo umbral, más distancia es mejor), a diferencia de la "
                  f"mitigación. Salvedad honesta: un qubit lógico; la tolerancia útil necesita ~miles."}}
    if problem.id == "noise":
        q = next((r for r in results if r.paradigm != "classical"), None)
        if q:
            ideal, noisy, mit = q.value["ideal"], q.value["noisy"], q.value["mitigated"]
            rn, rm = q.value["residual_noisy"], q.value["residual_mitigated"]
            return {"ideal": ideal, "noisy": noisy, "mitigated": mit, "verdict": {
                "en": f"Ideal ⟨Z₀Z₁⟩={ideal}, noisy={noisy} (error {rn}), ZNE-mitigated={mit} (error {rm}). "
                      f"Mitigation cut the error ~{round(rn / rm, 1) if rm else float('inf')}×. But ZNE's "
                      f"sampling cost grows exponentially with size, it is bias-reduction NOT correction, "
                      f"and a classical statevector simulator returns the exact {ideal} for free at this scale.",
                "es": f"Ideal ⟨Z₀Z₁⟩={ideal}, ruidoso={noisy} (error {rn}), mitigado-ZNE={mit} (error {rm}). "
                      f"La mitigación redujo el error ~{round(rn / rm, 1) if rm else float('inf')}×. Pero el "
                      f"costo de muestreo de ZNE crece exponencialmente, es reducción de sesgo NO corrección, "
                      f"y un simulador clásico de vector de estado da el {ideal} exacto gratis a esta escala."}}
        return {}
    if problem.id == "qml":
        cls = next((r for r in results if r.paradigm == "classical"), None)
        q = next((r for r in results if r.paradigm != "classical"), None)
        qa = q.value.get("test_acc") if q else None
        ca = cls.value.get("test_acc") if cls else None
        return {"quantum_test_acc": qa, "classical_test_acc": ca, "verdict": {
            "en": f"Quantum-kernel SVM test accuracy {qa} vs classical RBF-SVM {ca} on the same data. "
                  f"{'They tie' if qa == ca else 'Comparable'} — the quantum kernel shows no advantage. "
                  f"Provable quantum-kernel separations are contrived; on real data quantum kernels are "
                  f"competitive at best, usually worse. QML is over-hyped — here you see it honestly.",
            "es": f"Exactitud de test del SVM de kernel cuántico {qa} vs SVM-RBF clásico {ca} sobre los "
                  f"mismos datos. {'Empatan' if qa == ca else 'Comparables'} — el kernel cuántico no da "
                  f"ventaja. Las separaciones demostrables son artificiales; en datos reales los kernels "
                  f"cuánticos son competitivos en el mejor caso, usualmente peores. QML está sobrevalorado."}}
    if problem.id == "vqe":
        cls = next((r for r in results if r.paradigm == "classical"), None)
        q = next((r for r in results if r.paradigm != "classical"), None)
        eq = q.value.get("energy") if q else None
        ee = cls.value.get("energy") if cls else None
        err = abs(eq - ee) if (eq is not None and ee is not None) else None
        chem = err is not None and err < 1.6e-3
        return {"vqe_energy": eq, "exact_energy": ee, "error_ha": round(err, 6) if err is not None else None,
                "chemical_accuracy": chem, "verdict": {
            "en": f"VQE ground energy {eq} Ha vs exact (FCI) {ee} Ha — error {err:.2e} Ha "
                  f"({'within' if chem else 'outside'} chemical accuracy 1.6e-3). H₂ minimal-basis is a 4×4 "
                  f"matrix a laptop diagonalizes instantly, so VQE wins nothing here — it is pedagogy, and "
                  f"scaling it hits barren plateaus.",
            "es": f"Energía VQE {eq} Ha vs exacta (FCI) {ee} Ha — error {err:.2e} Ha "
                  f"({'dentro' if chem else 'fuera'} de la exactitud química 1.6e-3). H₂ en base mínima es "
                  f"una matriz 4×4 que un laptop diagonaliza al instante, así que VQE no gana nada aquí — es "
                  f"pedagogía, y escalarlo choca con mesetas áridas (barren plateaus)."}}
    if problem.id == "shor":
        cls = next((r for r in results if r.paradigm == "classical"), None)
        q = next((r for r in results if r.paradigm != "classical"), None)
        qf = q.value.get("factors") if q else None
        r = q.value.get("order") if q else None
        a = q.value.get("base") if q else None
        cf = cls.value.get("factors") if cls else None
        return {"quantum_factors": qf, "order": r, "classical_factors": cf, "verdict": {
            "en": f"Quantum order-finding (base a={a}) found order r={r} ⇒ factors {qf}; trial division "
                  f"found {cf} in microseconds. Both factor 15 trivially. The honest scale: RSA-2048 needs "
                  f"~10⁶ noisy physical qubits + full fault tolerance (Gidney 2025) — Shor is NOT a "
                  f"near-term cryptographic threat.",
            "es": f"El order-finding cuántico (base a={a}) halló orden r={r} ⇒ factores {qf}; la división de "
                  f"prueba halló {cf} en microsegundos. Ambos factorizan 15 trivialmente. La escala honesta: "
                  f"RSA-2048 necesita ~10⁶ qubits físicos ruidosos + tolerancia a fallos completa (Gidney "
                  f"2025) — Shor NO es una amenaza criptográfica de corto plazo."}}
    if problem.id == "qpe":
        cls = next((r for r in results if r.paradigm == "classical"), None)
        q = next((r for r in results if r.paradigm != "classical"), None)
        est = q.value.get("phi_estimate") if q else None
        err = q.value.get("error") if q else None
        tq = q.value.get("counting_qubits") if q else None
        exact = cls.value.get("phi_exact") if cls else None
        return {"phi_estimate": est, "phi_exact": exact, "error": err, "verdict": {
            "en": f"QPE (t={tq}) estimates φ̂={est} vs the exact φ={exact} (error {err}, resolution 2^-{tq}). "
                  f"Classically, diagonalizing this tiny U gives φ exactly and instantly — QPE earns its keep "
                  f"only when U is too large to diagonalize (e.g. e^{{iHt}} in Shor/chemistry).",
            "es": f"QPE (t={tq}) estima φ̂={est} vs el φ exacto={exact} (error {err}, resolución 2^-{tq}). "
                  f"Clásicamente, diagonalizar esta U minúscula da φ exacto e instantáneo — QPE gana solo "
                  f"cuando U es demasiado grande para diagonalizar (p.ej. e^{{iHt}} en Shor/química)."}}
    if problem.id == "qft":
        cls = next((r for r in results if r.paradigm == "classical"), None)
        q = next((r for r in results if r.paradigm != "classical"), None)
        fid = q.value.get("fidelity_vs_dft") if q else None
        gates = q.value.get("gate_count") if q else None
        ops = cls.cost.get("ops") if cls else None
        return {"fidelity_vs_dft": fid, "quantum_gates": gates, "classical_ops": ops, "verdict": {
            "en": f"The QFT matches the analytic DFT (fidelity {fid}). Quantum: {gates} gates (O(n²)) to "
                  f"apply the transform; classical FFT: ~{ops} ops (O(n·2ⁿ)) but it returns the FULL "
                  f"readable spectrum. The QFT is exponentially cheaper to APPLY yet unreadable on "
                  f"measurement — a subroutine (QPE/Shor), not a standalone speedup.",
            "es": f"La QFT coincide con la DFT analítica (fidelidad {fid}). Cuántico: {gates} compuertas "
                  f"(O(n²)) para aplicar la transformada; FFT clásica: ~{ops} ops (O(n·2ⁿ)) pero devuelve "
                  f"el espectro COMPLETO y legible. La QFT es exponencialmente más barata de APLICAR pero "
                  f"ilegible al medir — una subrutina (QPE/Shor), no un speedup por sí sola."}}
    if problem.id == "grover":
        cls = next((r for r in results if r.paradigm == "classical"), None)
        q = next((r for r in results if r.paradigm != "classical"), None)
        kq = cls.value.get("classical_queries") if cls else None
        qq = q.value.get("quantum_queries") if q else None
        sp = q.value.get("success_prob") if q else None
        return {"quantum_queries": qq, "classical_queries": kq, "success_prob": sp, "verdict": {
            "en": f"Quantum: {qq} Grover iteration(s) (~√N), P(marked)={sp}. Classical: {kq} queries to hit "
                  f"a marked item (~N/2 average). A quadratic speedup — but asymptotic; at this tiny N the "
                  f"classical scan is still instant and cheaper in wall-time.",
            "es": f"Cuántico: {qq} iteración(es) de Grover (~√N), P(marcado)={sp}. Clásico: {kq} consultas "
                  f"hasta un ítem marcado (~N/2 promedio). Speedup cuadrático — pero asintótico; a este N "
                  f"minúsculo el barrido clásico es instantáneo y más barato en tiempo."}}
    if problem.id == "simon":
        cls = next((r for r in results if r.paradigm == "classical"), None)
        q = next((r for r in results if r.paradigm != "classical"), None)
        s = (q or cls).value.get("recovered") if (q or cls) else None
        kq = cls.value.get("classical_queries") if cls else None
        qq = q.value.get("quantum_queries") if q else None
        return {"quantum_queries": qq, "classical_queries": kq, "verdict": {
            "en": f"Both recover the period s={s}. Quantum: O(n) = {qq} queries (sample y·s=0, GF(2) solve). "
                  f"Classical: {kq} queries to hit a collision (~2^(n/2) expected). The first provably "
                  f"exponential query separation — though at this tiny n the classical search is instant.",
            "es": f"Ambos recuperan el período s={s}. Cuántico: O(n) = {qq} consultas (muestrear y·s=0, "
                  f"resolver GF(2)). Clásico: {kq} consultas hasta una colisión (~2^(n/2) esperado). La "
                  f"primera separación exponencial demostrable — aunque a este n minúsculo es instantáneo."}}
    if problem.id == "deutsch-jozsa":
        cls = next((r for r in results if r.paradigm == "classical"), None)
        q = next((r for r in results if r.paradigm != "classical"), None)
        kq = cls.value.get("classical_queries") if cls else None
        verdict = q.value.get("verdict") if q else (cls.value.get("verdict") if cls else None)
        n = (q.cost.get("qubits", 2) - 1) if q else 1   # DJ uses n input qubits + 1 ancilla
        worst = 2 ** (n - 1) + 1
        return {"quantum_queries": 1, "classical_queries": kq, "verdict": {
            "en": f"Both decide f is {verdict}. Quantum: 1 oracle query. Classical: {kq} queries "
                  f"(worst case {worst} = 2^(n-1)+1). An exponential query-complexity gap — though at this "
                  f"size the classical decision is still instant.",
            "es": f"Ambos deciden que f es {verdict}. Cuántico: 1 consulta. Clásico: {kq} consultas "
                  f"(peor caso {worst} = 2^(n-1)+1). Una brecha exponencial en complejidad de consultas — "
                  f"aunque a este tamaño la decisión clásica es instantánea."}}
    if problem.id == "bernstein-vazirani":
        cls = next((r for r in results if r.paradigm == "classical"), None)
        nq = cls.value.get("classical_queries") if cls else None
        s = cls.value.get("recovered") if cls else None
        return {"quantum_queries": 1, "classical_queries": nq, "verdict": {
            "en": f"Both recover the hidden string s={s}. Quantum: 1 oracle query (phase kickback + "
                  f"interference). Classical: {nq} queries (one per bit). A real query-complexity advantage "
                  f"— though at this size wall-time is trivial either way.",
            "es": f"Ambos recuperan la cadena s={s}. Cuántico: 1 consulta al oráculo (phase kickback + "
                  f"interferencia). Clásico: {nq} consultas (una por bit). Una ventaja real en complejidad de "
                  f"consultas — aunque a este tamaño el tiempo de pared es trivial en ambos."}}
    if problem.id == "state-prep":
        return {"verdict": {
            "en": "Both a gate circuit and a direct classical amplitude vector prepare the same state; at "
                  "2–4 qubits the classical description is instant. Entanglement is the concept, not an "
                  "advantage.",
            "es": "Tanto un circuito de compuertas como un vector clásico de amplitudes preparan el mismo "
                  "estado; con 2–4 qubits la descripción clásica es instantánea. El entrelazamiento es el "
                  "concepto, no una ventaja."}}
    return {}


def run_case(problem_id: str, instance_id: str | None, seed: int, shots: int, only: str | None) -> dict:
    problem = get_problem(problem_id)
    inst = problem.instance(instance_id)
    solvers = solvers_for(problem, only=only)
    if not solvers:
        raise SystemExit(f"no applicable solvers for {problem_id} (only={only!r})")

    results = []
    primary_trace = None
    for solver in solvers:
        t0 = time.perf_counter()
        res = solver.run(problem, inst, seed=seed, shots=shots)
        res.cost.setdefault("wall_ms", round((time.perf_counter() - t0) * 1e3, 3))
        if primary_trace is None and res.trace is not None:
            primary_trace = res.trace
            primary_solver = res.solver
        results.append(res)

    # Lane verdict from the primary (circuit) trace.
    if primary_trace is not None:
        run_ms = max((r.cost.get("wall_ms", 0) for r in results), default=0.0)
        verdict = classify_lane(qubits=problem.instance(instance_id).params.get("n", primary_trace.qubits),
                                run_ms=run_ms, trace_bytes=primary_trace.nbytes(),
                                unitary_only=problem.live_capable)
    else:  # pragma: no cover
        primary_solver = results[0].solver
        verdict = classify_lane(qubits=inst.params.get("n", 1), run_ms=0, trace_bytes=0,
                                unitary_only=problem.live_capable)

    bundle = {
        "schema_version": SCHEMA_VERSION,
        "case_id": problem.id,
        "category": problem.category,
        "title": problem.title,
        "concept": problem.concept,
        "metric": problem.metric,
        "instance": {"id": inst.id, "title": inst.title, "params": inst.params, "note": inst.note},
        "qubits": inst.params.get("n", primary_trace.qubits if primary_trace else 1),
        "lane": verdict.lane,
        "lane_reasons": verdict.reasons,
        "seed": seed,
        "shots": shots,
        "primary_solver": primary_solver,
        "trace": primary_trace.to_dict() if primary_trace else None,
        "solvers": [
            {"solver": r.solver, "label": r.label, "framework": r.framework, "paradigm": r.paradigm,
             "value": r.value, "cost": r.cost, "notes": r.notes, "optimal": r.optimal, "extra": r.extra}
            for r in results
        ],
        "comparison": _comparison(problem, results),
        "references": problem.references,
    }

    out = ARTIFACTS / problem.id / f"{inst.id}.json"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(bundle, indent=1, ensure_ascii=False), encoding="utf-8")

    manifest = Manifest(
        case_id=problem.id, title=problem.title, category=problem.category,
        lane=verdict.lane, lane_reasons=verdict.reasons, qubits=bundle["qubits"], seed=seed, shots=shots,
        params=inst.params,
        measured={"run_ms": round(verdict.run_ms, 3), "trace_bytes": verdict.trace_bytes,
                  "unitary_only": verdict.unitary_only},
        viz=VIZ_BY_CATEGORY.get(problem.category, ["circuit", "histogram"]),
        engine=primary_trace.provenance["engine"] if primary_trace else results[0].framework,
        engine_version=primary_trace.provenance["engine_version"] if primary_trace else "—",
        trace_path=str(out.relative_to(ROOT / "data" / "artifacts")).replace("\\", "/"),
        references=problem.references,
    )
    manifest.write_json(MANIFESTS / f"{problem.id}__{inst.id}.json")

    _print_summary(problem, inst, results, verdict, out)
    return bundle


def _print_summary(problem, inst, results, verdict, out) -> None:
    print(f"\n=== {problem.id} / {inst.id} === lane={verdict.lane}  ({out.relative_to(ROOT)})")
    if verdict.reasons:
        print("    not-live:", "; ".join(verdict.reasons))
    for r in results:
        print(f"  [{r.paradigm:16}] {r.solver:20} {r.framework:18} "
              f"value={r.value}  cost={r.cost}")
    comp = _comparison(problem, results).get("verdict", {}).get("en")
    if comp:
        print("  →", comp)


def main(argv=None) -> None:
    # Windows consoles default to cp1252; the bilingual summaries contain UTF-8 (→, é, ⟩).
    for stream in (getattr(__import__("sys"), "stdout", None), getattr(__import__("sys"), "stderr", None)):
        try:
            stream.reconfigure(encoding="utf-8")
        except Exception:  # noqa: BLE001
            pass
    ap = argparse.ArgumentParser(prog="qlab.pipeline", description="QLab precompute pipeline")
    ap.add_argument("case", nargs="?", help="case id (omit with --list)")
    ap.add_argument("--instance", help="instance/variant id (default: first)")
    ap.add_argument("--all", action="store_true", help="run every instance of the case")
    ap.add_argument("--solver", help="run only this solver name")
    ap.add_argument("--seed", type=int, default=42)
    ap.add_argument("--shots", type=int, default=2048)
    ap.add_argument("--list", action="store_true", help="list cases and exit")
    args = ap.parse_args(argv)

    if args.list or not args.case:
        print("QLab cases:")
        for pid, cls in sorted(all_problems().items()):
            p = cls()
            print(f"  {pid:14} [{p.category:18}] {p.title['en']}  "
                  f"({len(p.instances())} variants)")
        return

    problem = get_problem(args.case)
    targets = [i.id for i in problem.instances()] if args.all else [args.instance]
    for iid in targets:
        run_case(args.case, iid, seed=args.seed, shots=args.shots, only=args.solver)


if __name__ == "__main__":
    main()
