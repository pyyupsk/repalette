import { wcagLuminance } from "culori";

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

export const isLight = (hex: string) => wcagLuminance(hex) > 0.55;

export type Swatch = {
  hex: string;
  count: number;
  pct: number;
};
