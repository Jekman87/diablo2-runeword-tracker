# runeword-table Specification

## Purpose

The read-only presentation of the dataset — the table's columns and their
content, the default row order, how item-type restrictions and availability
badges render, the detail view and what it contains, how a property line's
values are emphasised without altering the line, and the responsive collapse
of the runes column.

## Requirements

### Requirement: Every runeword is listed in a table

The application SHALL present all 99 runewords as a table with one row per
runeword and no pagination, windowing or truncation, so that the page is the
complete Chronicle list rather than a page of it. The table SHALL be a real
tabular structure whose column headers are associated with their columns, so that
assistive technology can navigate it by row and column.

#### Scenario: All 99 rows are rendered

- **WHEN** the page is loaded
- **THEN** the table contains exactly 99 runeword rows
- **AND** every runeword in the dataset appears exactly once

#### Scenario: The table exposes real tabular semantics

- **WHEN** the rendered table is inspected by role
- **THEN** it exposes a table with column headers and 99 rows
- **AND** each column header is associated with the cells beneath it

#### Scenario: No row is hidden by a rendering limit

- **WHEN** the last row in the rendered order is looked for
- **THEN** it is present without scrolling to a fetch, expanding a control or
  paging, because the list is complete and finite

### Requirement: Columns

Each row SHALL carry the runeword's name, its ordered rune sequence, its allowed
base item categories and its required character level. The rune sequence SHALL
render one icon per socketed rune in dataset order, including repeats, so that the
recipe can be read off the row. No column SHALL present crafted state, which is
not part of this capability.

#### Scenario: A row carries all four values

- **WHEN** any row is read
- **THEN** it presents that runeword's name, its runes, its item categories and
  its required level

#### Scenario: Rune order and repeats survive into the row

- **WHEN** the row for `Infinity` is read
- **THEN** its rune sequence renders four icons in the order `Ber`, `Mal`, `Ber`,
  `Ist`
- **AND** the repeated `Ber` appears twice rather than once

#### Scenario: Every rune icon is identifiable without sight

- **WHEN** a rune icon in a row is inspected
- **THEN** it carries that rune's canonical name as its accessible label, so the
  sequence is readable when the sprite is not

#### Scenario: No crafted-state column exists

- **WHEN** the table's columns are inspected
- **THEN** none presents or toggles crafted state, because tracking progress is a
  separate capability and this presentation is read-only

### Requirement: Default row order

Rows SHALL be presented in ascending required level, and runewords sharing a
required level SHALL be ordered by name, so that the order is total and the same
dataset always renders in the same sequence. The order SHALL NOT be the dataset's
own storage order, which groups by patch and carries no meaning for a player
choosing what to craft next.

#### Scenario: Rows ascend by required level

- **WHEN** the required levels are read down the rendered table
- **THEN** each is greater than or equal to the one above it

#### Scenario: A shared level is broken by name

- **WHEN** two or more runewords share a required level
- **THEN** they appear in name order relative to each other

#### Scenario: The order is deterministic

- **WHEN** the table is rendered more than once from the same dataset
- **THEN** the sequence of rows is identical each time

#### Scenario: Storage order is not the presented order

- **WHEN** the first rendered row is compared with the dataset's first record
- **THEN** the presented order is the level ordering, not the order the records
  are stored in

### Requirement: Item categories render with their restriction

A row SHALL present every base item category the runeword allows. Where the
runeword carries a restriction, it SHALL be rendered in parentheses alongside those
categories; the dataset stores the restriction as bare text, and supplying the
punctuation is the presentation layer's responsibility. A runeword without a
restriction SHALL render no parentheses and no empty ones.

#### Scenario: A single category with a restriction

- **WHEN** the row for `Leaf` is read
- **THEN** it presents `Staves` with `Not Orbs/Wands` in parentheses

#### Scenario: Multiple categories are all presented

- **WHEN** the row for a runeword naming more than one category is read
- **THEN** every category it names is present, separated so they read as a list

#### Scenario: No restriction means no parentheses

- **WHEN** the row for a runeword carrying no restriction is read
- **THEN** the categories are presented alone, with no parentheses and no empty
  pair

#### Scenario: The dataset keeps its bare text

- **WHEN** the restriction value in the dataset is inspected after rendering
- **THEN** it is still the bare text, because the punctuation was added at
  presentation and not written back

### Requirement: Availability badges

A row SHALL render a badge for each availability field the runeword carries: the
patch that introduced it, a ladder-only marker, and a note marker where a caveat
exists. A runeword carrying none SHALL render no badges rather than placeholders.
These badges SHALL be presentation only: no ordering, filtering, counting or
conditional behaviour anywhere in the application SHALL read the fields they
render, because availability changes between ladder seasons and a stale badge is a
cosmetic inaccuracy where stale logic would miscount progress.

#### Scenario: All three badges render together

- **WHEN** the row for `Mosaic` is read
- **THEN** it shows the patch `2.6`, a ladder-only marker and a note marker

#### Scenario: A runeword with no availability fields shows no badges

- **WHEN** the row for a runeword that predates patch tracking and is not
  ladder-only is read
- **THEN** it renders no badge and no empty badge slot

#### Scenario: The badge count matches the data

- **WHEN** the rendered rows carrying a ladder-only marker are counted
- **THEN** there are exactly 9, matching the dataset

#### Scenario: No logic reads an availability field

- **WHEN** the row ordering, and any counting or conditional rendering in the
  application, are inspected
- **THEN** none reads the ladder-only flag, the patch or the note

### Requirement: Availability information is reachable without a pointer

Every fact a badge encodes SHALL be available to a reader who cannot hover: the
badge SHALL expose its full meaning to assistive technology rather than only as a
pointer tooltip, and the runeword's detail view SHALL restate the patch, the
ladder status and the note in full. A one-letter marker whose only explanation is
a hover tooltip SHALL NOT be the sole presentation of a fact.

#### Scenario: A badge states its meaning to assistive technology

- **WHEN** the ladder-only marker is inspected by its accessible name
- **THEN** the name is the full meaning, not the single letter drawn on screen

#### Scenario: The note is readable without hovering

- **WHEN** the detail view for `Mosaic` is opened on a device with no pointer
- **THEN** the full note text is present in it

#### Scenario: Availability is restated in the detail view

- **WHEN** the detail view for a runeword carrying a patch or a ladder-only flag
  is opened
- **THEN** it states them in full words rather than as the row's abbreviated
  markers

### Requirement: Runeword detail view

Activating a runeword's name SHALL open a detail view presenting that runeword's
name, its rune sequence with each rune's name shown as a label, its socket count,
its item categories with any restriction, and every granted property line in the
order the dataset holds them. The socket count SHALL be derived from the length of
the rune sequence at the point of display and SHALL NOT be read from a stored
field. The name SHALL be activated by a real button, so that it is reachable and
operable by keyboard.

#### Scenario: The detail view presents the full record

- **WHEN** a runeword's name is activated
- **THEN** the detail view shows its name, its runes with labels, its socket
  count, its item categories and all of its property lines

#### Scenario: Property lines keep their order and their count

- **WHEN** the detail view for the runeword with the most property lines is opened
- **THEN** all 26 lines are present, in the dataset's order

#### Scenario: Socket count is derived at display

- **WHEN** the socket count shown for `Infinity` is compared with its rune
  sequence
- **THEN** it is 4, equal to the sequence length
- **AND** no socket-count field was read to produce it

#### Scenario: The name is operable by keyboard

- **WHEN** a runeword's name receives keyboard focus and is activated by keyboard
- **THEN** the detail view opens, because the name is a button rather than a
  clickable region

#### Scenario: One detail view serves the whole table

- **WHEN** the document is inspected while no detail view is open
- **THEN** it holds no per-row detail markup, because 99 rows do not put 99
  hidden panels in the document

### Requirement: Detail view dismissal and focus

The detail view SHALL be dismissible by keyboard without reaching for a pointer,
and SHALL return focus to the name that opened it when it closes, so that a
keyboard reader is not returned to the top of a 99-row table. While it is open,
keyboard focus SHALL remain within it.

#### Scenario: Escape closes the detail view

- **WHEN** the detail view is open and the Escape key is pressed
- **THEN** it closes

#### Scenario: Focus returns to the invoking name

- **WHEN** the detail view is closed by any means
- **THEN** focus is on the runeword name that opened it

#### Scenario: Focus does not escape into the table behind

- **WHEN** the detail view is open and focus is advanced past its last focusable
  element
- **THEN** focus stays within the detail view rather than landing on a row behind
  it

#### Scenario: Opening a second runeword replaces the first

- **WHEN** a detail view is open and another runeword's name is activated
- **THEN** the view presents the newly activated runeword and not both

### Requirement: Property values are emphasised without altering the line

Within a granted-property line, numeric values SHALL be rendered at the brighter
emphasis the theme declares for them, while the rest of the line renders at the
base property colour. The emphasis SHALL be derived from the line's text, and the
rendered fragments of any line SHALL concatenate back to the source line exactly,
character for character. A derivation that drops, reorders, duplicates or rewrites
any character SHALL fail the test suite, because a lost minus sign turns a penalty
into a bonus and reads as correct.

#### Scenario: Values are emphasised and text is not

- **WHEN** the property line `+50% Enhanced Defense` is rendered
- **THEN** `+50%` carries the emphasis and `Enhanced Defense` does not

#### Scenario: Rendered fragments reproduce every line exactly

- **WHEN** every property line in the dataset is rendered and its fragments are
  concatenated
- **THEN** the result equals the source line exactly, for all 99 runewords

#### Scenario: A leading sign is not lost

- **WHEN** the line `-33% Extra Gold From Monsters` is rendered
- **THEN** the emphasised fragment retains the leading `-`, so the value still
  reads as a penalty

#### Scenario: A range keeps its parts together

- **WHEN** the line `Adds 3-14 Cold Damage - Cold Duration 3 Seconds` is rendered
- **THEN** the range and the separate value are each emphasised as they appear
- **AND** the concatenated fragments still equal the source line

#### Scenario: A line with no numeric value renders whole

- **WHEN** a property line containing no digits, such as `Prevent Monster Heal`,
  is rendered
- **THEN** it renders as a single unemphasised fragment equal to the line

### Requirement: The runes column collapses on narrow viewports

On viewports too narrow for the runes column, the column SHALL be withdrawn and
the rune sequence SHALL be presented within the row's name content instead, so
that the recipe is never lost on a small screen. Exactly one presentation of a
row's rune sequence SHALL be perceivable at any viewport width. The collapse SHALL
be driven by the stylesheet rather than by script, so that layout does not depend
on JavaScript having run.

#### Scenario: The wide layout uses the dedicated column

- **WHEN** the table is rendered wide enough for four columns
- **THEN** the rune sequence appears in the runes column
- **AND** the inline presentation under the name is not perceivable

#### Scenario: The narrow layout moves the runes under the name

- **WHEN** the table is rendered on a narrow viewport
- **THEN** the runes column and its header are withdrawn
- **AND** the rune sequence appears with the runeword's name

#### Scenario: The sequence is never presented twice at once

- **WHEN** a row's perceivable rune icons are counted at any single viewport width
- **THEN** each socketed rune is presented exactly once

#### Scenario: Layout does not depend on script

- **WHEN** the collapse mechanism is inspected
- **THEN** it is expressed in the stylesheet, with no viewport measurement in
  application code deciding which presentation renders

### Requirement: Rune icon size is set by the use site

A rune icon in a table row SHALL be drawn smaller than one in the detail view, and
both SHALL be produced from the same sprite by setting the single size value the
theme exposes. Neither SHALL restate a sprite offset or introduce a second icon
implementation.

#### Scenario: Row and detail icons differ in size

- **WHEN** a rune icon in a row and the same rune's icon in the detail view are
  compared
- **THEN** the row icon is smaller

#### Scenario: Both sizes come from one mechanism

- **WHEN** the two icon presentations are inspected
- **THEN** each sets only the size value, and both resolve the correct sprite cell
  from the shared derivation
