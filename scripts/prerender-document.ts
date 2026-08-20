// The parts of the prerender that are pure string work: what goes into a built
// document, and what has to be true of the result.
//
// Split from `scripts/prerender.ts` so they can be tested without a build. The
// runner beside this file needs `dist/` on disk and a compiled SSR bundle to
// import; everything here needs neither, which is why the assertions that
// matter live on this side of the line.

/** The empty container the client build leaves in each document. */
export const EMPTY_ROOT = '<div id="root"></div>';

/**
 * The script that decides, before the first paint, whether this reader should be
 * shown the prerendered snapshot at all.
 *
 * A reader with saved progress must not be: the snapshot is the default state,
 * and showing it would be a page they never left — the same "visible frame of a
 * page the player did not leave behind" that the three storage-backed stores
 * load eagerly to avoid. A reader with nothing saved should be, and so should
 * every crawler, because for them it is simply the page, arriving without waiting
 * for the bundle.
 *
 * Three things about its shape are load-bearing:
 *
 * - **A classic `<script>`, not a module.** Modules are deferred; this has to run
 *   while the document is still being parsed and before anything is painted.
 * - **It hides with an inline `display` property**, not the `hidden` attribute:
 *   `[hidden] { display: none }` is a user-agent rule that any Tailwind display
 *   utility outranks. `src/main.tsx` removes the property again once React has
 *   committed the reader's real state, inside a `flushSync` so no frame is
 *   painted in between.
 * - **The keys are interpolated from the application's own constants**, never
 *   retyped here. A copy would be a second definition of one fact, and its
 *   failure would be silent: rename a key to `v2`, this stops matching, and
 *   returning readers start seeing the snapshot with nothing to report it.
 *
 * Wrapped in `try/catch` because reading storage throws outright in some privacy
 * modes, and this is the earliest code on the page.
 */
export function decisionScript(storageKeys: readonly string[]): string {
  if (storageKeys.length === 0) {
    throw new Error(
      "The decision script needs at least one storage key. With none it would " +
        "never hide the snapshot, and every returning reader would see a page " +
        "that is not theirs.",
    );
  }

  return (
    `<script>try{var k=${JSON.stringify(storageKeys)},` +
    `r=document.getElementById("root"),i=0;` +
    `for(;i<k.length;i++){if(localStorage.getItem(k[i])!==null){` +
    `r.style.display="none";break}}}catch(e){}</script>`
  );
}

/**
 * Puts the rendered markup into a built document, followed by the decision
 * script.
 *
 * The script goes immediately after the container so it runs with `#root` in the
 * document and still before the deferred bundle. Everything else in the file —
 * the head, the beacon, the JSON-LD block, the `<noscript>` paragraph — is left
 * exactly as the client build wrote it.
 */
export function injectInto(
  html: string,
  markup: string,
  storageKeys: readonly string[],
): string {
  if (!html.includes(EMPTY_ROOT)) {
    throw new Error(
      `The document does not contain ${EMPTY_ROOT}. The client build's output ` +
        `changed shape, so the render has nowhere to go — fix that rather than ` +
        `shipping a document with no content in it.`,
    );
  }

  if (markup.length === 0) {
    throw new Error("Rendering produced no markup.");
  }

  return html.replace(
    EMPTY_ROOT,
    `<div id="root">${markup}</div>${decisionScript(storageKeys)}`,
  );
}

/**
 * Fails unless a built document really carries the list, in the language it
 * declares.
 *
 * Presence alone is not enough to check: a Russian document full of English
 * content is the plausible failure, because the locale is the input most likely
 * to be wrong, and a presence check would wave it through. So each document is
 * given a word that must appear and a word that must not.
 *
 * This runs inside the build rather than in a test, because the thing it guards
 * against — the render silently not happening — breaks nothing a reader would
 * notice. The page keeps working, the bundle keeps mounting, and the only
 * casualty is everything a crawler was given.
 */
export function assertRendered(
  html: string,
  expectation: { label: string; present: string; absent: string },
): void {
  const root = html.match(/<div id="root">([\s\S]*?)<\/div><script>/);

  if (!root) {
    throw new Error(
      `${expectation.label}: no rendered content between the root element and ` +
        `the decision script. The render pass did not run, or its output was ` +
        `not injected.`,
    );
  }

  const body = root[1];

  // The wrong-language check comes first deliberately. When a document is
  // rendered in the other locale both conditions fail at once, and "rendered in
  // the wrong locale" is the accurate diagnosis; leading with "does not contain
  // Body Armor" would send the reader looking for a render that did happen.
  if (body.includes(expectation.absent)) {
    throw new Error(
      `${expectation.label}: the rendered content contains ` +
        `"${expectation.absent}", which belongs to the other language. The ` +
        `document was rendered in the wrong locale.`,
    );
  }

  if (!body.includes(expectation.present)) {
    throw new Error(
      `${expectation.label}: the rendered content does not contain ` +
        `"${expectation.present}", so it is not the list this document should ` +
        `carry.`,
    );
  }
}
