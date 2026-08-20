## MODIFIED Requirements

### Requirement: Availability badges

A row SHALL render a badge for each availability field the runeword carries: the
patch that introduced it, and a note marker where a caveat exists. A runeword
carrying none SHALL render no badges rather than placeholders.

No ladder-only marker SHALL be rendered. The dataset no longer carries the flag
one would read, and a legend entry for a marker the page cannot show is worse
than no entry at all.

A patch badge SHALL be coloured according to the patch it names, so that the era a
runeword comes from is readable without reading the number. Patches belonging to
one era MAY share a colour where the project has decided they are one era.

These badges SHALL remain decoration: no ordering, filtering, counting or progress
calculation anywhere in the application SHALL read the fields they render, because
availability changes between ladder seasons and a stale badge is a cosmetic
inaccuracy where stale logic would miscount progress. Choosing how to present a
field — which colour a patch badge takes — is not such logic, and is permitted;
what is forbidden is any behaviour that changes what the application counts,
orders, filters or reports.

#### Scenario: Patch and note render together

- **WHEN** the row for `Mosaic` is read
- **THEN** it shows the patch `2.6` and a note marker, and nothing else

#### Scenario: A runeword with no availability fields shows no badges

- **WHEN** the row for a runeword that predates patch tracking is read
- **THEN** it renders no badge and no empty badge slot

#### Scenario: No row carries a ladder marker

- **WHEN** every rendered row is inspected
- **THEN** none carries a ladder-only marker, and the badge component offers no
  variant that would draw one

#### Scenario: The badge count matches the data

- **WHEN** the rendered rows carrying a note marker are counted
- **THEN** there is exactly 1, matching the dataset

#### Scenario: No logic reads an availability field

- **WHEN** the row ordering, and any counting, filtering or progress calculation
  in the application, are inspected
- **THEN** none reads the patch or the note

#### Scenario: Patches from different eras are told apart

- **WHEN** a `3.0` badge and a `1.10` badge are compared
- **THEN** they render in different colours

#### Scenario: One era may share one colour

- **WHEN** a `1.10` badge and a `1.11` badge are compared
- **THEN** they render in the same colour, because the project treats them as one
