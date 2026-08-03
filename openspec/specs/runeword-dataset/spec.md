# runeword-dataset Specification

## Purpose

The data contract the whole application reads — what a runeword record contains,
the rune and item-type reference data it points at, the invariants that hold
across all 99 records, the validation that enforces them, and the generator that
keeps the committed data honest about its source.

## Requirements

### Requirement: Complete runeword dataset

The project SHALL ship a static dataset of all 99 runewords tracked by the D2R
Chronicle log, importable by application code through a single module. Each
record SHALL carry a unique name, an ordered rune sequence, a required character
level, one or more allowed base item categories, and the properties the runeword
grants. Names SHALL be the English forms and SHALL serve as the canonical
identifiers.

#### Scenario: All 99 runewords are present

- **WHEN** application code imports the dataset
- **THEN** it receives exactly 99 runeword records

#### Scenario: Names are unique identifiers

- **WHEN** the runeword names are collected
- **THEN** all 99 are distinct, so a name identifies exactly one record

#### Scenario: Every record carries the required fields

- **WHEN** any runeword record is read
- **THEN** it has a name, a non-empty ordered rune sequence, a required level, at
  least one item category, and at least one property line

#### Scenario: Required levels are within the game's range

- **WHEN** the required levels are inspected
- **THEN** every value is a positive integer within the range the game uses,
  from 13 to 69

### Requirement: Socket count is derived, never stored

Socket count SHALL NOT be a field on a runeword record. It equals the length of
the rune sequence and SHALL be derived at each use site, so that no second
representation of the same fact can drift from the first.

#### Scenario: No socket field exists

- **WHEN** a runeword record is inspected
- **THEN** it exposes no socket-count field

#### Scenario: Derived count matches the rune sequence

- **WHEN** socket count is derived for every runeword
- **THEN** each equals that runeword's rune-sequence length, ranging from 2 to 6

### Requirement: Rune sequence integrity

A runeword's rune sequence SHALL preserve both the order and the repetitions of
the runes as socketed in game, because the order is part of the recipe and is not
interchangeable. Every rune named in any sequence SHALL resolve to an entry in
the rune reference data.

#### Scenario: Order is preserved

- **WHEN** the sequence for `Ancient's Pledge` is read
- **THEN** it is exactly `Ral`, `Ort`, `Tal` in that order

#### Scenario: Repeated runes are preserved

- **WHEN** the sequence for `Infinity` is read
- **THEN** it is exactly `Ber`, `Mal`, `Ber`, `Ist` — the repeat is retained
  rather than collapsed

#### Scenario: Every rune reference resolves

- **WHEN** every rune named across all 99 sequences is looked up in the rune
  reference data
- **THEN** every lookup succeeds
- **AND** the total number of rune slots across the dataset is 343

### Requirement: Rune reference data

The project SHALL ship reference data for all 33 runes, each with its English
name and its rarity tier, in the canonical in-game rune order. Tier SHALL be
expressed as a named value rather than a bare number.

#### Scenario: All 33 runes are present in canonical order

- **WHEN** the rune reference data is read
- **THEN** it contains 33 entries
- **AND** the first is `El` and the last is `Zod`

#### Scenario: Tiers are named and evenly banded

- **WHEN** the runes are grouped by tier
- **THEN** each tier is one of `common`, `semirare` or `rare`
- **AND** each of the three bands contains exactly 11 runes

#### Scenario: Runes are addressable by name

- **WHEN** application code looks up a rune by its name
- **THEN** the lookup resolves without scanning the whole list

### Requirement: Base item category reference data

The project SHALL ship reference data for the base item categories a runeword can
be socketed into, each optionally carrying a reference URL. Every category named
by a runeword SHALL resolve to an entry. A runeword MAY additionally carry a
single restriction describing which bases within those categories qualify.

#### Scenario: Every category reference resolves

- **WHEN** every item category named across all 99 runewords is looked up
- **THEN** every lookup succeeds against the 20 declared categories

#### Scenario: Restrictions are stored without presentational punctuation

- **WHEN** the restriction on a runeword such as `Leaf` or `Mosaic` is read
- **THEN** the value is the bare text — `Not Orbs/Wands`, `Assassin` — with no
  surrounding parentheses, leaving punctuation to the presentation layer

#### Scenario: Runewords without a restriction carry none

- **WHEN** a runeword whose categories need no narrowing is read
- **THEN** it exposes no restriction value, rather than an empty one

#### Scenario: Categories without a reference URL are still valid

- **WHEN** a category that has no reference URL is read
- **THEN** it resolves successfully with the URL absent

### Requirement: Granted properties

Every runeword SHALL carry the properties it grants as an ordered list of
property groups — one uniform shape across all 99 records, so no consumer needs
a second code path for the records whose properties vary by base type. Each
group SHALL hold an ordered list of individual property lines, in the order the
game presents them, with no blank or whitespace-padded entries and at least one
line. Each group MAY carry a label naming the item categories it applies to.

A runeword whose properties do not vary by base SHALL carry exactly one group
with no label, meaning the lines apply to every base the runeword allows. A
runeword whose properties vary by base SHALL carry one labelled group per base
type, and the labels across its groups SHALL name each of that record's item
categories exactly once — every label resolves to a category the record allows,
and no category is left without a group or claimed by two.

No property line SHALL be a section heading: the vendored source's `####`
markers SHALL NOT survive into any group's lines.

#### Scenario: Properties are split into individual lines

- **WHEN** the properties of `Ancient's Pledge` are read
- **THEN** they are separate entries within its single group, beginning with
  `+50% Enhanced Defense`, rather than one multi-line string

#### Scenario: No empty or padded entries survive

- **WHEN** every property line in every group across the dataset is inspected
- **THEN** none is empty and none carries leading or trailing whitespace

#### Scenario: A uniform runeword carries one unlabelled group

- **WHEN** the property groups of the 96 runewords whose properties do not vary
  by base are read
- **THEN** each record carries exactly one group
- **AND** that group carries no label

#### Scenario: A varying runeword carries one labelled group per base type

- **WHEN** the property groups of `Fortitude` are read
- **THEN** there are exactly two, both labelled — one applying to `Weapons`
  with 12 lines and one applying to `Body Armors` with 12 lines
- **AND** `Phoenix` and `Spirit` likewise carry two labelled groups each

#### Scenario: Group labels resolve to the record's own categories

- **WHEN** every group label across `Fortitude`, `Phoenix` and `Spirit` is
  checked against that record's item categories
- **THEN** every label names a category the record allows
- **AND** each record's categories are each claimed by exactly one group

#### Scenario: No heading survives as a property line

- **WHEN** every property line in the dataset is inspected
- **THEN** none begins with `####`
- **AND** the dataset holds 969 property lines in total — the source's 975
  minus the six headings that became group labels

#### Scenario: Long property lists are complete

- **WHEN** the properties of the runeword with the most lines are read
- **THEN** all 24 of `Fortitude`'s lines are present across its two groups

### Requirement: Availability metadata is decoration only

A runeword MAY carry a ladder-only flag, the patch that introduced it, and a
free-form note. These fields exist to render badges. No filter, counter or
branch in application logic SHALL read them, because availability changes
between ladder seasons and a rule expressed as logic would silently miscount
progress, whereas a stale badge is only a cosmetic inaccuracy.

#### Scenario: The ladder-only flag is present on every record

- **WHEN** any runeword record is read
- **THEN** it exposes a ladder-only boolean
- **AND** exactly 8 of the 99 records have it set

#### Scenario: Patch is absent on the original runewords

- **WHEN** the patch field is inspected across the dataset
- **THEN** 74 records carry a patch value and the 25 that predate patch tracking
  carry none, which is a property of the data rather than a gap in it

#### Scenario: A season caveat is data, not logic

- **WHEN** the `Mosaic` record is read
- **THEN** it is not flagged ladder-only, carries patch `2.6`, and carries a note
  recording that it is disabled on ladder and craftable offline non-ladder
- **AND** the cleared ladder flag is a data correction: the vendor still marks
  Mosaic ladder-only, which would contradict the note if shipped as-is

#### Scenario: The progress denominator ignores availability

- **WHEN** the total against which progress is measured is derived from the
  dataset
- **THEN** it is 99 — no availability field reduces it

### Requirement: Schema-validated dataset

The dataset's shape SHALL be declared once as a validation schema, from which the
TypeScript types are derived, so that the validator and the compiler cannot
disagree. The dataset SHALL be validated when it is loaded rather than trusted,
and a dataset that does not satisfy the schema SHALL fail loudly at load rather
than reaching the interface as partial data.

#### Scenario: Types derive from the schema

- **WHEN** the dataset's types are inspected
- **THEN** they are derived from the validation schema, with no separately
  hand-written declaration of the same shape

#### Scenario: A valid dataset loads

- **WHEN** application code imports the dataset
- **THEN** validation passes and the typed records are returned

#### Scenario: A hand-edited malformed record fails at load

- **WHEN** a required field is removed or given the wrong type in the committed
  data
- **THEN** loading the dataset throws, naming the offending field
- **AND** the test suite fails, so the defect cannot reach a deployment

#### Scenario: Unresolvable cross-references fail the suite

- **WHEN** the committed data names a rune or item category that the reference
  data does not define
- **THEN** the test suite fails and identifies the unresolved name

### Requirement: Dataset is generated from the vendored source

The dataset SHALL be produced from the vendored reference snapshot by a committed
script rather than transcribed by hand, because a wrong value in game data passes
every type, lint and render check and surfaces only in play. The script SHALL
validate the vendored shape before transforming it, so that a change in the
upstream snapshot fails on the field that changed instead of yielding a
plausible-looking dataset with missing values. A test SHALL prove the committed
dataset still matches what the script produces.

The script SHALL parse the vendored property blocks into property groups: a
`####` sub-heading starts a new labelled group, and a block with no sub-heading
becomes a single unlabelled group. A sub-heading's text SHALL be resolved to
the record's own item categories through an explicit mapping rather than string
equality, because the source writes `#### Body Armor` singular where the
category is `Body Armors` plural. A sub-heading the mapping cannot resolve to
one of that record's categories SHALL fail the build naming the runeword and
the heading, rather than surviving as a property line or an unresolvable label.
A block that mixes headed and unheaded runs of lines SHALL likewise fail, so a
malformed vendor block cannot produce a group whose base types are unknowable.

#### Scenario: Regenerating reproduces the committed dataset

- **WHEN** the generator runs against the current vendored snapshot
- **THEN** the data it produces is equal to the committed dataset

#### Scenario: Hand-editing the committed data is caught

- **WHEN** a value in the committed dataset is changed without regenerating
- **THEN** the test suite fails and identifies the diverging dataset

#### Scenario: An unexpected vendor shape is rejected

- **WHEN** the vendored snapshot renames or retypes a field the generator reads,
  or introduces one it does not know
- **THEN** the generator fails and names the field, rather than emitting records
  with missing values

#### Scenario: A description key mismatch is rejected

- **WHEN** the vendored property blocks and the vendored runeword list do not
  agree on the same set of names
- **THEN** the generator fails rather than emitting a runeword with no properties

#### Scenario: A vendor sub-heading becomes a group label

- **WHEN** the generator transforms a vendored block containing `####`
  sub-headings
- **THEN** each sub-heading starts a new group labelled with the record's
  matching item categories, and the heading text itself appears in no group's
  lines
- **AND** `#### Body Armor` on `Fortitude` resolves to the category
  `Body Armors` through the explicit mapping

#### Scenario: An unresolvable sub-heading fails the build

- **WHEN** a vendored block carries a sub-heading the mapping cannot resolve to
  one of that record's item categories
- **THEN** the generator fails naming the runeword and the heading, rather than
  emitting the heading as a property line or guessing a label

#### Scenario: A block mixing headed and unheaded lines fails the build

- **WHEN** a vendored block places property lines before its first sub-heading
- **THEN** the generator fails naming the runeword, rather than inventing an
  unlabelled group beside labelled ones

#### Scenario: Regeneration leaves a clean working tree

- **WHEN** the generator runs and nothing in the vendored snapshot has changed
- **THEN** no committed file is modified
- **AND** `pnpm format:check` still passes, because the generator emits the
  project's canonical formatting

### Requirement: Attribution for the derived data

The runeword data derives from the MIT-licensed `fabd/diablo2-runewizard`
project, and the derived form ships inside the deployed bundle. The repository
SHALL carry an attribution naming the original author and licence and linking to
the source, and the licence text SHALL remain alongside the vendored snapshot it
covers.

#### Scenario: Attribution is present and discoverable

- **WHEN** a reader inspects the repository
- **THEN** an attribution names Fabrice Denis and the MIT licence and links to
  the upstream repository
- **AND** it is reachable from `README.md`

#### Scenario: The licence text travels with the snapshot

- **WHEN** the vendored directory is inspected
- **THEN** the upstream MIT licence text is present within it

### Requirement: Russian labels ship with the dataset

The dataset SHALL carry Russian labels beside the canonical English text. A
runeword record MAY carry a Russian variant holding a Russian name, a Russian
item-type restriction exactly when the record has an English one, a Russian
note exactly when the record has an English one, and Russian property groups
that mirror the English structure — the same number of groups, and within each
group one Russian line per English line, in the same order. A variant SHALL be
complete or absent; a partial variant SHALL fail validation at load, so a
half-translated record cannot exist. Every rune and every item-type category in
the reference data SHALL carry a Russian name.

The shipped dataset SHALL be fully translated — all 99 runewords, all 33 runes
and all 20 categories — proven by test, so an accidental omission fails the
suite rather than quietly falling back.

#### Scenario: Every record carries a complete Russian variant

- **WHEN** the shipped dataset is read
- **THEN** all 99 runeword records carry a Russian variant, all 33 runes and
  all 20 item-type categories carry a Russian name

#### Scenario: A variant mirrors its record's property structure

- **WHEN** the Russian variant of `Fortitude` is read
- **THEN** it carries two property groups of 12 lines each, matching the
  English groups line for line

#### Scenario: Restriction and note parity

- **WHEN** any Russian variant is read
- **THEN** it carries a Russian restriction exactly when the English record
  carries one, and a Russian note exactly when the English record carries one —
  `Mosaic`'s season note included

#### Scenario: A partial variant fails at load

- **WHEN** a committed variant omits its name or carries a group whose line
  count differs from the English group's
- **THEN** loading the dataset throws naming the offending record, and the test
  suite fails

#### Scenario: Group labels localise through the reference data

- **WHEN** a labelled property group is presented under the Russian locale
- **THEN** its label is the Russian name of the category from the reference
  data, because the variant stores no labels of its own

### Requirement: Russian labels are generated from an authored translation source

Russian labels SHALL enter the dataset through the generator, from authored
translation source files keyed by canonical English names, validated with the
same rigour as the vendored data. The generator SHALL fail the build when a
translation names a runeword, rune or category the vendored data does not
define, so a typo in a key cannot silently produce an untranslated record. No
translation SHALL be machine-generated: entries are the official Russian
localisation's own text, taken from a full transcription of the client's
runeword and rune text and, where that transcription is doubtful, from a reading
of the running client. Records the transcription predates MAY be sourced from
Russian community sites and rewritten onto the official localisation's own
conventions. Each entry in the translation source SHALL carry a note of its
source, kept in the authored files for review and NOT emitted into the shipped
JSON. The drift test SHALL continue to prove the committed dataset equals the
generator's output, Russian fields included.

#### Scenario: Regenerating reproduces the committed dataset with Russian fields

- **WHEN** the generator runs against the current vendored snapshot and
  translation source
- **THEN** the data it produces, Russian labels included, is equal to the
  committed dataset

#### Scenario: An unknown translation key fails the build

- **WHEN** the translation source names a runeword, rune or category the
  vendored data does not define
- **THEN** the generator fails naming the key, rather than dropping the entry

#### Scenario: Every translation entry names its source

- **WHEN** the translation source files are inspected
- **THEN** each entry carries a note identifying where its wording was taken
  from

#### Scenario: Source notes do not ship

- **WHEN** the generated JSON files are inspected
- **THEN** they contain no source notes, because the notes exist for review
  rather than rendering

### Requirement: Usefulness and advice ship as authored dataset fields

Each runeword record MAY carry a `usefulness` field whose value is exactly one
of `meta`, `situational` or `chronicle`, and MAY carry an `advice` field of the
shape `{ paragraphs: string[], sources?: { label, url }[] }` — English
paragraphs of free prose, plus optional source links shared across locales. A
record's Russian variant SHALL mirror `advice.paragraphs` count-for-count when
the record carries advice, on the same whole-variant terms the existing
translation parity sets; `sources` SHALL NOT be duplicated per locale.

Neither field has a vendor source: both SHALL be authored in a module under
`data/`, keyed by canonical English name, merged into the emitted JSON by the
generator, and validated when the dataset loads. The generator SHALL fail on a
key the dataset does not define. Each authored entry SHALL carry a `source`
note recording where its judgement came from — tier list, trade data,
build guide — and that note SHALL NOT be emitted into the shipped JSON.

The schema SHALL enforce the closed usefulness set, non-empty advice
paragraphs, well-formed absolute `https` URLs on sources, and the Russian
paragraph parity, so a hand-edit that breaks any of them blanks the page
naming the record rather than rendering wrong content quietly.

#### Scenario: The authored module feeds the generated dataset

- **WHEN** `pnpm data:build` runs with an advice entry keyed by a canonical
  name
- **THEN** the emitted record carries that usefulness value and advice, and
  the entry's `source` note appears nowhere in the emitted JSON

#### Scenario: An unknown key fails the build

- **WHEN** the authored module carries a key naming no runeword in the
  vendored dataset
- **THEN** generation fails naming that key

#### Scenario: Broken parity fails validation

- **WHEN** a record's Russian advice carries a different paragraph count than
  its English advice
- **THEN** dataset validation fails naming the record

#### Scenario: A malformed source URL fails validation

- **WHEN** an advice source's `url` is not an absolute `https` URL
- **THEN** dataset validation fails naming the record
