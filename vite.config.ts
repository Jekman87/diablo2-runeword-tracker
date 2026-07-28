import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  // Hardcoded, not read from the environment: the project deploys to the
  // GitHub Pages sub-path https://jekman87.github.io/diablo2-runeword-tracker/,
  // and keeping this a committed constant makes `pnpm preview` a faithful
  // rehearsal of production asset resolution.
  base: "/diablo2-runeword-tracker/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
  },
});
