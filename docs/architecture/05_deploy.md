# 05 · Deploy: GitHub Pages, static

QLab deploys as a **static site on GitHub Pages** (the `Research`-line "ships a public app" exception, like
CAOS_SIMLAB and CAOS_PINNLAB). No VPS, no backend.

## The flow

1. The offline pipeline commits trace bundles (`data/artifacts/`) + manifests (`manifests/`).
2. The web build (`web/`, React + Vite) overlays the committed traces/manifests into `dist/` (a `prebuild`
   `copy-data.mjs` step) and inlines the engine where needed.
3. `.github/workflows/deploy-pages.yml` builds `web/` and publishes `dist/` to Pages on push to `main` (when
   `web/**`, `data/artifacts/**` or `manifests/**` change), so **committing a new trace
   re-publishes the site**.
4. **Deep links answer 200:** a `postbuild` step (`web/spa-routes.mjs`) writes `dist/404.html` and a real
   `<route>.html` for every page and every case (`/benchmark` → `benchmark.html`, `/case/grover` →
   `case/grover.html`, the case list read from the built catalog). Pages resolves an extensionless path to
   that file with a direct 200; `<route>/index.html` would answer a 301 to the trailing-slash URL first. Any
   other path still gets `404.html`, which renders the app's "page not found" with status 404.

## Custom domain

Planned: `qlab.fasl-work.com` via a GoDaddy `CNAME → fsantibanezleal.github.io` (overriding the `*`
wildcard, as `seismic`/`simlab` do). **Not registered until deploy time**, set the domain on the Actions
deploy with `gh api PUT …/pages -f cname=…` (a `CNAME` file alone does not set it on Actions deploys), then
redeploy.

## Reproducibility & guards

What ships is a pinned engine (`qversus` from PyPI) + seeded traces; `python data-pipeline/run.py <case> --all`
reproduces the committed bytes. CI guards reject a real `.env`, raw/heavy data (`*.npy/.npz/.h5/.parquet`), and leaked local machine
paths in tracked files.

## Read next

- Back to [architecture.md](../architecture.md) · the runtime how-tos in [../guides.md](../guides.md).
