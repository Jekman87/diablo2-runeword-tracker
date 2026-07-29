import { z } from "zod";

import { sortDirections, sortKeys } from "@/runewords/sort";
import {
  DEFAULT_VIEW_SETTINGS,
  type ViewSettings,
  craftedFilters,
  slotFilters,
} from "@/view/types";

/**
 * The key, namespaced and versioned.
 *
 * The namespace is load-bearing rather than tidy: the site is published to
 * `jekman87.github.io/diablo2-runeword-tracker/`, and **GitHub Pages serves every
 * project under an account from one origin** — one `localStorage`, shared with
 * every other project the owner deploys. A key called `view` is a collision
 * waiting for a second project that has one.
 *
 * The version is in the key and not in the payload, so a future v2 writes
 * elsewhere and leaves this value intact rather than destroying it in place.
 *
 * **A different key from `CRAFTED_STORAGE_KEY`, deliberately.** Discarding an
 * unusable sort setting must not be able to take a player's progress with it.
 *
 * Exported for the tests, which need to plant a raw value. Nothing else may read
 * it — a second module naming the key is a second definition of the format.
 */
export const VIEW_STORAGE_KEY = "diablo2-runeword-tracker:view:v1";

/**
 * Reads the stored view settings, falling back to the defaults.
 *
 * Every failure — absent, unreadable, not JSON, the wrong shape, a choice this
 * version does not offer — returns `DEFAULT_VIEW_SETTINGS`. **Reading never
 * writes**, which is why the hook saves from its setters rather than from an
 * effect: an effect fires on mount and would overwrite a value that failed to
 * parse before the player had touched anything.
 *
 * The fallback is where this module is the **opposite of `src/crafted/storage.ts`**
 * and the reason the two are separate. Progress is the player's work: a value that
 * failed to parse is left untouched so it can be repaired by hand, and a name the
 * dataset does not know is carried forward because it cannot be reconstructed. A
 * sort direction is not the player's work. Nobody will ever hand-repair one, and
 * recovering a stale `sortKey` is worth nothing — so a bad record is discarded and
 * the next change of a control overwrites it. One module serving both would have a
 * write path that has to know which half of its payload may be discarded.
 */
export function loadViewSettings(): ViewSettings {
  const raw = read();

  if (raw === null) return { ...DEFAULT_VIEW_SETTINGS };

  const parsed = viewSettingsSchema.safeParse(parseJson(raw));

  if (!parsed.success) return { ...DEFAULT_VIEW_SETTINGS };

  return parsed.data;
}

/**
 * Writes the view settings.
 *
 * The four fields and nothing else — in particular **no search query**. A query
 * restored from an earlier session narrows the table to a few rows for a reason
 * the player has forgotten, which reads as a broken dataset rather than as a
 * preference. The record has no field for one, rather than an empty one.
 *
 * Called from the settings' setters and **never from an effect**, for the reason
 * `loadViewSettings` gives above.
 */
export function saveViewSettings(settings: ViewSettings): void {
  write(
    JSON.stringify({
      sortKey: settings.sortKey,
      sortDirection: settings.sortDirection,
      craftedFilter: settings.craftedFilter,
      slotFilter: settings.slotFilter,
    }),
  );
}

/**
 * What a stored record has to look like: four enums, each over the choices *this*
 * version offers.
 *
 * Parsed, not asserted. `localStorage` is external input by every meaningful
 * definition — user-editable in two clicks, shared with every other page on the
 * origin, and last written by a version of this application that may not be this
 * one. The project refuses to trust its own generated dataset; trusting this
 * instead would be exactly backwards.
 *
 * The enums read from the tuples the rest of the code is typed against, so a sort
 * key added in `src/runewords/sort.ts` becomes storable without this file being
 * touched, and one removed stops being accepted without it being remembered.
 *
 * **An unrecognised member rejects the whole record**, not the one field. Merging
 * field by field would leave the view in a state no version of the interface can
 * produce — a valid-looking record whose `sortKey` names a column that no longer
 * exists.
 */
const viewSettingsSchema = z.object({
  sortKey: z.enum(sortKeys),
  sortDirection: z.enum(sortDirections),
  craftedFilter: z.enum(craftedFilters),
  slotFilter: z.enum(slotFilters),
});

function read(): string | null {
  try {
    return window.localStorage.getItem(VIEW_STORAGE_KEY);
  } catch {
    // Storage disabled, or a privacy mode that throws on access. Caught here
    // rather than at the call site so that no component has to know storage can
    // fail at all.
    return null;
  }
}

function write(value: string): void {
  try {
    window.localStorage.setItem(VIEW_STORAGE_KEY, value);
  } catch {
    // Disabled, full, or throwing in a private mode. Searching, sorting and
    // filtering all keep working for the session, and there is nothing to tell
    // the player that they could act on.
  }
}

function parseJson(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    // Not JSON at all. `undefined` fails the schema above, which is the same path
    // as JSON of the wrong shape — one recovery, not two.
    return undefined;
  }
}
