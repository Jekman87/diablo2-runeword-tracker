## ADDED Requirements

### Requirement: Dataset columns

Each row SHALL carry the runeword's name, its ordered rune sequence, its allowed
base item categories and its required character level. The rune sequence SHALL
render one icon per socketed rune in dataset order, including repeats, so that the
recipe can be read off the row. These four are the columns this capability owns and
they SHALL remain read-only presentations of the dataset: none SHALL become a
control, and none SHALL vary with the player's progress.

The row SHALL further carry a crafted-state column, whose content, control and
behaviour are defined by `crafted-tracking` and not here. This capability requires
only that the column exists ahead of the four above and is a column proper, with a
column header of its own, so that crafted state is sortable on the same terms as
the rest of the row rather than being an ornament attached to the name.

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

#### Scenario: The four dataset columns stay read-only

- **WHEN** the name, runes, item categories and required level columns are
  inspected
- **THEN** none presents a control that changes data, and none renders differently
  according to whether the runeword is crafted

#### Scenario: Crafted state is a column, defined elsewhere

- **WHEN** the table's columns are inspected
- **THEN** crafted state occupies its own leading column with its own column
  header
- **AND** what that column contains and how it behaves is `crafted-tracking`'s
  requirement, not this capability's

## REMOVED Requirements

### Requirement: Columns

**Reason**: Replaced by `Dataset columns`. The original ended "No column SHALL
present crafted state, which is not part of this capability" and carried the
scenario `No crafted-state column exists`. This change adds that column, so both
are now false — and a `MODIFIED` block may not drop a scenario, which is exactly
what retiring that one requires. Renaming makes the replacement explicit rather
than hiding a deletion inside an edit.

**Migration**: The four read-only columns and their three scenarios carry over
into `Dataset columns` unchanged. What the crafted column contains and how it
behaves is not restated here — those are `crafted-tracking`'s requirements, and
this capability now only requires that the column exists and is a real column.
