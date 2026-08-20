# runeword-table Specification

## Purpose

The read-only presentation of the dataset — the table's columns and their
content, the default row order, how item-type restrictions and availability
badges render, the detail view and what it contains, how a property line's
values are emphasised without altering the line, and the responsive collapse
of the runes column.

## Requirements

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

### Requirement: Availability information is reachable without a pointer

Every fact a badge encodes SHALL be available to a reader who cannot hover: the
badge SHALL expose its full meaning to assistive technology rather than only as a
pointer tooltip, and the runeword's detail view SHALL restate the patch and the
note in full. A short marker whose only explanation is a hover tooltip SHALL NOT
be the sole presentation of a fact.

On a pointer, a table-row badge SHALL also show that same meaning in a Floating UI
tooltip whose surface matches the detail panel (theme tokens, not the browser's
native `title` chrome). The badge SHALL NOT carry a `title` attribute for that
tip. A decorative badge sample — as in the help legend, where adjacent copy
already states the meaning — SHALL NOT open a tooltip.

#### Scenario: A badge states its meaning to assistive technology

- **WHEN** a patch badge is inspected by its accessible name
- **THEN** the name is the full meaning, not the bare version drawn on screen

#### Scenario: A pointer tip matches the detail panel, not the OS

- **WHEN** a pointer hovers a table-row availability badge
- **THEN** a Floating UI tooltip opens with the badge's full meaning
- **AND** the badge has no `title` attribute

#### Scenario: The note is readable without hovering

- **WHEN** the detail view for `Mosaic` is opened on a device with no pointer
- **THEN** the full note text is present in it

#### Scenario: Availability is restated in the detail view

- **WHEN** the detail view for a runeword carrying a patch or a ladder-only flag
  is opened
- **THEN** it states them in full words rather than as the row's abbreviated
  markers

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

### Requirement: The detail panel centres the properties it lists

The granted-property lines in the detail panel SHALL be centred, as the game centres
them in the item tooltip this panel reproduces.

Centring SHALL apply to the property lines alone. The runeword's name, the labelled
values beside it — its runes, its sockets, the level it requires — and its note SHALL
stay left-aligned, because those are the structure this panel adds and the game's
tooltip has no equivalent for them.

Where a runeword's properties are divided into labelled groups, a group's heading
SHALL be centred with the lines it introduces, so that a heading never sits at one
edge above centred text.

#### Scenario: Property lines are centred

- **WHEN** a runeword's detail panel is opened
- **THEN** its granted-property lines are centred within the panel

#### Scenario: The panel's own structure stays left-aligned

- **WHEN** the same panel's name, labelled values and note are inspected
- **THEN** each is still left-aligned

#### Scenario: A group heading follows its group

- **WHEN** a runeword whose properties are split into two labelled groups is opened
- **THEN** each heading is centred with the lines beneath it

### Requirement: A column heading too wide for a narrow viewport has a short form

A column heading whose full form does not fit SHALL have a short form, presented
in place of the full one at every width where the full one does not fit. Both
forms SHALL come from the display-copy layer, and exactly one of them SHALL be
perceivable at any width — so that the page is never announced twice and a reader
is never handed a heading the layout cannot hold.

**The width at which the two forms swap is the width at which the full form stops
fitting, and that is not necessarily a layout breakpoint.** It SHALL be measured in
the locale whose heading is longest, and one width SHALL serve every locale, so
that the locales are not two layouts.

The choice between the two SHALL be made by the stylesheet, for the reason the
rune sequence's collapse is: a heading decided in script depends on script having
run.

Only headings that need one get one. A heading whose full form fits SHALL keep it,
because a short form nothing requires is a second name for the same column.

#### Scenario: The short form covers every width the full one does not fit

- **WHEN** the table is rendered at any width below the one at which the full
  heading fits its column in the longest locale
- **THEN** the heading of a column with a short form presents that short form

#### Scenario: The wide viewport shows the full form

- **WHEN** the table is rendered at a width where the full heading fits
- **THEN** every column heading presents its full form

#### Scenario: Both locales swap at the same width

- **WHEN** the width at which the forms swap is compared between the two locales
- **THEN** it is the same width

#### Scenario: Only one form is perceivable at a time

- **WHEN** a column heading with a short form is inspected at a single viewport
  width
- **THEN** exactly one of its two forms is perceivable, and the other is not in
  the accessibility tree

#### Scenario: A heading that fits keeps its full form

- **WHEN** the headings on a narrow viewport are inspected
- **THEN** a column whose full heading fits presents that full heading

### Requirement: No cell paints outside the column that holds it

Under the fixed column layout a column cannot grow to fit its content, so content
too wide for its column paints over the column beside it. No heading and no cell
SHALL do that at any supported width, in either locale.

Column widths SHALL therefore be declared per width band rather than once. A single
set of proportions cannot serve both a 768px viewport and a 1280px one: the same
five columns have about 705px in the first case and 960px in the second, while the
content's minimum needs do not shrink with the viewport. The proportions for each
band SHALL be measured against the locale whose text is longest, and each band's
proportions SHALL total the whole width.

Where content can wrap it SHOULD be allowed to, so that a band whose proportions
are later changed degrades into a taller row rather than into overlapping text.

#### Scenario: Nothing overflows its column at any supported width

- **WHEN** every header cell and every body cell is measured against the column
  that holds it, across the supported widths, in both locales
- **THEN** none of them paints outside its column

#### Scenario: The proportions are declared per band and each band is whole

- **WHEN** the declared column widths are inspected
- **THEN** there is a set for each width band, and each set totals the whole width

#### Scenario: A rune sequence too wide for its column wraps

- **WHEN** a six-rune sequence is presented in a column narrower than the sequence
- **THEN** it wraps onto a second line rather than painting over the column beside
  it
