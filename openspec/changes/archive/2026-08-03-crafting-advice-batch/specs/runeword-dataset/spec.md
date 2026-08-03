# runeword-dataset Delta

## ADDED Requirements

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
