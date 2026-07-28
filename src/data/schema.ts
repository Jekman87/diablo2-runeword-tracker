import { z } from "zod";

// The shape of the dataset, declared once. The TypeScript types are inferred
// from these schemas rather than written alongside them, so the validator and
// the compiler cannot disagree about what a record is.

/**
 * One runeword. `name` is the canonical identifier — English, unique across the
 * dataset.
 *
 * There is deliberately no socket-count field. Socket count equals
 * `runes.length` and is derived at each use site, so no second representation
 * of the same fact exists to drift from the first.
 *
 * `ladderOnly` is required on every record so consumers read a boolean instead
 * of testing for a key. `patch`, `note` and `itemTypeRestriction` stay absent
 * when they do not apply — none of them has a meaningful empty value, and
 * inventing `""` would only move the check somewhere else.
 */
export const runewordSchema = z.object({
  name: z.string().min(1),
  // Ordered, and repeats are real: `Infinity` is Ber Mal Ber Ist.
  runes: z.array(z.string().min(1)).min(1),
  requiredLevel: z.int().positive(),
  itemTypes: z.array(z.string().min(1)).min(1),
  // Bare text — `Assassin`, not `(Assassin)`. Punctuation is presentation.
  itemTypeRestriction: z.string().min(1).optional(),
  ladderOnly: z.boolean(),
  patch: z.string().min(1).optional(),
  note: z.string().min(1).optional(),
  // One entry per line, in the order the game presents them.
  properties: z.array(z.string().min(1)).min(1),
});

export type Runeword = z.infer<typeof runewordSchema>;

/**
 * One rune. Tier is a named value rather than the source's `1 | 2 | 3`, because
 * `tier === "rare"` cannot be misread the way `tier === 3` can. The numeric
 * ordering is not lost: array order carries the canonical rune progression,
 * which is a finer ordering than the three bands anyway.
 */
export const runeSchema = z.object({
  name: z.string().min(1),
  tier: z.enum(["common", "semirare", "rare"]),
});

export type Rune = z.infer<typeof runeSchema>;

/** One base item category a runeword can be socketed into. */
export const itemTypeSchema = z.object({
  name: z.string().min(1),
  // Four of the twenty categories have no wiki page to link to.
  url: z.url().optional(),
});

export type ItemType = z.infer<typeof itemTypeSchema>;

export const runewordsSchema = z.array(runewordSchema).min(1);
export const runesSchema = z.array(runeSchema).min(1);
export const itemTypesSchema = z.array(itemTypeSchema).min(1);
