# Tasks

## 1. Schema

- [x] 1.1 Replace `properties: z.array(z.string().min(1)).min(1)` on
      `runewordSchema` in `src/data/schema.ts` with `propertyGroups`: an array
      (min 1) of `{ itemTypes?: string[] (min 1 when present), properties:
string[] (min 1, each min 1) }`, per design Decision 1, with a doc comment
      stating that an absent `itemTypes` means the group applies to every base the
      runeword allows.
- [x] 1.2 Add a `superRefine` to `runewordSchema` enforcing the per-record
      invariants (design Decision 4): exactly one group → it carries no
      `itemTypes` label; two or more groups → every group is labelled and the
      labels across groups name each entry of the record's `itemTypes` exactly
      once. Each failure message names the violated rule so a blank page points
      at the offending record.
- [x] 1.3 Extend the schema-focused cases in `src/data/index.test.ts`
      (the `validRecord()` helpers): a record with `propertyGroups: []` fails,
      an empty `properties` inside a group fails, a single labelled group fails,
      multiple groups with a missing or duplicated label fail, and a valid
      single-unlabelled-group record passes.

## 2. Generator

- [x] 2.1 Replace `splitProperties` in `scripts/generate-dataset.ts` with
      `splitPropertyGroups` (design Decision 3): trim lines and drop blanks as
      today; a line matching `#### <text>` starts a new labelled group; no
      headings → one unlabelled group; a property line before the first heading in
      a block that has headings → throw naming the runeword.
- [x] 2.2 Add the `HEADING_CATEGORIES` mapping (design Decision 2 — the four
      known headings, with `Body Armor` → `Body Armors`) and resolve each heading
      through it; the resolved category must be one of that record's `itemTypes`,
      otherwise throw naming the runeword and the heading.
- [x] 2.3 Update `scripts/generate-dataset.test.ts`: the drift test keeps
      proving committed JSON equals `buildDataset` output; add cases for a
      headed block producing labelled groups, the `Body Armor` singular mapping,
      an unknown heading throwing, a heading not in the record's `itemTypes`
      throwing, and lines before the first heading throwing.
- [x] 2.4 Run `pnpm data:build` to regenerate `src/data/runewords.json`;
      confirm the diff touches only the three varying records' property shape
      plus the flat→grouped rename on the rest, and that `pnpm format:check`
      still passes.

## 3. Dataset tests

- [x] 3.1 Rework the granted-properties block of `src/data/index.test.ts` to
      the delta spec's scenarios: `Ancient's Pledge` first line inside its single
      group; no empty or padded line in any group; 96 records with exactly one
      unlabelled group; `Fortitude`, `Phoenix`, `Spirit` each with two labelled
      groups (`Fortitude` at 12+12 for `Weapons`/`Body Armors`); every label
      resolving to the record's own `itemTypes` with each category claimed once;
      no line beginning with `####`; 969 lines in total.

## 4. Detail view

- [x] 4.1 Update `RunewordDialog.tsx` to map `propertyGroups` in one pass
      (design Decision 5): a labelled group renders its categories as a gold
      sub-heading (`<h4>` beneath the `Granted Properties` `<h3>`) followed by its
      `<ul>` of `PropertyLine`s; an unlabelled group renders the `<ul>` alone with
      no heading element. Labels are dataset content — no new i18n strings.
- [x] 4.2 Update `RunewordDialog.test.tsx`: the `Fortitude` assertion compares
      against the flattened group lines (24, no `####`), asserts the two
      sub-headings render as headings naming `Weapons` and `Body Armors`, and a
      single-group runeword renders no group sub-heading.
- [x] 4.3 Update `PropertyLine.test.tsx`'s `allLines` to
      `flatMap((r) => r.propertyGroups.flatMap((g) => g.properties))` and confirm
      the round-trip now covers 969 lines.
- [x] 4.4 Correct the `PANEL` comment in `RunewordDetails.tsx`: `Fortitude` is
      24 property lines plus two sub-headings — the scroll cap is still
      load-bearing.

## 5. Docs and verification

- [x] 5.1 Update the confirmed field-mapping table in `docs/DATA-SOURCES.md`:
      the `(descriptions)` row maps to `propertyGroups`, noting the `####`
      sub-headings become labelled groups and the `Body Armor`→`Body Armors`
      mapping.
- [x] 5.2 Update `IDEAS.md`: mark `property-groups` done in the change table
      and record what landed (shape chosen, the singular/plural gotcha's
      resolution, anything learned).
- [x] 5.3 Run the full gate (`pnpm check` — typecheck, lint, format, tests,
      build) and diff the built CSS class list against the previous build, per the
      established method — the new `<h4>` should add only utilities a component
      renders.
- [x] 5.4 Verify in the browser: `Fortitude`'s detail panel shows two labelled
      lists with no literal `####` text, a single-group runeword (e.g.
      `Ancient's Pledge`) is unchanged, and the panel still scrolls within its
      height cap.
