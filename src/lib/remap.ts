import { converter } from "culori";
import { hexToRgb, type Swatch, toHex } from "./colors";
import { type HueBucket, type Preset, presets } from "./presets";

const toOklch = converter("oklch");

const HUE_ORDER: HueBucket[] = [
  "red",
  "orange",
  "yellow",
  "green",
  "cyan",
  "blue",
  "purple",
  "pink",
];

// Hue ranges in degrees. Red wraps 345..360 + 0..15.
const HUE_RANGES: { name: HueBucket; ranges: [number, number][] }[] = [
  {
    name: "red",
    ranges: [
      [345, 360],
      [0, 15],
    ],
  },
  { name: "orange", ranges: [[15, 50]] },
  { name: "yellow", ranges: [[50, 95]] },
  { name: "green", ranges: [[95, 160]] },
  { name: "cyan", ranges: [[160, 210]] },
  { name: "blue", ranges: [[210, 265]] },
  { name: "purple", ranges: [[265, 310]] },
  { name: "pink", ranges: [[310, 345]] },
];

const CHROMA_THRESHOLD = 0.08;
const clamp = (v: number) => (v < 0 ? 0 : v > 255 ? 255 : v) | 0;

const bucketForHue = (h: number | undefined): HueBucket => {
  if (h === undefined) return "red";
  for (const b of HUE_RANGES) {
    for (const [min, max] of b.ranges) {
      if (h >= min && h <= max) return b.name;
    }
  }
  return "red";
};

const nearestAvailableBucket = (
  bucket: HueBucket,
  available: Set<HueBucket>,
): HueBucket | undefined => {
  if (available.has(bucket)) return bucket;
  const idx = HUE_ORDER.indexOf(bucket);
  for (let d = 1; d < HUE_ORDER.length; d++) {
    const before = HUE_ORDER[(idx - d + HUE_ORDER.length) % HUE_ORDER.length];
    if (available.has(before)) return before;
    const after = HUE_ORDER[(idx + d) % HUE_ORDER.length];
    if (available.has(after)) return after;
  }
  return undefined;
};

const nearestNeutralIndex = (l: number, neutrals: string[]): number => {
  let best = 0;
  let bestDist = Infinity;
  for (let i = 0; i < neutrals.length; i++) {
    const c = toOklch(neutrals[i]);
    const d = Math.abs((c?.l ?? 0) - l);
    if (d < bestDist) {
      bestDist = d;
      best = i;
    }
  }
  return best;
};

type Classification =
  | { kind: "neutral"; index: number; matchHex: string }
  | { kind: "accent"; bucket: HueBucket; matchHex: string };

const classify = (hex: string, preset: Preset): Classification | null => {
  const c = toOklch(hex);
  if (!c) return null;
  if ((c.c ?? 0) < CHROMA_THRESHOLD && preset.neutrals.length > 0) {
    const i = nearestNeutralIndex(c.l ?? 0, preset.neutrals);
    return { kind: "neutral", index: i, matchHex: preset.neutrals[i] };
  }
  const bucket = bucketForHue(c.h);
  const available = new Set(Object.keys(preset.accents) as HueBucket[]);
  const pick = nearestAvailableBucket(bucket, available);
  const matchHex = pick
    ? preset.accents[pick]
    : preset.neutrals[Math.floor(preset.neutrals.length / 2)];
  if (!matchHex) return null;
  return { kind: "accent", bucket: pick ?? bucket, matchHex };
};

const targetFor = (cls: Classification, src: Preset, tgt: Preset): string => {
  if (cls.kind === "neutral") {
    if (tgt.neutrals.length === 0) {
      return Object.values(tgt.accents)[0] ?? "#000000";
    }
    if (src.neutrals.length <= 1) return tgt.neutrals[0];
    const ratio = cls.index / (src.neutrals.length - 1);
    const i = Math.round(ratio * (tgt.neutrals.length - 1));
    return tgt.neutrals[i];
  }
  const available = new Set(Object.keys(tgt.accents) as HueBucket[]);
  const pick = nearestAvailableBucket(cls.bucket, available);
  if (pick && tgt.accents[pick]) return tgt.accents[pick]!;
  return tgt.neutrals[Math.floor(tgt.neutrals.length / 2)] ?? "#000000";
};

export const detectSource = (palette: Swatch[]): Preset => {
  let best = presets[0];
  let bestScore = Infinity;
  const top = palette.slice(0, 50);
  for (const preset of presets) {
    let score = 0;
    for (const s of top) {
      const cls = classify(s.hex, preset);
      if (!cls) continue;
      const [pr, pg, pb] = hexToRgb(s.hex);
      const [mr, mg, mb] = hexToRgb(cls.matchHex);
      const dr = pr - mr;
      const dg = pg - mg;
      const db = pb - mb;
      score += (dr * dr + dg * dg + db * db) * s.count;
    }
    if (score < bestScore) {
      bestScore = score;
      best = preset;
    }
  }
  return best;
};

export type RemapOptions = {
  desatAccents: number;
  dimAccents: number;
  preserveAlpha: boolean;
};

export const defaultRemapOptions: RemapOptions = {
  desatAccents: 0.35,
  dimAccents: 0.55,
  preserveAlpha: true,
};

export const buildColorMap = (
  paletteHexes: string[],
  source: Preset,
  target: Preset,
  opts: RemapOptions = defaultRemapOptions,
): Map<string, string> => {
  const baseRgb = hexToRgb(target.neutrals[0] ?? "#000000");
  const out = new Map<string, string>();
  for (const hex of paletteHexes) {
    const cls = classify(hex, source);
    if (!cls) {
      out.set(hex, hex);
      continue;
    }
    const targetHex = targetFor(cls, source, target);
    const [mr, mg, mb] = hexToRgb(cls.matchHex);
    const [tr, tg, tb] = hexToRgb(targetHex);
    const [r, g, b] = hexToRgb(hex);
    let or = clamp(tr + (r - mr));
    let og = clamp(tg + (g - mg));
    let ob = clamp(tb + (b - mb));

    if (cls.kind === "accent") {
      const lum = (0.299 * or + 0.587 * og + 0.114 * ob) / 255;
      const gray = 0.299 * or + 0.587 * og + 0.114 * ob;
      or = or * (1 - opts.desatAccents) + gray * opts.desatAccents;
      og = og * (1 - opts.desatAccents) + gray * opts.desatAccents;
      ob = ob * (1 - opts.desatAccents) + gray * opts.desatAccents;
      const w = (1 - lum) * opts.dimAccents;
      or = or * (1 - w) + baseRgb[0] * w;
      og = og * (1 - w) + baseRgb[1] * w;
      ob = ob * (1 - w) + baseRgb[2] * w;
    }

    out.set(hex, `#${toHex(clamp(or))}${toHex(clamp(og))}${toHex(clamp(ob))}`);
  }
  return out;
};

export const renderRemapped = (
  source: ImageData,
  mapping: Map<string, string>,
): ImageData => {
  const { data, width, height } = source;
  const out = new ImageData(width, height);
  const cache = new Map<number, [number, number, number]>();
  for (const [hex, newHex] of mapping) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const key = (r << 16) | (g << 8) | b;
    const nr = parseInt(newHex.slice(1, 3), 16);
    const ng = parseInt(newHex.slice(3, 5), 16);
    const nb = parseInt(newHex.slice(5, 7), 16);
    cache.set(key, [nr, ng, nb]);
  }
  for (let i = 0; i < data.length; i += 4) {
    const key = (data[i] << 16) | (data[i + 1] << 8) | data[i + 2];
    const hit = cache.get(key);
    if (hit) {
      out.data[i] = hit[0];
      out.data[i + 1] = hit[1];
      out.data[i + 2] = hit[2];
    } else {
      out.data[i] = data[i];
      out.data[i + 1] = data[i + 1];
      out.data[i + 2] = data[i + 2];
    }
    out.data[i + 3] = data[i + 3];
  }
  return out;
};
