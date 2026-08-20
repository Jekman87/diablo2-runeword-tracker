import { z } from "zod";

// The shape of the dataset, declared once. The TypeScript types are inferred
// from these schemas rather than written alongside them, so the validator and
// the compiler cannot disagree about what a record is.

/**
 * A runeword's Russian labels, shipped beside the canonical record.
 *
 * `propertyGroups` mirrors the English structure — the same number of groups,
 * one Russian line per English line — which the record-level `superRefine`
 * below enforces, because parity is a relation between the variant and its
 * record and cannot be stated on the variant alone. Group labels are
 * deliberately absent: labels are category names, and those localise through
 * the item-type reference data rather than being restated per record.
 */
const runewordRuSchema = z.object({
  name: z.string().min(1),
  // Present exactly when the English field is — parity enforced on the record.
  itemTypeRestriction: z.string().min(1).optional(),
  note: z.string().min(1).optional(),
  propertyGroups: z
    .array(
      z.object({
        properties: z.array(z.string().min(1)).min(1),
      }),
    )
    .min(1),
  // Present exactly when the record carries advice, mirroring its paragraphs
  // count-for-count — enforced on the record, like the property parity. The
  // sources are not here: links are shared across locales, not translated.
  advice: z
    .object({
      paragraphs: z.array(z.string().min(1)).min(1),
    })
    .optional(),
});

/**
 * The three usefulness judgements, a closed set. Values are locale-independent
 * dataset content; the words shown for them live in the display-copy layer.
 * Closed because a free-text label would drift into prose that belongs in
 * `advice`.
 */
export const usefulnessValues = ["meta", "situational", "chronicle"] as const;

/**
 * A runeword's crafting advice: editorial prose (recommended bases with the
 * affixes that matter, socket counts, ethereal notes, builds, verdicts) plus
 * the links it was drawn from. Paragraphs are plain strings — no inline
 * markup — and the sources render as their own line, so nothing here needs
 * parsing.
 */
const adviceSchema = z.object({
  paragraphs: z.array(z.string().min(1)).min(1),
  sources: z
    .array(
      z.object({
        label: z.string().min(1),
        url: z.url().startsWith("https://"),
      }),
    )
    .min(1)
    .optional(),
});

/**
 * One runeword. `name` is the canonical identifier — English, unique across the
 * dataset.
 *
 * There is deliberately no socket-count field. Socket count equals
 * `runes.length` and is derived at each use site, so no second representation
 * of the same fact exists to drift from the first.
 *
 * There is deliberately no ladder-only field either. Patch 3.3 released the last
 * eight ladder-only runewords into Non-Ladder, so the flag would be `false` on
 * all 99 and render nothing; what outlived the patch is a Lord of Destruction
 * restriction, and this tracker mirrors Reign of the Warlock. The vendor
 * snapshot keeps its own flag for the day a patch needs one again.
 *
 * `patch`, `note` and `itemTypeRestriction` stay absent when they do not apply —
 * none of them has a meaningful empty value, and inventing `""` would only move
 * the check somewhere else.
 *
 * `ru` is the record's Russian variant, complete or absent — never partial, so
 * a half-translated record cannot exist and the Russian locale's whole-record
 * fallback is a schema guarantee rather than a rendering convention. Optional
 * because the dataset must stay loadable while a future vendor refresh's new
 * runeword awaits translation; the coverage test pins the shipped dataset at
 * 100% translated regardless.
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
    patch: z.string().min(1).optional(),
    note: z.string().min(1).optional(),
    // Decoration on the availability-markers terms: no filter reads these two,
    // no counter subtracts by them, no logic branches on them. Both are
    // authored editorial content merged in by the generator, not vendor data.
    usefulness: z.enum(usefulnessValues).optional(),
    advice: adviceSchema.optional(),
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
    ru: runewordRuSchema.optional(),
  })
  .superRefine((record, ctx) => {
    // Per-record shape knowledge lives here, so a hand-edit to the committed
    // JSON that breaks it blanks the page pointing at the offending record.
    const { name, itemTypes, propertyGroups, ru } = record;

    // The variant's parity with its record — a relation the variant schema
    // cannot state alone. Field presence must match field for field, and the
    // property structure must mirror group for group and line for line,
    // because rendering pairs each Russian line with the English line's
    // position and a mismatch would silently shift every line after it.
    if (ru !== undefined) {
      for (const field of ["itemTypeRestriction", "note"] as const) {
        if ((ru[field] === undefined) !== (record[field] === undefined)) {
          ctx.addIssue({
            code: "custom",
            path: ["ru", field],
            message:
              `"${name}": the Russian variant must carry ${field} exactly ` +
              `when the record does — a variant is complete or absent, ` +
              `never partial.`,
          });
        }
      }

      if ((ru.advice === undefined) !== (record.advice === undefined)) {
        ctx.addIssue({
          code: "custom",
          path: ["ru", "advice"],
          message:
            `"${name}": the Russian variant must carry advice exactly when ` +
            `the record does — a variant is complete or absent, never partial.`,
        });
      } else if (
        ru.advice !== undefined &&
        record.advice !== undefined &&
        ru.advice.paragraphs.length !== record.advice.paragraphs.length
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["ru", "advice", "paragraphs"],
          message:
            `"${name}": Russian advice carries ` +
            `${ru.advice.paragraphs.length} paragraphs where the record ` +
            `carries ${record.advice.paragraphs.length} — rendering pairs ` +
            `them by position.`,
        });
      }

      if (ru.propertyGroups.length !== propertyGroups.length) {
        ctx.addIssue({
          code: "custom",
          path: ["ru", "propertyGroups"],
          message:
            `"${name}": the Russian variant carries ` +
            `${ru.propertyGroups.length} property groups where the record ` +
            `carries ${propertyGroups.length}.`,
        });
      } else {
        for (const [index, group] of ru.propertyGroups.entries()) {
          if (
            group.properties.length !== propertyGroups[index].properties.length
          ) {
            ctx.addIssue({
              code: "custom",
              path: ["ru", "propertyGroups", index, "properties"],
              message:
                `"${name}": Russian property group ${index} carries ` +
                `${group.properties.length} lines where the English group ` +
                `carries ${propertyGroups[index].properties.length}.`,
            });
          }
        }
      }
    }

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

export type RunewordRu = z.infer<typeof runewordRuSchema>;

export type Usefulness = (typeof usefulnessValues)[number];

export type RunewordAdvice = z.infer<typeof adviceSchema>;

/**
 * One rune. Tier is a named value rather than the source's `1 | 2 | 3`, because
 * `tier === "rare"` cannot be misread the way `tier === 3` can. The numeric
 * ordering is not lost: array order carries the canonical rune progression,
 * which is a finer ordering than the three bands anyway.
 *
 * `ru` is required, not optional like a runeword's variant: the rune list is
 * small, closed and fully translated, so an optional field would buy nothing
 * but a presence check at every use site.
 */
export const runeSchema = z.object({
  name: z.string().min(1),
  tier: z.enum(["common", "semirare", "rare"]),
  ru: z.string().min(1),
});

export type Rune = z.infer<typeof runeSchema>;

/**
 * One base item category a runeword can be socketed into. `ru` is required for
 * the rune schema's reason: twenty closed, fully translated entries.
 */
export const itemTypeSchema = z.object({
  name: z.string().min(1),
  // Four of the twenty categories have no wiki page to link to.
  url: z.url().optional(),
  ru: z.string().min(1),
});

export type ItemType = z.infer<typeof itemTypeSchema>;

/**
 * The game names the crafting-advice panel highlights. Authored beside the
 * advice itself and validated here for the reason every other list is: a
 * hand-edit that empties it should fail loudly rather than quietly stop
 * highlighting.
 */
const termListSchema = z.object({
  en: z.array(z.string().min(3)),
  ru: z.array(z.string().min(3)),
});

export const adviceTermsSchema = z.object({
  // Empty is legitimate rather than broken: the lists are filtered to the
  // names a shipped paragraph actually uses, so a dataset carrying no advice
  // carries no terms either. That the *shipped* lists are full is a coverage
  // assertion over the real dataset, not a shape one.
  bases: termListSchema,
  skills: termListSchema,
});

export type AdviceTerms = z.infer<typeof adviceTermsSchema>;

export const runewordsSchema = z.array(runewordSchema).min(1);
export const runesSchema = z.array(runeSchema).min(1);
export const itemTypesSchema = z.array(itemTypeSchema).min(1);
