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
  build: {
    // Emit every asset as a fingerprinted file instead of inlining the small
    // ones. Vite's 4 KB default would inline the cursor (1 928 B) and the
    // divider (3 482 B) as base64 data URIs, which is not merely a different
    // encoding: it would leave the sub-path guarantee for CSS-referenced
    // assets exercised by the font alone, and silently split future images
    // into "inlined" and "prefixed" depending on their size. A data URI also
    // rides inside the render-blocking stylesheet rather than being cached
    // separately. Two cacheable requests on a static site is the cheaper side
    // of that trade.
    assetsInlineLimit: 0,
  },
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
