import type { ItemType, Runeword } from "@/data";

/**
 * One kind of socketed base the uncrafted runewords still call for, and how
 * many of them it would serve.
 */
export interface RemainingBase {
  category: string;
  sockets: number;
  count: number;
}

/**
 * The socketed bases the uncrafted runewords still require, grouped by
 * (category, socket count) — a runeword specifies a category and a socket
 * count and never a specific item, so this is the finest honest grain.
 *
 * The socket count is `runes.length`, derived here as at every other use
 * site. The count is the number of uncrafted runewords the base would serve,
 * and a runeword allowing several categories counts under each of them:
 * they are alternatives the player can farm toward, not fractions of a need,
 * on the precedent the slot filter set with its 114 memberships across 99
 * runewords. The consequence — the counts do not sum to the uncrafted
 * total — is the presentation's to say, not this function's to hide.
 *
 * Groups follow the category reference's order and then ascend by socket
 * count, so the list reads the way the dataset is organised. A group nothing
 * uncrafted requires is absent rather than present at zero.
 *
 * Both datasets and the crafted set come in as parameters rather than
 * imports, exactly as `remainingRunes` takes them: pure logic, testable
 * without rendering anything.
 */
export function remainingBases(
  runewords: readonly Runeword[],
  itemTypes: readonly ItemType[],
  crafted: ReadonlySet<string>,
): RemainingBase[] {
  // Counts per category, then per socket count within it. Two levels of Map
  // rather than a composite string key, so nothing has to parse its own key
  // back apart to order the result.
  const groups = new Map<string, Map<number, number>>();

  for (const runeword of runewords) {
    if (crafted.has(runeword.name)) continue;

    const sockets = runeword.runes.length;

    for (const category of runeword.itemTypes) {
      const socketCounts = groups.get(category) ?? new Map<number, number>();

      socketCounts.set(sockets, (socketCounts.get(sockets) ?? 0) + 1);
      groups.set(category, socketCounts);
    }
  }

  return itemTypes.flatMap((itemType) => {
    const socketCounts = groups.get(itemType.name);

    if (!socketCounts) return [];

    return [...socketCounts]
      .sort(([a], [b]) => a - b)
      .map(([sockets, count]) => ({
        category: itemType.name,
        sockets,
        count,
      }));
  });
}
