# Dataset Localisation — Design

## Context

The `russian-locale` change gave the project a two-locale strings layer, a header
switch and a persisted preference, and deliberately scoped dataset text out:
runeword names, rune names, base categories, property lines, restrictions and
notes still render in canonical English inside the Russian page. Both
`search.ts` and `sort.ts` carry docblocks deferring the Cyrillic-collation
question to exactly this change.

The maintainer's decisions (agreed 2026-07-30) constrain the design:

1. Strictly one language on screen — no English shown alongside Russian.
2. Crafted storage and the future CSV format keep canonical English names.
3. Sourcing is the game's own official Russian localisation, reached two ways:
   noob-club.ru transcribes the client's runeword and rune text in full (topics
   70236, 70237, 73463), and a reader with the game open settles what the
   transcription leaves doubtful — the client wins, and it caught a
   transcription typo on `Shael`. Community sites, diablo2-resurrected.ru
   chiefly, cover the records the transcription predates. No machine
   translation; source noted per entry.
4. Russian fields enter through `scripts/generate-dataset.ts`, zod-validated; a
   record either carries a complete Russian variant or is flagged untranslated
   and falls back to English.
5. The `[REVIEW]`-flagged terms in `src/i18n/ru.ts` are verified and unflagged
   here.

Current shape that matters: the dataset is generated from the read-only
`vendor/runewizard` snapshot into three JSON files (99 runewords, 33 runes,
20 item-type categories, 969 property lines); search matches three fields by
lowercase substring; sorting compares text by code point (`byCodePoint`);
crafted storage keys by `runeword.name`; `RuneIcon` uses the canonical name for
both sprite lookup and `aria-label`.

## Goals / Non-Goals

**Goals:**

- Russian labels for every localisable dataset field, shipped inside the
  generated JSON and validated like the rest of the dataset.
- One language on screen: the Russian locale renders dataset text in Russian,
  with a whole-record English fallback for any untranslated record.
- Search and sort operate on the text the active locale actually displays,
  with real Russian collation.
- Canonical English names remain the only identifiers: storage, sprite keys,
  slot mapping and the future CSV format are untouched.
- The `[REVIEW]` flags in `ru.ts` resolved under the amended sourcing rule.

**Non-Goals:**

- No CSV import/export implementation (Phase 3); this change only fixes its
  contract as English-only.
- No third locale, no i18n library, no locale-selection changes.
- No re-translation of project-authored copy already shipped by
  `russian-locale`.
- No changes to the vendored snapshot — it stays read-only English source data.

## Decisions

### 1. Russian labels live in the dataset, not the strings layer

The strings layer holds copy the project authors; dataset text is data. Russian
dataset labels therefore ship inside the generated JSON:

- `Runeword` gains an optional `ru` variant object:
  `{ name, itemTypeRestriction?, note?, propertyGroups: { properties: string[] }[] }`.
  The variant's `itemTypeRestriction` and `note` are present exactly when the
  English fields are; `propertyGroups` mirrors the English group structure —
  same group count, same per-group line count, one Russian line per English
  line. Group labels are not stored in the variant: they are category names and
  localise through the item-type reference data.
- `Rune` gains a required `ru` name (33 entries, all translated — the game
  transliterates rune names).
- `ItemType` gains a required `ru` name (20 entries, all translated).

Rationale: embedding the variant beside the English record keeps one file per
concern, keeps the drift test meaningful, and makes "complete variant or none"
enforceable in the schema. Reference data gets _required_ Russian names because
both lists are small, closed and fully translated; making them optional would
buy nothing but weaker types. Alternative considered: a parallel
`runewords.ru.json` keyed by name — rejected because completeness and shape
parity would then be cross-file invariants instead of a `superRefine` on one
record.

### 2. Translations are authored source files merged by the generator

A new authored directory `data/ru/` holds TypeScript modules — `runewords.ts`,
`runes.ts`, `item-types.ts` — keyed by canonical English name, typed, with a
per-entry source note (where the wording was verified, plus the disagreement and
the choice made wherever sources differed). `scripts/generate-dataset.ts`
imports them, validates them with zod, merges them into the output records, and
fails the build when a translation names a runeword, rune or category the
vendored data does not define — a typo in a key must not silently produce an
untranslated record.

Source notes stay in the authored TS files (as fields or comments) and are not
emitted into the JSON: they exist for review, not for rendering, and the JSON
ships in the bundle.

The existing drift test extends naturally: committed JSON must equal generator
output, now including the merged Russian fields. A new coverage assertion pins
99/99 runewords, 33/33 runes and 20/20 categories translated, so an accidental
omission fails the suite rather than quietly falling back.

### 3. A single display projection feeds rendering, search and sort

A new module (`src/runewords/display.ts`) exposes the locale projection of a
record: given a runeword and the active locale, it returns the display fields —
name, category names, restriction, note, property groups with labels, rune
labels. Components, `matchesQuery` and the sort comparators all read this one
projection, so "search matches what the row shows" and "sort orders what the
column shows" hold by construction rather than by three parallel
implementations agreeing.

Projection rule: under `en`, canonical fields verbatim. Under `ru`, the
record's `ru` variant plus Russian reference names; a record with no `ru`
variant projects entirely in English — name, categories, restriction, rune
labels and all — so a row is never half-translated (decision 4's whole-record
fallback). With the coverage test at 100% this path is defensive: it exists so
a future vendor update that adds a runeword renders coherently while its
translation is pending, not because any shipped record uses it.

### 4. Search matches the selected language's text

`matchesQuery` gains a locale parameter and matches against the projected name,
categories and restriction. `toLowerCase()` handles Cyrillic case folding
correctly, and substring matching needs no collator. One normalisation is
added: `ё` folds to `е` on both query and haystack, because Russian typists
routinely type `е` for `ё` and an exact-match miss on that distinction would
read as a bug. Under the Russian locale, English text is not matched — except
on a fallback record, whose projected (English) text is exactly what the row
shows.

### 5. Sorting collates Russian text with `Intl.Collator("ru")`

`byCodePoint` stays the comparator for English projections — the premise that
ASCII code-point order is alphabetical order still holds there. Russian
projections compare through a module-level `Intl.Collator("ru")`, which orders
`ё` between `е` and `ж` where code-point order would exile it past `я`.
`Intl.Collator` is universal in the browsers the site targets and adds no
dependency. The universal tiebreak (required level, then name) keeps the
_canonical_ name as its final key: it is an identifier-level determinism
guarantee, invisible as presentation, and keeping it locale-independent means a
row's tiebroken position never shifts with the language. Crafted storage's
code-point sort of stored names is untouched for the same reason.

### 6. Canonical names remain the only identifiers

No identity-keyed code path changes: crafted storage reads and writes English
names; `RuneIcon` keeps the canonical name as sprite key; the slot mapping
stays keyed by canonical category names; `patchColour()` keys by the raw patch
value. `RuneIcon`'s `aria-label` switches to the projected rune label, because
a label read aloud is presentation, not identity. The future CSV format is
specified as canonical-English and locale-independent, which is a sentence in
the progress contract rather than code in this change.

### 7. `PropertyLine` renders Russian lines through the existing regex

The two-tone value emphasis splits on numeric patterns; Russian property lines
keep Arabic digits, `+`, `%` and ranges, so the mechanism holds. The existing
round-trip test extends over all Russian lines, proving no character of any
translated line is lost or duplicated by the split.

### 8. `[REVIEW]` terms are resolved under the amended sourcing rule

Each flagged term — the slot names («Ближний бой», «Дальний бой», «Левая
рука», «Броня»), «патч» vs «обновление», «Основы», «ладдер» and the `L`
marker — is checked against the official localisation, corrected where it
disagrees with the current value, its source note updated to name where it was
verified, and the `[REVIEW]` flag removed. Three were wrong and two had no
source to check against at all — the slot names this project invented — which is
itself the finding and is recorded as such. The rule is restated where it lives:
the `ui-strings` spec's sourcing requirement keeps the client as the source and
gains the two ways the client is read, and `docs/CODE_RULES.md` and
`openspec/config.yaml` follow.

## Risks / Trade-offs

- **Community translations may diverge from the official client** → the risk
  the maintainer accepted knowingly; mitigated by cross-checking a second
  source, per-entry source notes making every term reviewable, and canonical
  English names remaining the identifiers so a wording fix is a data edit with
  no migration.
- **969 translated property lines roughly double `runewords.json`** → accepted;
  it is a static asset served gzipped, and Russian text compresses well. No
  lazy-loading machinery for one locale's labels.
- **Hand-transcription errors across ~1,100 translated strings** → the same
  hazard the generator exists for, now without a machine-readable source.
  Mitigated structurally: zod validation, group/line-count parity enforced per
  record, unknown-key failures, 100% coverage assertion, and source notes for
  spot review.
- **`Intl.Collator` output could theoretically differ across engines** → CLDR
  Russian collation is stable in practice; the sort remains total and
  deterministic per engine, and the identifier-level tiebreak is
  collator-free. Tests assert relative orderings (`е` < `ё` < `ж`), not full
  snapshots of collator output.
- **Search folding `ё`→`е` is a deliberate inexactness** → scoped to matching
  only; displayed text keeps its `ё`.

## Migration Plan

No stored data changes: crafted progress and the locale preference keep their
formats. Deploy is a routine static build. Rollback is reverting the release;
nothing persisted depends on the new fields.

## Open Questions

None blocking. The exact Russian wording of individual entries (and whether any
`[REVIEW]` term changes) is resolved during implementation against the sources,
under the validation the design puts around it.
