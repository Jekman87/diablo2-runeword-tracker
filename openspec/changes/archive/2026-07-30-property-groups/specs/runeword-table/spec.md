# runeword-table Delta

## MODIFIED Requirements

### Requirement: Runeword detail view

A runeword's detail view SHALL present that runeword's name, its rune sequence with
each rune's name shown as a label, its socket count, its item categories with any
restriction, and every granted property line in the order the dataset holds them.
The socket count SHALL be derived from the length of the rune sequence at the point
of display and SHALL NOT be read from a stored field.

Where the dataset carries a runeword's properties as labelled groups — because the
runeword grants different properties per base type — the view SHALL present each
group's lines under a sub-heading naming the base types that group applies to, so
that a reader deciding which base to socket can tell the two lists apart. The
sub-heading SHALL be presented as a heading and SHALL NOT read as another property
line. A runeword carrying a single unlabelled group SHALL present its lines with no
sub-heading, exactly as a flat property list. The group labels are dataset content —
item category names — and SHALL NOT pass through the display-copy layer.

The view SHALL open on any of three triggers on the runeword's name: a pointer
hovering it, keyboard focus reaching it, and a click or tap activating it. No one
of the three SHALL be the only way in — a touch device has no hover, and a keyboard
has neither hover nor tap. The name SHALL remain a real button, so that it is
reachable and operable by keyboard.

Hover SHALL open the view after a short delay rather than instantly, so that a
pointer crossing the table on its way somewhere else does not open a panel for
every name it passes. Once open, the view SHALL remain open while the pointer
travels from the name toward it, so that reaching the panel does not dismiss it.

#### Scenario: The detail view presents the full record

- **WHEN** a runeword's name is activated
- **THEN** the detail view shows its name, its runes with labels, its socket
  count, its item categories and all of its property lines

#### Scenario: Property lines keep their order and their count

- **WHEN** the detail view for the runeword with the most property lines is opened
- **THEN** all 24 of `Fortitude`'s lines are present, in the dataset's order,
  grouped as the dataset groups them

#### Scenario: A varying runeword's groups are told apart by sub-headings

- **WHEN** the detail view for `Fortitude` is opened
- **THEN** its 12 `Weapons` lines appear under a sub-heading naming `Weapons`
  and its 12 `Body Armors` lines under a sub-heading naming `Body Armors`
- **AND** each sub-heading is presented as a heading rather than as another
  property line

#### Scenario: A uniform runeword shows no group sub-heading

- **WHEN** the detail view for a runeword carrying a single unlabelled group is
  opened
- **THEN** its property lines are presented as one list with no sub-heading and
  no empty heading slot

#### Scenario: Group labels come from the dataset

- **WHEN** the source of a rendered group sub-heading is inspected
- **THEN** it is the dataset's item category names and did not pass through the
  display-copy layer, because category names are identifiers rather than copy

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

#### Scenario: A pointer hovering the name opens the view

- **WHEN** a pointer comes to rest over a runeword's name, with no click
- **THEN** the detail view for that runeword opens

#### Scenario: Keyboard focus alone opens the view

- **WHEN** a runeword's name receives keyboard focus without being activated
- **THEN** the detail view opens, so that a keyboard reader reaches the same
  content a pointer user reaches by hovering

#### Scenario: Tapping opens the view where there is no hover

- **WHEN** a runeword's name is tapped on a device with no pointer hover
- **THEN** the detail view opens, because hover is unavailable there and must not
  be the only trigger

#### Scenario: A pointer passing over does not open anything

- **WHEN** a pointer crosses several names without resting on any of them
- **THEN** no detail view opens, because hover opens after a delay

#### Scenario: Travelling from the name to the panel does not dismiss it

- **WHEN** the view is open and the pointer moves off the name toward the panel,
  crossing the gap between them
- **THEN** the view stays open
