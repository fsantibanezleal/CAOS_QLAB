// The App route: the shared shell's CaseWorkbench (ADR-0016 s9, ADR-0071). The rail holds the case and the
// variant, the lane (replay of the committed trace, or live in the browser), the live controls and the verdict;
// the instrument holds one row of question groups whose views fill the panel (rule 8). The selection lives in the
// URL (?case=…&variant=…), and every view carries the key of the selection it shows.
import {
  CaseWorkbench, ChipGroup, Knob, PlotCard, Readout, Stage, Verdict, type Lane, type Tone, type WorkbenchGroup,
  useWorkbenchState,
} from "@fasl-work/caos-app-shell";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { ADVANTAGE_EDGE, ADVANTAGE_LABEL, casePhysics } from "../data/casePhysics";
import { DEFAULT_CASE, groupByCategory, useCatalog } from "../lib/catalog";
import type { Bundle, CircuitOp, Measurements, Step } from "../lib/contract.types";
import { CATEGORY_LABELS } from "../lib/contract.types";
import { loadBundle } from "../lib/data";
import { useT, useUI } from "../lib/ui";
import { adjustableParams, liveSupported, repeatedBlocks, runLive, withRepetitions } from "../live/liveTrace";
import { AmplitudeBars } from "../viz/AmplitudeBars";
import { BlochSphere, trajectoryFromSteps } from "../viz/BlochSphere";
import { CircuitDiagram } from "../viz/CircuitDiagram";
import { ComparisonPanel } from "../viz/ComparisonPanel";
import { CostBars } from "../viz/CostBars";
import { EnergyScan, isEnergyScan } from "../viz/EnergyScan";
import { Histogram } from "../viz/Histogram";
import { isLandscape, LandscapeHeatmap } from "../viz/LandscapeHeatmap";
import { isZne, ZneExtrapolation } from "../viz/ZneExtrapolation";
import { Tex } from "./Tabs";

type Mode = "replay" | "live";

const TONE_BY_EDGE: Record<string, Tone> = { genuine: "good", query: "accent", qec: "accent", classical: "neutral" };

/** The key a view's data was computed for: the current one when the bundle is the selected variant's, otherwise a
 *  key that cannot match, so the shell marks the view stale until the new bundle arrives. */
function useDataKey(bundle: Bundle | null, caseId: string, variantId: string): string {
  const ws = useWorkbenchState();
  const current = ws?.stateKey ?? "";
  return bundle && bundle.case_id === caseId && bundle.instance.id === variantId ? current : `stale:${current}`;
}

function StateViews({ ops, qubits, step, lane, keyed }: {
  ops: CircuitOp[]; qubits: number; step: Step; lane: Lane; keyed: { caseId: string; variantId: string; bundle: Bundle };
}) {
  const dataKey = useDataKey(keyed.bundle, keyed.caseId, keyed.variantId);
  return (
    <>
      <PlotCard fill title={{ en: "Circuit and amplitudes", es: "Circuito y amplitudes" }} lane={lane} provenance="synthetic" dataKey={dataKey}>
        <Stage label={{ en: "Circuit and amplitudes", es: "Circuito y amplitudes" }}>
          {(sz) => {
            const circuitH = Math.min(24 + Math.min(qubits, 10) * 44 + 10, Math.round(sz.height * 0.42));
            return (
              <div className="qlab-stack">
                <CircuitDiagram ops={ops} qubits={qubits} size={{ width: sz.width, height: circuitH }} />
                <AmplitudeBars step={step} qubits={qubits} size={{ width: sz.width, height: sz.height - circuitH }} />
              </div>
            );
          }}
        </Stage>
      </PlotCard>
    </>
  );
}

function BlochView({ bloch, lane, keyed }: { bloch: ReturnType<typeof trajectoryFromSteps>; lane: Lane; keyed: { caseId: string; variantId: string; bundle: Bundle } }) {
  const dataKey = useDataKey(keyed.bundle, keyed.caseId, keyed.variantId);
  return (
    <PlotCard fill title={{ en: "Bloch sphere", es: "Esfera de Bloch" }} lane={lane} provenance="synthetic" dataKey={dataKey}>
      <Stage label={{ en: "Bloch sphere", es: "Esfera de Bloch" }}>{(sz) => <BlochSphere trajectory={bloch} size={sz} />}</Stage>
    </PlotCard>
  );
}

function MeasurementView({ measurements, lane, keyed }: { measurements: Measurements; lane: Lane; keyed: { caseId: string; variantId: string; bundle: Bundle } }) {
  const dataKey = useDataKey(keyed.bundle, keyed.caseId, keyed.variantId);
  return (
    <PlotCard fill title={{ en: "Measurement histogram", es: "Histograma de mediciones" }} lane={lane} provenance="synthetic" dataKey={dataKey}>
      <Stage label={{ en: "Histogram", es: "Histograma" }}>{(sz) => <Histogram measurements={measurements} size={sz} />}</Stage>
    </PlotCard>
  );
}

function VersusViews({ keyed, en }: { keyed: { caseId: string; variantId: string; bundle: Bundle }; en: boolean }) {
  const dataKey = useDataKey(keyed.bundle, keyed.caseId, keyed.variantId);
  return (
    <>
      <PlotCard title={{ en: "Every method on this variant", es: "Cada método en esta variante" }} lane="replay" provenance="synthetic" dataKey={dataKey}>
        <ComparisonPanel bundle={keyed.bundle} bare />
      </PlotCard>
      <PlotCard fill title={{ en: "Wall-clock cost per method (log scale)", es: "Costo en tiempo por método (escala log)" }}
                lane="replay" provenance="synthetic" dataKey={dataKey}>
        <Stage label={{ en: "Cost", es: "Costo" }}>{(sz) => <CostBars solvers={keyed.bundle.solvers} size={sz} en={en} />}</Stage>
      </PlotCard>
    </>
  );
}

function FillView({ title, keyed, children }: {
  title: { en: string; es: string }; keyed: { caseId: string; variantId: string; bundle: Bundle };
  children: (sz: { width: number; height: number }) => React.ReactNode;
}) {
  const dataKey = useDataKey(keyed.bundle, keyed.caseId, keyed.variantId);
  return (
    <PlotCard fill title={title} lane="replay" provenance="synthetic" dataKey={dataKey}>
      <Stage label={title}>{children}</Stage>
    </PlotCard>
  );
}

export function Workbench() {
  const { cat, err } = useCatalog();
  const t = useT();
  const { lang } = useUI();
  const en = lang === "en";
  const [params, setParams] = useSearchParams();
  const active = cat?.cases.find((c) => c.id === (params.get("case") ?? DEFAULT_CASE)) ?? cat?.cases[0] ?? null;
  const variant = active?.variants.find((v) => v.id === params.get("variant")) ?? active?.variants[0] ?? null;

  const [bundle, setBundle] = useState<Bundle | null>(null);
  const [loadErr, setLoadErr] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>("replay");
  const [iters, setIters] = useState(0);
  const [over, setOver] = useState<Record<number, number>>({});
  const [group, setGroup] = useState("state");

  useEffect(() => {
    if (!variant) return;
    let live = true;
    setLoadErr(null);
    setMode("replay");
    setOver({});
    loadBundle(variant.path)
      .then((b) => {
        if (!live) return;
        setBundle(b);
        setIters(typeof b.trace?.extra?.iterations === "number" ? (b.trace.extra.iterations as number) : 0);
      })
      .catch((e) => live && setLoadErr(String(e)));
    return () => { live = false; };
  }, [variant?.path]); // eslint-disable-line react-hooks/exhaustive-deps

  const trace = bundle?.trace ?? null;
  const ops = trace?.circuit_ops ?? [];
  const qubits = trace?.qubits ?? 0;
  const current = !!(bundle && active && variant && bundle.case_id === active.id && bundle.instance.id === variant.id);
  const canLive = current && variant?.lane === "live" && ops.length > 0 && liveSupported(ops, qubits);
  const live = canLive && mode === "live";
  const extra = trace?.extra ?? {};
  const repetition = useMemo(
    () => (bundle?.case_id === "grover" && typeof extra.iterations === "number" ? repeatedBlocks(ops, qubits, extra.iterations as number) : null),
    [bundle, ops, qubits, extra.iterations],
  );
  const marked = Array.isArray(extra.marked) ? (extra.marked as string[]) : [];
  const circuit = useMemo(() => (live && repetition ? withRepetitions(repetition, iters) : ops), [live, repetition, iters, ops]);
  const knobs = useMemo(() => (live ? adjustableParams(circuit) : []), [live, circuit]);
  const liveRun = useMemo(
    () => (live && bundle ? runLive(circuit, qubits, over, bundle.shots || 2048, bundle.seed || 1) : null),
    [live, bundle, circuit, qubits, over],
  );

  if (err || loadErr) return <div className="page-body"><p className="err">{err ?? loadErr}</p></div>;
  if (!cat || !active || !variant) return <div className="page-body"><p className="note">{en ? "Loading the lab…" : "Cargando el laboratorio…"}</p></div>;

  const select = (caseId: string, variantId?: string) =>
    setParams(variantId ? { case: caseId, variant: variantId } : { case: caseId }, { replace: true });
  const cases = groupByCategory(cat.cases).flatMap(([category, list]) =>
    list.map((c) => ({ id: c.id, name: t(c.title), category: t(CATEGORY_LABELS[category]) || category })));
  const phys = casePhysics(active.id);
  const edge = phys ? ADVANTAGE_EDGE[phys.advantage] : "classical";
  const verdictText = bundle?.comparison?.verdict ?? variant.verdict ?? null;
  const lane: Lane = live ? "live" : "replay";
  const keyed = bundle ? { caseId: active.id, variantId: variant.id, bundle } : null;
  const shownSteps = live && liveRun ? liveRun.steps : trace?.steps ?? [];
  const finalStep = shownSteps[shownSteps.length - 1];
  const shownCounts = live && liveRun ? liveRun.measurements : trace?.measurements;
  const bloch = qubits === 1 && shownSteps.length ? trajectoryFromSteps(shownSteps, lang) : [];
  const theta = marked.length && qubits ? Math.asin(Math.sqrt(marked.length / 2 ** qubits)) : 0;
  const pMarked = finalStep ? marked.reduce((s, k) => s + (finalStep.probabilities[parseInt(k, 2)] ?? 0), 0) : 0;

  const groups: WorkbenchGroup[] = [];
  if (keyed && trace && finalStep) {
    groups.push({ id: "state", label: { en: "Circuit and state", es: "Circuito y estado" }, lane, provenance: "synthetic",
      content: <StateViews ops={circuit} qubits={qubits} step={finalStep} lane={lane} keyed={keyed} /> });
    if (bloch.length > 0) {
      groups.push({ id: "bloch", label: { en: "Bloch sphere", es: "Esfera de Bloch" }, lane, provenance: "synthetic",
        content: <BlochView bloch={bloch} lane={lane} keyed={keyed} /> });
    }
    if (shownCounts?.shots) {
      groups.push({ id: "measurement", label: { en: "Measurement", es: "Medición" }, lane, provenance: "synthetic",
        content: <MeasurementView measurements={shownCounts} lane={lane} keyed={keyed} /> });
    }
  }
  if (keyed) {
    groups.push({ id: "versus", label: { en: "Quantum vs classical", es: "Cuántico vs clásico" }, lane: "replay", provenance: "synthetic",
      content: <VersusViews keyed={keyed} en={en} /> });
    const landscape = isLandscape(extra.landscape) ? extra.landscape : null;
    if (landscape) {
      groups.push({ id: "landscape", label: { en: "Landscape", es: "Paisaje" }, lane: "replay", provenance: "synthetic",
        content: (
          <FillView title={{ en: "QAOA landscape over (γ, β)", es: "Paisaje QAOA sobre (γ, β)" }} keyed={keyed}>
            {(sz) => <LandscapeHeatmap landscape={landscape} size={sz}
              gammaStar={typeof extra.gamma === "number" ? extra.gamma : undefined}
              betaStar={typeof extra.beta === "number" ? extra.beta : undefined} />}
          </FillView>
        ) });
    }
    const vqe = bundle?.solvers.find((s) => isEnergyScan(s.extra?.landscape));
    const scan = vqe && isEnergyScan(vqe.extra?.landscape) ? vqe.extra!.landscape : null;
    if (scan && isEnergyScan(scan)) {
      const exact = bundle?.solvers.find((s) => s.paradigm === "classical" && typeof s.value?.energy === "number")?.value?.energy;
      groups.push({ id: "energy", label: { en: "Energy scan", es: "Barrido de energía" }, lane: "replay", provenance: "synthetic",
        content: (
          <FillView title={{ en: "VQE energy against the ansatz angle θ", es: "Energía VQE frente al ángulo θ del ansatz" }} keyed={keyed}>
            {(sz) => <EnergyScan scan={scan} size={sz}
              thetaStar={typeof vqe?.value?.optimal_theta === "number" ? vqe.value.optimal_theta : undefined}
              exact={typeof exact === "number" ? exact : undefined} />}
          </FillView>
        ) });
    }
    const zneSolver = bundle?.solvers.find((s) => isZne(s.extra?.zne));
    const zne = zneSolver && isZne(zneSolver.extra?.zne) ? zneSolver.extra!.zne : null;
    if (zne && isZne(zne)) {
      groups.push({ id: "mitigation", label: { en: "Mitigation", es: "Mitigación" }, lane: "replay", provenance: "synthetic",
        content: (
          <FillView title={{ en: "Zero-noise extrapolation", es: "Extrapolación a ruido cero" }} keyed={keyed}>
            {(sz) => <ZneExtrapolation zne={zne} size={sz}
              ideal={typeof zneSolver?.value?.ideal === "number" ? zneSolver.value.ideal : undefined} />}
          </FillView>
        ) });
    }
  }

  const controlsRail = (
    <>
      {!canLive && bundle && (
        <p className="note qlab-replay-only">
          <strong>{en ? "Replay only. " : "Solo replay. "}</strong>
          {bundle.lane_reasons[0] ?? (en ? "This case runs in the offline engine." : "Este caso corre en el motor offline.")}
        </p>
      )}
      {canLive && (
        <ChipGroup id="lane" label={{ en: "Lane", es: "Carril" }} value={mode} onChange={(id) => { setMode(id as Mode); setOver({}); }}
          options={[
            { id: "replay", label: { en: "Replay (committed)", es: "Replay (versionado)" }, hint: { en: "The committed Qiskit trace.", es: "La traza Qiskit versionada." } },
            { id: "live", label: { en: "Live (browser)", es: "En vivo (navegador)" }, hint: { en: "Re-simulated here by the exact TypeScript engine.", es: "Re-simulado aquí por el motor TypeScript exacto." } },
          ]} />
      )}
      {live && repetition && (
        <Knob id="iterations" label={{ en: "Grover iterations k", es: "Iteraciones de Grover k" }} value={iters}
          min={0} max={3 * repetition.count + 3} step={1} format={{ decimals: 0 }}
          hint={{ en: `Optimal k = ${repetition.count}; past it the marked amplitude rotates away.`, es: `k óptimo = ${repetition.count}; pasado el óptimo la amplitud marcada se aleja.` }}
          onChange={(v) => { setIters(v); setOver({}); }} />
      )}
      {live && knobs.map((k) => (
        <Knob key={k.opIndex} id={`angle-${k.opIndex}`} label={`${k.gate.toUpperCase()} q${k.target.join(",")}`}
          value={over[k.opIndex] ?? k.value} min={0} max={2 * Math.PI} step={(2 * Math.PI) / 120} unit="rad" format={{ decimals: 2 }}
          onChange={(v) => setOver((s) => ({ ...s, [k.opIndex]: v }))} />
      ))}
    </>
  );
  const verdictRail = (
    <>
      {phys && (
        <Verdict compact title={{ en: "Quantum vs classical", es: "Cuántico vs clásico" }} tone={TONE_BY_EDGE[edge] ?? "neutral"}
          verdict={ADVANTAGE_LABEL[phys.advantage]}>
          <div className="qlab-relation"><Tex tex={phys.relation} /></div>
        </Verdict>
      )}
    </>
  );
  const runRail = (
    <>
      {keyed && (
        <Readout title={live ? { en: "This live run", es: "Esta corrida en vivo" } : { en: "This committed run", es: "Esta corrida versionada" }}
          lane={lane} provenance="synthetic" dataKey={undefined}
          items={[
            { label: { en: "Qubits", es: "Qubits" }, value: qubits || bundle!.qubits, unitless: true, format: { decimals: 0 } },
            { label: { en: "Shots", es: "Disparos" }, value: bundle!.shots, unitless: true, format: { decimals: 0 } },
            ...(marked.length && finalStep ? [
              { label: { en: "P(marked)", es: "P(marcado)" }, value: pMarked, unitless: true, format: { decimals: 4 } },
              { label: { en: "Closed form sin²((2k+1)θ)", es: "Forma cerrada sin²((2k+1)θ)" }, value: Math.sin((2 * (live ? iters : (extra.iterations as number) ?? 0) + 1) * theta) ** 2, unitless: true, format: { decimals: 4 } },
            ] : []),
          ]} />
      )}
    </>
  );

  // The rail never scrolls (ADR-0071 rule 6): with live controls it is two sections shown one at a time.
  const rail = [
    { id: "controls", label: { en: "Controls", es: "Controles" }, content: controlsRail },
    { id: "verdict", label: { en: "Verdict", es: "Veredicto" }, content: verdictRail },
    { id: "run", label: { en: "This run", es: "Esta corrida" }, content: runRail },
  ];
  const shownGroup = groups.some((g) => g.id === group) ? group : groups[0]?.id ?? "context";

  return (
    <CaseWorkbench
      caseId={active.id}
      cases={{ cases, selectedId: active.id, onSelect: (id) => select(id), layout: "select" }}
      variants={{
        variants: active.variants.map((v) => ({ id: v.id, label: v.title, note: v.note, lane: v.lane === "live" ? "live" : "replay" })),
        activeId: variant.id, onSelect: (id) => select(active.id, id), title: { en: "Variant", es: "Variante" },
      }}
      controls={canLive ? { lane: mode, ...(live ? { iters, over } : {}) } : {}}
      replayOnly={!canLive}
      rail={rail}
      railLabel={{ en: "Case and controls", es: "Caso y controles" }}
      groups={groups}
      group={shownGroup}
      onGroupChange={setGroup}
      context={{
        content: (
          <>
            <h2>{t(active.title)}</h2>
            <p>{t(active.concept)}</p>
            {variant.note && <p><strong>{en ? "This variant: " : "Esta variante: "}</strong>{t(variant.note)}</p>}
            {phys && <p>{t(phys.teaches)}</p>}
            {phys && <p><strong>{en ? "Honest scope: " : "Alcance honesto: "}</strong>{t(phys.honest)}</p>}
            {verdictText && <p><strong>{en ? "Verdict on this run: " : "Veredicto de esta corrida: "}</strong>{t(verdictText)}</p>}
            <p><strong>{en ? "Metric: " : "Métrica: "}</strong>{t(active.metric)}</p>
            {active.references.length > 0 && (
              <ul>
                {active.references.map((r) => (
                  <li key={r.label}>
                    {r.label}{" "}
                    {r.doi ? <a href={`https://doi.org/${r.doi}`} target="_blank" rel="noreferrer">doi:{r.doi}</a>
                      : r.url ? <a href={r.url} target="_blank" rel="noreferrer">{r.url.replace(/^https?:\/\//, "")}</a> : null}
                  </li>
                ))}
              </ul>
            )}
          </>
        ),
      }}
    />
  );
}
