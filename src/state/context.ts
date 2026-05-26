import { createContext, type Dispatch } from "react";
import type { Swatch } from "../lib/colors";
import { defaultRemapOptions, type RemapOptions } from "../lib/remap";
import type { Preset } from "../lib/presets";

export type Theme = "light" | "dark" | "system";

export type ImageState = {
  file: File;
  url: string;
  bitmap: ImageBitmap;
  width: number;
  height: number;
  data: ImageData;
};

export type Status = "idle" | "decoding" | "ready" | "error";

export type State = {
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
};

export type Action =
  | { type: "set-theme"; theme: Theme }
  | { type: "begin-decode" }
  | { type: "set-image"; image: ImageState; palette: Swatch[]; source: Preset }
  | { type: "decode-failed"; error: string }
  | { type: "reset" }
  | { type: "select"; hex: string | null }
  | { type: "edit"; from: string; to: string | null }
  | { type: "preview"; preset: Preset; mapping: Map<string, string> }
  | { type: "commit-preview" }
  | { type: "revert-preview" }
  | { type: "set-source"; preset: Preset };

export type Ctx = State & {
  dispatch: Dispatch<Action>;
  effectiveMapping: Map<string, string>;
};

export const initialState: State = {
  theme: "system",
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
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "set-theme":
      return { ...state, theme: action.theme };
    case "begin-decode":
      return { ...state, status: "decoding", error: null };
    case "set-image":
      return {
        ...state,
        image: action.image,
        palette: action.palette,
        sourcePreset: action.source,
        selectedHex: action.palette[0]?.hex ?? null,
        mapping: new Map(),
        previewMapping: null,
        previewPreset: null,
        status: "ready",
        error: null,
      };
    case "decode-failed":
      return { ...state, status: "error", error: action.error };
    case "reset":
      return { ...initialState, theme: state.theme };
    case "select":
      return { ...state, selectedHex: action.hex };
    case "edit": {
      const next = new Map(state.mapping);
      if (action.to === null || action.to === action.from)
        next.delete(action.from);
      else next.set(action.from, action.to);
      return { ...state, mapping: next };
    }
    case "preview":
      return {
        ...state,
        previewMapping: action.mapping,
        previewPreset: action.preset,
      };
    case "commit-preview": {
      if (!state.previewMapping) return state;
      const next = new Map(state.mapping);
      for (const [k, v] of state.previewMapping) {
        if (k !== v) next.set(k, v);
      }
      return {
        ...state,
        mapping: next,
        previewMapping: null,
        previewPreset: null,
      };
    }
    case "revert-preview":
      return { ...state, previewMapping: null, previewPreset: null };
    case "set-source":
      return { ...state, sourcePreset: action.preset };
  }
};

export const AppCtx = createContext<Ctx | null>(null);
