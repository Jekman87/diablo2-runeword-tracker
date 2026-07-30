# Property Groups

## Why

Three runewords — `Fortitude`, `Phoenix` and `Spirit` — grant different
properties depending on which base type they are socketed into. The vendored
source expresses that with Markdown sub-headings inside the property block, and
the generator carried them through verbatim: six of the dataset's 975 property
lines are literal section headers (`#### Weapons`, `#### Body Armor`,
`#### Shields`, `#### Swords`) masquerading as granted properties, and the
detail view renders them as green property text. The dataset is lying about
what a property is, and the presentation faithfully repeats the lie.

Nothing urgent depends on it — no progress logic reads `properties`, and the
Chronicle counts a runeword once regardless of the base it went into — but the
detail view for these three runewords is wrong on every device, and every
future consumer of `properties` inherits the same six bogus lines.

## What Changes

- **BREAKING (dataset schema):** the flat `properties: string[]` field on a
  runeword record is replaced by `propertyGroups` — a list of groups, each
  holding an ordered list of property lines and an optional list of the item
  categories the group applies to. One uniform shape for all 99 records: the 96
  runewords whose properties do not vary carry a single unlabelled group, and
  the three that vary carry one labelled group per base type. No optional
  extra field, so the detail view has a single code path.
- The generator learns to parse the `####` heading lines: a heading starts a
  new labelled group, and its text is resolved to the record's own item
  categories through an explicit mapping — the source heading reads
  `#### Body Armor` singular while the record's category is `Body Armors`
  plural, so string equality alone fails on `Fortitude`. A heading that cannot
  be resolved fails the build loudly rather than surviving as a property line.
- `src/data/runewords.json` is regenerated: same 99 records, 969 real property
  lines (975 minus the six headings), zero lines starting with `####`.
- The detail view renders each labelled group under a sub-heading naming its
  base types, and renders a single unlabelled group exactly as the property
  list renders today.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `runeword-dataset`: the granted-properties requirement changes shape — a
  record carries property groups rather than one flat line list, with
  invariants tying group labels to the record's own item categories and
  forbidding heading text from surviving as a property line. The generator
  requirement gains the heading-parsing rule and its failure mode.
- `runeword-table`: the detail-view requirement changes — the view presents
  property lines grouped by base type where the runeword grants different
  properties per base, and the "runeword with the most property lines"
  scenario's count changes because the six headings stop being lines. The
  property-value emphasis requirement is unchanged in behaviour but its
  "every line in the dataset" round-trip now iterates lines inside groups.

## Impact

- `src/data/schema.ts` — `properties` replaced by `propertyGroups`; types are
  inferred, so consumers fail to compile until updated.
- `scripts/generate-dataset.ts` and its test — heading parsing, the
  heading-to-category mapping, new invariants.
- `src/data/runewords.json` — regenerated.
- `src/data/index.test.ts` — granted-properties assertions move to groups;
  the `Fortitude` 26-line anchor becomes two 12-line groups.
- `src/components/RunewordDialog.tsx` and its test — renders groups; the
  labels are dataset content (category names), not display copy, so no i18n
  strings are added.
- `src/components/PropertyLine.test.tsx` — the all-lines round-trip flattens
  groups instead of the flat field; the component itself is untouched.
- `docs/DATA-SOURCES.md` — the confirmed field-mapping table row for
  `properties` updates to `propertyGroups`.
- No change to progress logic, persistence, search, sort, filters or the
  remaining panels — none of them reads properties.
