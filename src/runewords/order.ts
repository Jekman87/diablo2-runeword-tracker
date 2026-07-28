import { type Runeword, runewords } from "@/data";

/**
 * All 99 runewords in the order the table presents them: required level
 * ascending, name breaking a tie.
 *
 * Sorted once here, at module scope, over a dataset that cannot change at
 * runtime. Sorting inside a component would re-order 99 records on every
 * render, and wrapping a constant in `useMemo` is ceremony around a value that
 * was never recomputed in the first place.
 *
 * `runewords` is copied rather than sorted in place: `@/data` hands out the
 * dataset in the vendor's patch-grouped order and other consumers are entitled
 * to find it that way.
 */
export const orderedRunewords: readonly Runeword[] = [...runewords].sort(
  byRequiredLevel,
);

/**
 * Compares two runewords by required level, then by name.
 *
 * The name tiebreak is not a nicety. Twenty-three levels are shared across the
 * dataset and the largest group holds ten runewords, so on level alone the
 * position of a row would be a property of the sort implementation rather than
 * of the data, and "where is Fortitude" could answer differently between
 * renders. With it, the order is total.
 *
 * Names compare by code point rather than through `localeCompare`, because the
 * order has to be the same everywhere it renders. Every runeword name is ASCII
 * and initially capitalised, so code-point order *is* alphabetical order here,
 * without depending on which collation the runtime happens to ship.
 *
 * This is `search-sort-filter`'s default comparator, not a private detail of
 * the table — which is why it is an exported function in a plain module rather
 * than a closure inside a component.
 */
export function byRequiredLevel(a: Runeword, b: Runeword): number {
  if (a.requiredLevel !== b.requiredLevel) {
    return a.requiredLevel - b.requiredLevel;
  }

  if (a.name === b.name) return 0;

  return a.name < b.name ? -1 : 1;
}
