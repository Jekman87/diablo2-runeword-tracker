import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { assertRendered, injectInto } from "./prerender-document.ts";

// Puts the rendered list into both built documents.
//
// Runs after `vite build` has written `dist/`, and after a second Vite pass has
// compiled `src/prerender/entry.tsx` into something Node can import. This half
// needs no bundler: it reads two files, substitutes one element's contents, and
// writes them back. The string work and the assertions live in
// `prerender-document.ts`, which needs neither a build nor a filesystem and is
// therefore unit-tested.
//
// **Why this exists.** Until now the served HTML carried four fields a crawler
// could read — title, description, a fallback paragraph and a JSON-LD block —
// while the 99 runewords, their runes, their bases and their properties existed
// only after the bundle ran. Google renders JavaScript late, on a budget, and
// weights what it finds there less, so the long-tail queries that would find
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

/**
 * One word each document must carry and one it must not.
 *
 * `Body Armors` and `Доспехи` are the same item-type label in the two locale
 * projections, so each appears only if the table rendered *and* rendered in the
 * right language. A runeword name would not do — `Enigma` and most rune names
 * are identical in both records — and nor would a guess at the wording: the
 * first attempt here used `Броня`, which is not what the Russian record says,
 * and the build caught it. Take these from `src/data/item-types.json`.
 */
const documents = [
  {
    file: path.join(DIST, "index.html"),
    locale: "en",
    present: "Body Armors",
    absent: "Доспехи",
  },
  {
    file: path.join(DIST, "ru", "index.html"),
    locale: "ru",
    present: "Доспехи",
    absent: "Body Armors",
  },
] as const;

const { renderEntry, storageKeys } = (await import(
  pathToFileURL(SSR_ENTRY).href
)) as {
  renderEntry: (locale: "en" | "ru") => string;
  storageKeys: readonly string[];
};

for (const { file, locale, present, absent } of documents) {
  const label = path.relative(ROOT, file);
  const rendered = injectInto(
    readFileSync(file, "utf8"),
    renderEntry(locale),
    storageKeys,
  );

  assertRendered(rendered, { label, present, absent });

  // The keys came from the stores' own constants through the SSR bundle, so
  // what is left to check is that they survived the trip into the document
  // intact — a mangled key would leave the decision script matching nothing,
  // and every returning reader would start seeing the snapshot.
  for (const key of storageKeys) {
    if (!rendered.includes(key)) {
      throw new Error(
        `${label}: the decision script does not name the storage key ` +
          `"${key}", so it would not recognise a reader who has one.`,
      );
    }
  }
  writeFileSync(file, rendered, "utf8");

  console.log(
    `Prerendered ${label} in ${locale} ` +
      `(${rendered.length.toLocaleString("en-US")} characters)`,
  );
}
