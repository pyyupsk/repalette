import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";

import { cloudflare } from "@cloudflare/vite-plugin";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
    cloudflare()
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (!id.includes("node_modules")) return;
          if (id.includes("/react-dom/") || id.includes("/scheduler/")) {
            return "react-dom";
          }
          if (id.includes("/react/")) return "react";
          if (id.includes("@base-ui") || id.includes("@floating-ui")) {
            return "base-ui";
          }
          if (id.includes("@tabler/icons")) return "icons";
          if (id.includes("@tanstack")) return "virtual";
          if (id.includes("culori")) return "culori";
          if (id.includes("react-colorful")) return "colorful";
          if (id.includes("sonner")) return "sonner";
        },
      },
    },
  },
});