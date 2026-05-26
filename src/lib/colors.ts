export type RGB = readonly [number, number, number];

export const toHex = (n: number) => n.toString(16).padStart(2, "0");

export const rgbToHex = ([r, g, b]: RGB) =>
  `#${toHex(r)}${toHex(g)}${toHex(b)}`;

export const hexToRgb = (hex: string): RGB => {
  const clean = hex.replace(/^#/, "");
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return [r, g, b];
};

export const relLuminance = ([r, g, b]: RGB) => {
  const a = [r, g, b].map((v) => {
    const x = v / 255;
    return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
};

export const isLight = (hex: string) => relLuminance(hexToRgb(hex)) > 0.55;

export type Swatch = {
  hex: string;
  count: number;
  pct: number;
};
