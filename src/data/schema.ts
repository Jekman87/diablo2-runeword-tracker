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
export const runewordSchema = z
  .object({
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
    // The granted properties, as ordered groups. One uniform shape for all 99
    // records: a runeword whose properties do not vary by base carries a
    // single group, and the three that vary carry one group per base type.
    propertyGroups: z
      .array(
        z.object({
          // The subset of the record's own `itemTypes` this group applies to.
          // Absent means the group applies to every base the runeword allows —
          // a copy of the record's whole `itemTypes` would be a second
          // representation of an existing fact.
          itemTypes: z.array(z.string().min(1)).min(1).optional(),
          // One entry per line, in the order the game presents them.
          properties: z.array(z.string().min(1)).min(1),
        }),
      )
      .min(1),
  })
  .superRefine((record, ctx) => {
    // Per-record shape knowledge lives here, so a hand-edit to the committed
    // JSON that breaks it blanks the page pointing at the offending record.
    const { name, itemTypes, propertyGroups } = record;

    if (propertyGroups.length === 1) {
      if (propertyGroups[0].itemTypes !== undefined) {
        ctx.addIssue({
          code: "custom",
          path: ["propertyGroups", 0, "itemTypes"],
          message:
            `"${name}": a single property group must carry no itemTypes ` +
            `label — absence already means it applies to every base.`,
        });
      }

      return;
    }

    const claimed = new Map<string, number>();

    for (const [index, group] of propertyGroups.entries()) {
      if (group.itemTypes === undefined) {
        ctx.addIssue({
          code: "custom",
          path: ["propertyGroups", index, "itemTypes"],
          message:
            `"${name}": every group must be labelled when a record carries ` +
            `several, because an unlabelled group's base types are unknowable.`,
        });

        continue;
      }

      for (const category of group.itemTypes) {
        claimed.set(category, (claimed.get(category) ?? 0) + 1);
      }
    }

    // The labels across groups partition the record's own categories: every
    // label resolves to a category the record allows, and no category is left
    // without a group or claimed by two.
    for (const [category, count] of claimed) {
      if (!itemTypes.includes(category)) {
        ctx.addIssue({
          code: "custom",
          path: ["propertyGroups"],
          message:
            `"${name}": group label "${category}" names a category the ` +
            `record's itemTypes do not allow.`,
        });
      } else if (count > 1) {
        ctx.addIssue({
          code: "custom",
          path: ["propertyGroups"],
          message: `"${name}": category "${category}" is claimed by ${count} groups.`,
        });
      }
    }

    for (const category of itemTypes) {
      if (!claimed.has(category)) {
        ctx.addIssue({
          code: "custom",
          path: ["propertyGroups"],
          message: `"${name}": category "${category}" is claimed by no group.`,
        });
      }
    }
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
