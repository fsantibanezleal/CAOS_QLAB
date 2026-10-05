// Product version string, surfaced in the footer (ADR-0016 §2). Display form X.XX.XXX (ADR-0068), injected at
// build time from the repository's VERSION file (vite.config.ts), so there is no hand-maintained copy.
export const VERSION: string = __APP_VERSION__;
