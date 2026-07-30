import type { Runeword } from "@/data";
import { useLocale, useStrings } from "@/i18n";
import { displayRuneword } from "@/runewords/display";

export interface ItemTypesProps {
  runeword: Runeword;
}

/**
 * The bases a runeword can be socketed into, with any restriction set apart
 * beneath them: `Staves` with `(Not Orbs/Wands)` on its own line,
 * `Body Armors` with `(Barbarian)`, or just `Helms, Body Armors, Shields` where
 * nothing is excluded.
 *
 * A component rather than the `itemTypesLabel` function it replaces, for a
 * reason that leaves no room for argument: the restriction is a different colour
 * from the categories, and a function returning `string` cannot carry two.
 * Fifteen of the 99 carry one, and an exclusion that changes which item to go
 * looking for should not read as more of the category list.
 *
 * The split of responsibility does not move. The categories and the restriction
 * are dataset text, read from the locale projection; the separator and the
 * parentheses around the restriction are punctuation and therefore copy. So
 * under the Russian locale the categories read `Щиты, Гримуар` and the
 * restriction reads `(ассасин)` — the brackets from the strings layer, the word
 * inside them from the dataset.
 *
 * Used by the row and by the detail view, exactly as the function was, so the
 * two still render from one place.
 *
 * Nothing here is named for the reference's `rw-ItemTypes-class`. That name
 * describes half of what the field holds — `(Not Orbs/Wands)` is an item
 * exclusion, not a character class — and a borrowed name that misdescribes its
 * own subject is not worth copying.
 */
export function ItemTypes({ runeword }: ItemTypesProps) {
  const strings = useStrings();
  const projected = displayRuneword(runeword, useLocale());

  return (
    /* The size sits on the wrapper rather than on the categories, which is what
       makes the restriction's `0.9em` mean what the reference means by it.
       Against the cell's inherited 16px that `em` resolves to 14.4px and the
       exclusion renders *larger* than the category it qualifies — measured in a
       browser, which is the only place it shows. Nested, it comes out below the
       categories and the two read as a heading and its footnote, which is the
       relationship the reference's own nesting expresses.

       14px rather than the reference's 13px: at 13px the column was the hardest
       thing on the page to read, and one step is enough to fix that without the
       base items competing with the runeword's own name. The ratio is the
       reference's and does the work — the restriction follows to 12.6px. */
    <span className="block text-[14px]">
      <span className="block text-muted">
        {projected.itemTypes.join(strings.itemTypes.separator)}
      </span>

      {/* No element at all where there is no restriction — not an empty pair of
          parentheses and not an empty line. Eighty-four of the 99 have none, and
          a blank second line in each of them would make the column look like it
          had lost something. */}
      {projected.itemTypeRestriction === undefined ? null : (
        <span className="block text-[0.9em] text-item-restriction">
          {strings.itemTypes.restriction(projected.itemTypeRestriction)}
        </span>
      )}
    </span>
  );
}
