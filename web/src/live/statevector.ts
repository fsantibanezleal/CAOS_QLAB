// An exact state-vector simulator for the live (in-browser) lane — ≤12 qubits, pure TypeScript.
// It is NOT an approximation: amplitudes evolve exactly (the only stochastic step is shot sampling,
// seeded). Convention matches the committed traces: little-endian index (bit i = qubit i); measurement
// bitstrings are big-endian (qubit n-1 … qubit 0), as Qiskit reports them.

export interface State {
  n: number;
  re: Float64Array;
  im: Float64Array;
}

export function zeroState(n: number): State {
  const size = 1 << n;
  const re = new Float64Array(size);
  const im = new Float64Array(size);
  re[0] = 1;
  return { n, re, im };
}

type Mat2 = [number, number, number, number, number, number, number, number]; // a,b,c,d each (re,im)

const H = Math.SQRT1_2;
function g1(gate: string, p = 0): Mat2 | null {
  const c = Math.cos(p / 2), s = Math.sin(p / 2);
  switch (gate) {
    case "h": return [H, 0, H, 0, H, 0, -H, 0];
    case "x": return [0, 0, 1, 0, 1, 0, 0, 0];
    case "y": return [0, 0, 0, -1, 0, 1, 0, 0];
    case "z": return [1, 0, 0, 0, 0, 0, -1, 0];
    case "s": return [1, 0, 0, 0, 0, 0, 0, 1];
    case "sdg": return [1, 0, 0, 0, 0, 0, 0, -1];
    case "t": return [1, 0, 0, 0, 0, 0, H, H];
    case "tdg": return [1, 0, 0, 0, 0, 0, H, -H];
    case "rx": return [c, 0, 0, -s, 0, -s, c, 0];
    case "ry": return [c, 0, -s, 0, s, 0, c, 0];
    case "rz": return [c, -s, 0, 0, 0, 0, c, s];
    case "p": case "u1": return [1, 0, 0, 0, 0, 0, Math.cos(p), Math.sin(p)];
    default: return null;
  }
}

function applyMat2(st: State, q: number, m: Mat2): void {
  const { re, im, n } = st;
  const size = 1 << n;
  const bit = 1 << q;
  const [ar, ai, br, bi, cr, ci, dr, di] = m;
  for (let i = 0; i < size; i++) {
    if (i & bit) continue;
    const j = i | bit;
    const x0r = re[i], x0i = im[i], x1r = re[j], x1i = im[j];
    re[i] = ar * x0r - ai * x0i + br * x1r - bi * x1i;
    im[i] = ar * x0i + ai * x0r + br * x1i + bi * x1r;
    re[j] = cr * x0r - ci * x0i + dr * x1r - di * x1i;
    im[j] = cr * x0i + ci * x0r + dr * x1i + di * x1r;
  }
}

function applyCX(st: State, ctrl: number, tgt: number): void {
  const { re, im, n } = st;
  const size = 1 << n, cb = 1 << ctrl, tb = 1 << tgt;
  for (let i = 0; i < size; i++) {
    if ((i & cb) && !(i & tb)) {
      const j = i | tb;
      const tr = re[i], ti = im[i];
      re[i] = re[j]; im[i] = im[j];
      re[j] = tr; im[j] = ti;
    }
  }
}

function applyCZ(st: State, a: number, b: number): void {
  const { re, im, n } = st;
  const size = 1 << n, ab = 1 << a, bb = 1 << b;
  for (let i = 0; i < size; i++) if ((i & ab) && (i & bb)) { re[i] = -re[i]; im[i] = -im[i]; }
}

function applyCP(st: State, a: number, b: number, p: number): void {
  const { re, im, n } = st;
  const size = 1 << n, ab = 1 << a, bb = 1 << b;
  const cr = Math.cos(p), ci = Math.sin(p);
  for (let i = 0; i < size; i++) if ((i & ab) && (i & bb)) {
    const r = re[i], im0 = im[i];
    re[i] = cr * r - ci * im0; im[i] = cr * im0 + ci * r;
  }
}

function applyRZZ(st: State, a: number, b: number, p: number): void {
  const { re, im, n } = st;
  const size = 1 << n, ab = 1 << a, bb = 1 << b;
  const c = Math.cos(p / 2), s = Math.sin(p / 2);
  for (let i = 0; i < size; i++) {
    const parity = ((i & ab) ? 1 : 0) ^ ((i & bb) ? 1 : 0); // exp(-i p/2 Z⊗Z): +/- on parity
    const sign = parity ? +1 : -1; // even parity → e^{-i p/2}; odd → e^{+i p/2}
    const r = re[i], im0 = im[i];
    re[i] = c * r - sign * s * (-im0); // multiply by (c - i*sign*s)
    im[i] = c * im0 - sign * s * (r);
  }
}

function applySwap(st: State, a: number, b: number): void {
  const { re, im, n } = st;
  const size = 1 << n, ab = 1 << a, bb = 1 << b;
  for (let i = 0; i < size; i++) {
    const hasA = (i & ab) !== 0, hasB = (i & bb) !== 0;
    if (hasA && !hasB) {
      const j = (i & ~ab) | bb;
      const tr = re[i], ti = im[i];
      re[i] = re[j]; im[i] = im[j]; re[j] = tr; im[j] = ti;
    }
  }
}

export interface Op { gate: string; targets: number[]; params: number[]; }

/** Apply one circuit op in place. Returns false if the gate is unsupported (live lane disables). */
export function applyOp(st: State, op: Op): boolean {
  const g = op.gate.toLowerCase();
  const p = op.params?.[0] ?? 0;
  const m = g1(g, p);
  if (m) { applyMat2(st, op.targets[0], m); return true; }
  switch (g) {
    case "cx": case "cnot": applyCX(st, op.targets[0], op.targets[1]); return true;
    case "cz": applyCZ(st, op.targets[0], op.targets[1]); return true;
    case "cp": case "cu1": applyCP(st, op.targets[0], op.targets[1], p); return true;
    case "rzz": applyRZZ(st, op.targets[0], op.targets[1], p); return true;
    case "swap": applySwap(st, op.targets[0], op.targets[1]); return true;
    case "barrier": case "id": case "i": return true;
    default: return false;
  }
}

export function probabilities(st: State): number[] {
  const out = new Array(st.re.length);
  for (let i = 0; i < st.re.length; i++) out[i] = st.re[i] * st.re[i] + st.im[i] * st.im[i];
  return out;
}

/** Reduced Bloch vector [x,y,z] for qubit q. */
export function blochOf(st: State, q: number): [number, number, number] {
  const { re, im, n } = st;
  const size = 1 << n, bit = 1 << q;
  let r0 = 0, r1 = 0, re01 = 0, im01 = 0;
  for (let i = 0; i < size; i++) {
    const a = re[i] * re[i] + im[i] * im[i];
    if (i & bit) { r1 += a; } else {
      r0 += a;
      const j = i | bit;
      // ρ01 += amp_i * conj(amp_j)
      re01 += re[i] * re[j] + im[i] * im[j];
      im01 += im[i] * re[j] - re[i] * im[j];
    }
  }
  return [2 * re01, -2 * im01, r0 - r1];
}

// mulberry32 — a tiny seeded PRNG so live sampling reproduces.
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Sample `shots` measurements from the final distribution. Keys are big-endian bitstrings (q_{n-1}…q_0). */
export function sampleCounts(st: State, shots: number, seed: number): Record<string, number> {
  const probs = probabilities(st);
  const cdf = new Float64Array(probs.length);
  let acc = 0;
  for (let i = 0; i < probs.length; i++) { acc += probs[i]; cdf[i] = acc; }
  const rnd = mulberry32(seed);
  const counts: Record<string, number> = {};
  for (let s = 0; s < shots; s++) {
    const u = rnd() * acc;
    let lo = 0, hi = cdf.length - 1;
    while (lo < hi) { const mid = (lo + hi) >> 1; if (u <= cdf[mid]) hi = mid; else lo = mid + 1; }
    const key = lo.toString(2).padStart(st.n, "0");
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return counts;
}
