import itemTypesData from "./item-types.json";
import runesData from "./runes.json";
import runewordsData from "./runewords.json";
import {
  type ItemType,
  type Rune,
  type Runeword,
  itemTypesSchema,
  runesSchema,
  runewordsSchema,
} from "./schema";

// The one way into the dataset. Consumers import from `@/data` and never reach
// for a raw JSON file, so there is no path that skips validation.
//
// The JSON is imported rather than fetched: Vite inlines roughly 45 KB into the
// bundle, which buys away a loading state, an error state and a race between
// first paint and data arrival on a page whose entire content is this data.

/** All 99 runewords, in the vendor's patch-grouped chronological order. */
export const runewords: Runeword[] = runewordsSchema.parse(runewordsData);

/** All 33 runes, in the canonical in-game order. */
export const runes: Rune[] = runesSchema.parse(runesData);

/** The 20 base item categories a runeword can be socketed into. */
export const itemTypes: ItemType[] = itemTypesSchema.parse(itemTypesData);

// Built once at load rather than scanned per use. The table alone resolves 343
// rune references.

// Keyed by canonical name, which is the identifier crafted progress, the undo
// notice and the open-panel flag all carry. It is what lets a component holding
// only a name — rather than a record — still present that runeword in the
// active locale.
export const runewordsByName: ReadonlyMap<string, Runeword> = new Map(
  runewords.map((runeword) => [runeword.name, runeword]),
);

export const runesByName: ReadonlyMap<string, Rune> = new Map(
  runes.map((rune) => [rune.name, rune]),
);

export const itemTypesByName: ReadonlyMap<string, ItemType> = new Map(
  itemTypes.map((itemType) => [itemType.name, itemType]),
);

export type { ItemType, Rune, Runeword } from "./schema";

// Validation above runs at module initialisation, unconditionally. Validating
// only in tests would look like the cheaper option — CI already proves the
// committed JSON is valid — but the likely future edit to `runewords.json` is
// somebody fixing one property by hand instead of re-running the generator, and
// load-time parsing is what makes that fail loudly. It costs about a
// millisecond for 99 records.
//
// The accepted consequence is that invalid data means a blank page rather than
// a degraded one. For a tracker whose entire content is the dataset, an obvious
// failure beats a partially rendered table of unvalidated game data.
//
// There is deliberately no `socketCount()` helper. The count is `runes.length`;
// a function wrapping one property access adds indirection and invites someone
// to cache the result in a field, which is exactly the drift the derived-count
// rule exists to prevent.
