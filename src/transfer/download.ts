/**
 * The six lines that turn a string into a file the browser saves.
 *
 * Its own module because it is the only part of the transfer that needs a
 * browser: jsdom 30 implements neither `URL.createObjectURL` nor
 * `URL.revokeObjectURL`, so a component test has to stub them. Keeping this
 * behind one seam means the stub is one line in the one test that exports,
 * rather than a global fake in `src/test/setup.ts` — which is exactly the kind
 * of hand-written stand-in for a browser that file was emptied to be rid of.
 *
 * A `Blob` and an object URL rather than a `data:` URL, which jsdom would
 * tolerate without a stub. The stub is cheaper than a non-standard download path
 * in the shipped code, and Chrome's limits on `data:` downloads are a cliff this
 * has no reason to stand near.
 */
export function downloadText(filename: string, text: string): void {
  // Declared `text/csv` because the file is one; the charset is not stated
  // because the contents are ASCII, which every encoding this could be read as
  // agrees about.
  const url = URL.createObjectURL(new Blob([text], { type: "text/csv" }));
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = filename;

  // Never in the document. An anchor only has to be clicked, and appending one
  // would put a stray element in the page for the duration — and, briefly, in the
  // tab order.
  anchor.click();

  // Immediately, not on a timer. The click has already started the download by
  // the time this returns, and every engine keeps the blob alive for a download
  // in flight; leaving the URL unrevoked leaks the whole file until the tab
  // closes.
  URL.revokeObjectURL(url);
}
