import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

// Puts the rendered list into both built documents.
//
// Runs after `vite build` has written `dist/`, and after a second Vite pass has
// compiled `src/prerender/entry.tsx` into something Node can import. This half
// needs no bundler and touches no application code: it reads two files,
// substitutes one element's contents, and writes them back.
//
// **Why this exists at all.** Until now the served HTML carried four fields a
// crawler could read — title, description, a fallback paragraph and a JSON-LD
// block — while the 99 runewords, their runes, their bases and their properties
// existed only after the bundle ran. Google renders JavaScript late, on a budget,
// and weights what it finds there less, so the long-tail queries that would find
// this page ("enigma runeword", «рунное слово загадка») matched nothing in the
// document. See `docs/SITE.md`.
//
// **Why it fails loudly.** A missing prerender breaks nothing a reader would
// notice: the page still works, the bundle still mounts, and the only casualty
// is everything a crawler was given. That is precisely the failure that survives
// for months unnoticed, so every step here throws rather than warning, and the
// build stops.

const ROOT = path.resolve(import.meta.dirname, "..");
const DIST = path.join(ROOT, "dist");
const SSR_ENTRY = path.join(ROOT, ".prerender", "entry.js");

/** The empty container the client build leaves in each document. */
const EMPTY_ROOT = '<div id="root"></div>';

const documents = [
  { file: path.join(DIST, "index.html"), locale: "en" },
  { file: path.join(DIST, "ru", "index.html"), locale: "ru" },
] as const;

const { renderEntry } = (await import(pathToFileURL(SSR_ENTRY).href)) as {
  renderEntry: (locale: "en" | "ru") => string;
};

for (const { file, locale } of documents) {
  const html = readFileSync(file, "utf8");

  if (!html.includes(EMPTY_ROOT)) {
    throw new Error(
      `${path.relative(ROOT, file)} does not contain ${EMPTY_ROOT}. The client ` +
        `build's output changed shape, so the render has nowhere to go — fix ` +
        `this rather than shipping a document with no content in it.`,
    );
  }

  const markup = renderEntry(locale);

  if (markup.length === 0) {
    throw new Error(`Rendering the ${locale} document produced no markup.`);
  }

  writeFileSync(
    file,
    html.replace(EMPTY_ROOT, `<div id="root">${markup}</div>`),
    "utf8",
  );

  console.log(
    `Prerendered ${path.relative(ROOT, file)} in ${locale} ` +
      `(${markup.length.toLocaleString("en-US")} characters)`,
  );
}
