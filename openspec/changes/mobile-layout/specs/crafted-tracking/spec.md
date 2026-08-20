## MODIFIED Requirements

### Requirement: Every runeword can be marked crafted

The table SHALL present a crafted-state control on every runeword's row. From the
narrow-viewport breakpoint up, that control SHALL occupy its own leading column
with its own column header, so that the state is a property of the row that later
changes can sort on rather than an ornament attached to the name. The control
SHALL be a real button carrying its pressed state, so that it is reachable by Tab
and operable by Space and Enter without a pointer. Activating the control SHALL
open the mark or unmark confirmation rather than applying the change immediately;
confirming that dialog SHALL change the crafted state.

Below the breakpoint the leading column SHALL be withdrawn from view, because the
row already states its crafted state without it — by its accent border and its
tint, which `A crafted row is distinguishable without colour` requires — and a
pointer press anywhere on the row already opens the confirmation. The column is
worth more as width to the columns a player reads than as a third statement of
something already said twice.

**The control itself SHALL survive that withdrawal.** Each row SHALL still carry
one crafted-state button, in the tab order, with its pressed state and its
accessible name intact, because it is the only path to marking a runeword without
a pointer and a narrow viewport is not only a phone — a desktop window narrowed
below the breakpoint is the same viewport. A control withdrawn from view SHALL
become visible when it takes keyboard focus, and SHALL take no width from the row
while it is not focused.

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

#### Scenario: The state is its own column above the breakpoint

- **WHEN** the table's columns are inspected at or above the breakpoint
- **THEN** crafted state occupies a leading column with a column header of its
  own, so that a later change can make that header a sort control

#### Scenario: The column is withdrawn below the breakpoint

- **WHEN** the table is rendered on a narrow viewport
- **THEN** the crafted column's header is not perceivable and the column takes no
  width from the row

#### Scenario: The keyboard path survives the withdrawal

- **WHEN** the page is traversed by Tab on a narrow viewport
- **THEN** each row's crafted-state button is still reachable, still reports its
  pressed state, and still opens the confirmation when activated

#### Scenario: A withdrawn control is visible while focused

- **WHEN** a crafted-state control on a narrow viewport receives keyboard focus
- **THEN** it is visible

#### Scenario: Confirming mark then confirming remove returns to the starting state

- **WHEN** an uncrafted runeword is confirmed marked and then confirmed unmarked
- **THEN** the runeword is back in the state it started in

## ADDED Requirements

### Requirement: A dialog that dims the page absorbs the press that dismisses it

A dialog that dims the page behind it SHALL be dismissed by an outside press only
once that press completes, so that the dim is still in place when the release is
hit-tested and the page beneath never receives the press, its release, or the
click they produce.

Dismissing on the press itself takes the dim away between the press and the
release. The browser then hit-tests the release against whatever the dim was
covering and delivers it there — so one tap both closes the dialog and acts on the
page behind it. Observed on a phone-sized viewport: a tap on the dim closed the
mark confirmation and opened the advice panel of the row underneath, and a few
pixels away it raised the same question again for a different runeword.

This holds for every dialog on the page that dims what is behind it, because a dim
exists to absorb the press and one that does not is worse than none: it looks like
a shield and behaves like glass.

#### Scenario: The press alone does not dismiss

- **WHEN** a press begins on the dim behind an open dialog
- **THEN** the dialog is still open

#### Scenario: The completed press dismisses

- **WHEN** that press is released on the dim
- **THEN** the dialog closes, cancelling rather than confirming

#### Scenario: Nothing behind the dim is acted on

- **WHEN** a tap on the dim lands over a runeword's row
- **THEN** no runeword is marked or unmarked, no panel opens, and no second
  confirmation is raised

#### Scenario: The other routes out are unaffected

- **WHEN** the dialog is dismissed by Escape or by its own cancelling control
- **THEN** it closes as it did before
