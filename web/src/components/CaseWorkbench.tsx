import { useEffect, useState } from "react";
import type { Bundle, CatalogCase } from "../lib/contract.types";
import { loadBundle } from "../lib/data";
import { liveSupported } from "../live/liveTrace";
import { useT, useUI } from "../lib/ui";
import { AmplitudeBars } from "../viz/AmplitudeBars";
import { BlochSphere, trajectoryFromSteps } from "../viz/BlochSphere";
import { CircuitDiagram } from "../viz/CircuitDiagram";
import { ComparisonPanel } from "../viz/ComparisonPanel";
import { Histogram } from "../viz/Histogram";
import { isLandscape, LandscapeHeatmap } from "../viz/LandscapeHeatmap";
import { isZne, ZneExtrapolation } from "../viz/ZneExtrapolation";
import { LivePanel } from "./LivePanel";

/**
 * Per-case workbench: a variant-bar + the data-driven viz for the selected variant.
 *
 * Can run controlled (the App landing drives the variant from its sidebar) or
 * uncontrolled (the /case/:id deep-link page). When `variantId`/`onVariantChange`
 * are supplied the selection is lifted to the parent; otherwise local state is used.
 * `onBundle` reports the loaded bundle up so the sidebar can show a live read-out;
 * `hideVariantBar` lets the App suppress the in-pane chips (they live in the aside).
 */
export function CaseWorkbench({
  caseEntry,
  variantId,
  onVariantChange,
  onBundle,
  hideVariantBar,
}: {
  caseEntry: CatalogCase;
  variantId?: string;
  onVariantChange?: (id: string) => void;
  onBundle?: (b: Bundle | null) => void;
  hideVariantBar?: boolean;
}) {
  const t = useT();
  const { lang } = useUI();
  const [localVid, setLocalVid] = useState(caseEntry.variants[0].id);
  const vid = variantId ?? localVid;
  const setVid = (id: string) => (onVariantChange ? onVariantChange(id) : setLocalVid(id));
  const [bundle, setBundle] = useState<Bundle | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [mode, setMode] = useState<"replay" | "live">("replay");
  const variant = caseEntry.variants.find((v) => v.id === vid) ?? caseEntry.variants[0];

  useEffect(() => {
    let live = true;
    setBundle(null);
    onBundle?.(null);
    setErr(null);
    setMode("replay");
    loadBundle(variant.path)
      .then((b) => {
        if (live) {
          setBundle(b);
          onBundle?.(b);
        }
      })
      .catch((e) => live && setErr(String(e)));
    return () => { live = false; };
    // onBundle is a stable callback from the parent; intentionally not in deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant.path]);

  const finalStep = bundle?.trace?.steps?.[bundle.trace.steps.length - 1];
  const extra = bundle?.trace?.extra;
  const landscape = extra && isLandscape(extra.landscape) ? extra.landscape : null;
  const blochTraj =
    bundle?.trace && bundle.trace.qubits === 1 ? trajectoryFromSteps(bundle.trace.steps, lang) : [];
  const zneSolver = bundle?.solvers?.find((s) => isZne(s.extra?.zne));
  const zneRaw = zneSolver?.extra?.zne;
  const zne = isZne(zneRaw) ? zneRaw : null;
  const zneIdeal = typeof zneSolver?.value?.ideal === "number" ? zneSolver.value.ideal : undefined;

  const ops = bundle?.trace?.circuit_ops ?? [];
  const canLive = variant.lane === "live" && ops.length > 0 && liveSupported(ops);

  return (
    <div className="workbench">
      {!hideVariantBar && (
        <div className="variant-bar">
          {caseEntry.variants.map((v) => (
            <button key={v.id} className={`variant-chip ${v.id === vid ? "on" : ""}`} onClick={() => setVid(v.id)}>
              {t(v.title)}
            </button>
          ))}
          <span className="lane-badge">{variant.lane}</span>
        </div>
      )}
      {variant.note && <p className="variant-note">{t(variant.note)}</p>}

      {err && <p className="err">Failed to load: {err}</p>}
      {!bundle && !err && <p className="note">Loading variant…</p>}

      {bundle && (
        <>
          {canLive && (
            <div className="mode-toggle">
              <button className={mode === "replay" ? "on" : ""} onClick={() => setMode("replay")}>
                {lang === "en" ? "Replay (committed)" : "Replay (commiteado)"}
              </button>
              <button className={mode === "live" ? "on" : ""} onClick={() => setMode("live")}>
                {lang === "en" ? "Live (browser)" : "En vivo (navegador)"}
              </button>
            </div>
          )}

          {mode === "live" && canLive ? (
            <LivePanel ops={ops} qubits={bundle.trace!.qubits} seed={bundle.seed} shots={bundle.shots} />
          ) : (
            <>
              {bundle.trace?.circuit_ops?.length ? (
                <CircuitDiagram ops={bundle.trace.circuit_ops} qubits={bundle.trace.qubits} />
              ) : null}
              <div className="viz-row">
                {blochTraj.length > 0 && <BlochSphere trajectory={blochTraj} />}
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
              {zne && (
                <div className="viz-row">
                  <ZneExtrapolation zne={zne} ideal={zneIdeal} />
                </div>
              )}
            </>
          )}
          <ComparisonPanel bundle={bundle} />
        </>
      )}
    </div>
  );
}
