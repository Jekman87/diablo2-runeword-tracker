# crafted-tracking Delta

## ADDED Requirements

### Requirement: Marking or unmarking asks for confirmation first

Activating the crafted-state control or clicking the row SHALL NOT change crafted
state immediately. It SHALL open a modal confirmation that names the runeword and
states the proposed direction. When the runeword is not crafted, the dialog SHALL
ask to mark it as crafted and offer Cancel plus a visually distinct confirm action
(green). When the runeword is already crafted, the dialog SHALL ask to remove it
from crafted and offer Cancel plus a visually distinct remove action (red).

Progress SHALL be written only when the player confirms. Cancelling, pressing
Escape, or dismissing the backdrop SHALL leave crafted state and storage unchanged.
There SHALL be no transient undo notice after a confirmed change: the confirmation
is the safety mechanism.

The dialog SHALL behave as a modal: named by its heading, focus trapped while
open, initial focus on Cancel, focus returned to the crafted-state control when it
closes. Copy SHALL come from the display-copy layer; the runeword's name in the
dialog SHALL be the locale projection, while storage continues to use the
canonical English name.

#### Scenario: Activating an uncrafted control opens a mark dialog

- **WHEN** the crafted-state control of an uncrafted runeword is activated
- **THEN** a modal confirmation appears asking to mark that runeword as crafted
- **AND** crafted state and stored progress are unchanged until the confirm action
  is taken

#### Scenario: Activating a crafted control opens a remove dialog

- **WHEN** the crafted-state control of a crafted runeword is activated
- **THEN** a modal confirmation appears asking to remove that runeword from crafted
- **AND** crafted state is unchanged until the remove action is taken

#### Scenario: Confirming marks the runeword

- **WHEN** the mark confirmation's confirm action is taken
- **THEN** that runeword becomes crafted, progress updates, and the dialog closes

#### Scenario: Confirming removes the runeword

- **WHEN** the remove confirmation's remove action is taken
- **THEN** that runeword is no longer crafted, progress updates, and the dialog
  closes

#### Scenario: Cancelling leaves progress alone

- **WHEN** the confirmation is cancelled, Escape is pressed, or the backdrop is
  dismissed
- **THEN** crafted state and stored progress are what they were before the dialog
  opened

#### Scenario: A row click raises the same confirmation

- **WHEN** a pointer click lands on a row away from nested controls
- **THEN** the same confirmation opens as for that row's crafted-state control

#### Scenario: No undo notice appears after confirm

- **WHEN** a mark or unmark is confirmed
- **THEN** no transient notice offering to undo that change appears

#### Scenario: Focus returns to the crafted control

- **WHEN** the confirmation closes by any route
- **THEN** focus is on the crafted-state control of the runeword that was asked
  about

#### Scenario: The reflex keypress is the safe one

- **WHEN** the confirmation opens
- **THEN** the focused control is Cancel

## MODIFIED Requirements

### Requirement: Every runeword can be marked crafted

The table SHALL present a crafted-state control on every runeword's row, in its
own leading column with its own column header, so that the state is a property of
the row that later changes can sort on rather than an ornament attached to the
name. The control SHALL be a real button carrying its pressed state, so that it is
reachable by Tab and operable by Space and Enter without a pointer. Activating the
control SHALL open the mark or unmark confirmation rather than applying the change
immediately; confirming that dialog SHALL change the crafted state.

#### Scenario: Every row carries a control

- **WHEN** the table is rendered
- **THEN** each of the 99 rows presents one crafted-state control

#### Scenario: The control is a button with a pressed state

- **WHEN** a row's crafted-state control is inspected
- **THEN** it is a button whose pressed state states whether the runeword is
  crafted

#### Scenario: The control is operable by keyboard alone

- **WHEN** a crafted-state control receives keyboard focus and is activated by
  keyboard, and the resulting confirmation is accepted
- **THEN** the runeword's crafted state changes

#### Scenario: The state is its own column

- **WHEN** the table's columns are inspected
- **THEN** crafted state occupies a leading column with a column header of its
  own, so that a later change can make that header a sort control

#### Scenario: Confirming mark then confirming remove returns to the starting state

- **WHEN** an uncrafted runeword is confirmed marked and then confirmed unmarked
- **THEN** the runeword is back in the state it started in

### Requirement: The whole row is a pointer target, and adds no keyboard stop

A pointer click anywhere on a runeword's row SHALL open the mark or unmark
confirmation for that runeword, so that the target is larger than the control
alone. The row SHALL NOT be given a button role or placed in the tab order,
because 99 focusable rows would double the page's tab stops and cost the table the
row and column semantics it is built on.

#### Scenario: Clicking the row opens confirmation

- **WHEN** a pointer click lands on a row, away from any control within it
- **THEN** the mark or unmark confirmation for that runeword opens

#### Scenario: The row is not focusable

- **WHEN** the page is traversed by Tab
- **THEN** no table row receives focus, and the only focusable control in the
  crafted column is its button

#### Scenario: Rows keep their table semantics

- **WHEN** the rendered table is inspected by role
- **THEN** each row is still a table row rather than a button, and the table is
  still navigable by row and column

### Requirement: Overall progress out of all 99

The interface SHALL present overall progress as the number of crafted runewords
against the total number in the dataset, both as a progress indicator carrying a
value and a maximum and as text. The maximum SHALL be the size of
the dataset itself and SHALL NOT be derived from how many rows are rendered,
visible, filtered or available, because the Chronicle goal is every runeword and a
denominator that moves would misreport completion.

The text SHALL state the proportion completed as a percentage and SHALL also state
both counts. The percentage is the form the in-game Chronicle uses and is what
answers "how far am I"; the counts stay because the goal is a number of runewords
rather than a proportion, and a percentage alone cannot be checked against a list of 99. Neither SHALL replace the other.

When every runeword in the dataset is crafted, that same text line SHALL
additionally include a completion message after the percentage and counts,
congratulating the player and reminding them to claim the reward in the game. The
message SHALL come from the display-copy layer. Below full progress the line SHALL
show only the percentage and counts. The sticky progress band's reserved height
SHALL accommodate the longer line (including when it wraps under a narrow viewport
or the Russian locale) so the table header that sticks beneath it neither gaps nor
overlaps rows incorrectly.

Progress SHALL remain visible while the table is being read, rather than scrolling
out of the viewport above it, because it is the question the page exists to answer
and the table is thousands of pixels tall. Where it remains visible over the rows
passing beneath it, it SHALL conceal them rather than overlap them, and a runeword's
detail view SHALL render above it.

#### Scenario: Progress reports the crafted count

- **WHEN** three runewords are marked crafted
- **THEN** the indicator's value is 3 and its maximum is 99
- **AND** the text beside it states both the percentage and the two counts
- **AND** the text does not include the completion message

#### Scenario: Full progress adds the completion message

- **WHEN** every runeword in the dataset is marked crafted
- **THEN** the progress text states 100%, the full counts, and the completion
  message on the same line of reading order

#### Scenario: Progress stays in view

- **WHEN** the page is scrolled to a row far down the table
- **THEN** the progress indicator and its text are still on screen
- **AND** the rows passing beneath them are concealed rather than showing through

#### Scenario: A detail view is not covered by progress

- **WHEN** the detail view of a row near the top of the viewport is open and the
  page is scrolled
- **THEN** the detail view renders above the progress indicator rather than beneath
  it

#### Scenario: The denominator is the dataset, not the view

- **WHEN** the source of the maximum is inspected
- **THEN** it is the number of runewords in the dataset, taken directly and not
  counted from the rendered table

#### Scenario: Progress updates immediately when a change is confirmed

- **WHEN** a runeword's crafted state is confirmed marked or unmarked
- **THEN** the progress indicator and its text reflect the new count without a
  reload

#### Scenario: Nothing crafted reports zero rather than nothing

- **WHEN** no runeword is marked crafted
- **THEN** the indicator is present and reports 0% and 0 of 99, rather than being
  absent

#### Scenario: The indicator exposes a progress role

- **WHEN** the indicator is inspected by role
- **THEN** it exposes a progress indicator with its value and maximum, without
  those being restated by hand alongside a generic element

#### Scenario: The sticky stack survives the longer line

- **WHEN** progress is complete and the page is scrolled so the progress band and
  the table header are stuck
- **THEN** no strip of runeword row shows between them

## REMOVED Requirements

### Requirement: The most recent toggle can be undone from a transient notice

**Reason**: A modal confirmation now gates every mark and unmark, so the undo
toast duplicated the same protection. Import already uses confirmation alone.
**Migration**: Players cancel the dialog instead of undoing after the fact. Help
copy that described the undo notice is updated to describe the confirmation.

### Requirement: The transient notice never destroys keyboard focus

**Reason**: The undo notice is removed with the requirement above.
**Migration**: Focus management for the confirmation dialog covers return of
focus to the crafted control.
