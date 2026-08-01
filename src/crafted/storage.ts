import { z } from "zod";

import { foldLabel } from "@/runewords/fold";

/**
 * The one place that names the storage key or touches the storage API.
 *
 * Plain functions with no React import, which is what lets the five failure
 * modes below be tested directly instead of through a rendered component. It is
 * also what makes `csv-import-export` a second *caller* rather than a second
 * definition of the format: an import writes through here.
 */
export interface StoredProgress {
  /** Names the dataset knows. Everything the interface renders comes from here. */
  crafted: ReadonlySet<string>;
  /** Names it does not. Rendered nowhere, counted nowhere, written back always. */
  unknown: readonly string[];
}

/**
 * Every name the dataset answers to, keyed by its **folded** form and resolving
 * to the canonical English name.
 *
 * The keys being pre-folded is the one precondition this module cannot check.
 * It is what lets a lookup be a lookup rather than a scan, and it is why the map
 * is built where the dataset is — `runewordNameAliases` in `@/data` builds it
 * with the same `foldLabel` used below, once, instead of this module rebuilding
 * an index on every split.
 */
export type NameAliases = ReadonlyMap<string, string>;

/**
 * The key, namespaced and versioned.
 *
 * The namespace is load-bearing rather than tidy. The site is published to
 * `jekman87.github.io/diablo2-runeword-tracker/`, and **GitHub Pages serves
 * every project under an account from one origin** — which means one
 * `localStorage`, shared with every other project the owner deploys there. A
 * key called `crafted` is a collision waiting for a second project that tracks
 * something.
 *
 * The version is in the key and not in the payload. A future v2 writes a
 * different key and leaves this one sitting there intact, so a format change can
 * be rolled back or migrated; a `version` field inside one key would already
 * have destroyed the old value by the time anyone noticed.
 *
 * Exported for the tests, which need to plant a raw value. Nothing else may read
 * it — a second module naming the key is a second definition of the format.
 */
export const CRAFTED_STORAGE_KEY = "diablo2-runeword-tracker:crafted:v1";

/**
 * Reads stored progress, split against the names the dataset actually has.
 *
 * Every failure — absent, unreadable, unparseable, the wrong shape — returns
 * empty progress rather than throwing, because the alternative for a page whose
 * state is this value is a blank screen.
 *
 * Reading never writes. That is the whole reason the hook saves from the toggle
 * instead of from an effect: a value that failed to parse is still there
 * afterwards to be inspected or repaired by hand.
 */
export function loadCrafted(known: NameAliases): StoredProgress {
  const raw = read();

  if (raw === null) return empty();

  const parsed = storedNamesSchema.safeParse(parseJson(raw));

  if (!parsed.success) return empty();

  return splitStoredNames(parsed.data, known);
}

/**
 * A list of names split into the ones the dataset knows and the ones it does not.
 *
 * Extracted from `loadCrafted` so that an imported file goes through **the same
 * split a stored value goes through**. Two implementations of "does the dataset
 * know this name" would agree on the day they were written and are one patch
 * apart from disagreeing about a renamed runeword — which is the one case both
 * of them exist to handle.
 *
 * Takes the names the dataset answers to rather than importing the dataset,
 * which is what keeps this module testable without one and is why `loadCrafted`
 * has the parameter it has.
 *
 * **Matching folds case, surrounding whitespace and `ё`/`е`, and accepts a
 * runeword's Russian label as readily as its canonical English name.** The
 * exporter writes canonical names, so a file this application produced
 * round-trips exactly; the tolerance is for the file a player typed, translated
 * or pulled out of a spreadsheet, and a Russian reader's hand-written list is
 * Russian. It stops there deliberately: an import reports nothing about what it
 * failed to match, so a near-miss is invisible, and fuzzy distance or
 * punctuation stripping would be ways for an import to mark a runeword the file
 * did not name. The two labels per runeword cannot do that — they are the
 * dataset's own text, and their folded forms are distinct across all 99
 * runewords, which `src/data/index.test.ts` asserts.
 *
 * What is stored for a match is the canonical English name, whatever language
 * the file used, so nothing downstream has to fold or translate anything again.
 */
export function splitStoredNames(
  names: Iterable<string>,
  known: NameAliases,
): StoredProgress {
  const crafted = new Set<string>();
  const unknown: string[] = [];

  // A `Set` first, so a hand-edited list or an imported file naming the same
  // runeword twice marks it once and cannot inflate the count.
  for (const name of new Set(names)) {
    const match = known.get(foldLabel(name));

    if (match === undefined) unknown.push(name);
    else crafted.add(match);
  }

  return { crafted, unknown };
}

/**
 * Writes progress, carrying the unknown names through untouched.
 *
 * Preserving them is the deliberate half of this module. A stored name the
 * dataset does not have is either something the player typed or a runeword
 * renamed between game patches — and in the second case dropping it means that
 * when the patch restores the runeword, it comes back unmarked, for a reason the
 * player has no way to see.
 *
 * This used to add that `IDEAS.md` rules the same failure out for CSV import,
 * "where unmatched names must be reported rather than skipped quietly". That
 * decision was withdrawn on 2026-07-31. An import reports nothing: it preserves
 * an unmatched name exactly as this does, and the count in its confirmation is
 * what a player judges a file by. The preservation is the part that survived, and
 * `splitStoredNames` below is where an import gets it from.
 *
 * **An import is the one save that does not carry these forward**, because it
 * replaces the whole stored value rather than editing it — the names it brings
 * become the unknown list and the ones held before it are gone with everything
 * else. `progress-transfer` specifies that, `progress-persistence` records the
 * exception, and it is the only way one of these names can ever be cleared:
 * nothing in the interface renders one.
 *
 * Sorted, so the same set of marks produces byte-identical storage regardless of
 * the order they were made in. Code-point order rather than `localeCompare`, for
 * the reason the row comparator gives: the result must not depend on the
 * runtime's collation.
 */
export function saveCrafted({ crafted, unknown }: StoredProgress): void {
  write(JSON.stringify([...crafted, ...unknown].sort()));
}

/**
 * What a stored value has to look like: a list of non-empty strings.
 *
 * Parsed, not asserted. `localStorage` is external input by every meaningful
 * definition — user-editable in two clicks, shared with every other page on the
 * origin, and last written by a version of this application that may not be this
 * one. The project already refuses to trust the generated, committed dataset;
 * trusting this instead would be exactly backwards.
 */
const storedNamesSchema = z.array(z.string().min(1));

/** A fresh object each time, so no caller can mutate a shared empty. */
function empty(): StoredProgress {
  return { crafted: new Set(), unknown: [] };
}

function read(): string | null {
  try {
    return window.localStorage.getItem(CRAFTED_STORAGE_KEY);
  } catch {
    // Storage disabled, or a privacy mode that throws on access. Caught here
    // rather than at the call site so that no component has to know storage can
    // fail at all.
    return null;
  }
}

function write(value: string): void {
  try {
    window.localStorage.setItem(CRAFTED_STORAGE_KEY, value);
  } catch {
    // Disabled, full, or throwing in a private mode. The session keeps working
    // in memory, and there is nothing to tell the player that they could act on.
  }
}

function parseJson(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    // Not JSON at all. `undefined` fails the schema below, which is the same
    // path as JSON of the wrong shape — one recovery, not two.
    return undefined;
  }
}
