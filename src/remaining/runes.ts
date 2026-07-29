import type { Rune, Runeword } from "@/data";

/** One rune the uncrafted runewords still call for, and how many times. */
export interface RemainingRune {
  name: string;
  tier: Rune["tier"];
  count: number;
}

/**
 * Every rune the uncrafted runewords still require, with its count, in
 * canonical rune order.
 *
 * One pass over the sequences: a crafted runeword contributes nothing, an
 * uncrafted one contributes every occurrence in its sequence — repeats are
 * real, `Infinity` is `Ber Mal Ber Ist` and adds two `Ber`. A rune nothing
 * uncrafted requires is absent rather than present at zero, because "still
 * needed" is the contract and a `×0` row is noise.
 *
 * The result's order is the rune reference's own, which is also tier order —
 * the sprite's rows are the tiers — so the presentation's bands fall out of a
 * filter with no sorting anywhere. The tier rides along on each entry for the
 * same reason: the panel would otherwise look every rune up again to know
 * which band it belongs to.
 *
 * Both datasets and the crafted set come in as parameters rather than
 * imports, on the pattern `visibleRunewords` set: pure logic, testable
 * without rendering anything, indifferent to where crafted state lives.
 */
export function remainingRunes(
  runewords: readonly Runeword[],
  runes: readonly Rune[],
  crafted: ReadonlySet<string>,
): RemainingRune[] {
  const counts = new Map<string, number>();

  for (const runeword of runewords) {
    if (crafted.has(runeword.name)) continue;

    for (const rune of runeword.runes) {
      counts.set(rune, (counts.get(rune) ?? 0) + 1);
    }
  }

  return runes
    .filter((rune) => counts.has(rune.name))
    .map((rune) => ({
      name: rune.name,
      tier: rune.tier,
      // Present in `counts` by the filter above; the fallback is for the
      // compiler, not for a case that can occur.
      count: counts.get(rune.name) ?? 0,
    }));
}
