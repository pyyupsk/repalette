export type HueBucket =
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "cyan"
  | "blue"
  | "purple"
  | "pink";

export type Preset = {
  id: string;
  name: string;
  attribution: string;
  // Neutrals: any length, sorted darkest -> lightest.
  neutrals: string[];
  // Accents keyed by hue bucket. Optional per preset; not every palette has every hue.
  accents: Partial<Record<HueBucket, string>>;
};

const mocha: Preset = {
  id: "catppuccin-mocha",
  name: "Catppuccin Mocha",
  attribution: "catppuccin.com",
  neutrals: [
    "#11111b",
    "#181825",
    "#1e1e2e",
    "#313244",
    "#45475a",
    "#585b70",
    "#6c7086",
    "#7f849c",
    "#9399b2",
    "#a6adc8",
    "#bac2de",
    "#cdd6f4",
  ],
  accents: {
    red: "#f38ba8",
    orange: "#fab387",
    yellow: "#f9e2af",
    green: "#a6e3a1",
    cyan: "#94e2d5",
    blue: "#89b4fa",
    purple: "#cba6f7",
    pink: "#f5c2e7",
  },
};

const beardedVividBlack: Preset = {
  id: "bearded-vivid-black",
  name: "Bearded Vivid Black",
  attribution: "BeardedBear",
  neutrals: [
    "#060607",
    "#0f0f11",
    "#141417",
    "#1c1c20",
    "#282727",
    "#393836",
    "#545458",
    "#6e6e74",
    "#9e9e9e",
    "#ababb1",
    "#c7c7cc",
  ],
  accents: {
    red: "#d62c2c",
    orange: "#ff7135",
    yellow: "#ffb638",
    green: "#42dd76",
    cyan: "#14e5d4",
    blue: "#28a9ff",
    purple: "#a95eff",
    pink: "#e66dff",
  },
};

const dracula: Preset = {
  id: "dracula",
  name: "Dracula",
  attribution: "draculatheme.com",
  neutrals: [
    "#21222c",
    "#282a36",
    "#343746",
    "#44475a",
    "#6272a4",
    "#a4a8c4",
    "#bdc1d8",
    "#f8f8f2",
  ],
  accents: {
    red: "#ff5555",
    orange: "#ffb86c",
    yellow: "#f1fa8c",
    green: "#50fa7b",
    cyan: "#8be9fd",
    purple: "#bd93f9",
    pink: "#ff79c6",
  },
};

const gruvboxDark: Preset = {
  id: "gruvbox-dark",
  name: "Gruvbox Dark",
  attribution: "morhetz",
  neutrals: [
    "#1d2021",
    "#282828",
    "#32302f",
    "#3c3836",
    "#504945",
    "#665c54",
    "#7c6f64",
    "#928374",
    "#a89984",
    "#bdae93",
    "#d5c4a1",
    "#ebdbb2",
  ],
  accents: {
    red: "#cc241d",
    orange: "#d65d0e",
    yellow: "#d79921",
    green: "#98971a",
    cyan: "#689d6a",
    blue: "#458588",
    purple: "#b16286",
  },
};

const nord: Preset = {
  id: "nord",
  name: "Nord",
  attribution: "nordtheme.com",
  neutrals: [
    "#2e3440",
    "#3b4252",
    "#434c5e",
    "#4c566a",
    "#d8dee9",
    "#e5e9f0",
    "#eceff4",
  ],
  accents: {
    red: "#bf616a",
    orange: "#d08770",
    yellow: "#ebcb8b",
    green: "#a3be8c",
    cyan: "#8fbcbb",
    blue: "#5e81ac",
    purple: "#b48ead",
  },
};

export const presets: Preset[] = [
  mocha,
  beardedVividBlack,
  dracula,
  gruvboxDark,
  nord,
];
export const presetById = new Map(presets.map((p) => [p.id, p]));
