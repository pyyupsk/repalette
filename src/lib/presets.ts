export type PresetSlot =
  | "crust" | "mantle" | "base" | "surface0" | "surface1" | "surface2"
  | "overlay0" | "overlay1" | "overlay2"
  | "subtext0" | "subtext1" | "text"
  | "rosewater" | "flamingo" | "pink" | "mauve"
  | "red" | "maroon" | "peach" | "yellow"
  | "green" | "teal" | "sky" | "sapphire" | "blue" | "lavender";

export type Preset = {
  id: string;
  name: string;
  attribution: string;
  colors: Record<PresetSlot, string>;
};

const mocha: Preset = {
  id: "catppuccin-mocha",
  name: "Catppuccin Mocha",
  attribution: "catppuccin.com",
  colors: {
    crust: "#11111b", mantle: "#181825", base: "#1e1e2e",
    surface0: "#313244", surface1: "#45475a", surface2: "#585b70",
    overlay0: "#6c7086", overlay1: "#7f849c", overlay2: "#9399b2",
    subtext0: "#a6adc8", subtext1: "#bac2de", text: "#cdd6f4",
    rosewater: "#f5e0dc", flamingo: "#f2cdcd", pink: "#f5c2e7", mauve: "#cba6f7",
    red: "#f38ba8", maroon: "#eba0ac", peach: "#fab387", yellow: "#f9e2af",
    green: "#a6e3a1", teal: "#94e2d5", sky: "#89dceb", sapphire: "#74c7ec",
    blue: "#89b4fa", lavender: "#b4befe",
  },
};

const beardedVividBlack: Preset = {
  id: "bearded-vivid-black",
  name: "Bearded Vivid Black",
  attribution: "BeardedBear",
  colors: {
    crust: "#060607", mantle: "#0f0f11", base: "#141417",
    surface0: "#1c1c20", surface1: "#282727", surface2: "#393836",
    overlay0: "#545458", overlay1: "#6e6e74", overlay2: "#9e9e9e",
    subtext0: "#ababb1", subtext1: "#b8b8be", text: "#c7c7cc",
    rosewater: "#b8a89e", flamingo: "#a89090", pink: "#c060c8", mauve: "#9050c8",
    red: "#a83838", maroon: "#8a4848", peach: "#9a8070", yellow: "#c89a40",
    green: "#42dd76", teal: "#14e5d4", sky: "#14e5d4", sapphire: "#28a9ff",
    blue: "#28a9ff", lavender: "#9070d8",
  },
};

const dracula: Preset = {
  id: "dracula",
  name: "Dracula",
  attribution: "draculatheme.com",
  colors: {
    crust: "#21222c", mantle: "#282a36", base: "#282a36",
    surface0: "#343746", surface1: "#3d4051", surface2: "#44475a",
    overlay0: "#5a5d72", overlay1: "#6272a4", overlay2: "#7a82b8",
    subtext0: "#a4a8c4", subtext1: "#bdc1d8", text: "#f8f8f2",
    rosewater: "#ffe5d0", flamingo: "#ffb8c8", pink: "#ff79c6", mauve: "#bd93f9",
    red: "#ff5555", maroon: "#cc5577", peach: "#ffb86c", yellow: "#f1fa8c",
    green: "#50fa7b", teal: "#80f0e0", sky: "#8be9fd", sapphire: "#6cb8e8",
    blue: "#8be9fd", lavender: "#caa9fa",
  },
};

const gruvboxDark: Preset = {
  id: "gruvbox-dark",
  name: "Gruvbox Dark",
  attribution: "morhetz",
  colors: {
    crust: "#1d2021", mantle: "#282828", base: "#32302f",
    surface0: "#3c3836", surface1: "#504945", surface2: "#665c54",
    overlay0: "#7c6f64", overlay1: "#928374", overlay2: "#a89984",
    subtext0: "#bdae93", subtext1: "#d5c4a1", text: "#ebdbb2",
    rosewater: "#ebdbb2", flamingo: "#d5a48f", pink: "#d3869b", mauve: "#b16286",
    red: "#cc241d", maroon: "#9d0006", peach: "#d65d0e", yellow: "#d79921",
    green: "#98971a", teal: "#689d6a", sky: "#83a598", sapphire: "#458588",
    blue: "#458588", lavender: "#b16286",
  },
};

const nord: Preset = {
  id: "nord",
  name: "Nord",
  attribution: "nordtheme.com",
  colors: {
    crust: "#2e3440", mantle: "#3b4252", base: "#434c5e",
    surface0: "#4c566a", surface1: "#5a6478", surface2: "#6a7384",
    overlay0: "#7d8da3", overlay1: "#8fa1b7", overlay2: "#a7b6c8",
    subtext0: "#d8dee9", subtext1: "#e5e9f0", text: "#eceff4",
    rosewater: "#e5e9f0", flamingo: "#d8b4a0", pink: "#b48ead", mauve: "#b48ead",
    red: "#bf616a", maroon: "#a85258", peach: "#d08770", yellow: "#ebcb8b",
    green: "#a3be8c", teal: "#8fbcbb", sky: "#88c0d0", sapphire: "#81a1c1",
    blue: "#5e81ac", lavender: "#b48ead",
  },
};

export const presets: Preset[] = [mocha, beardedVividBlack, dracula, gruvboxDark, nord];
export const presetById = new Map(presets.map((p) => [p.id, p]));
