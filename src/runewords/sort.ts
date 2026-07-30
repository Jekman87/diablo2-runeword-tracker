import type { Runeword } from "@/data";
import type { Locale } from "@/i18n";
import { displayRuneword } from "@/runewords/display";
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
 * owns it. The locale is one for the same reason: two of the five keys order
 * text, and the language that text is in belongs to the caller.
 *
 * **The tiebreak stays locale-independent.** `byRequiredLevel` ends in the
 * *canonical* name, and that is deliberate: the tiebreak is a determinism
 * guarantee at the level of identifiers, invisible as presentation, so keeping
 * it out of the locale means a row's tiebroken position never shifts with the
 * language.
 */
export function comparatorFor(
  key: SortKey,
  direction: SortDirection,
  crafted: ReadonlySet<string>,
  locale: Locale,
): (a: Runeword, b: Runeword) => number {
  const compareKey = KEY_COMPARATORS[key];
  const sign = direction === "descending" ? -1 : 1;

  return (a, b) => {
    const byKey = compareKey(a, b, crafted, locale);

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
 *
 * The two textual keys read the locale projection, so each orders the text its
 * column actually presents. That is the same reason `matchesQuery` reads it:
 * ordering by a string nothing renders is as wrong as matching one.
 */
const KEY_COMPARATORS: Record<
  SortKey,
  (
    a: Runeword,
    b: Runeword,
    crafted: ReadonlySet<string>,
    locale: Locale,
  ) => number
> = {
  crafted: (a, b, crafted) =>
    Number(crafted.has(a.name)) - Number(crafted.has(b.name)),

  name: (a, b, _crafted, locale) =>
    byLocale(
      displayRuneword(a, locale).name,
      displayRuneword(b, locale).name,
      locale,
    ),

  runes: (a, b) => a.runes.length - b.runes.length,

  itemTypes: (a, b, _crafted, locale) =>
    byLocale(
      displayRuneword(a, locale).itemTypes[0],
      displayRuneword(b, locale).itemTypes[0],
      locale,
    ),

  // Level alone, not `byRequiredLevel`. The name half of that function is the
  // tiebreak every key shares, and folding it in here would make it the one
  // comparison that reverses with the direction.
  requiredLevel: (a, b) => a.requiredLevel - b.requiredLevel,
};

/**
 * Compares two pieces of displayed text the way the active locale reads them.
 *
 * **English keeps `byCodePoint`**, whose premise still holds there: every
 * canonical name and category is ASCII and initially capitalised, so code-point
 * order *is* alphabetical order, with no dependence on the runtime's collation.
 *
 * **Russian goes through a collator**, which is the question `search.ts` and this
 * file both deferred. Code-point order puts `ё` (U+0451) past `я` (U+044F),
 * exiling every word that contains it to the end of the list; Russian
 * alphabetical order puts it between `е` and `ж`, which is where a reader looks
 * for it. `Intl.Collator` is in every browser this site targets and adds no
 * dependency, so there is nothing to weigh against getting the order right.
 */
function byLocale(a: string, b: string, locale: Locale): number {
  if (a === b) return 0;
  if (locale === "ru") return russianCollator.compare(a, b);

  return byCodePoint(a, b);
}

/**
 * Built once at module level rather than per comparison. A comparator runs
 * O(n log n) times over 99 rows, and constructing a collator is the expensive
 * part of using one.
 */
const russianCollator = new Intl.Collator("ru");

/**
 * Compares two strings by code point rather than through `localeCompare`.
 *
 * The same reasoning as `byRequiredLevel`'s name tiebreak: the presented order
 * has to be the same everywhere it renders, and every canonical name and
 * category in the dataset is ASCII and initially capitalised, so code-point
 * order *is* alphabetical order here without depending on the runtime's
 * collation.
 *
 * Still the tiebreak's comparison in both locales, and still the English
 * projection's: this is where the ASCII premise is true, and `byLocale` above is
 * where text that may not be ASCII is handled.
 */
function byCodePoint(a: string, b: string): number {
  if (a === b) return 0;

  return a < b ? -1 : 1;
}
