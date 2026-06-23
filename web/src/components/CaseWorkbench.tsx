import { useEffect, useState } from "react";
import type { Bundle, CatalogCase } from "../lib/contract.types";
import { loadBundle } from "../lib/data";
import { useT } from "../lib/ui";
import { AmplitudeBars } from "../viz/AmplitudeBars";
import { CircuitDiagram } from "../viz/CircuitDiagram";
import { ComparisonPanel } from "../viz/ComparisonPanel";
import { Histogram } from "../viz/Histogram";
import { isLandscape, LandscapeHeatmap } from "../viz/LandscapeHeatmap";

/** Per-case workbench: a variant-bar + the data-driven viz for the selected variant. */
export function CaseWorkbench({ caseEntry }: { caseEntry: CatalogCase }) {
  const t = useT();
  const [vid, setVid] = useState(caseEntry.variants[0].id);
  const [bundle, setBundle] = useState<Bundle | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const variant = caseEntry.variants.find((v) => v.id === vid) ?? caseEntry.variants[0];

  useEffect(() => {
    let live = true;
    setBundle(null);
    setErr(null);
    loadBundle(variant.path).then((b) => live && setBundle(b)).catch((e) => live && setErr(String(e)));
    return () => { live = false; };
  }, [variant.path]);

  const finalStep = bundle?.trace?.steps?.[bundle.trace.steps.length - 1];
  const extra = bundle?.trace?.extra;
  const landscape = extra && isLandscape(extra.landscape) ? extra.landscape : null;

  return (
    <div className="workbench">
      <div className="variant-bar">
        {caseEntry.variants.map((v) => (
          <button key={v.id} className={`variant-chip ${v.id === vid ? "on" : ""}`} onClick={() => setVid(v.id)}>
            {t(v.title)}
          </button>
        ))}
        <span className="lane-badge">{variant.lane}</span>
      </div>
      {variant.note && <p className="variant-note">{t(variant.note)}</p>}

      {err && <p className="err">Failed to load: {err}</p>}
      {!bundle && !err && <p className="note">Loading variant…</p>}

      {bundle && (
        <>
          {bundle.trace?.circuit_ops?.length ? (
            <CircuitDiagram ops={bundle.trace.circuit_ops} qubits={bundle.trace.qubits} />
          ) : null}
          <div className="viz-row">
            {finalStep && <AmplitudeBars step={finalStep} qubits={bundle.trace!.qubits} />}
            {bundle.trace?.measurements?.shots ? <Histogram measurements={bundle.trace.measurements} /> : null}
          </div>
          {landscape && (
            <div className="viz-row">
              <LandscapeHeatmap
                landscape={landscape}
                gammaStar={typeof extra?.gamma === "number" ? extra.gamma : undefined}
                betaStar={typeof extra?.beta === "number" ? extra.beta : undefined}
              />
            </div>
          )}
          <ComparisonPanel bundle={bundle} />
        </>
      )}
    </div>
  );
}
