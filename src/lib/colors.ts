import { wcagLuminance } from "culori";

export type RGB = readonly [number, number, number];

export const toHex = (n: number) => n.toString(16).padStart(2, "0");

export const stripHash = (hex: string) => hex.replace(/^#/, "");

export const isValidHex = (s: string) => /^#?[0-9a-f]{6}$/i.test(s);

export const clampByte = (v: number) =>
  (v < 0 ? 0 : v > 255 ? 255 : v) | 0;

export const rgbToHex = ([r, g, b]: RGB) =>
  `#${toHex(r)}${toHex(g)}${toHex(b)}`;

export const hexToRgb = (hex: string): RGB => {
  const clean = stripHash(hex);
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
