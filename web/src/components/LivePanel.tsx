import { useMemo, useState } from "react";
import { useUI } from "../lib/ui";
import { adjustableParams, type Repetition, runLive, withRepetitions } from "../live/liveTrace";
import type { Op } from "../live/statevector";
import { AmplitudeBars } from "../viz/AmplitudeBars";
import { BlochSphere, trajectoryFromSteps } from "../viz/BlochSphere";
import { CircuitDiagram } from "../viz/CircuitDiagram";
import { Histogram } from "../viz/Histogram";

const TAU = 2 * Math.PI;

function piLabel(x: number): string {
  const r = x / Math.PI;
  return `${r.toFixed(2)}π`;
}

/**
 * The live (in-browser) lane: re-simulate the circuit in real time as the sliders move. Pure TypeScript
 * state-vector engine (exact, ≤12 qubits); the same renderers animate the fresh trace. A circuit made of a prep
 * and repeated identical blocks (Grover) also gets an iteration-count knob that rebuilds the circuit.
 */
export function LivePanel({ ops, qubits, seed, shots, repetition = null, marked = [] }: {
  ops: Op[]; qubits: number; seed: number; shots: number; repetition?: Repetition | null; marked?: string[];
}) {
  const { lang } = useUI();
  const en = lang === "en";
  const [iters, setIters] = useState<number>(repetition?.count ?? 0);
  const circuit = useMemo(() => (repetition ? withRepetitions(repetition, iters) : ops), [ops, repetition, iters]);
  const knobs = useMemo(() => adjustableParams(circuit), [circuit]);
  const [over, setOver] = useState<Record<number, number>>({});

  const result = useMemo(
    () => runLive(circuit, qubits, over, shots || 2048, seed || 1),
    [circuit, qubits, over, shots, seed],
  );

  // ops with current overrides, for the circuit diagram
  const liveOps = useMemo(
    () => circuit.map((o, i) => (over[i] != null ? { ...o, params: [over[i]] } : o)),
    [circuit, over],
  );

  const finalStep = result.steps[result.steps.length - 1];
  const trajectory = qubits === 1 ? trajectoryFromSteps(result.steps, lang) : [];

  // Grover read-out: the exact marked probability after `iters` iterations next to sin^2((2k+1)theta).
  const N = 2 ** qubits;
  const theta = marked.length ? Math.asin(Math.sqrt(marked.length / N)) : 0;
  const pMarked = finalStep ? marked.reduce((s, k) => s + (finalStep.probabilities[parseInt(k, 2)] ?? 0), 0) : 0;
  const maxIters = repetition ? 3 * repetition.count + 3 : 0;

  return (
    <div className="live-panel">
      <div className="live-head">
        <span className="live-dot" /> {en ? "Live, running in your browser" : "En vivo, ejecutándose en el navegador"}
        <span className="live-sub">{en ? "exact state-vector engine · drag a slider to re-simulate" : "motor de statevector exacto · arrastrar un slider para re-simular"}</span>
      </div>

      {repetition && (
        <div className="live-knobs">
          <label className="live-knob">
            <span className="knob-name">{en ? "Grover iterations k" : "iteraciones de Grover k"}</span>
            <input type="range" min={0} max={maxIters} step={1} value={iters}
                   onChange={(e) => { setIters(Number(e.target.value)); setOver({}); }} />
            <span className="knob-val">{iters}</span>
          </label>
          <button className="live-reset" onClick={() => setIters(repetition.count)}>
            {en ? `Optimal k = ${repetition.count}` : `k óptimo = ${repetition.count}`}
          </button>
          {marked.length > 0 && (
            <p className="note">
              {en ? "P(marked) after" : "P(marcado) tras"} k = {iters}: <b>{pMarked.toFixed(4)}</b>
              {en ? ", closed form sin²((2k+1)θ) = " : ", forma cerrada sin²((2k+1)θ) = "}
              {(Math.sin((2 * iters + 1) * theta) ** 2).toFixed(4)}
              {en ? ". Past the optimum the marked amplitude rotates away again." : ". Pasado el óptimo la amplitud marcada vuelve a alejarse."}
            </p>
          )}
        </div>
      )}

      {knobs.length > 0 ? (
        <div className="live-knobs">
          {knobs.map((k) => {
            const val = over[k.opIndex] ?? k.value;
            return (
              <label key={k.opIndex} className="live-knob">
                <span className="knob-name">{k.gate.toUpperCase()} q{k.target.join(",")}</span>
                <input type="range" min={0} max={TAU} step={TAU / 120} value={val}
                       onChange={(e) => setOver((s) => ({ ...s, [k.opIndex]: Number(e.target.value) }))} />
                <span className="knob-val">{piLabel(val)}</span>
              </label>
            );
          })}
          <button className="live-reset" onClick={() => setOver({})}>{en ? "Reset" : "Reiniciar"}</button>
        </div>
      ) : !repetition && (
        <p className="note">{en
          ? "This circuit has no continuous parameters, the gates are fixed (H, CX, …). It still re-simulates live below."
          : "Este circuito no tiene parámetros continuos, las compuertas son fijas (H, CX, …). Igual se re-simula en vivo abajo."}</p>
      )}

      {liveOps.length ? <CircuitDiagram ops={liveOps} qubits={qubits} /> : null}
      <div className="viz-row">
        {trajectory.length > 0 && <BlochSphere trajectory={trajectory} />}
        {finalStep && <AmplitudeBars step={finalStep} qubits={qubits} />}
        <Histogram measurements={result.measurements} />
      </div>
    </div>
  );
}
