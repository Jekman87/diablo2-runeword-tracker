import {
  type Runeword,
  itemTypesByName,
  runesByName,
  runewordsByName,
} from "@/data";
import type { Locale } from "@/i18n";

/**
 * A runeword as one locale presents it: the text a row and a detail panel
 * render, and the text search matches and sorting orders.
 *
 * Only the localisable fields are here. `requiredLevel`, `ladderOnly`, `patch`
 * and the group `itemTypes` labels are not text in any language — a level is a
 * number and a patch is a version string — and the canonical name stays on the
 * record for every identity-keyed path to read. A projection carrying a copy of
 * the whole record would invite exactly the "which name is this" confusion the
 * canonical-identifier rule exists to prevent.
 *
 * `runes` is a list of labels in the record's own rune order. Repeats are kept
 * for the same reason the dataset keeps them: `Infinity` is Ber Mal Ber Ist.
 */
export interface RunewordDisplay {
  name: string;
  itemTypes: string[];
  itemTypeRestriction?: string;
  note?: string;
  /** Group labels stay canonical categories; only the lines are projected. */
  propertyGroups: { properties: string[] }[];
  runes: string[];
}

/**
 * How a runeword reads in the active locale.
 *
 * **One projection, three consumers.** Components render it, `matchesQuery`
 * matches it and the sort comparators order it, which is what makes "search
 * finds what the row shows" and "the column sorts what it presents" true by
 * construction rather than by three implementations agreeing. Written as a pure
 * function of the record and the locale, so all three are testable without
 * rendering anything.
 *
 * **The fallback is per record, not per field.** A record with no `ru` variant
 * projects entirely in English — its name, its categories, its restriction and
 * even its rune labels, which *are* translated in the reference data — because
 * a row reading `Клятва древних` beside `Ral Ort Tal` and a row reading
 * `Ancient's Pledge` beside `Рал Орт Тал` are both worse than either language
 * alone. The shipped dataset has no such record (the coverage test pins that),
 * so this path exists for the vendor refresh that adds a runeword before its
 * translation lands, not for anything on screen today.
 *
 * Reference lookups fall back to the canonical name rather than throwing. A
 * rune or category the reference data does not define is already a broken
 * cross-reference that `src/data`'s tests assert against; rendering its
 * canonical name is the honest thing to do with one, and blanking the page over
 * a label would be a worse answer than the label itself.
 */
export function displayRuneword(
  runeword: Runeword,
  locale: Locale,
): RunewordDisplay {
  const variant = locale === "ru" ? runeword.ru : undefined;

  if (variant === undefined) {
    return {
      name: runeword.name,
      itemTypes: runeword.itemTypes,
      ...(runeword.itemTypeRestriction !== undefined && {
        itemTypeRestriction: runeword.itemTypeRestriction,
      }),
      ...(runeword.note !== undefined && { note: runeword.note }),
      propertyGroups: runeword.propertyGroups.map((group) => ({
        properties: group.properties,
      })),
      runes: runeword.runes,
    };
  }

  return {
    name: variant.name,
    itemTypes: runeword.itemTypes.map((name) => displayItemType(name, locale)),
    ...(variant.itemTypeRestriction !== undefined && {
      itemTypeRestriction: variant.itemTypeRestriction,
    }),
    ...(variant.note !== undefined && { note: variant.note }),
    propertyGroups: variant.propertyGroups.map((group) => ({
      properties: group.properties,
    })),
    runes: runeword.runes.map((name) => displayRune(name, locale)),
  };
}

/**
 * A rune's label in the given locale. The canonical name stays the sprite key
 * and the map key everywhere; this is what a reader sees and what a screen
 * reader announces, which is presentation.
 *
 * Exported because the remaining-needs panels present runes and categories
 * outside any runeword — they aggregate across records, so there is no record
 * to project.
 */
export function displayRune(name: string, locale: Locale): string {
  if (locale !== "ru") return name;

  return runesByName.get(name)?.ru ?? name;
}

/** A base item category's label in the given locale. */
export function displayItemType(name: string, locale: Locale): string {
  if (locale !== "ru") return name;

  return itemTypesByName.get(name)?.ru ?? name;
}

/**
 * A runeword's label in the given locale, found by its canonical name.
 *
 * For the two places that hold an identifier rather than a record — the crafted
 * toggle's accessible name and the undo notice, both of which name a runeword
 * inside a sentence from the strings layer. A Russian sentence with an English
 * name in the middle of it is exactly the mixed-language row the whole-record
 * fallback exists to prevent, so the sentence gets the projected label while
 * storage keeps the canonical name it was handed.
 */
export function displayRunewordName(name: string, locale: Locale): string {
  const record = runewordsByName.get(name);

  if (record === undefined) return name;

  return displayRuneword(record, locale).name;
}
