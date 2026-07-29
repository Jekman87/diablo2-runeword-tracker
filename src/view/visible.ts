import type { Runeword } from "@/data";
import { matchesQuery } from "@/runewords/search";
import { slotsOf } from "@/runewords/slots";
import { comparatorFor } from "@/runewords/sort";
import type { CraftedFilter, SlotFilter, ViewSettings } from "@/view/types";

/**
 * The rows the table presents: filtered by search ∧ crafted ∧ slot, then sorted.
 *
 * **The one place the three controls meet**, which is what makes "why is this row
 * here" answerable without knowing the order the controls were used in. The
 * alternative — filtering in the table's JSX and sorting in a hook — spreads the
 * conjunction across two files and turns that question into one about render
 * order.
 *
 * A pure function of the dataset, the settings, the query and the crafted set,
 * with the dataset a **parameter rather than an import** so the matching, the
 * comparing and the combination are all testable without rendering anything.
 *
 * **Filter, then sort.** Sorting 99 rows and discarding 88 of them is the same
 * answer for more work. The result is identical either way, which is what makes
 * the order of operations free to be the cheap one.
 *
 * **Returns a new array.** `Array.prototype.filter` is what builds it, so the
 * in-place `sort` below cannot reach the source: `@/data` hands the dataset out
 * in the vendor's patch-grouped order and other consumers are entitled to keep
 * finding it that way.
 *
 * The query is a parameter beside the settings rather than a member of them,
 * because it is the one control that is not persisted — see `ViewSettings`.
 */
export function visibleRunewords(
  runewords: readonly Runeword[],
  settings: ViewSettings,
  query: string,
  crafted: ReadonlySet<string>,
): Runeword[] {
  return runewords
    .filter(
      (runeword) =>
        matchesQuery(runeword, query) &&
        matchesCraftedFilter(runeword, settings.craftedFilter, crafted) &&
        matchesSlotFilter(runeword, settings.slotFilter),
    )
    .sort(comparatorFor(settings.sortKey, settings.sortDirection, crafted));
}

/**
 * Whether a runeword's crafted state is one the filter is presenting.
 *
 * Reads the crafted set and never writes it: filtering is a way of looking at
 * progress and never a way of changing it.
 */
function matchesCraftedFilter(
  runeword: Runeword,
  filter: CraftedFilter,
  crafted: ReadonlySet<string>,
): boolean {
  if (filter === "all") return true;

  return crafted.has(runeword.name) === (filter === "crafted");
}

/**
 * Whether a runeword belongs to the slot the filter is presenting.
 *
 * `some` rather than an equality against a single slot, because a runeword can go
 * into more than one — `Fortitude` is presented under both weapon and body
 * armour, which is the truth about the runeword rather than a concession.
 */
function matchesSlotFilter(runeword: Runeword, filter: SlotFilter): boolean {
  if (filter === "all") return true;

  return slotsOf(runeword).includes(filter);
}
