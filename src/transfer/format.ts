/**
 * The transfer file format, as plain functions over strings.
 *
 * No React and no DOM, for the reason `src/crafted/storage.ts` gives about
 * itself: every rule in here — a byte-order mark, three kinds of line ending, a
 * quoted cell, a spreadsheet's second column — is a one-line test against a
 * string, and would be a rendered component and a file picker away otherwise.
 * `download.ts` next door holds the six lines that need a browser.
 */

/**
 * The name the browser saves an export under.
 *
 * **Not display copy, and deliberately not in the strings layer**, though
 * `docs/CODE_RULES.md` sends every user-facing string there. This one is never
 * rendered in the interface, and it must not change when the interface language
 * does: a file written by a browser set to Russian and opened in one set to
 * English has to be the same file. That is the same reasoning that keeps
 * canonical runeword names out of the layer.
 *
 * No timestamp, matching the decision that the contents carry none. A second
 * export overwrites the first or gets a browser-appended `(1)`, which is the
 * browser's business.
 */
export const EXPORT_FILENAME = "diablo2-runeword-tracker-crafted.csv";

/**
 * The crafted names as the text of a file: one canonical name per line, and
 * nothing else at all.
 *
 * **No header line.** There was one — `# diablo2-runeword-tracker export v1` —
 * on the argument that a future format change needs a way to announce itself. It
 * came out because nothing read it and nothing was ever going to until a v2
 * existed: it was a line of ceremony at the top of every file the player opens,
 * paid for by a version that may never ship. If one does, it can introduce its
 * own marker and treat an unmarked file as v1, which is exactly what this is.
 *
 * `parseImport` still skips `#` lines, deliberately, and that outlives the
 * header for two reasons: files already exported with it must keep importing,
 * and a hand-written list is allowed to carry a comment.
 *
 * Sorted by code point, so the same set of marks produces byte-identical output
 * however it was arrived at — the same guarantee `saveCrafted` makes about
 * storage, for the same reason and by the same means. `localeCompare` would make
 * the bytes depend on the runtime's collation.
 *
 * **No cell escaping, because there is nothing to escape.** All 99 canonical
 * names are ASCII and none contains a comma, a tab or a quote; the two that are
 * not plain letters carry an apostrophe (`Ancient's Pledge`, `King's Grace`),
 * which is not a CSV metacharacter. A quoting pass here would be code that never
 * runs, and `parseImport` unwraps quotes anyway for the files other tools write.
 *
 * LF rather than CRLF, and no byte-order mark. Both are what a reader has to
 * strip back off, and `parseImport` tolerates either from a file that arrives
 * with them.
 */
export function formatExport(names: Iterable<string>): string {
  const lines = [...names].sort();

  // Nothing crafted is an empty file rather than a lone newline. A trailing
  // newline otherwise, so the file ends the way a text file ends; it costs the
  // parser nothing, because a blank final line yields no candidate.
  return lines.length === 0 ? "" : `${lines.join("\n")}\n`;
}

/**
 * The candidate names in a file's text, in the order they appear, without
 * repeats.
 *
 * Candidates, not runewords: nothing here knows what the dataset holds. Matching
 * is `splitStoredNames`'s, which is the same split a stored value goes through,
 * so an imported list and a stored list cannot disagree about what counts as a
 * known name.
 *
 * **Text, and deliberately not a spreadsheet.** A workbook parser would be the
 * largest dependency in this project, added to read a list of names; anyone
 * holding one saves it as CSV in two clicks. A `.xlsx` chosen anyway is parsed
 * as text like anything else, yields candidates that match nothing, and reaches
 * the confirmation counting zero — which is a screen the player can cancel,
 * rather than an error state this would otherwise have to have copy for.
 *
 * What it handles, and the whole of it: a leading byte-order mark; CRLF, LF and
 * lone CR alike; a line whose first non-blank character is `#`, which is what
 * keeps a file exported while this format had a header line readable and lets a
 * hand-written list carry comments; blank
 * lines; the first cell of a line, where a cell ends at the first comma or tab;
 * and a cell wrapped in double quotes, including one containing a comma or a
 * doubled quote.
 *
 * What it does not handle is a quoted cell containing a raw newline, which would
 * split into two candidates that both match nothing. A runeword name contains no
 * newline, so the only file that reaches this was never a list of runeword names.
 */
export function parseImport(text: string): string[] {
  // Order-preserving, and a `Set` rather than a filtered array because the file
  // is the player's and may well list the same runeword twice.
  const candidates = new Set<string>();

  for (const line of stripBom(text).split(/\r\n|\r|\n/)) {
    // Tested on the raw line rather than on the extracted cell, because a
    // comment is a property of the line: `# note, something` is one comment and
    // not a cell called `# note`.
    if (line.trimStart().startsWith("#")) continue;

    const candidate = firstCell(line).trim();

    if (candidate !== "") candidates.add(candidate);
  }

  return [...candidates];
}

/**
 * The text before the first comma or tab, or the contents of a quoted cell.
 *
 * A spreadsheet saved as CSV puts the name in the first column and whatever else
 * the player was tracking in the rest; taking the first cell is what makes such a
 * file work without the parser knowing anything about columns.
 */
function firstCell(line: string): string {
  const start = line.trimStart();

  if (start.startsWith('"')) return quotedCell(start);

  const separator = start.search(/[,\t]/);

  return separator === -1 ? start : start.slice(0, separator);
}

/**
 * The contents of a cell that opens with a double quote.
 *
 * Inside quotes a comma is text rather than a separator, and `""` is one literal
 * quote — the two rules that make quoting worth honouring at all. A cell that is
 * never closed yields what there was, because discarding the line would lose a
 * name over a stray character at the end of a file.
 */
function quotedCell(cell: string): string {
  let value = "";

  for (let index = 1; index < cell.length; index += 1) {
    if (cell[index] !== '"') {
      value += cell[index];
      continue;
    }

    if (cell[index + 1] !== '"') return value;

    value += '"';
    index += 1;
  }

  return value;
}

/**
 * The text without a leading byte-order mark.
 *
 * Excel writes one in front of every CSV it saves as UTF-8, and it is invisible
 * in every editor the player might check the file in — so left in place it would
 * silently cost them whichever runeword happened to be on the first line.
 *
 * Written as an escape rather than as the character itself, because the
 * character is zero-width: pasted literally into this file it would be a
 * comparison against something no reviewer can see.
 */
function stripBom(text: string): string {
  return text.startsWith("\uFEFF") ? text.slice(1) : text;
}
