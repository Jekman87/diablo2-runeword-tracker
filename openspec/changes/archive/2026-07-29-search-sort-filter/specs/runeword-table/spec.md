## MODIFIED Requirements

### Requirement: Every runeword is listed in a table

The application SHALL present the runewords as a table with one row per runeword,
and SHALL NOT limit which rows are reachable by pagination, windowing,
virtualisation or truncation, so that the page is the complete Chronicle list
rather than a page of it. With nothing narrowing the view, all 99 rows SHALL be
present. Rows MAY be withheld only by a narrowing the player asked for — a search
query or a filter, defined by `runeword-browsing` — and such a narrowing SHALL
remain reversible by the controls that caused it. The table SHALL be a real
tabular structure whose column headers are associated with their columns, so that
assistive technology can navigate it by row and column.

#### Scenario: All 99 rows are rendered

- **WHEN** the page is loaded with nothing narrowing the view
- **THEN** the table contains exactly 99 runeword rows
- **AND** every runeword in the dataset appears exactly once

#### Scenario: The table exposes real tabular semantics

- **WHEN** the rendered table is inspected by role
- **THEN** it exposes a table with column headers and one row per presented
  runeword
- **AND** each column header is associated with the cells beneath it

#### Scenario: No row is hidden by a rendering limit

- **WHEN** the last row in the rendered order is looked for
- **THEN** it is present without scrolling to a fetch, expanding a control or
  paging, because the list is complete and finite

#### Scenario: A row withheld by a filter is not a row lost to the rendering

- **WHEN** a filter or a search query is withholding rows and is then cleared
- **THEN** every runeword is present again, because the narrowing was the player's
  and the table renders whatever it is given in full

### Requirement: Default row order

Rows SHALL be presented in ascending required level, with runewords sharing a
required level ordered by name, whenever no other ordering has been chosen — on a
first visit, and after the view is returned to its defaults. This order SHALL also
serve as the tiebreak for every other ordering the table can present, so that the
sequence of rows is total in all of them. The order SHALL NOT be the dataset's own
storage order, which groups by patch and carries no meaning for a player choosing
what to craft next. Which orderings can be chosen, and how, is
`runeword-browsing`'s requirement rather than this capability's.

#### Scenario: Rows ascend by required level

- **WHEN** the required levels are read down the rendered table with no other
  ordering chosen
- **THEN** each is greater than or equal to the one above it

#### Scenario: A shared level is broken by name

- **WHEN** two or more runewords share a required level and no other ordering has
  been chosen
- **THEN** they appear in name order relative to each other

#### Scenario: The order is deterministic

- **WHEN** the table is rendered more than once from the same dataset with the
  same ordering chosen
- **THEN** the sequence of rows is identical each time

#### Scenario: Storage order is not the presented order

- **WHEN** the first rendered row is compared with the dataset's first record with
  no other ordering chosen
- **THEN** the presented order is the level ordering, not the order the records
  are stored in

#### Scenario: The default order is also every other order's tiebreak

- **WHEN** rows are ordered by a column whose values do not distinguish them
- **THEN** they fall into ascending required-level order, and then name order,
  among themselves
