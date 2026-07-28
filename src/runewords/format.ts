import type { Runeword } from "@/data";
import type { Strings } from "@/i18n";

/**
 * The bases a runeword can be socketed into, as one line of text:
 * `Staves (Not Orbs/Wands)`, `Body Armors (Barbarian)`, or just
 * `Helms, Body Armors, Shields` where no restriction applies.
 *
 * The dataset stores the restriction bare — `Not Orbs/Wands`, never
 * `(Not Orbs/Wands)` — by requirement, so supplying the punctuation is this
 * layer's job. A runeword with no restriction gets no parentheses at all rather
 * than an empty pair.
 *
 * Both the separator and the bracketing come from the strings layer, because
 * how a list is punctuated is a property of the language and not of the data.
 * The categories themselves are canonical identifiers and are passed straight
 * through.
 *
 * A plain function taking the strings record rather than a hook, so the row and
 * the detail view render the same line from one place without either importing
 * the other.
 */
export function itemTypesLabel(runeword: Runeword, strings: Strings): string {
  const categories = runeword.itemTypes.join(strings.itemTypes.separator);

  if (runeword.itemTypeRestriction === undefined) return categories;

  return strings.itemTypes.withRestriction(
    categories,
    runeword.itemTypeRestriction,
  );
}
