import { renderToString } from "react-dom/server";

import { App } from "@/App";
import { type Locale, seedLocale } from "@/i18n";

// The application, rendered to a string instead of into DOM nodes, so both entry
// documents can ship the list in their HTML. No server is involved anywhere in
// this: `renderToString` is a pure function of the tree, it runs once per
// language during `pnpm build`, and what GitHub Pages serves afterwards is the
// same static files it always served.
//
// This file lives under `src/` rather than in `scripts/` because Vite compiles
// it: it is TSX, it imports through the `@/` alias, and both are Vite's to
// resolve. `scripts/prerender.ts` is the plain Node half that calls in here and
// writes the documents — the split is "what needs the bundler" against "what
// needs the filesystem".
//
// Nothing here imports `@/index.css`. Only `main.tsx` does, which is why this
// entry pulls no stylesheet into a render that has no use for one — and why the
// built documents still get their `<link rel="stylesheet">` from the client
// build, so the prerendered list arrives styled.

/**
 * Renders the application for one language and returns its markup.
 *
 * The locale is stated rather than detected. There is no stored preference to
 * read and no document to ask at build time; the language is an input, decided
 * by which of the two files is being written.
 *
 * Everything else resolves to its default: the storage readers catch the missing
 * `window` and return empty, so this is the page a first visit sees — nothing
 * crafted, no filters, the default sort. That is the only honest thing to bake
 * into a file that every reader receives.
 */
export function renderEntry(locale: Locale): string {
  seedLocale(locale);

  return renderToString(<App />);
}
