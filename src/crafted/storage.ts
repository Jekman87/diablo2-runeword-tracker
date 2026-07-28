import { z } from "zod";

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
export function loadCrafted(known: ReadonlySet<string>): StoredProgress {
  const raw = read();

  if (raw === null) return empty();

  const parsed = storedNamesSchema.safeParse(parseJson(raw));

  if (!parsed.success) return empty();

  const crafted = new Set<string>();
  const unknown: string[] = [];

  // A `Set` first, so a hand-edited list naming the same runeword twice marks
  // it once and cannot inflate the count.
  for (const name of new Set(parsed.data)) {
    if (known.has(name)) crafted.add(name);
    else unknown.push(name);
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
 * player has no way to see. `IDEAS.md` already rules the same failure out for
 * CSV import, where unmatched names must be reported rather than skipped
 * quietly.
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
