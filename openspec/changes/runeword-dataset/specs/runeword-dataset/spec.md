## ADDED Requirements

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
individual lines, in the order the game presents them, with no blank or
whitespace-padded entries. Each runeword SHALL have at least one property line.

#### Scenario: Properties are split into individual lines

- **WHEN** the properties of `Ancient's Pledge` are read
- **THEN** they are separate entries, beginning with `+50% Enhanced Defense`,
  rather than one multi-line string

#### Scenario: No empty or padded entries survive

- **WHEN** every property line in the dataset is inspected
- **THEN** none is empty and none carries leading or trailing whitespace

#### Scenario: Long property lists are complete

- **WHEN** the properties of the runeword with the most of them are read
- **THEN** all 26 lines are present

### Requirement: Availability metadata is decoration only

A runeword MAY carry a ladder-only flag, the patch that introduced it, and a
free-form note. These fields exist to render badges. No filter, counter or
branch in application logic SHALL read them, because availability changes
between ladder seasons and a rule expressed as logic would silently miscount
progress, whereas a stale badge is only a cosmetic inaccuracy.

#### Scenario: The ladder-only flag is present on every record

- **WHEN** any runeword record is read
- **THEN** it exposes a ladder-only boolean
- **AND** exactly 9 of the 99 records have it set

#### Scenario: Patch is absent on the original runewords

- **WHEN** the patch field is inspected across the dataset
- **THEN** 74 records carry a patch value and the 25 that predate patch tracking
  carry none, which is a property of the data rather than a gap in it

#### Scenario: A season caveat is data, not logic

- **WHEN** the `Mosaic` record is read
- **THEN** it is flagged ladder-only, carries patch `2.6`, and carries a note
  recording that it is disabled in Season 13 and craftable offline non-ladder

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
