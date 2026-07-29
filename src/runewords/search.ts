import type { Runeword } from "@/data";

/**
 * Whether a runeword matches a search query.
 *
 * Case-insensitive substring over three fields — the name, every base item
 * category, and the item-type restriction. Those are exactly the three pieces of
 * text the row renders in the columns a reader is searching, which is the whole
 * rule: a player types what they can see.
 *
 * Substring rather than prefix, so `Body Armors` is findable by typing `armor`.
 * A trimmed empty query matches everything, so an emptied field narrows nothing.
 *
 * **Including the restriction is a deliberate superset of the reference**, whose
 * placeholder promises "Runeword name or item type". Fifteen runewords carry one
 * and it renders on its own line in the item-types cell, so `assassin` finds
 * `Chaos`, `Pattern`, `Mosaic` and `Treachery` through a word that is visibly in
 * the column being searched. Excluding it would make a rendered word
 * unsearchable.
 *
 * **Runes are deliberately not searched.** `IDEAS.md` drops rune search: on the
 * reference the rune relationship is expressed by highlighting driven by a rune
 * inventory, and this project tracks no inventory, so a rune query has nothing
 * to compare itself against. Ten rune names do occur *inside* other text — `El` within
 * `Delirium`, `Mal` within `Malice` — and those match as substrings of a name,
 * which is the name column doing its job rather than rune search creeping back
 * in.
 *
 * **Availability is not searched either.** `ladderOnly`, `patch` and `note` are
 * decoration by requirement, so typing `2.6` finds nothing on account of the
 * patch that introduced a runeword.
 *
 * `toLowerCase()` and `includes()`, with no normalisation and no collator. The
 * dataset is ASCII throughout every name, category and restriction — the font
 * subset in `src/index.css` already depends on that — so case folding is the
 * whole of it. `russian-locale` is the change that introduces non-ASCII text and
 * therefore owns the collation question.
 */
export function matchesQuery(runeword: Runeword, query: string): boolean {
  const needle = query.trim().toLowerCase();

  if (needle === "") return true;

  if (runeword.name.toLowerCase().includes(needle)) return true;

  if (
    runeword.itemTypes.some((category) =>
      category.toLowerCase().includes(needle),
    )
  ) {
    return true;
  }

  return runeword.itemTypeRestriction?.toLowerCase().includes(needle) ?? false;
}
