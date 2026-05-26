import { type Swatch, toHex } from "./colors";

export type PaletteResult = {
  width: number;
  height: number;
  total: number;
  swatches: Swatch[];
  indices: Map<string, Uint32Array>;
};

export const extractPalette = (image: HTMLImageElement | ImageBitmap): PaletteResult => {
  const width = image.width;
  const height = image.height;
  const total = width * height;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("decode failed: 2d context unavailable");

  ctx.drawImage(image as CanvasImageSource, 0, 0);
  const { data } = ctx.getImageData(0, 0, width, height);

  const counts = new Map<number, number>();
  for (let i = 0; i < total; i++) {
    const o = i * 4;
    const key = (data[o] << 16) | (data[o + 1] << 8) | data[o + 2];
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  const swatches: Swatch[] = [];
  const keyToHex = new Map<number, string>();
  for (const [key, count] of counts) {
    const r = (key >> 16) & 0xff;
    const g = (key >> 8) & 0xff;
    const b = key & 0xff;
    const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    keyToHex.set(key, hex);
    swatches.push({ hex, count, pct: (count / total) * 100 });
  }
  swatches.sort((a, b) => b.count - a.count);

  const offsets = new Map<string, number>();
  const indices = new Map<string, Uint32Array>();
  for (const s of swatches) indices.set(s.hex, new Uint32Array(s.count));

  for (let i = 0; i < total; i++) {
    const o = i * 4;
    const key = (data[o] << 16) | (data[o + 1] << 8) | data[o + 2];
    const hex = keyToHex.get(key);
    if (!hex) continue;
    const arr = indices.get(hex);
    if (!arr) continue;
    const off = offsets.get(hex) ?? 0;
    arr[off] = i;
    offsets.set(hex, off + 1);
  }

  return { width, height, total, swatches, indices };
};
