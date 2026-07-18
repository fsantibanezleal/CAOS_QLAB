import { useMemo, useState } from "react";
import { useUI } from "../lib/ui";
import { adjustableParams, runLive } from "../live/liveTrace";
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
 * state-vector engine (exact, ≤12 qubits); the same renderers animate the fresh trace.
 */
export function LivePanel({ ops, qubits, seed, shots }: { ops: Op[]; qubits: number; seed: number; shots: number }) {
  const { lang } = useUI();
  const en = lang === "en";
  const knobs = useMemo(() => adjustableParams(ops), [ops]);
  const [over, setOver] = useState<Record<number, number>>({});

  const result = useMemo(
    () => runLive(ops, qubits, over, shots || 2048, seed || 1),
    [ops, qubits, over, shots, seed],
  );

  // ops with current overrides, for the circuit diagram
  const liveOps = useMemo(
    () => ops.map((o, i) => (over[i] != null ? { ...o, params: [over[i]] } : o)),
    [ops, over],
  );

  const finalStep = result.steps[result.steps.length - 1];
  const trajectory = qubits === 1 ? trajectoryFromSteps(result.steps, lang) : [];

  return (
    <div className="live-panel">
      <div className="live-head">
        <span className="live-dot" /> {en ? "Live — running in your browser" : "En vivo — ejecutándose en el navegador"}
        <span className="live-sub">{en ? "exact state-vector engine · drag a slider to re-simulate" : "motor de statevector exacto · arrastrar un slider para re-simular"}</span>
      </div>

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
      ) : (
        <p className="note">{en
          ? "This circuit has no continuous parameters — the gates are fixed (H, CX, …). It still re-simulates live below."
          : "Este circuito no tiene parámetros continuos — las compuertas son fijas (H, CX, …). Igual se re-simula en vivo abajo."}</p>
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
