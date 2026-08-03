# crafted-tracking Delta

## MODIFIED Requirements

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
open, focus returned to the crafted-state control when it closes. Initial focus
SHALL depend on the direction being asked about: the mark dialog SHALL focus its
confirm action, so the reflex Enter records the craft the player just asked for,
while the unmark dialog SHALL focus Cancel, so the reflex Enter preserves
progress. In both directions the focused control is the safe one — marking loses
nothing if it was a misclick, unmarking would.

The dialog's action buttons SHALL share a minimum width, so an action whose label
is short in one locale (the English "Add") still presents a pressable target
rather than a sliver, matching the minimum the language switch's options already
establish for a chip.

Copy SHALL come from the display-copy layer; the runeword's name in the
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
- **THEN** the focused control is the one that cannot cost the player anything:
  the confirm action when marking, because a mark confirmed by accident is one
  click from being undone, and Cancel when unmarking, because a removal
  confirmed by accident is progress gone

#### Scenario: Enter in the mark dialog marks

- **WHEN** the mark confirmation opens and Enter is pressed with nothing else
  touched
- **THEN** the runeword becomes crafted, because the confirm action held the
  initial focus

#### Scenario: Enter in the unmark dialog preserves progress

- **WHEN** the remove confirmation opens and Enter is pressed with nothing else
  touched
- **THEN** the runeword stays crafted, because Cancel held the initial focus

#### Scenario: A short label still fills a pressable chip

- **WHEN** the dialog's action buttons are measured under the English locale
- **THEN** no action button is narrower than the shared minimum width

### Requirement: A nested control's activation does not also toggle the row

Activating any interactive element inside a row SHALL perform only that element's
own action. Opening a runeword's detail view SHALL NOT mark it crafted, and
activating the crafted control SHALL toggle the state exactly once rather than
twice. A pointer gesture that ends a text selection SHALL NOT toggle the row.

Interaction inside a floating panel the row hosts SHALL NOT toggle the row
either, including a plain click on the panel's own text. The row's floating
panels are React portals: their DOM lives outside the row while their events
still bubble through the component tree into the row's click handling, so the
row SHALL treat any event whose target is not a DOM descendant of the row
itself as handled elsewhere. The exclusion is by containment rather than by
enumerating panel kinds, so a panel added later is excluded without this
behaviour being revisited.

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

#### Scenario: A click inside an open floating panel does not toggle

- **WHEN** plain, non-interactive text inside a row's open floating panel is
  clicked
- **THEN** no mark or unmark confirmation opens and the runeword's crafted
  state is unchanged

#### Scenario: The exclusion is by kind, not by identity

- **WHEN** the row's handling of a click is inspected
- **THEN** it excludes interactive elements as a class and portalled content by
  containment rather than naming the particular controls and panels that exist
  today, so a control or panel added later is excluded without this behaviour
  being revisited
