# runeword-dataset Delta

## MODIFIED Requirements

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
