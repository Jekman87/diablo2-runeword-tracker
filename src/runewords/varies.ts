import type { Runeword } from "@/data";

/**
 * Which granted-property lines of a runeword **roll** — vary from one crafted
 * copy to the next — as a parallel array of booleans per property group.
 *
 * **Why this is derived from the Russian line even when English is on screen.**
 * The two variants mark the same fact with different reliability. The Russian
 * localisation brackets a rolling range and leaves a fixed span bare, by a
 * convention `data/ru/runewords.ts` states outright: `+(240-270)% к урону`
 * rolls, `+5-30 урона от огня` is one item's fixed damage span. The vendored
 * English text has no such discipline — `+240-270% Enhanced Damage (varies)`
 * carries a marker while `+75-100% Enhanced Defense` does not, and both roll.
 * Measured over the shipped dataset: the Russian convention marks 158 lines,
 * the English markers 114, and the 46 the English misses are real rolls rather
 * than disagreements.
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
 * A bracketed range, or a per-level formula.
 *
 * `+(1-6) к умению "Боевые приказы"` and `При надевании дает ауру "Шипы"
 * (15-21)-го уровня` are the bracket forms; `+1*ур к здоровью` is how this
 * dataset writes a per-character-level value, which varies with the reader's
 * character rather than with the craft and belongs in the same treatment for
 * the same reason: the number on the finished item is not the number here.
 */
const RUSSIAN_ROLL = /\(\d+(?:\.\d+)?[-–]\d+(?:\.\d+)?\)|\*ур/;

/** The English markers, for a record whose Russian variant has not landed. */
const ENGLISH_ROLL = /\(varies\)|Per Character Level/i;
