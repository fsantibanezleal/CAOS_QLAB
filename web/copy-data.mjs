// Overlay the committed trace bundles + manifests into web/public so the dev server and build can serve
// them, and generate a compact catalog index the app loads on start. In CI the Pages workflow overlays the
// same files into dist/. Pure Node, cross-platform.
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, "..");
const pub = resolve(here, "public");
mkdirSync(pub, { recursive: true });

for (const [src, dst] of [["data/artifacts", "public/data/artifacts"], ["manifests", "public/manifests"]]) {
  const s = resolve(repo, src);
  if (existsSync(s)) {
    cpSync(s, resolve(here, dst), { recursive: true });
    console.log(`copied ${src} -> web/${dst}`);
  } else console.warn(`skip (missing): ${src}`);
}

// --- generate public/data/catalog.json: one index of every case + its variants + verdicts ---
const artRoot = resolve(repo, "data/artifacts");
const cases = [];
for (const caseId of readdirSync(artRoot).sort()) {
  const caseDir = resolve(artRoot, caseId);
  const variantFiles = readdirSync(caseDir).filter((f) => f.endsWith(".json")).sort();
  if (!variantFiles.length) continue;
  let meta = null;
  const variants = [];
  for (const vf of variantFiles) {
    const b = JSON.parse(readFileSync(resolve(caseDir, vf), "utf-8"));
    if (!meta) {
      meta = {
        id: b.case_id, title: b.title, category: b.category, concept: b.concept,
        metric: b.metric, references: b.references ?? [],
      };
    }
    variants.push({
      id: b.instance.id, title: b.instance.title, note: b.instance.note ?? { en: "", es: "" },
      lane: b.lane, primary_solver: b.primary_solver,
      verdict: b.comparison?.verdict ?? null,
      solvers: (b.solvers ?? []).map((s) => ({ solver: s.solver, label: s.label, framework: s.framework,
        paradigm: s.paradigm, value: s.value })),
      path: `data/artifacts/${caseId}/${vf}`,
    });
  }
  cases.push({ ...meta, variants });
}
const catalog = { schema: "qlab-catalog/1", count: cases.length, cases };
const outDir = resolve(pub, "data");
mkdirSync(outDir, { recursive: true });
writeFileSync(resolve(outDir, "catalog.json"), JSON.stringify(catalog), "utf-8");
console.log(`catalog.json: ${cases.length} cases, ${cases.reduce((n, c) => n + c.variants.length, 0)} variants`);
