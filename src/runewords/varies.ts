import type { Runeword } from "@/data";

/**
 * Which granted-property lines of a runeword **roll** — vary from one crafted
 * copy to the next — as a parallel array of booleans per property group.
 *
 * Only rolls. A value that grows with the character's level is the same on every
 * copy and is not a gamble, so it stays at the base colour; see `RUSSIAN_ROLL`.
 *
 * **Why this is derived from the Russian line even when English is on screen.**
 * The two variants mark the same fact with different reliability. The Russian
 * localisation brackets a rolling range and leaves a fixed span bare, by a
 * convention `data/ru/runewords.ts` states outright: `+(240-270)% к урону`
 * rolls, `+5-30 урона от огня` is one item's fixed damage span. The vendored
 * English text has no such discipline — `+240-270% Enhanced Damage (varies)`
 * carries a marker while `+75-100% Enhanced Defense` does not, and both roll.
 * Measured over the shipped dataset when both patterns still caught per-level
 * formulas: the Russian convention marked 158 lines, the English markers 114,
 * and the 46 the English missed were real rolls rather than disagreements.
 *
 * Since the variants are aligned line for line — a parity the schema enforces —
 * the Russian line is simply the better sensor for a property of the *record*,
 * and reading it costs nothing when rendering English. A record with no Russian
 * variant falls back to the English markers; none ship today, and the fallback
 * exists for the vendor refresh that adds a runeword before its translation.
 *
 * Returned as a shape mirroring `propertyGroups` so a caller indexes it exactly
 * as it indexes the lines it is rendering.
 */
export function varyingProperties(runeword: Runeword): boolean[][] {
  const ru = runeword.ru?.propertyGroups;

  return runeword.propertyGroups.map((group, groupIndex) =>
    group.properties.map((line, index) => {
      const russian = ru?.[groupIndex]?.properties[index];

      return russian === undefined
        ? ENGLISH_ROLL.test(line)
        : RUSSIAN_ROLL.test(russian);
    }),
  );
}

/**
 * A bracketed range.
 *
 * `+(1-6) к умению "Боевые приказы"` and `При надевании дает ауру "Шипы"
 * (15-21)-го уровня` are the two forms the convention uses.
 *
 * **A per-level formula is not one of these, and used to be.** `+1*ур к
 * здоровью` was matched here on the reasoning that its number varies too, so
 * the number on the finished item is not the number on the page either way.
 * That conflates two different questions. A roll is settled once, when the
 * runeword is made, and cannot be changed afterwards — which is why it is worth
 * marking on a page about deciding what to craft. A per-level value is not
 * settled at all: it is the same on every copy, and it grows as the character
 * does. Marking it said "this one is a gamble" about a line that is not.
 *
 * The lines say so themselves — every one of the 15 in the Russian dataset ends
 * `(зависит от уровня персонажа)` — so nothing is lost by leaving them at the
 * base colour. None of them also carries a bracketed range, so dropping the
 * formula from this pattern unmarks exactly those 15 and no others: measured
 * over the shipped dataset, the treatment goes from 158 lines to 143.
 */
const RUSSIAN_ROLL = /\(\d+(?:\.\d+)?[-–]\d+(?:\.\d+)?\)/;

/**
 * The English marker, for a record whose Russian variant has not landed.
 *
 * `Per Character Level` came out of this for the reason above. The English text
 * writes those lines as `+(0.5 per Character Level) 0.5-49.5% Deadly Strike
 * (Based on Character Level)`, so the words are there twice over and neither is
 * a roll.
 */
const ENGLISH_ROLL = /\(varies\)/i;
