import type { Runeword } from "@/data";
import { useStrings } from "@/i18n";

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
 * The split of responsibility does not move. The categories are canonical
 * identifiers joined by a separator from the strings layer; the parentheses are
 * punctuation and therefore copy; the words inside them are dataset content.
 * What changed is that the strings layer brackets the restriction alone instead
 * of joining both halves into one string, because the two halves are now two
 * elements.
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

  return (
    /* The 13px sits on the wrapper rather than on the categories, which is what
       makes the restriction's `0.9em` mean what the reference means by it.
       Against the cell's inherited 16px that `em` resolves to 14.4px and the
       exclusion renders *larger* than the category it qualifies — measured in a
       browser, which is the only place it shows. Nested, it resolves to 11.7px
       and the two read as a heading and its footnote, which is the relationship
       the reference's own nesting expresses. */
    <span className="block text-[13px]">
      <span className="block text-muted">
        {runeword.itemTypes.join(strings.itemTypes.separator)}
      </span>

      {/* No element at all where there is no restriction — not an empty pair of
          parentheses and not an empty line. Eighty-four of the 99 have none, and
          a blank second line in each of them would make the column look like it
          had lost something. */}
      {runeword.itemTypeRestriction === undefined ? null : (
        <span className="block text-[0.9em] text-item-restriction">
          {strings.itemTypes.restriction(runeword.itemTypeRestriction)}
        </span>
      )}
    </span>
  );
}
