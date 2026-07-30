# runeword-dataset Delta

## ADDED Requirements

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
