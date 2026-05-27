import { useMemo } from "react";
import { create } from "zustand";
import type { Swatch } from "../lib/colors";
import type { Preset } from "../lib/presets";
import { defaultRemapOptions, type RemapOptions } from "../lib/remap";

export type Theme = "light" | "dark" | "system";

type ImageState = {
  file: File;
  url: string;
  bitmap: ImageBitmap;
  width: number;
  height: number;
  data: ImageData;
};

type Status = "idle" | "decoding" | "ready" | "error";

type AppState = {
  theme: Theme;
  image: ImageState | null;
  palette: Swatch[];
  selectedHex: string | null;
  mapping: Map<string, string>;
  previewMapping: Map<string, string> | null;
  previewPreset: Preset | null;
  sourcePreset: Preset | null;
  status: Status;
  error: string | null;
  remapOptions: RemapOptions;

  setTheme: (theme: Theme) => void;
  beginDecode: () => void;
  setImage: (image: ImageState, palette: Swatch[], source: Preset) => void;
  decodeFailed: (error: string) => void;
  reset: () => void;
  select: (hex: string | null) => void;
  edit: (from: string, to: string | null) => void;
  preview: (preset: Preset, mapping: Map<string, string>) => void;
  commitPreview: () => void;
  revertPreview: () => void;
  setSource: (preset: Preset) => void;
};

const initialTheme = (): Theme => {
  if (typeof localStorage === "undefined") return "system";
  const t = localStorage.getItem("theme");
  return t === "light" || t === "dark" ? t : "system";
};

export const useStore = create<AppState>((set) => ({
  theme: initialTheme(),
  image: null,
  palette: [],
  selectedHex: null,
  mapping: new Map(),
  previewMapping: null,
  previewPreset: null,
  sourcePreset: null,
  status: "idle",
  error: null,
  remapOptions: defaultRemapOptions,

  setTheme: (theme) => set({ theme }),

  beginDecode: () => set({ status: "decoding", error: null }),

  setImage: (image, palette, source) =>
    set({
      image,
      palette,
      sourcePreset: source,
      selectedHex: palette[0]?.hex ?? null,
      mapping: new Map(),
      previewMapping: null,
      previewPreset: null,
      status: "ready",
      error: null,
    }),

  decodeFailed: (error) => set({ status: "error", error }),

  reset: () =>
    set((s) => ({
      image: null,
      palette: [],
      selectedHex: null,
      mapping: new Map(),
      previewMapping: null,
      previewPreset: null,
      sourcePreset: null,
      status: "idle",
      error: null,
      theme: s.theme,
    })),

  select: (selectedHex) => set({ selectedHex }),

  edit: (from, to) =>
    set((s) => {
      const next = new Map(s.mapping);
      if (to === null || to === from) next.delete(from);
      else next.set(from, to);
      return { mapping: next };
    }),

  preview: (previewPreset, previewMapping) =>
    set({ previewMapping, previewPreset }),

  commitPreview: () =>
    set((s) => {
      if (!s.previewMapping) return s;
      const next = new Map(s.mapping);
      for (const [k, v] of s.previewMapping) {
        if (k !== v) next.set(k, v);
      }
      return { mapping: next, previewMapping: null, previewPreset: null };
    }),

  revertPreview: () => set({ previewMapping: null, previewPreset: null }),

  setSource: (sourcePreset) => set({ sourcePreset }),
}));

export const useEffectiveMapping = (): Map<string, string> => {
  const mapping = useStore((s) => s.mapping);
  const previewMapping = useStore((s) => s.previewMapping);
  return useMemo(() => {
    if (!previewMapping) return mapping;
    const m = new Map(previewMapping);
    for (const [k, v] of mapping) m.set(k, v);
    return m;
  }, [mapping, previewMapping]);
};
