import type { Runeword } from "@/data";
import { byRequiredLevel } from "@/runewords/order";

/**
 * The five things the table can be ordered by — one per column, each named for
 * the column rather than for the field behind it.
 *
 * A tuple, so the stored value's schema, the headers and this type all read from
 * one declaration. The order is the order the columns appear in.
 */
export const sortKeys = [
  "crafted",
  "name",
  "runes",
  "itemTypes",
  "requiredLevel",
] as const;

export type SortKey = (typeof sortKeys)[number];

/**
 * The two directions, and there are only two.
 *
 * No "unsorted" third state: required level ascending *is* the default, so an
 * unsorted presentation is not a state the table can be in and a header that
 * cycled through three would offer one that does not exist.
 *
 * Named as `aria-sort` names them, so the attribute is the value rather than a
 * mapping of it.
 */
export const sortDirections = ["ascending", "descending"] as const;

export type SortDirection = (typeof sortDirections)[number];

/**
 * The direction a column adopts when it is chosen while some other column is
 * sorted.
 *
 * Ascending for four of the five, because lowest-first is what "sort by level" or
 * "sort by name" is understood to mean.
 *
 * **Descending for crafted state, so the first press shows what is done.** The
 * arithmetic underneath is unchanged — `false` before `true`, so ascending still
 * presents the un-crafted first — and this is only about which direction one press
 * lands on. Both readings are defensible: ascending answers "what is left" and
 * descending answers "what have I got". The second is what a player pressing the
 * crafted header is asking, and the first is one more press away either way.
 */
export function firstDirectionFor(key: SortKey): SortDirection {
  return key === "crafted" ? "descending" : "ascending";
}

/**
 * A comparator for one column in one direction.
 *
 * **Every comparator ends in `byRequiredLevel`**, which is what makes each of the
 * five orderings total. Four of the five keys cannot separate the dataset on
 * their own — 45 runewords share three sockets, 21 share `Body Armors` as their
 * first category, the required level repeats across 27 values, and crafted state
 * has two values against 99 rows — so without a tiebreak a row's position would
 * be a property of the sort implementation and of which rows the filters happened
 * to leave behind. `runeword-table` fixed exactly this once for the default
 * order; this is the second caller the function it exported was written for.
 *
 * **Descending negates the key comparison and leaves the tiebreak ascending.** So
 * a descending presentation is not the ascending one read backwards: reversing
 * socket count puts the six-socket runewords first, and inside each group the
 * rows stay in level-then-name order.
 *
 * The crafted set is a parameter rather than a module read, because two of the
 * five uses of it — this and the crafted filter — need the same value and neither
 * owns it.
 */
export function comparatorFor(
  key: SortKey,
  direction: SortDirection,
  crafted: ReadonlySet<string>,
): (a: Runeword, b: Runeword) => number {
  const compareKey = KEY_COMPARATORS[key];
  const sign = direction === "descending" ? -1 : 1;

  return (a, b) => {
    const byKey = compareKey(a, b, crafted);

    return byKey === 0 ? byRequiredLevel(a, b) : byKey * sign;
  };
}

/**
 * What each column compares on, before the tiebreak and before the direction.
 *
 * Each returns 0 where it cannot separate the two rows, which is the signal
 * `comparatorFor` reads to fall through to `byRequiredLevel`. None of them reads
 * `ladderOnly`, `patch` or `note`: availability changes between ladder seasons,
 * and where a stale badge is cosmetic a stale ordering would present the table by
 * something untrue.
 *
 * Two of the five are judgement calls.
 *
 * **Crafted ascending puts un-crafted rows first.** `false` before `true` is the
 * arithmetic and it is also the useful direction — the reason to order a tracker
 * by crafted state is to see what is left.
 *
 * **The runes column compares socket count, not the rune sequence.** Sorting the
 * sequence as text orders `Ber Mal Ber Ist` before `El El El` and answers no
 * question anybody has. Socket count is that column's readable magnitude — a
 * two-socket recipe is a cheap one — and it is `runes.length`, the derivation the
 * dataset requires rather than a stored field. Ordering by the rarest rune in the
 * sequence was considered and rejected: it needs the canonical rune index as an
 * ordinal, which is a second meaning for array position in `runes.json`, and "how
 * bad is the worst rune" is `remaining-panels`' question rather than a column's.
 *
 * `itemTypes` compares the **first** category only — the first line of what the
 * cell draws, so the order is visibly the column's own content. Comparing the
 * joined list would order by a string nothing renders.
 */
const KEY_COMPARATORS: Record<
  SortKey,
  (a: Runeword, b: Runeword, crafted: ReadonlySet<string>) => number
> = {
  crafted: (a, b, crafted) =>
    Number(crafted.has(a.name)) - Number(crafted.has(b.name)),

  name: (a, b) => byCodePoint(a.name, b.name),

  runes: (a, b) => a.runes.length - b.runes.length,

  itemTypes: (a, b) => byCodePoint(a.itemTypes[0], b.itemTypes[0]),

  // Level alone, not `byRequiredLevel`. The name half of that function is the
  // tiebreak every key shares, and folding it in here would make it the one
  // comparison that reverses with the direction.
  requiredLevel: (a, b) => a.requiredLevel - b.requiredLevel,
};

/**
 * Compares two strings by code point rather than through `localeCompare`.
 *
 * The same reasoning as `byRequiredLevel`'s name tiebreak: the presented order
 * has to be the same everywhere it renders, and every name and category in the
 * dataset is ASCII and initially capitalised, so code-point order *is*
 * alphabetical order here without depending on the runtime's collation.
 *
 * The Russian locale kept that premise: it scopes non-ASCII text to the
 * display-copy layer, which ordering never reads, so dataset text stays ASCII
 * and this comparison stays correct in both languages. Collating Cyrillic
 * becomes a question only with a dataset-localisation change that would put
 * Russian labels into the sorted fields, and is that change's to answer.
 */
function byCodePoint(a: string, b: string): number {
  if (a === b) return 0;

  return a < b ? -1 : 1;
}
