## MODIFIED Requirements

### Requirement: Runeword detail view

A runeword's detail view SHALL present that runeword's name, its rune sequence with
each rune's name shown as a label, its socket count, its item categories with any
restriction, and every granted property line in the order the dataset holds them.
The socket count SHALL be derived from the length of the rune sequence at the point
of display and SHALL NOT be read from a stored field.

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

### Requirement: Detail view dismissal and focus

The detail view SHALL be dismissible by keyboard without reaching for a pointer,
and SHALL return focus to the name that opened it when it closes, so that a
keyboard reader is not returned to the top of a 99-row table.

Whether keyboard focus is contained within the view SHALL depend on how the view
was opened, and the three ways of opening it are three cases rather than two.

A view opened by **activating** the name — a click, a tap, or a keypress — SHALL
contain focus, so that a reader who went to it on purpose is not dropped back into
the table behind it.

A view opened by **keyboard focus reaching** the name SHALL NOT contain focus and
SHALL NOT move it. Advancing focus from the name SHALL enter the view, and
advancing past the view's last focusable element SHALL continue into the table at
the row after the one that opened it. Containing focus here would make the table
impossible to read by keyboard: focus reaching a name opens that name's view, so a
trap would close over the keyboard on the first row and no later row could ever be
reached.

A view opened by **hover** SHALL NOT contain focus and SHALL NOT move it, because
a panel that appears under a passing pointer must not take the keyboard away from
wherever its owner actually is.

#### Scenario: A view reached by keyboard does not trap the reader in it

- **WHEN** focus reaches a runeword's name by keyboard, opening its view, and
  focus is then advanced twice
- **THEN** the first advance enters the view and the second leaves it for the next
  row, so every row of the table remains reachable
- **AND** focus was never moved into the view by the act of opening it

#### Scenario: Escape closes the detail view

- **WHEN** the detail view is open and the Escape key is pressed
- **THEN** it closes

#### Scenario: Focus returns to the invoking name

- **WHEN** a detail view that had taken focus is dismissed by keyboard
- **THEN** focus is on the runeword name that opened it, rather than at the top of
  a 99-row table
- **AND** a view that never took focus leaves it wherever it already was

#### Scenario: A reader who pressed elsewhere is left where they pressed

- **WHEN** a detail view is dismissed by a press outside it that puts focus
  somewhere else
- **THEN** focus stays where the press put it rather than being returned to the
  name, because the reader has already said where they want to be

#### Scenario: Focus does not escape into the table behind

- **WHEN** the detail view was opened by activating the name and focus is advanced
  past its last focusable element
- **THEN** focus stays within the detail view rather than landing on a row behind
  it

#### Scenario: Opening a second runeword replaces the first

- **WHEN** a detail view is open and another runeword's name is activated
- **THEN** the view presents the newly activated runeword and not both

#### Scenario: One view is open at most, whichever triggers opened them

- **WHEN** a view opened by any of the three triggers is followed by any of the
  three triggers on a different runeword's name — including a view deliberately
  pinned open and then a pointer merely resting elsewhere
- **THEN** exactly one view is open, and it is the one most recently asked for
- **AND** no two views are ever on screen together, whatever order the triggers
  come in

#### Scenario: A replaced view's focus is not a request to reopen it

- **WHEN** a view that had taken focus is replaced by another, and closing it
  returns focus to the name that opened it
- **THEN** that returning focus does not reopen it, so the view the reader asked
  for is the one that stays

#### Scenario: A hover-opened view does not take the keyboard

- **WHEN** a detail view opens because the pointer came to rest on a name
- **THEN** keyboard focus stays exactly where it was
- **AND** advancing focus is not confined to the panel, because its reader never
  asked to go there

#### Scenario: Dismissing a hover-opened view leaves focus alone

- **WHEN** a hover-opened detail view closes
- **THEN** focus is still wherever it was before the view appeared, rather than
  being moved to the name the pointer happened to be over

### Requirement: Availability badges

A row SHALL render a badge for each availability field the runeword carries: the
patch that introduced it, a ladder-only marker, and a note marker where a caveat
exists. A runeword carrying none SHALL render no badges rather than placeholders.

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

- **WHEN** the row ordering, and any counting, filtering or progress calculation
  in the application, are inspected
- **THEN** none reads the ladder-only flag, the patch or the note

#### Scenario: Patches from different eras are told apart

- **WHEN** a `3.0` badge and a `1.10` badge are compared
- **THEN** they render in different colours

#### Scenario: One era may share one colour

- **WHEN** a `1.10` badge and a `1.11` badge are compared
- **THEN** they render in the same colour, because the project treats them as one
  era

#### Scenario: An unrecognised patch renders plainly

- **WHEN** a runeword carries a patch value the project has chosen no colour for
- **THEN** its badge renders with no colour applied, rather than borrowing another
  patch's colour or silently losing its styling

#### Scenario: The colour is not assembled from the patch value

- **WHEN** the mapping from patch value to colour is inspected
- **THEN** it is an explicit enumeration of the values the project has decided on,
  not a class name built from the patch string, because a name built at runtime is
  invisible to the stylesheet's build-time scan and would be stripped

### Requirement: Dataset columns

Each row SHALL carry the runeword's name, its ordered rune sequence, its allowed
base item categories and its required character level. The rune sequence SHALL
render one icon per socketed rune in dataset order, including repeats, so that the
recipe can be read off the row. Each rune in a row SHALL be presented with its
canonical name, so that the sequence can be read by somebody who does not
recognise the artwork. These four are the columns this capability owns and they
SHALL remain read-only presentations of the dataset: none SHALL become a control,
and none SHALL vary with the player's progress.

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

- **WHEN** a rune in a row is inspected
- **THEN** that rune's canonical name is available to a reader who cannot see the
  sprite, so the sequence is readable when the artwork is not

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

#### Scenario: A rune's name is drawn beside its icon

- **WHEN** a rune in a row is looked at
- **THEN** its canonical name is rendered with the icon rather than hidden behind
  a pointer, because a sequence of unlabelled sprites tells a reader who does not
  know the runes nothing at all

#### Scenario: A rune is announced once, not twice

- **WHEN** a rune whose name is rendered visibly is read by assistive technology
- **THEN** the name is announced once
- **AND** the icon beside it is not announced separately, because it repeats what
  the visible name already says

#### Scenario: Rune names come from the dataset

- **WHEN** the source of a rendered rune name is inspected
- **THEN** it is the dataset's canonical name and did not pass through the
  display-copy layer, because rune names are identifiers rather than copy

### Requirement: Item categories render with their restriction

A row SHALL present every base item category the runeword allows. Where the
runeword carries a restriction, it SHALL be rendered in parentheses and set apart
from the categories it qualifies — on its own line and in its own colour — so that
an exclusion that changes which item to go looking for is not read as more of the
category list. The dataset stores the restriction as bare text, and supplying the
punctuation is the presentation layer's responsibility. A runeword without a
restriction SHALL render no parentheses, no empty ones and no empty line.

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

#### Scenario: The restriction is set apart from the categories

- **WHEN** the row for `Leaf` is read
- **THEN** `Not Orbs/Wands` renders on its own line beneath `Staves`
- **AND** in a different colour from the categories

#### Scenario: A row without a restriction gains no extra line

- **WHEN** the row for a runeword carrying no restriction is compared with one
  that carries one
- **THEN** the unrestricted row occupies no line for the restriction it does not
  have

#### Scenario: The restriction is data, and its brackets are copy

- **WHEN** the rendered restriction is traced to its sources
- **THEN** the text came from the dataset record and the parentheses around it came
  from the display-copy layer

## ADDED Requirements

### Requirement: Rune icon size and its native ceiling

Rune icons SHALL be produced from one sprite by one derivation, and their size
SHALL be set by the use site through the single size value the theme exposes. No
use site SHALL restate a sprite offset or introduce a second icon implementation.

No use site SHALL draw a rune icon larger than the sprite's native cell size,
because the artwork does not survive being upscaled. Two use sites MAY draw at the
same size where both want the artwork at its sharpest; the sizes are a property of
what each use site needs and not a hierarchy between them.

#### Scenario: Both sizes come from one mechanism

- **WHEN** the row and detail-view icon presentations are inspected
- **THEN** each sets only the size value, and both resolve the correct sprite cell
  from the shared derivation

#### Scenario: No icon is drawn above the native cell size

- **WHEN** the size every use site asks for is inspected
- **THEN** none exceeds the sprite's native cell size

#### Scenario: Two use sites may agree on a size

- **WHEN** a rune icon in a row and the same rune's icon in the detail view are
  compared
- **THEN** they may be the same size, because both are drawn at the native ceiling
  and neither is required to be smaller than the other

## REMOVED Requirements

### Requirement: Rune icon size is set by the use site

**Reason**: Replaced by `Rune icon size and its native ceiling`. The original
required that "A rune icon in a table row SHALL be drawn smaller than one in the
detail view" and carried the scenario `Row and detail icons differ in size`. Rows
now draw runes at the sprite's native 40px, which is what makes the column
readable, and the detail view already drew them at 40px — so the two are equal and
the requirement cannot hold. It is retired rather than edited because a `MODIFIED`
block may not drop a scenario, and dropping that one is the substance of the
change.

**Migration**: The part that was load-bearing — one sprite, one derivation, one
size value set by the use site, no restated offsets — carries over verbatim into
the replacement's first scenario. What replaces "the row is smaller" is a ceiling:
no use site may draw above the native cell size, and two use sites are allowed to
agree on one.
