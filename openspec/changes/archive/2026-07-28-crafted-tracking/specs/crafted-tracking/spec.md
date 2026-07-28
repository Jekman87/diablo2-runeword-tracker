## ADDED Requirements

### Requirement: Every runeword can be marked crafted

The table SHALL present a crafted-state control on every runeword's row, in its
own leading column with its own column header, so that the state is a property of
the row that later changes can sort on rather than an ornament attached to the
name. The control SHALL be a real button carrying its pressed state, so that it is
reachable by Tab and operable by Space and Enter without a pointer.

#### Scenario: Every row carries a control

- **WHEN** the table is rendered
- **THEN** each of the 99 rows presents one crafted-state control

#### Scenario: The control is a button with a pressed state

- **WHEN** a row's crafted-state control is inspected
- **THEN** it is a button whose pressed state states whether the runeword is
  crafted

#### Scenario: The control is operable by keyboard alone

- **WHEN** a crafted-state control receives keyboard focus and is activated by
  keyboard
- **THEN** the runeword's crafted state changes

#### Scenario: The state is its own column

- **WHEN** the table's columns are inspected
- **THEN** crafted state occupies a leading column with a column header of its
  own, so that a later change can make that header a sort control

#### Scenario: Activating the control twice returns to the starting state

- **WHEN** a control is activated and then activated again
- **THEN** the runeword is back in the state it started in, because the control
  is a toggle and reverting needs no other affordance

### Requirement: The control names the runeword and the direction

The crafted-state control's accessible name SHALL identify both the runeword it
belongs to and what activating it will do, so that the control is unambiguous when
it is reached out of the context of its row. The name SHALL come from the
display-copy layer with the runeword's canonical name supplied to it, rather than
being written into the component.

#### Scenario: The name identifies the runeword

- **WHEN** a crafted-state control's accessible name is read
- **THEN** it contains that runeword's name

#### Scenario: The name states what the next activation does

- **WHEN** the accessible names of a crafted and an uncrafted control are compared
- **THEN** they differ, each stating the direction its activation would take

### Requirement: The whole row is a pointer target, and adds no keyboard stop

A pointer click anywhere on a runeword's row SHALL toggle its crafted state, so
that the target is larger than the control alone. The row SHALL NOT be given a
button role or placed in the tab order, because 99 focusable rows would double the
page's tab stops and cost the table the row and column semantics it is built on.

#### Scenario: Clicking the row toggles the runeword

- **WHEN** a pointer click lands on a row, away from any control within it
- **THEN** that runeword's crafted state changes

#### Scenario: The row is not focusable

- **WHEN** the page is traversed by Tab
- **THEN** no table row receives focus, and the only focusable control in the
  crafted column is its button

#### Scenario: Rows keep their table semantics

- **WHEN** the rendered table is inspected by role
- **THEN** each row is still a table row rather than a button, and the table is
  still navigable by row and column

### Requirement: A nested control's activation does not also toggle the row

Activating any interactive element inside a row SHALL perform only that element's
own action. Opening a runeword's detail view SHALL NOT mark it crafted, and
activating the crafted control SHALL toggle the state exactly once rather than
twice. A pointer gesture that ends a text selection SHALL NOT toggle the row.

#### Scenario: Opening the detail view does not mark the runeword

- **WHEN** a runeword's name is clicked
- **THEN** the detail view opens
- **AND** the runeword's crafted state is unchanged

#### Scenario: The control toggles once, not twice

- **WHEN** the crafted-state control is clicked
- **THEN** the state changes once, rather than being toggled by the control and
  again by the row beneath it

#### Scenario: Selecting text does not toggle

- **WHEN** a pointer drag selects text within a row and is released
- **THEN** the runeword's crafted state is unchanged

#### Scenario: The exclusion is by kind, not by identity

- **WHEN** the row's handling of a click is inspected
- **THEN** it excludes interactive elements as a class rather than naming the
  particular controls that exist today, so a control added later is excluded
  without this behaviour being revisited

### Requirement: A crafted row is distinguishable without colour

A crafted runeword's row SHALL be visually distinguished from an uncrafted one,
and that distinction SHALL NOT rest on colour alone. The control's pressed state,
its accessible name and the filled rather than empty rendering of its socket SHALL
each carry the same fact, so that the state is readable by a player who cannot
distinguish the colours and by one who cannot see the row.

#### Scenario: The row is visually marked

- **WHEN** a runeword is marked crafted
- **THEN** its row is distinguished from the uncrafted rows around it

#### Scenario: The state survives the loss of colour

- **WHEN** a crafted and an uncrafted row are compared with colour disregarded
- **THEN** the two are still distinguishable, because the socket renders filled
  rather than empty

#### Scenario: The state is exposed to assistive technology

- **WHEN** a crafted runeword's control is inspected by assistive technology
- **THEN** it reports itself as pressed, and its name states that activating it
  would unmark the runeword

### Requirement: Overall progress out of all 99

The interface SHALL present overall progress as the number of crafted runewords
against the total number in the dataset, both as a progress indicator carrying a
value and a maximum and as a count stated in text. The maximum SHALL be the size of
the dataset itself and SHALL NOT be derived from how many rows are rendered,
visible, filtered or available, because the Chronicle goal is every runeword and a
denominator that moves would misreport completion.

#### Scenario: Progress reports the crafted count

- **WHEN** three runewords are marked crafted
- **THEN** the indicator's value is 3 and its maximum is 99
- **AND** the count is also stated in text beside it

#### Scenario: The denominator is the dataset, not the view

- **WHEN** the source of the maximum is inspected
- **THEN** it is the number of runewords in the dataset, taken directly and not
  counted from the rendered table

#### Scenario: Progress updates immediately on a toggle

- **WHEN** a runeword's crafted state is toggled
- **THEN** the progress indicator and its text reflect the new count without a
  reload

#### Scenario: Nothing crafted reports zero rather than nothing

- **WHEN** no runeword is marked crafted
- **THEN** the indicator is present and reports 0 of 99, rather than being absent

#### Scenario: The indicator exposes a progress role

- **WHEN** the indicator is inspected by role
- **THEN** it exposes a progress indicator with its value and maximum, without
  those being restated by hand alongside a generic element

### Requirement: The most recent toggle can be undone from a transient notice

Toggling a runeword's crafted state SHALL raise a short-lived notice naming what
happened and offering to reverse it, so that a misclick on the enlarged row target
is recoverable. The notice SHALL be announced politely to assistive technology
rather than interrupting it. At most one notice SHALL exist at a time, describing
the most recent toggle; a further toggle SHALL replace it rather than stack beneath
it. Undoing SHALL reverse exactly that one toggle and SHALL NOT be a history of
earlier ones.

#### Scenario: A toggle raises the notice

- **WHEN** a runeword's crafted state is toggled
- **THEN** a notice appears naming that runeword and offering to undo the change

#### Scenario: Undo reverses the toggle

- **WHEN** the notice's undo action is activated
- **THEN** the runeword returns to the state it had before the toggle
- **AND** the notice is dismissed

#### Scenario: A second toggle replaces the first notice

- **WHEN** one runeword is toggled and then another is
- **THEN** exactly one notice is present, describing the second

#### Scenario: The notice dismisses itself

- **WHEN** a notice has been raised and no further interaction occurs
- **THEN** it dismisses itself after a short interval, leaving the toggle applied

#### Scenario: The notice is announced without interrupting

- **WHEN** the notice's live region is inspected
- **THEN** it is polite rather than assertive
- **AND** the region is present in the document before the notice appears in it,
  so the announcement is not lost

#### Scenario: Undo is not the only way back

- **WHEN** the notice has dismissed itself and the player wants the toggle
  reversed
- **THEN** activating the runeword's control again reverses it, because the
  control is a toggle and the notice is an affordance for pointer misclicks rather
  than the mechanism for reversal

### Requirement: The transient notice never destroys keyboard focus

The notice SHALL NOT take focus when it appears, and SHALL NOT remove itself while
focus is inside it, because a focusable control that disappears drops focus to the
document body and loses a keyboard reader their place in a 99-row table. When
undoing moves focus, it SHALL move it somewhere deliberate rather than nowhere.

#### Scenario: The notice does not steal focus

- **WHEN** a notice appears
- **THEN** focus remains where the player left it, on the control they activated

#### Scenario: A focused notice does not vanish

- **WHEN** focus is inside the notice and the dismissal interval elapses
- **THEN** the notice remains present

#### Scenario: Dismissal resumes once focus leaves

- **WHEN** focus leaves the notice
- **THEN** the dismissal interval starts again and the notice eventually goes

#### Scenario: Undoing leaves focus somewhere deliberate

- **WHEN** the undo action is activated from within the notice and the notice is
  removed
- **THEN** focus is placed on the crafted-state control of the runeword that was
  reverted, rather than falling to the document body
