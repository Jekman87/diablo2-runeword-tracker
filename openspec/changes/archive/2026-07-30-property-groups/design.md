## Context

Three runewords — `Fortitude`, `Phoenix`, `Spirit` — grant different properties
per base type. The vendored `runewords-descriptions.ts` expresses that with
Markdown sub-headings inside the property block (`#### Weapons`,
`#### Body Armor`, `#### Shields`, `#### Swords` — six occurrences), and
`splitProperties` in `scripts/generate-dataset.ts` carries them through
verbatim. So `Fortitude`'s first "property" is the literal text
`#### Weapons`, and the detail view renders it in green as if the runeword
granted it.

The blast radius is small and fully known. `properties` is read by exactly one
component (`RunewordDialog`), one test that flattens all lines
(`PropertyLine.test.tsx`), and the dataset's own tests. No progress logic, no
search, no filter, no aggregation reads it — the Chronicle counts a runeword
once regardless of the base it went into.

One trap, recorded in `IDEAS.md`: the source heading reads `#### Body Armor`
singular while `Fortitude`'s category is `Body Armors` plural, so matching
heading text to item categories by string equality fails on exactly one of the
six headings.

## Goals / Non-Goals

**Goals:**

- One uniform record shape for all 99 runewords: an ordered list of property
  groups, each with an optional item-category label — so the detail view has a
  single code path, not a fast path for 96 records and a special one for 3.
- The generator owns the heading parsing and fails loudly on anything it does
  not recognise, keeping the "a vendor refresh fails on the field that moved"
  property.
- The detail view for the three varying runewords becomes correct: two
  labelled lists a reader can tell apart, instead of 26 lines with two bogus
  green headings buried in them.

**Non-Goals:**

- No change to the table row, search, sort, filters, remaining panels,
  progress or persistence — nothing outside the dataset shape, its generator
  and the detail view.
- No per-base crafted tracking. The Chronicle counts a runeword once; the
  groups exist to present properties, not to split progress.
- No i18n additions. Group labels are item category names — dataset content,
  the same vocabulary `ItemTypes` already renders — not display copy.
- No vendor file edits. `vendor/` stays a read-only snapshot; the knowledge of
  what a heading means lives in the generator.

## Decisions

### 1. Replace `properties` with `propertyGroups`; do not add a field beside it

```ts
// schema.ts
propertyGroups: z.array(
  z.object({
    // Absent means the group applies to every base the runeword allows.
    itemTypes: z.array(z.string().min(1)).min(1).optional(),
    properties: z.array(z.string().min(1)).min(1),
  }),
).min(1),
```

A 96-record runeword carries `[{ properties: [...] }]`; the three varying ones
carry `[{ itemTypes: ["Weapons"], properties: [...] }, ...]`.

**Why this over an optional extra field** (keeping `properties` flat and adding
`propertyOverrides` for the three): the optional field gives every consumer two
code paths and makes the common case the misleading one — `Fortitude.properties`
would still exist and still be wrong for whichever base the reader cares about.
`IDEAS.md` already settled this: one uniform shape.

**Why `itemTypes` is an array, not a single string:** the label's meaning is
"the subset of the record's `itemTypes` this group applies to", and giving it
the same shape as the field it subsets keeps that relationship literal. Today
every group labels exactly one category, and the invariants below pin that
down where it matters — in the data, not the schema shape.

**Why the label is optional rather than always present:** for 96 records the
only honest value would be a copy of the record's whole `itemTypes`, a second
representation of an existing fact — exactly what the socket-count rule exists
to forbid. Absent-means-all keeps one source of truth.

### 2. Group labels are the record's own category names, resolved by an explicit mapping

The generator resolves heading text to categories with a small lookup:

```ts
const HEADING_CATEGORIES: Record<string, string> = {
  Weapons: "Weapons",
  Swords: "Swords",
  Shields: "Shields",
  "Body Armor": "Body Armors", // the one the source writes in the singular
};
```

The resolved value must then be one of that record's `itemTypes`, or the build
fails naming the runeword and the heading.

**Alternatives rejected:**

- _Verbatim heading text as a free-text label._ Ships `Body Armor` as a label
  that string-matches nothing else in the dataset, creates a second category
  vocabulary one entry wide, and hands `russian-locale` a third field to source
  from the game client. The mismatch is the vendor's typo-level inconsistency;
  vendoring it into our schema makes it permanent.
- _Automatic singular/plural normalisation._ Implicit, and wrong the first time
  a future heading pluralises differently. An enumerated mapping fails loudly on
  anything new, which is the generator's established posture (strict vendor
  schema, `assertDescriptionKeysAgree`).

### 3. Parsing rule: headings partition the block completely or not at all

`splitProperties` becomes `splitPropertyGroups`:

- A trimmed line matching `#### <text>` starts a new labelled group.
- A block with no headings becomes one unlabelled group (the 96-record path —
  behaviour identical to today).
- A block with headings must start with one: property lines before the first
  heading fail the build, because lines outside every group have no
  determinable base types. All three current blocks start with a heading.
- Empty groups (a heading followed immediately by another heading or the end)
  fail schema validation via `properties: min(1)`.

### 4. Cross-field invariants live in the schema; dataset-wide counts live in tests

The runeword schema gains a `superRefine`: a record with one group must carry
no label; a record with several groups must have every group labelled, and the
labels across groups must name each of the record's `itemTypes` exactly once
(a partition). This is per-record shape knowledge, and load-time validation is
the project's established stance — a hand-edit to `runewords.json` that breaks
the partition should blank the page, not degrade it.

Dataset-wide facts stay in `src/data/index.test.ts`, following the existing
cross-reference pattern: 96 single-group records, 3 two-group records
(`Fortitude`, `Phoenix`, `Spirit`), 969 total lines, no line starting with
`####`, `Fortitude` at 12+12.

### 5. The detail view maps groups in one pass; labels render as headings

`RunewordDialog` replaces its single `<ul>` with a map over `propertyGroups`:
when a group carries `itemTypes`, render them joined as a sub-heading (an
`<h4>` under the existing `Granted Properties` `<h3>`, styled as a heading —
gold, like the other labels — so it cannot read as another green property
line); then the group's `<ul>` exactly as today. A single unlabelled group
renders no heading element at all — not an empty one.

`PropertyLine` is untouched; its round-trip test flattens
`propertyGroups.flatMap((g) => g.properties)` and now proves 969 lines instead
of 975 — six of which it was previously "emphasising" as if `#### Weapons`
were a property.

### 6. Everything lands atomically in one change

Schema, generator, regenerated JSON, detail view and tests move together in one
commit sequence that keeps `pnpm check` green at each step boundary only where
possible — the schema swap itself is the breaking edge, so schema + generator +
JSON + consumers land as one task rather than four. There is no data migration:
`localStorage` stores runeword names, which do not change.

## Risks / Trade-offs

- **[Vendor refresh introduces a new heading]** → the mapping lookup fails
  naming the runeword and heading; extending `HEADING_CATEGORIES` is a
  conscious one-line edit reviewed against the game, not a silent guess.
- **[The 26-line anchor is scattered through prose and tests]** →
  `Fortitude: 26` appears in `index.test.ts`, the dialog test, and comments
  (`RunewordDetails`' PANEL note). Tests are updated by the tasks; the comment
  keeps its point (the panel must scroll) with the count corrected to 24 lines
  plus two sub-headings — visually as tall as before.
- **[Schema `superRefine` errors are less legible than structural failures]** →
  each refine emits a message naming the runeword and the violated rule, so a
  blank page still points at the record that caused it.
- **[Groups invite future per-base progress tracking]** → explicitly a
  non-goal; the Chronicle counts once. Nothing in the shape stores progress,
  and the spec keeps availability-style "decoration only" discipline: only the
  detail view reads groups.

## Migration Plan

Single change, no deployment migration: the dataset is bundled, `localStorage`
holds only runeword names and view settings, neither references properties.
Rollback is reverting the commits.

## Open Questions

None. The one genuinely open call — label vocabulary — is settled by Decision 2,
and the heading-to-category mapping covers all six occurrences in the current
snapshot.
