import { hexToRgb, type RGB, type Swatch, toHex } from "./colors";
import { type Preset, type PresetSlot, presets } from "./presets";

type SlotEntry = { slot: PresetSlot; rgb: RGB };

const ACCENT_SLOTS = new Set<PresetSlot>([
  "rosewater",
  "flamingo",
  "pink",
  "mauve",
  "red",
  "maroon",
  "peach",
  "yellow",
  "green",
  "teal",
  "sky",
  "sapphire",
  "blue",
  "lavender",
]);

const clamp = (v: number) => (v < 0 ? 0 : v > 255 ? 255 : v) | 0;

const slotsOf = (preset: Preset): SlotEntry[] =>
  (Object.keys(preset.colors) as PresetSlot[]).map((slot) => ({
    slot,
    rgb: hexToRgb(preset.colors[slot]),
  }));

const nearestSlot = (rgb: RGB, slots: SlotEntry[]): SlotEntry => {
  let best = Infinity;
  let pick = slots[0];
  for (const entry of slots) {
    const dr = rgb[0] - entry.rgb[0];
    const dg = rgb[1] - entry.rgb[1];
    const db = rgb[2] - entry.rgb[2];
    const d = dr * dr + dg * dg + db * db;
    if (d < best) {
      best = d;
      pick = entry;
    }
  }
  return pick;
};

export const detectSource = (palette: Swatch[]): Preset => {
  let bestScore = Infinity;
  let bestPreset = presets[0];
  const topSwatches = palette.slice(0, 50);
  for (const preset of presets) {
    const slots = slotsOf(preset);
    let score = 0;
    for (const s of topSwatches) {
      const rgb = hexToRgb(s.hex);
      const near = nearestSlot(rgb, slots);
      const dr = rgb[0] - near.rgb[0];
      const dg = rgb[1] - near.rgb[1];
      const db = rgb[2] - near.rgb[2];
      score += (dr * dr + dg * dg + db * db) * s.count;
    }
    if (score < bestScore) {
      bestScore = score;
      bestPreset = preset;
    }
  }
  return bestPreset;
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
  const srcSlots = slotsOf(source);
  const baseRgb = hexToRgb(target.colors.base);
  const out = new Map<string, string>();
  for (const hex of paletteHexes) {
    const rgb = hexToRgb(hex);
    const near = nearestSlot(rgb, srcSlots);
    const tgt = hexToRgb(target.colors[near.slot]);
    let or = clamp(tgt[0] + (rgb[0] - near.rgb[0]));
    let og = clamp(tgt[1] + (rgb[1] - near.rgb[1]));
    let ob = clamp(tgt[2] + (rgb[2] - near.rgb[2]));

    if (ACCENT_SLOTS.has(near.slot)) {
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

    const cr = clamp(or);
    const cg = clamp(og);
    const cb = clamp(ob);
    out.set(hex, `#${toHex(cr)}${toHex(cg)}${toHex(cb)}`);
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
