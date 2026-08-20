## MODIFIED Requirements

### Requirement: Every column header sorts its column

Each column header the table presents SHALL be a control that sorts the table by
that column. Each column SHALL sort on the value that column presents: crafted
state, the runeword's name, the number of sockets its rune sequence fills, the
first base item category it names, and the required character level.

At or above the narrow-viewport breakpoint the table presents all five headers.
Below it two columns are withdrawn — the runes column, by `runeword-table`, and
the crafted column, by `crafted-tracking` — and neither presents a heading or a
sort control there, so three sort controls are presented. A header cell that a
withdrawn column keeps for the sake of the table's column count SHALL present
neither. A withdrawn header SHALL NOT be replaced by a sort control somewhere
else: sorting is a property of a column header, and a control detached from the
column it orders is a second way to do the same thing.
The crafted **filter** in the browsing controls is present at every width and is
what answers "what have I made" on a narrow viewport.

A sort order chosen at one width SHALL remain in effect at every other width. The
setting is the player's, not the layout's, so narrowing the viewport SHALL NOT
change which column the table is sorted by or in which direction — only which
headers are there to press.

Activating the header of a column that is not the sorted one SHALL sort by it.
Activating the header of the sorted column SHALL reverse the direction. There
SHALL be exactly two directions and no unsorted state, because required level
ascending is the default and is reachable by choosing it.

Ascending on crafted state SHALL present un-crafted runewords first, because
`false` before `true` is the arithmetic and because that ordering answers what is
left.

Choosing a column SHALL adopt that column's own first direction, and for crafted
state that direction SHALL be descending, so that one activation presents the
crafted runewords first. A player pressing the crafted header is asking what they
have made; what is left is the same header pressed twice, and is also what every
other control on the page already offers. Every other column SHALL start ascending.

Each header SHALL be a real button within its column header cell, so that it is
reachable and operable by keyboard, and SHALL NOT be a click handler on the cell.
That button SHALL cover the whole of its cell, so that the target is the header a
player sees rather than only the text within it.

#### Scenario: Sorting by a column that was not sorted

- **WHEN** the `Runeword` header is activated while the table is sorted by
  required level
- **THEN** the rows are presented in ascending name order

#### Scenario: Activating the sorted column reverses it

- **WHEN** the header of the column already sorted ascending is activated
- **THEN** the same rows are presented in descending order of that column

#### Scenario: The runes column sorts by socket count

- **WHEN** the `Runes` header is activated
- **THEN** the rows are ordered by how many runes the sequence holds, so the 14
  two-socket runewords precede the 45 three-socket ones
- **AND** the order is not derived from the rune names as text

#### Scenario: The base items column sorts on its first category

- **WHEN** the `Base Items` header is activated
- **THEN** the rows are ordered by the first category each row presents, so the
  order is visibly the column's own content

#### Scenario: One press of the crafted header shows what is done

- **WHEN** the `Crafted` header is activated with some runewords marked
- **THEN** the crafted runewords are presented before the un-crafted ones, because
  that column starts descending

#### Scenario: A second press shows what is left

- **WHEN** the `Crafted` header is activated again
- **THEN** the un-crafted runewords are presented first, which is that column
  ascending

#### Scenario: A narrow viewport presents the headers of the columns it shows

- **WHEN** the table's headers are inspected on a narrow viewport
- **THEN** each presented column carries its own sort control, and the withdrawn
  columns carry none anywhere else

#### Scenario: A sort chosen wide survives a narrow viewport

- **WHEN** the table is sorted by crafted state and the viewport is then narrowed
  past the breakpoint
- **THEN** the rows are still in that order, in that direction

#### Scenario: A press anywhere in a header sorts it

- **WHEN** a column header is activated away from the heading's own text, within the
  same cell
- **THEN** the table sorts by that column, because the control fills the cell rather
  than only the words in it

#### Scenario: A header is operable by keyboard

- **WHEN** a column header receives keyboard focus and is activated by keyboard
- **THEN** the table sorts by that column, because the header carries a button
  rather than a handler on the cell

#### Scenario: There is no third state

- **WHEN** a column's header is activated three times in succession
- **THEN** the table is sorted by that column each time, alternating direction,
  and never returns to an unsorted presentation

## ADDED Requirements

### Requirement: The sort indicator is withdrawn on a narrow viewport

The space each header reserves for its sort arrow SHALL be withdrawn below the
narrow-viewport breakpoint, and SHALL be reserved unconditionally at or above it.
It SHALL NOT be made conditional on a column being the sorted one at any width:
drawing it only where it is used made the sorted column wider than its neighbours
and shifted every row beside it.

Nothing is lost by the withdrawal. The sorted column and its direction are already
carried by `aria-sort` and by each header's accessible name, in words; the arrow
was always the third carrier and never the only one.

#### Scenario: The arrow is not drawn on a narrow viewport

- **WHEN** the table's headers are inspected on a narrow viewport
- **THEN** no header draws a sort arrow and none reserves space for one

#### Scenario: The reservation is unconditional above the breakpoint

- **WHEN** the table's headers are inspected at or above the breakpoint
- **THEN** every header reserves the same space for the arrow, whether or not it
  is the sorted column

#### Scenario: The direction is still reported without the arrow

- **WHEN** the sorted column is inspected on a narrow viewport
- **THEN** it still carries `aria-sort` with its direction, and its header's
  accessible name still states the direction in words
