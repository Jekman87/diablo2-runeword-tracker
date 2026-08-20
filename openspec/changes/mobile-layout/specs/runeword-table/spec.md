## MODIFIED Requirements

### Requirement: The runes column collapses on narrow viewports

On viewports too narrow for the runes column, the column SHALL be withdrawn and
the rune sequence SHALL be presented within the row's name content instead, so
that the recipe is never lost on a small screen. Exactly one presentation of a
row's rune sequence SHALL be perceivable at any viewport width. The collapse SHALL
be driven by the stylesheet rather than by script, so that layout does not depend
on JavaScript having run.

The narrow presentation SHALL be the runes' **names** rather than their icons.
The icons are drawn at the sprite's native cell size, and six of them with their
labels take more width than the whole table has on a phone; the names carry the
same recipe in a fraction of it. The names SHALL be presented in the sequence's
own order, with a rune that the sequence repeats presented as many times as it
occurs, and SHALL be the locale's projected names — the same projection the
labels beneath the icons already use.

The wide presentation is unchanged: from the breakpoint up the runes column
renders the icons at their native size, with their names beneath them.

#### Scenario: The wide layout uses the dedicated column

- **WHEN** the table is rendered wide enough for four columns
- **THEN** the rune sequence appears in the runes column as icons with their names
- **AND** the inline presentation under the name is not perceivable

#### Scenario: The narrow layout moves the runes under the name

- **WHEN** the table is rendered on a narrow viewport
- **THEN** the runes column and its header are withdrawn
- **AND** the rune sequence appears with the runeword's name

#### Scenario: The narrow presentation is names, not icons

- **WHEN** a row's rune sequence is inspected on a narrow viewport
- **THEN** it presents the rune names as text and draws no rune icon

#### Scenario: Order and repeats survive the narrow presentation

- **WHEN** a runeword whose sequence repeats a rune is presented on a narrow
  viewport
- **THEN** its names read in the sequence's own order, with the repeated rune
  appearing once for each socket it fills

#### Scenario: The narrow names are the locale's

- **WHEN** a row's rune sequence is presented on a narrow viewport under the
  Russian locale
- **THEN** the names are the dataset's Russian projections, not the canonical
  English ones

#### Scenario: The sequence is never presented twice at once

- **WHEN** a row's perceivable rune presentations are counted at any single
  viewport width
- **THEN** each socketed rune is presented exactly once

#### Scenario: Layout does not depend on script

- **WHEN** the collapse mechanism is inspected
- **THEN** it is expressed in the stylesheet, with no viewport measurement in
  application code deciding which presentation renders

## ADDED Requirements

### Requirement: A column heading too wide for a narrow viewport has a short form

A column heading whose full form does not fit the minimum supported viewport SHALL
have a short form, presented in place of the full one below the breakpoint. Both
forms SHALL come from the display-copy layer, and exactly one of them SHALL be
perceivable at any width — so that the page is never announced twice and a
narrow-viewport reader is never handed a heading the layout cannot hold.

The choice between the two SHALL be made by the stylesheet, for the reason the
rune sequence's collapse is: a heading decided in script depends on script having
run.

Only headings that need one get one. A heading whose full form fits SHALL keep it,
because a short form nothing requires is a second name for the same column.

#### Scenario: The narrow viewport shows the short form

- **WHEN** the table is rendered on a narrow viewport
- **THEN** the heading of a column with a short form presents that short form

#### Scenario: The wide viewport shows the full form

- **WHEN** the table is rendered at or above the breakpoint
- **THEN** every column heading presents its full form

#### Scenario: Only one form is perceivable at a time

- **WHEN** a column heading with a short form is inspected at a single viewport
  width
- **THEN** exactly one of its two forms is perceivable, and the other is not in
  the accessibility tree

#### Scenario: A heading that fits keeps its full form

- **WHEN** the headings on a narrow viewport are inspected
- **THEN** a column whose full heading fits presents that full heading
