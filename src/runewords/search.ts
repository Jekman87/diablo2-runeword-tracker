import type { Runeword } from "@/data";
import type { Locale } from "@/i18n";
import { displayRuneword } from "@/runewords/display";
import { foldLabel } from "@/runewords/fold";

/**
 * Whether a runeword matches a search query, in the language it is displayed in.
 *
 * Case-insensitive substring over three fields — the name, every base item
 * category, and the item-type restriction — **as the active locale projects
 * them**. Those are exactly the three pieces of text the row renders in the
 * columns a reader is searching, which is the whole rule: a player types what
 * they can see. Reading the projection rather than the record is what keeps that
 * true in both languages by construction: under Russian a Cyrillic fragment
 * matches the Russian labels, and a translated record's English name is not
 * matched, because it is not on screen. A record showing its English fallback
 * matches its English text, for the same reason.
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
 * **The collation question the docblock used to defer is answered here, and the
 * answer is that matching needs no collator.** Substring search compares code
 * units, and `toLowerCase()` folds Cyrillic case correctly — `ЩИТЫ` and `щиты`
 * fold to the same string — so nothing about Russian text needs
 * `Intl.Collator`. Ordering is the part that does, and that is `sort.ts`'s.
 *
 * One normalisation is added, and it is a deliberate inexactness: `ё` folds to
 * `е` on both sides. It comes from `foldLabel`, which import matching shares, so
 * a tolerance this field offers is one an imported file gets too.
 */
export function matchesQuery(
  runeword: Runeword,
  query: string,
  locale: Locale,
): boolean {
  const needle = foldLabel(query);

  if (needle === "") return true;

  const projected = displayRuneword(runeword, locale);

  if (foldLabel(projected.name).includes(needle)) return true;

  if (
    projected.itemTypes.some((category) => foldLabel(category).includes(needle))
  ) {
    return true;
  }

  return projected.itemTypeRestriction === undefined
    ? false
    : foldLabel(projected.itemTypeRestriction).includes(needle);
}
