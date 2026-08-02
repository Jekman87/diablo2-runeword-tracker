import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import type { Connect } from "vite";
import { defineConfig } from "vitest/config";

/**
 * `/ru` → `/ru/`, in dev and preview, because GitHub Pages already does this
 * in production and the local servers must not disagree with it: without the
 * slash Vite's SPA fallback quietly serves the *English* root document, which
 * looks exactly like the Russian entry being broken. One redirect keeps the
 * three environments telling the same story.
 */
function ruEntryRedirect() {
  const from = "/diablo2-runeword-tracker/ru";
  const middleware: Connect.NextHandleFunction = (req, res, next) => {
    if (req.url === from || req.url?.startsWith(`${from}?`)) {
      res.statusCode = 301;
      // "" or "?query" — either way the slash lands before it.
      res.setHeader("Location", `${from}/${req.url.slice(from.length)}`);
      res.end();
      return;
    }
    next();
  };

  return {
    name: "ru-entry-redirect",
    configureServer(server: { middlewares: Connect.Server }) {
      server.middlewares.use(middleware);
    },
    configurePreviewServer(server: { middlewares: Connect.Server }) {
      server.middlewares.use(middleware);
    },
  };
}

export default defineConfig({
  // Hardcoded, not read from the environment: the project deploys to the
  // GitHub Pages sub-path https://jekman87.github.io/diablo2-runeword-tracker/,
  // and keeping this a committed constant makes `pnpm preview` a faithful
  // rehearsal of production asset resolution.
  base: "/diablo2-runeword-tracker/",
  plugins: [react(), tailwindcss(), ruEntryRedirect()],
  build: {
    rollupOptions: {
      // Two entry documents, one bundle: `ru/index.html` is the Russian front
      // door — Russian title, description and default locale for a first
      // visit — deployed as `/ru/` on Pages. Everything the two load is the
      // same fingerprinted output.
      input: {
        main: fileURLToPath(new URL("./index.html", import.meta.url)),
        ru: fileURLToPath(new URL("./ru/index.html", import.meta.url)),
      },
    },
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
